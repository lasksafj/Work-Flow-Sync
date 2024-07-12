import { getGroupsApi } from '@/apis/chat/chatApi';
import { Colors } from '@/constants/Colors';
import { format } from 'date-fns';
import { Link, router } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TouchableHighlight } from 'react-native';

const chats = [
    {
        "id": "1",
        "from": "Aguilar",
        "date": "Wed Sep 10 2008 01:23:35 GMT+0200 (Central European Summer Time)",
        "img": "https://i.pravatar.cc/150?u=aguilarduke@marketoid.com",
        "msg": "Ullamco nostrud velit reprehenderit exercitation labore laboris consequat ex magna nostrud.",
        "read": true,
        "unreadCount": 2
    },
    {
        "id": "2",
        "from": "Baxter",
        "date": "Wed May 20 1998 08:53:35 GMT+0200 (Central European Summer Time)",
        "img": "https://i.pravatar.cc/150?u=baxterduke@marketoid.com",
        "msg": "Commodo tempor consequat elit in sit sint cillum magna laborum laborum veniam ea exercitation quis.",
        "read": false,
        "unreadCount": 2
    },
    {
        "id": "3",
        "from": "Bonnie",
        "date": "Tue Dec 30 2003 17:58:09 GMT+0100 (Central European Standard Time)",
        "img": "https://i.pravatar.cc/150?u=bonnieduke@marketoid.com",
        "msg": "Labore excepteur reprehenderit deserunt pariatur in cupidatat dolor Lorem nulla elit irure.",
        "read": true,
        "unreadCount": 1
    },
    {
        "id": "d90b9cac-aca0-4b8f-9ac5-3b7c228e3657",
        "from": "Myrna",
        "date": "Fri Dec 24 2010 08:09:38 GMT+0100 (Central European Standard Time)",
        "img": "https://i.pravatar.cc/150?u=myrnaduke@marketoid.com",
        "msg": "Proident cupidatat sint exercitation incididunt enim deserunt cillum irure.",
        "read": true,
        "unreadCount": 0
    },
    {
        "id": "45ba88b0-3d9e-4ca7-a93a-45b7db9d7100",
        "from": "Terra",
        "date": "Mon Jun 04 1990 16:28:06 GMT+0200 (Central European Summer Time)",
        "img": "https://i.pravatar.cc/150?u=terraduke@marketoid.com",
        "msg": "Deserunt mollit qui aute enim sit enim ullamco nostrud velit excepteur culpa in.",
        "read": false,
        "unreadCount": 0
    },
    {
        "id": "874933b3-b7ba-47e0-8bcd-40defa550c68",
        "from": "Bessie",
        "date": "Wed Jul 17 1985 00:01:43 GMT+0200 (Central European Summer Time)",
        "img": "https://i.pravatar.cc/150?u=bessieduke@marketoid.com",
        "msg": "Duis et eu commodo nulla in anim elit.",
        "read": true,
        "unreadCount": 0
    },
    {
        "id": "f09bb250-6e5b-4d98-a849-93e0fdc1a351",
        "from": "Ella",
        "date": "Fri Aug 05 2011 14:09:06 GMT+0200 (Central European Summer Time)",
        "img": "https://i.pravatar.cc/150?u=elladuke@marketoid.com",
        "msg": "Commodo pariatur proident et dolor.",
        "read": false,
        "unreadCount": 2
    },
    {
        "id": "c4ae3078-4df8-4c0d-b55f-73e02622ee0f",
        "from": "Cain",
        "date": "Thu Mar 06 1997 05:05:53 GMT+0100 (Central European Standard Time)",
        "img": "https://i.pravatar.cc/150?u=cainduke@marketoid.com",
        "msg": "Ex ea magna exercitation duis aliquip minim pariatur adipisicing.",
        "read": false,
        "unreadCount": 3
    },
    {
        "id": "c6650dc2-2fa3-4415-9fb7-239ccc7983d0",
        "from": "Herring",
        "date": "Tue Sep 05 2017 21:57:55 GMT+0200 (Central European Summer Time)",
        "img": "https://i.pravatar.cc/150?u=herringduke@marketoid.com",
        "msg": "Qui velit laborum dolore labore dolor est.",
        "read": true,
        "unreadCount": 1
    },
    {
        "id": "a8c98568-690f-43aa-b188-0d13ff10dbde",
        "from": "Jerri",
        "date": "Wed Jul 07 2021 22:38:47 GMT+0200 (Central European Summer Time)",
        "img": "https://i.pravatar.cc/150?u=jerriduke@marketoid.com",
        "msg": "Nisi irure nostrud tempor ex aute aute consectetur reprehenderit velit.",
        "read": true,
        "unreadCount": 2
    },
    {
        "id": "9160e9d7-8e66-425f-99a0-dd323d464387",
        "from": "Yvette",
        "date": "Fri May 03 1996 17:50:23 GMT+0200 (Central European Summer Time)",
        "img": "https://i.pravatar.cc/150?u=yvetteduke@marketoid.com",
        "msg": "Ea consectetur ex ullamco commodo reprehenderit dolore occaecat aute culpa commodo exercitation id.",
        "read": false,
        "unreadCount": 1
    },
    {
        "id": "d8da9548-3691-47f1-940a-85f0dba6d470",
        "from": "Cornelia",
        "date": "Thu Feb 06 2003 18:59:28 GMT+0100 (Central European Standard Time)",
        "img": "https://i.pravatar.cc/150?u=corneliaduke@marketoid.com",
        "msg": "Qui incididunt pariatur do esse pariatur reprehenderit nulla id deserunt magna consequat sint non.",
        "read": false,
        "unreadCount": 2
    },
    {
        "id": "349337b0-ada4-4ba1-9899-914913daacc6",
        "from": "Mueller",
        "date": "Wed May 20 1987 01:53:37 GMT+0200 (Central European Summer Time)",
        "img": "https://i.pravatar.cc/150?u=muellerduke@marketoid.com",
        "msg": "Dolore proident laborum laborum consequat ea duis ut sunt sint ullamco qui tempor.",
        "read": false,
        "unreadCount": 0
    },
    {
        "id": "ddd8aef7-c1c1-4d76-aea1-89c9c43d7491",
        "from": "Anita",
        "date": "Tue Jun 14 2016 17:52:21 GMT+0200 (Central European Summer Time)",
        "img": "https://i.pravatar.cc/150?u=anitaduke@marketoid.com",
        "msg": "Minim elit ex veniam eiusmod ut.",
        "read": true,
        "unreadCount": 0
    },
];

