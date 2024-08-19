import React from "react";
import { Stack, useRouter } from "expo-router";

export default function ProfileLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="ProfileScreen"
                options={{
                    headerShown: true,
                    headerTitle: "Profile",
                    headerTitleAlign: "center",
                }}
            />
        </Stack>
    );
}