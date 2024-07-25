import { Tabs, useSegments } from 'expo-router';
import React, { useEffect } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { connectSockets, disconnectSockets } from '@/socket/socket';

export default function TabLayout() {
    // const colorScheme = useColorScheme();
    // const segments = useSegments();
    // const hide = segments.includes("ChatScreen");

    useEffect(() => {
        connectSockets();

        return () => {
            disconnectSockets();
        };
    }, [])

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors['light'].tint,
                headerShown: false,
                // tabBarStyle: {
                //     display: hide ? "none" : "flex",
                // }
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="schedule"
                options={{
                    title: 'Schedule',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'cube' : 'cube-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'cube' : 'cube-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'cube' : 'cube-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="earnings"
                options={{
                    title: 'Earnings',
                    tabBarIcon: ({ color, focused }) => (
                        // <TabBarIcon name={focused ? 'cube' : 'cube-outline'} color={color} />
                        <MaterialIcons name="attach-money" size={24} color="black" />
                    ),
                }}
            />
        </Tabs>
    );
}
