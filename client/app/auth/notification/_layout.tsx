import React from "react";
import { Stack } from "expo-router";

export default function NotificationsLayout() {
    return (
        <Stack>
            <Stack.Screen name="NotificationScreen" />
            <Stack.Screen name="NotificationDetail" />
        </Stack>
    );
}
