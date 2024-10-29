import { getGroupsApi, getParticipantsApi } from '@/apis/chat/chatApi';
import { Colors } from '@/constants/Colors';
import { format, isBefore, startOfToday } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TouchableHighlight, Modal, SafeAreaView, ActivityIndicator } from 'react-native';
import ChatScreen from './ChatScreen';
import { router, useFocusEffect, useLocalSearchParams, usePathname } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { chatSocket } from '@/socket/socket';
import { Avatar } from '@/components/Avatar';
import * as Notifications from 'expo-notifications';

type chatType = {
    groupId: string,
    groupName: string,
    groupImg?: string,
    lastMessageTime: string,
    lastMessage: string,
    lastActiveTime?: string,
    seen?: boolean,
    otherParticipantName: string
}

const RenderItem = ({ item, openChat }: any) => {
    let { groupId, groupName, lastMessageTime, groupCreatedAt, groupImg, lastMessage, lastActiveTime, seen, otherParticipantName } = item;

    const date = lastMessageTime ? new Date(lastMessageTime) : new Date(groupCreatedAt);
    let time;
    // Check if the timeVar is before 0h (start of the day)
    if (isBefore(date, startOfToday())) {
        time = format(date, 'MMMM d');
    } else {
        time = format(date, 'hh:mm a');
    }

    const lastActive = new Date(lastActiveTime);
    if (!seen)
        seen = lastActiveTime && (Math.floor(date.getTime() / 1000) <= Math.floor(lastActive.getTime() / 1000));

    return (
        <TouchableHighlight activeOpacity={0.8} underlayColor={Colors.lightGray}
            onPress={() => {
                openChat({ groupId, groupName, groupImg, otherParticipantName });
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                    paddingLeft: 20,
                    paddingVertical: 10,
                }}>
                {/* <Image
                    source={{ uri: img[0] || "https://i.pravatar.cc/150?u=aguilarduke@marketoid.com" }}
                    style={{ width: 50, height: 50, borderRadius: 50 }}
                /> */}
                <Avatar img={groupImg} name={otherParticipantName} />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: seen ? 'normal' : 'bold' }}>
                        {groupName.length > 20 ? `${groupName.substring(0, 20)}...` : groupName}
                    </Text>
                    <Text style={{ fontSize: 16, color: seen ? Colors.gray : 'black', fontWeight: seen ? 'normal' : 'bold', }}>
                        {lastMessage && lastMessage.length > 40 ? `${lastMessage.substring(0, 40)}...` : lastMessage}
                    </Text>

                </View>
                <Text style={{ color: seen ? Colors.gray : 'black', paddingRight: 20, alignSelf: 'flex-start', fontWeight: seen ? 'normal' : 'bold' }}>
                    {time}
                </Text>

            </View>
        </TouchableHighlight>
    )
};



