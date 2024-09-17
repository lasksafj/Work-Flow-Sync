import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import { Avatar } from "@/components/Avatar";

const NotificationDetail = () => {
    const item: any = useLocalSearchParams();

    const date = new Date(item.created_date as string);
    const formattedDate = format(date, "MMM dd, yyyy h:mm a");
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {item.avatar ? (
                    <Image
                        alt=""
                        resizeMode="cover"
                        style={styles.avatar}
                        source={{ uri: item.avatar }}
                    />
                ) : (
                    <Avatar
                        name={item.first_name + " " + item.last_name}
                        img={item.avatar}
                    />
                )}

                <Text style={styles.senderName}>
                    {item.first_name} {item.last_name}
                </Text>
            </View>
            <Text style={styles.content}>{item.content}</Text>
            <Text style={styles.date}>{formattedDate}</Text>
        </View>
    );
};

export default NotificationDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    senderName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    content: {
        fontSize: 16,
        color: "#333",
        marginBottom: 10,
    },
    date: {
        fontSize: 14,
        color: "#666",
    },
});
