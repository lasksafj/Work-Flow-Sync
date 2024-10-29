import api from "@/apis/api";
import { isToday, set } from "date-fns";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { Avatar } from "@/components/Avatar";
import { FlashList } from "@shopify/flash-list";

// Main component for displaying notifications
const NotificationScreen = () => {
    // State variables for notifications, pagination, loading, and more data availability
    const [notifications, setNotifications] = useState<any[]>([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [moreData, setMoreData] = useState(true);
    const limit = 10; // Pagination limit for loading notifications

    // Effect hook to load notifications when the component is mounted
    useEffect(() => {
        loadNotifications();
    }, []);

    // Function to load notifications from the API with pagination support
    const loadNotifications = () => {
        if (!moreData || loading) {
            return;
        }
        setLoading(true); // Set loading state while fetching data
        api.get(
            `api/notifications/notification-get?offset=${offset}&limit=${limit}`
        )
            .then((res) => {
                if (res.data && res.data.length > 0) {
                    // Sort notifications based on date (today vs earlier)
                    const sortedNotifications = sortNotificationsByDate(
                        res.data
                    );
                    setOffset(offset + limit); // Update the offset for pagination
                    setNotifications((prevNotifications) => [
                        ...prevNotifications,
                        ...sortedNotifications,
                    ]);

                } else {
                    setMoreData(false); // No more data to load
                }
                setLoading(false); // Reset loading state
            })
            .catch((err) => {
                console.log(err); // Handle error
                setLoading(false); // Reset loading state on error
            });
    };

    // Function to sort notifications into two groups: today and earlier
    const sortNotificationsByDate = (noties: any) => {
        const today: any = [];
        const earlier: any = [];

        noties.forEach((notification: any) => {
            const createdAt = new Date(notification.created_date);
            if (isToday(createdAt)) {
                today.push(notification); // Group today's notifications
            } else {
                earlier.push(notification); // Group earlier notifications
            }
        });

        const sortedData = [];

        // Add "Today" section header and today's notifications if available
        if (today.length > 0) {
            if (notifications.length == 0) {
                sortedData.push("Today");
            }
            sortedData.push(...today.map((item: any) => ({ type: "item", ...item })));
        }

        // Add "Earlier" section header and earlier notifications if available
        if (earlier.length > 0) {
            if (notifications.findIndex((value) => value === "Earlier") == -1) {
                sortedData.push("Earlier");
            }
            sortedData.push(...earlier.map((item: any) => ({ type: "item", ...item })));
        }

        return sortedData;
    };

    // Function to calculate the time difference from the created date to the current time
    const getDateDifference = (createdDate: Date) => {
        const now = new Date();
        const created = new Date(createdDate);
        const diffInMilliseconds = now.getTime() - created.getTime();

        const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
        const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
        const diffInDays = Math.floor(
            diffInMilliseconds / (1000 * 60 * 60 * 24)
        );

        // Return the time difference in days, hours, or minutes
        if (diffInDays > 0) {
            return `${diffInDays} day(s) ago`;
        } else if (diffInHours > 0) {
            return `${diffInHours} hour(s) ago`;
        } else {
            return `${diffInMinutes} minute(s) ago`;
        }
    };

    // Function to render each notification item
    const RenderItem = ({ item, index }: any) => {

        return (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    // Navigate to notification detail screen with item as parameters
                    router.push({
                        pathname: "auth/notification/NotificationDetail",
                        params: item,
                    });
                }}
            >
                <View style={styles.card}>
                    {/* Render notification avatar */}
                    <Avatar
                        name={item.first_name + " " + item.last_name}
                        img={item.avatar}
                        style={styles.cardImg}
                    />

                    <View>
                        {/* Render notification content (truncated if too long) */}
                        <Text>
                            {item.content.length > 40
                                ? `${item.content.substring(0, 40)}...`
                                : item.content}
                        </Text>

                        {/* Render time difference and author of the notification */}
                        <View style={styles.cardStats}>
                            <View style={styles.cardStatsItem}>
                                <FeatherIcon color="#636a73" name="clock" />

                                <Text style={styles.cardStatsItemText}>
                                    {getDateDifference(item.created_date)}
                                </Text>
                                <Text style={styles.cardStatsItemText}>
                                    by{" "}
                                    <Text style={{ fontWeight: "bold" }}>
                                        {item.first_name} {item.last_name}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    return (
        <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
            <View style={styles.container}>
                {/* Notification list */}
                <FlashList
                    data={notifications}
                    renderItem={({ item }) => {
                        // Render section headers for "Today" and "Earlier"
                        if (typeof item === "string") {
                            return <Text style={styles.sectionHeader}>{item}</Text>;
                        } else {
                            // Render individual notification items
                            return <RenderItem item={item} />;
                        }
                    }}
                    getItemType={(item) => {
                        return typeof item === "string" ? "sectionHeader" : "row";
                    }}
                    estimatedItemSize={100} // Estimated size for better performance
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={loadNotifications} // Load more notifications when scrolled to end
                    ListFooterComponent={
                        loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : null
                    }
                />
            </View>
        </SafeAreaView>
    );
};

export default NotificationScreen;

// Styles for the notification screen and its components
const styles = StyleSheet.create({
    container: {
        padding: 24,
        flex: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        color: "#1d1d1d",
        marginBottom: 12,
    },
    sectionHeader: {
        fontSize: 15,
        fontWeight: "bold",
        backgroundColor: "#",
        paddingVertical: 5,
        paddingHorizontal: 0,
        marginTop: 10,
    },
    /** Card */
    card: {
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    cardImg: {
        width: 50,
        height: 50,
        borderRadius: 9999,
        marginRight: 12,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#000",
        marginBottom: 8,
    },
    cardStats: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    cardStatsItem: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginRight: 8,
    },
    cardStatsItemText: {
        fontSize: 13,
        fontWeight: "500",
        color: "#636a73",
        marginLeft: 2,
    },
    cardAction: {
        marginLeft: "auto",
    },
});
