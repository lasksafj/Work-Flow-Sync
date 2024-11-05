import { StyleSheet, Text, View, Image } from "react-native";
import React, { useMemo } from "react";
import { useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import { Avatar } from "@/components/Avatar";

// Define the NotificationParams type for type safety
type NotificationParams = {
    avatar?: string;
    first_name: string;
    last_name: string;
    created_date: string;
    content: string;
};

// Component to display the details of a notification
const NotificationDetail = () => {
    // Retrieve the notification parameters from the route using expo-router
    const item = useLocalSearchParams() as NotificationParams;

    // Memoized function to format the notification creation date
    const formattedDate = useMemo(() => {
        const date = new Date(item.created_date);
        return format(date, "MMM dd, yyyy h:mm a"); // Format the date
    }, [item.created_date]);

    return (
        <View style={styles.container}>
            {/* Header section displaying the avatar, sender name, and date */}
            <View style={styles.header}>
                {item.avatar ? (
                    // Display the sender's avatar if available
                    <Image
                        alt="avatar"
                        resizeMode="cover"
                        style={styles.avatar}
                        source={{ uri: item.avatar }}
                    />
                ) : (
                    // Fallback to default Avatar component if avatar URL is not available
                    <Avatar
                        name={`${item.first_name} ${item.last_name}`}
                        img={item.avatar}
                    />
                )}

                {/* Sender information with name and formatted date */}
                <View style={styles.senderInfo}>
                    <Text style={styles.senderName}>
                        {item.first_name} {item.last_name}
                    </Text>
                    <Text style={styles.date}>{formattedDate}</Text>
                </View>
            </View>
            
            {/* Content section displaying the notification message */}
            <View style={styles.contentBox}>
                <Text style={styles.content}>{item.content}</Text>
            </View>
        </View>
    );
};

export default NotificationDetail;

// Styles for the NotificationDetail component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20, 
        backgroundColor: "#f9f9f9", 
    },
    header: {
        flexDirection: "row",
        alignItems: "center", 
        marginBottom: 20, 
    },
    avatar: {
        width: 60,
        height: 60, 
        borderRadius: 30, 
        marginRight: 15, 
    },
    senderInfo: {
        flexDirection: "column", 
        justifyContent: "center", 
        paddingLeft: 10, 
    },
    senderName: {
        fontSize: 20, 
        fontWeight: "600",
        color: "#333", 
    },
    date: {
        fontSize: 14, 
        color: "#999", 
    },
    contentBox: {
        padding: 15, 
        backgroundColor: "#fff", 
        borderRadius: 5, 
    },
    content: {
        fontSize: 16, 
        lineHeight: 24, 
        color: "#333",
    },
});
