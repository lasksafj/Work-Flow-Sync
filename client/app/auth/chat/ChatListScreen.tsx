import { getGroupsApi, getParticipantsApi } from '@/apis/chat/chatApi';
import { Colors } from '@/constants/Colors';
import { format, isBefore, startOfToday } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TouchableHighlight, Modal, SafeAreaView } from 'react-native';
import ChatScreen from './ChatScreen';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';



type chatType = {
    groupId: string,
    groupName: string,
    img: string,
    lastMessageTime: string,
    lastMessage: string
}

const RenderItem = ({ item, openChat }: any) => {
    const { groupId, groupName, lastMessageTime, img, lastMessage } = item;

    const date = new Date(lastMessageTime);
    let time;
    // Check if the timeVar is before 0h (start of the day)
    if (isBefore(date, startOfToday())) {
        time = format(date, 'MMMM d');
    } else {
        time = format(date, 'hh:mm a');
    }


    return (
        <TouchableHighlight activeOpacity={0.8} underlayColor={Colors.lightGray}
            onPress={() => {
                openChat({ groupId, groupName });
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
                <Image source={{ uri: img }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, }}>
                        {groupName.length > 20 ? `${groupName.substring(0, 20)}...` : groupName}
                    </Text>
                    <Text style={{ fontSize: 16, color: Colors.gray }}>
                        {lastMessage.length > 40 ? `${lastMessage.substring(0, 40)}...` : lastMessage}
                    </Text>

                </View>
                <Text style={{ color: Colors.gray, paddingRight: 20, alignSelf: 'flex-start' }}>
                    {time}
                </Text>

            </View>
        </TouchableHighlight>
    )
};



const ChatListScreen = () => {
    const user = useAppSelector((state: RootState) => state.user)

    const [chats, setchats] = useState<chatType[]>([]);
    const [modalChatVisible, setModalChatVisible] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState({ groupId: '', groupName: '' });

    let { groupId, groupName } = useLocalSearchParams();
    if (groupId)
        console.log('groupId, groupName', groupId, groupName);
    else
        console.log('groupId, groupName', selectedGroup);


    const openChat = (group: any) => {
        // console.log('open chat', group);
        setSelectedGroup(group);
        setModalChatVisible(true);
    };

    const closeChat = () => {
        setModalChatVisible(false);
        setSelectedGroup({ groupId: '', groupName: '' });
        router.setParams({
            groupId: '',
            groupName: ''
        });
    };

    useEffect(() => {
        if (groupId && groupId != '') {
            openChat({ groupId, groupName });
        }
    }, [groupId])

    useFocusEffect(
        useCallback(() => {
            // console.log('CHATLISTSCREEN  getGroupsApi');
            async function getGroup() {
                let res = await getGroupsApi();
                if (!res)
                    return
                // console.log(res);

                for (let i = 0; i < res.length; i++) {
                    res[i].img = "https://i.pravatar.cc/150?u=aguilarduke@marketoid.com";
                    if (!res[i].groupName) {
                        let participants = await getParticipantsApi(res[i].groupId);
                        let gname = participants
                            .filter((p: any) => p.email != user.profile.email)
                            .map((p: any) => p.name)
                            .join(', ');
                        res[i].groupName = gname;
                    }
                }
                // should sort on server ?????????????????????????????????????????
                res = res.sort((a: any, b: any) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
                setchats(res);
            }
            getGroup();
        }, [modalChatVisible])
    );


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
