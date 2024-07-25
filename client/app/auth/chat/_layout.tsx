import React from 'react'
import { Link, Stack } from 'expo-router'
import { TouchableOpacity, View, Image, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import Icon from 'react-native-vector-icons/FontAwesome'

export default function ChatLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="ChatListScreen"
                options={{
                    title: 'Chats',
                    headerLargeTitle: true,
                    // headerTransparent: true,
                    headerBlurEffect: 'regular',
                    headerLeft: () => (
                        <Ionicons
                            name="ellipsis-horizontal-circle-outline"
                            color={Colors.primary}
                            size={30}
                        />
                    ),
                    headerRight: () => (
                        <View style={{ flexDirection: 'row', gap: 30 }}>
                            <TouchableOpacity>
                                <Ionicons name="camera-outline" color={Colors.primary} size={30} />
                            </TouchableOpacity>
                            <Link href="auth/chat/NewChatScreen" asChild>
                                <TouchableOpacity>
                                    <Ionicons name="add-circle" color={Colors.primary} size={30} />
                                </TouchableOpacity>
                            </Link>
                        </View>
                    ),
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    // headerSearchBarOptions: {
                    //     placeholder: 'Search',
                    // },
                }}
            />

            <Stack.Screen name="NewChatScreen" />


            {/* <Stack.Screen
                name="ChatScreen"
                options={{
                    title: '',
                    headerBackTitleVisible: false,
                    headerRight: () => (
                        <View style={{ flexDirection: 'row', gap: 30 }}>
                            <TouchableOpacity>
                                <Icon name="video-camera" size={24} color="#0084ff" />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Icon name="phone" size={24} color="#0084ff" />
                            </TouchableOpacity>
                        </View>
                    ),
                    headerStyle: {
                        backgroundColor: Colors.background,
                    },
                }}
            /> */}


        </Stack >
    )
}
