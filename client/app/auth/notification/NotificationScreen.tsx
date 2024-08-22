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
import InitialNameAvatar from "@/components/InitialNameAvatar";
import { Avatar } from "@/components/Avatar";
import { FlashList } from "@shopify/flash-list";

const NotificationScreen = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [moreData, setMoreData] = useState(true);
    const limit = 10;

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = () => {
        if (!moreData || loading) {
            return;
        }
        setLoading(true);
        api.get(
            `api/notifications/notification-get?offset=${offset}&limit=${limit}`
        )
            .then((res) => {
                if (res.data && res.data.length > 0) {
                    const sortedNotifications = sortNotificationsByDate(
                        res.data
                    );
                    setOffset(offset + limit);
                    setNotifications((prevNotifications) => [
                        ...prevNotifications,
                        ...sortedNotifications,
                    ]);

                } else {
                    setMoreData(false);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };

    const sortNotificationsByDate = (noties: any) => {
        const today: any = [];
        const earlier: any = [];

        noties.forEach((notification: any) => {
            const createdAt = new Date(notification.created_date);
            if (isToday(createdAt)) {
                today.push(notification);
            } else {
                earlier.push(notification);
            }
        });

        const sortedData = [];

        if (today.length > 0) {
            if (notifications.length == 0) {
                sortedData.push("Today");
            }
            sortedData.push(...today.map((item: any) => ({ type: "item", ...item })));
        }

        if (earlier.length > 0) {
            if (notifications.findIndex((value) => value === "Earlier") == -1) {
                sortedData.push("Earlier");
            }
            sortedData.push(...earlier.map((item: any) => ({ type: "item", ...item })));
        }

        return sortedData;
    };

    const getDateDifference = (createdDate: Date) => {
        const now = new Date();
        const created = new Date(createdDate);
        const diffInMilliseconds = now.getTime() - created.getTime();

        const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
        const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
        const diffInDays = Math.floor(
            diffInMilliseconds / (1000 * 60 * 60 * 24)
        );

        if (diffInDays > 0) {
            return `${diffInDays} day(s) ago`;
        } else if (diffInHours > 0) {
            return `${diffInHours} hour(s) ago`;
        } else {
            return `${diffInMinutes} minute(s) ago`;
        }
    };

    const RenderItem = ({ item, index }: any) => {

        return (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    router.push({
                        pathname: "auth/notification/NotificationDetail",
                        params: item,
                    });
                }}
            >
                <View style={styles.card}>
                    <Avatar
                        name={item.first_name + " " + item.last_name}
                        img={item.avatar}
                        style={styles.cardImg}
                    />

                    <View>
                        <Text>
                            {item.content.length > 40
                                ? `${item.content.substring(0, 40)}...`
                                : item.content}
                        </Text>

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
                {/* <Text style={styles.title}>Notifications</Text> */}
                <FlashList
                    data={notifications}
                    renderItem={({ item }) => {
                        if (typeof item === "string") {
                            // Rendering header
                            return <Text style={styles.sectionHeader}>{item}</Text>;
                        } else {
                            // Render item
                            return <RenderItem item={item} />;
                        }
                    }}
                    getItemType={(item) => {
                        // To achieve better performance, specify the type based on the item
                        return typeof item === "string" ? "sectionHeader" : "row";
                    }}
                    estimatedItemSize={100}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={loadNotifications}
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
