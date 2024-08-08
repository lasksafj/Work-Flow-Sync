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
    Image,
    SectionList,
    ActivityIndicator,
    FlatList,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import InitialNameAvatar from "@/components/InitialNameAvatar";
import { Avatar } from "@/components/Avatar";

const NotificationScreen = () => {
    const [notifications, setNotifications] = useState<any[]>([
        { title: "Today", data: [] },
        { title: "Earlier", data: [] },
    ]);
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
                    setNotifications((prevNotifications) => {
                        const today = [
                            ...prevNotifications[0]?.data,
                            ...sortedNotifications[0]?.data,
                        ];
                        const earlier = [
                            ...prevNotifications[1]?.data,
                            ...sortedNotifications[1]?.data,
                        ];
                        return [
                            { title: "Today", data: today },
                            { title: "Earlier", data: earlier },
                        ];
                    });
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

    const sortNotificationsByDate = (notifications: any) => {
        const today: any = [];
        const earlier: any = [];

        notifications.forEach((notification: any) => {
            const createdAt = new Date(notification.created_date);
            if (isToday(createdAt)) {
                today.push(notification);
            } else {
                earlier.push(notification);
            }
        });
        return [
            { title: "Today", data: today },
            { title: "Earlier", data: earlier },
        ];
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

    const renderItem = ({ item, index }: any) => (
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
                {item.avatar ? (
                    <Avatar img={item.avatar}
                        style={styles.cardImg}
                    />
                ) : (
                    <InitialNameAvatar
                        name={item.first_name + " " + item.last_name}
                        style={styles.cardImg}
                    />
                )}

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

                {/* <View style={styles.cardAction}>
                    <FeatherIcon
                        color="#9ca3af"
                        name="chevron-right"
                        size={22}
                    />
                </View> */}
            </View>
        </TouchableOpacity>
    );

    const renderSectionHeader = ({
        section: { title },
    }: {
        section: { title: string };
    }) => <Text style={styles.sectionHeader}>{title}</Text>;

    return (
        <SafeAreaView style={{ backgroundColor: "#fff" }}>
            <View style={styles.container}>
                <Text style={styles.title}>Notifications</Text>
                <SectionList
                    sections={notifications}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    renderSectionHeader={renderSectionHeader}
                    onEndReached={loadNotifications}
                    // onEndReachedThreshold={0.5}
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
