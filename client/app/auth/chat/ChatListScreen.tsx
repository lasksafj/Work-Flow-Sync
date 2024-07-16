import { getGroupsApi } from '@/apis/chat/chatApi';
import { Colors } from '@/constants/Colors';
import { format, isBefore, startOfToday } from 'date-fns';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TouchableHighlight } from 'react-native';


type chatType = {
    groupId: string,
    groupName: string,
    img: string,
    lastMessageTime: string,
    lastMessage: string
}

const renderItem = ({ item }: any) => {
    const { groupId, groupName, lastMessageTime, img, lastMessage } = item;
    const date = new Date(lastMessageTime);

    // Check if the timeVar is before 0h (start of the day)
    let time;
    if (isBefore(date, startOfToday())) {
        time = format(date, 'MMMM d');
    } else {
        time = format(date, 'hh:mm a');
    }
    return (
        <Link href={`auth/chat/ChatScreen?groupId=${groupId}&&groupName=${groupName}`} asChild>
            <TouchableHighlight activeOpacity={0.8} underlayColor={Colors.lightGray}>
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
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{groupName}</Text>
                        <Text style={{ fontSize: 16, color: Colors.gray }}>
                            {lastMessage.length > 40 ? `${lastMessage.substring(0, 40)}...` : lastMessage}
                        </Text>
                    </View>
                    <Text style={{ color: Colors.gray, paddingRight: 20, alignSelf: 'flex-start' }}>
                        {time}
                    </Text>
                </View>
            </TouchableHighlight>
        </Link>
    )
};

const ChatListScreen = () => {
    const [chats, setchats] = useState<chatType[]>([]);

    useEffect(() => {
        getGroupsApi()
            .then(res => {
                for (let i = 0; i < res.length; i++) {
                    res[i].img = "https://i.pravatar.cc/150?u=aguilarduke@marketoid.com";
                }
                setchats(res);
            })
            .catch(err => {
                console.log('CHATLISTSCREEN  getGroupsApi', err);

            })
    }, []);



    return (
        <View style={styles.container}>
            <FlatList
                data={chats}
                renderItem={renderItem}
                keyExtractor={(item) => item.groupId}
                style={styles.container}
            />
        </View>

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