const ChatListScreen = () => {
    const user = useAppSelector((state: RootState) => state.user)

    const [chats, setChats] = useState<chatType[]>([]);
    const [modalChatVisible, setModalChatVisible] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState({ groupId: '', groupName: '', groupImg: '', otherParticipantName: '' });

    const limit = 15;
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [chatsAvailable, setChatsAvailable] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // New state for refreshing


    let { groupId, groupName, groupImg, groupCreatedAt } = useLocalSearchParams();

    if (groupId)
        console.log('groupId useLocalSearchParams ', groupId, groupName, groupImg, groupCreatedAt);
    else
        console.log('selectedGroup', selectedGroup);


    const openChat = (group: any) => {
        if (modalChatVisible) {
            setModalChatVisible(false);
        }
        setSelectedGroup(group);
        setModalChatVisible(prev => { return true; });
    };

    const closeChat = () => {
        setModalChatVisible(false);
        setChats(prevChats =>
            prevChats.map(chat =>
                chat.groupId == selectedGroup.groupId ? { ...chat, seen: true } : chat
            )
        );
        setSelectedGroup({ groupId: '', groupName: '', groupImg: '', otherParticipantName: '' });

        // router.setParams({});
    };

    const createGroupNameImg = async (groupId: string) => {
        let participants = await getParticipantsApi(groupId);
        if (participants) {
            let gname = participants
                .filter((p: any) => p.email != user.profile.email)
                .map((p: any) => p.name)
                .join(', ');
            let gImg = participants
                .filter((p: any) => p.email != user.profile.email)
                .map((p: any) => p.avatar)
                .join(', ');

            return { gname, gImg };
        }
        return { gname: '', gImg: '' };
    }

    const onChatListNewMessage = useCallback(async ({ groupId, groupName, groupImg, lastMessageTime, lastMessage, lastActiveTime }: any) => {
        let { gname, gImg } = await createGroupNameImg(groupId);
        let seen = false;
        setChats(prevChats => {
            // Data from server id: number, data in client id: string, so use == to compare
            const index = prevChats.findIndex(chat => chat.groupId == groupId);
            const newChats: chatType[] = index > -1
                ? [{ ...prevChats[index], lastMessageTime, lastMessage, lastActiveTime, seen, otherParticipantName: gname }, ...prevChats.slice(0, index), ...prevChats.slice(index + 1)]
                : [{ groupId, groupName, groupImg, lastMessageTime, lastMessage, lastActiveTime, seen, otherParticipantName: gname }, ...prevChats];

            if (!newChats[0].groupName) {
                newChats[0].groupName = gname;
            }
            if (!newChats[0].groupImg) {
                newChats[0].groupImg = gImg;
            }
            return newChats;
        });
    }, []);


    // useFocusEffect(
    //     useCallback(() => {
    //         // console.log('CHATLISTSCREEN  getGroupsApi');
    //         async function getGroup() {
    //             let res = await getGroupsApi();
    //             if (!res)
    //                 return

    //             for (let i = 0; i < res.length; i++) {
    //                 res[i].groupImg = "https://i.pravatar.cc/150?u=aguilarduke@marketoid.com";
    //                 if (!res[i].groupName) {
    //                     let participants = await getParticipantsApi(res[i].groupId);
    //                     if (participants) {
    //                         let gname = participants
    //                             .filter((p: any) => p.email != user.profile.email)
    //                             .map((p: any) => p.name)
    //                             .join(', ');
    //                         res[i].groupName = gname;
    //                     }
    //                 }
    //             }
    //             setChats(res);
    //         }
    //         getGroup();
    //     }, [modalChatVisible])
    // );

    const fetchGroups = async (offset: number) => {
        setIsLoadingMore(true);
        let res = await getGroupsApi(limit, offset);
        if (res) {
            if (res.length < limit) {
                setChatsAvailable(false);
            }

            for (const group of res) {
                group.groupId = String(group.groupId);
                const { gname, gImg } = await createGroupNameImg(group.groupId);
                if (!group.groupName) {
                    group.groupName = gname;
                }
                if (!group.groupImg) {
                    group.groupImg = gImg;
                }
                group.otherParticipantName = gname;
            }

            setChats(prevChats => {
                const chatMap = new Map(prevChats.map(chat => [chat.groupId, chat]));
                for (const group of res) {
                    chatMap.set(group.groupId, group);
                }
                return Array.from(chatMap.values());
            });
        }
        setIsLoadingMore(false);
    };

    const handleLoadMore = () => {
        if (!isLoadingMore && chatsAvailable) {
            fetchGroups(chats.length);
        }
    };

    const renderFooter = () => {
        if (!isLoadingMore || refreshing) return null;
        return <ActivityIndicator size="large" color={Colors.primary} />;
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        setChats([]); // Clear existing data
        setChatsAvailable(true); // Reset data availability
        await fetchGroups(0); // Fetch fresh data
        setRefreshing(false);
    };

    // open group chat from useLocalSearchParams: groupId, groupName, groupImg, groupCreatedAt
    useEffect(() => {
        async function initGroup() {
            if (groupId) {
                const { gname, gImg } = await createGroupNameImg(groupId as string);
                if (!groupName || !groupImg) {
                    groupName = groupName || gname;
                    groupImg = groupImg || gImg;
                }
                openChat({ groupId, groupName, groupImg, otherParticipantName: gname });
                if (groupCreatedAt)
                    onChatListNewMessage({ groupId, groupName, groupImg, lastMessageTime: groupCreatedAt });
            }
        }

        initGroup();
    }, [groupId]);

    useEffect(() => {
        fetchGroups(chats.length);
    }, []);

    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(response => {
            if (response) {
                const { data } = response.request.content;

                if (data.path === 'chat') {
                    if (selectedGroup.groupId == data.groupId) {
                        // User is already viewing the chat for this groupId
                        // Dismiss the notification
                        Notifications.dismissNotificationAsync(response.request.identifier);
                        return;
                    }
                }
            }
        });
        return () => {
            subscription.remove();
        };
    }, [selectedGroup]);

    useEffect(() => {
        chatSocket.emit('ChatList:join', user.profile.email);
        chatSocket.on('ChatList:newMessage', onChatListNewMessage);

        return () => {
            chatSocket.off('ChatList:newMessage');
            chatSocket.emit('ChatList:leave', user.profile.email);
        }
    }, []);


    // const [modalNewChatVisible, setModalNewChatVisible] = useState(false);
    // const openNewChat = () => {
    //     setModalNewChatVisible(true);
    // };
    // const closeNewChat = () => {
    //     setModalNewChatVisible(false);
    // };
    // const navigation = useNavigation();
    // useEffect(() => {
    //     navigation.setOptions({
    //         headerLeft: () => (
    //             <Ionicons
    //                 name="ellipsis-horizontal-circle-outline"
    //                 color={Colors.primary}
    //                 size={30}
    //             />
    //         ),
    //         headerRight: () => (
    //             <View style={{ flexDirection: 'row', gap: 30 }}>
    //                 <TouchableOpacity>
    //                     <Ionicons name="camera-outline" color={Colors.primary} size={30} />
    //                 </TouchableOpacity>
    //                 <TouchableOpacity
    //                     onPress={openNewChat}
    //                 >
    //                     <Ionicons name="add-circle" color={Colors.primary} size={30} />
    //                 </TouchableOpacity>
    //             </View>
    //         ),
    //     });
    // }, []);

    return (
        <SafeAreaView style={styles.container}>

            <FlashList
                data={chats}
                renderItem={props =>
                    <RenderItem
                        {...props}
                        openChat={openChat}
                    />
                }
                keyExtractor={(item) => item.groupId}
                estimatedItemSize={200}

                onEndReached={chatsAvailable ? handleLoadMore : null}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}

                refreshing={refreshing} // Add refreshing state
                onRefresh={handleRefresh} // Add onRefresh handler

            // style={styles.container}
            />


            <Modal
                // animationType="slide"
                visible={modalChatVisible}
                onRequestClose={() => {
                    closeChat();
                }}
            >
                <ChatScreen group={selectedGroup} closeChat={closeChat} />
            </Modal>

            {/* <Modal
                animationType="slide"
                visible={modalNewChatVisible}
                onRequestClose={() => {
                    setModalNewChatVisible(!modalNewChatVisible);
                }}
            >
                <NewChatScreen closeNewChat={closeNewChat} />
            </Modal> */}
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    chatItem: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    chatDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    chatName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    lastMessage: {
        fontSize: 14,
        color: '#888',
    },

});

export default ChatListScreen;
