import { RelativePathString, router, Tabs, useSegments } from 'expo-router';
import React, { useEffect, useRef } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';
import { connectSockets, disconnectSockets } from '@/socket/socket';
import * as Notifications from 'expo-notifications';


function useNotificationObserver() {
    const segments = useSegments();
    // console.log(segments);

    useEffect(() => {
        let isMounted = true;

        function redirect(notification: Notifications.Notification) {
            const { data } = notification.request.content;
            if (data.path == 'chat') {
                const destination = {
                    pathname: '/auth/chat/ChatListScreen' as RelativePathString,
                    params: {
                        groupId: data.groupId,
                        groupName: data.groupName,
                        groupImg: data.groupImg,
                        groupCreatedAt: '',
                    },
                };

                // if (segments[segments.length - 1] == 'ChatListScreen') {
                //     router.replace('/auth/chat/ChatListScreen');
                //     // router.replace(destination);
                // }
                // else {
                //     // this does not change local params
                //     router.replace('/auth/chat/ChatListScreen');

                //     // router.push(destination);

                //     // // so add replace to enforce the app change local params, so that ChatListScreen initGroup can run 
                //     // router.replace(destination);
                // }
                router.replace('/auth/chat/ChatListScreen');
                setTimeout(() => {
                    router.replace(destination);
                }, 500);
            }
        }

        Notifications.getLastNotificationResponseAsync()
            .then(response => {
                if (!isMounted || !response?.notification) {
                    return;
                }
                redirect(response?.notification);
            });


        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            redirect(response.notification);
        });

        return () => {
            isMounted = false;
            subscription.remove();
        };
    }, []);
}

export default function TabLayout() {
    // const colorScheme = useColorScheme();
    // const segments = useSegments();
    // console.log(segments);

    // const hide = segments.includes("ChatScreen");

    useEffect(() => {
        connectSockets();
        return () => {
            disconnectSockets();
        };
    }, []);


    useNotificationObserver();

    // const lastNotificationResponse = Notifications.useLastNotificationResponse();
    // React.useEffect(() => {
    //     if (
    //         lastNotificationResponse &&
    //         lastNotificationResponse.notification.request.content.data.path &&
    //         lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
    //     ) {
    //         const { data } = lastNotificationResponse.notification.request.content;

    //         if (data.path == 'chat') {
    //             const destination = {
    //                 pathname: '/auth/chat/ChatListScreen',
    //                 params: {
    //                     groupId: data.groupId,
    //                     groupName: data.groupName,
    //                     groupImg: data.groupImg,
    //                     groupCreatedAt: '',
    //                 },
    //             };
    //             if (segments[segments.length - 1] == 'ChatListScreen') {
    //                 router.replace(destination);
    //             }
    //             else {
    //                 // this does not change local params
    //                 router.navigate(destination);

    //                 // so add replace to enforce the app change local params, so that ChatListScreen initGroup can run 
    //                 router.replace(destination);

    //             }
    //         }
    //     }
    // }, [lastNotificationResponse]);



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
                name="dashboard"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="planner"
                options={{
                    title: "Planner",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="schedule" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="chat" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="earnings"
                options={{
                    title: 'Payroll',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="currency-usd" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="notification"
                options={{
                    title: 'Notifications',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="bell" color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}