const renderItem = ({ item }: any) => {
    const { id, from, date, img, msg, read, unreadCount } = item;
    return (
        // <TouchableOpacity
        //     style={styles.chatItem}
        //     onPress={() => {
        //         router.push({
        //             pathname: 'auth/chat/ChatScreen',
        //             params: { chatId: item.id }
        //         });
        //     }}
        // >
        //     <Image source={{ uri: item.avatar }} style={styles.avatar} />
        //     <View style={styles.chatDetails}>
        //         <Text style={styles.chatName}>{item.name}</Text>
        //         <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        //     </View>
        // </TouchableOpacity>

        <Link href={`auth/chat/ChatScreen?chatId=${id}`} asChild>
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
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{from}</Text>
                        <Text style={{ fontSize: 16, color: Colors.gray }}>
                            {msg.length > 40 ? `${msg.substring(0, 40)}...` : msg}
                        </Text>
                    </View>
                    <Text style={{ color: Colors.gray, paddingRight: 20, alignSelf: 'flex-start' }}>
                        {format(date, 'MM/dd/yy')}
                    </Text>
                </View>
            </TouchableHighlight>
        </Link>
    )
};

const ChatListScreen = () => {



    // useEffect(() => {
    //     getGroupsApi()
    //     .then(res => {

    //     })
    //     .catch(err => {

    //     })
    // }, []);



    return (
        <FlatList
            data={chats}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.container}
        />
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
