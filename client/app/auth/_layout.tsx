import { router, Tabs, useSegments } from 'expo-router';
import React, { useEffect, useRef } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
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
                    pathname: '/auth/chat/ChatListScreen',
                    params: {
                        groupId: data.groupId,
                        groupName: data.groupName,
                        groupImg: data.groupImg,
                        groupCreatedAt: '',
                    },
                };

                if (segments[segments.length - 1] == 'ChatListScreen') {
                    router.replace(destination);
                }
                else {
                    // this does not change local params
                    router.navigate('auth/chat/ChatListScreen');

                    // so add replace to enforce the app change local params, so that ChatListScreen initGroup can run 
                    router.replace(destination);
                }
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
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "cube" : "cube-outline"}
                            color={color}
                        />
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
