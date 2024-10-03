import React from "react";
import { Stack } from "expo-router";

export default function QRCodeLayout() {
    return (
        <Stack>
            <Stack.Screen name="QRCode" options={{ headerTitle: "QR Code" }} />
            <Stack.Screen name="ClockInOutScreen" options={{ headerTitle: "Clock in/out" }} />
        </Stack>
    );
}
