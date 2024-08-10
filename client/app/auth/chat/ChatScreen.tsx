import React, { useState, useCallback, useEffect } from 'react';
import { Bubble, Composer, GiftedChat, IMessage, InputToolbar, utils } from 'react-native-gifted-chat';
import { View, Image, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'
import { Colors } from '@/constants/Colors';
import { chatSocket } from '@/socket/socket';
import { getMessagesApi } from '@/apis/chat/chatApi';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import InitialNameAvatar from '@/components/InitialNameAvatar';
import { Avatar } from '@/components/Avatar';


const ChatHeader = ({ closeChat, groupName, groupImg, otherParticipantName }: any) => {
    return (
        <View style={styles.chatHeader}>
            <TouchableOpacity
                onPress={closeChat}
                style={{ width: 50, alignItems: 'center' }}
            >
                <Icon name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <Image
                    src='https://onlinejpgtools.com/images/examples-onlinejpgtools/butterfly-icon.jpg'
                    alt='avatar'
                    style={{ width: 30, height: 30, marginRight: 10, }}
                /> */}
                <Avatar img={groupImg} name={otherParticipantName} size={35} style={{ marginRight: 10 }} />
                <Text style={{ fontSize: 20, fontWeight: 'bold', }}>{groupName}</Text>
            </View>
            <View style={{ width: 50, alignItems: 'center' }} />
        </View>
    )
}

const renderBubble = (props: any) => {
    if (props.currentMessage.user._id == props.user._id ||
        (utils.isSameUser(props.currentMessage, props.previousMessage) &&
            utils.isSameDay(props.currentMessage, props.previousMessage))) {
        return (
            <Bubble
                {...props}
            />
        );
    }
    return (
        <View>
            <Text style={{
                padding: 5, fontSize: 12,
                backgroundColor: 'transparent',
                color: '#aaa'
            }}>{props.currentMessage.user.name}</Text>
            <Bubble
                {...props}
            />
        </View>
    );
}

// const renderBubble = (props: any) => {
//     return (
//         <Bubble
//             {...props}
//             wrapperStyle={{
//                 right: {
//                     backgroundColor: '#0084ff',
//                 },
//                 left: {
//                     backgroundColor: '#e5e5ea',
//                 },
//             }}
//         />
//     );
// };

const renderInputToolbar = (props: any) => {
    return (
        <InputToolbar
            {...props}
            containerStyle={{
                borderTopWidth: 0,
                // borderTopColor: '#e5e5ea',
                // paddingVertical: 2,
            }}
            primaryStyle={{ alignItems: 'center' }}
        />
    );
};

const renderComposer = (props: any) => {
    return (
        <Composer
            {...props}
            textInputStyle={{
                borderRadius: 20,
                borderColor: '#e5e5ea',
                borderWidth: 1,
                paddingHorizontal: 12,
                marginRight: 8,
                backgroundColor: '#e5e5ea',
            }}
        />
    );
};

const renderSend = (props: any) => {
    return (
        <TouchableOpacity style={styles.sendButton} onPress={() => props.onSend({ text: props.text.trim() }, true)}>
            <Icon name="send" size={20} color="#0084ff" />
        </TouchableOpacity>
    );
};

const renderAvatar = (props: any) => {
    const { currentMessage } = props;
    return (
        <>
            {
                currentMessage.user.avatar ?
                    <Image source={{ uri: currentMessage.user.avatar }} style={styles.avatarStyle} />
                    :
                    <InitialNameAvatar name={currentMessage.user.name} size={36} />
            }
        </>

    );
};

const getMessages = async (groupId: string, limit: number, offset: number) => {
    const res = await getMessagesApi(groupId, limit, offset);
    if (!res) return null;
    return res.map((mes: any) => ({
        _id: mes.id,
        createdAt: mes.create_time,
        text: mes.content,
        user: {
            _id: mes.email,
            name: `${mes.first_name} ${mes.last_name}`,
            avatar: mes.avatar ? mes.avatar : '',
        },
        sent: true,
    }));
};

const ChatScreen = ({ group, closeChat }: any) => {
    const user = useAppSelector((state: RootState) => state.user);

    const { groupId, groupName, groupImg, otherParticipantName } = group;
    const [messages, setMessages] = useState<IMessage[]>([]);

    const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
    const [isEarlierMessagesAvailable, setIsEarlierMessagesAvailable] = useState(true);

    const [offset, setOffset] = useState(0);
    const limit = 20;

    // const { groupId, groupName } = useLocalSearchParams();
    // const navigation = useNavigation();
    // useEffect(() => {
    //     navigation.setOptions({
    //         headerTitle: () => <CustomHeaderTitle groupName={groupName} />,
    //     });
    // }, []);

    useEffect(() => {
        chatSocket.emit('joinChat', groupId);
        chatSocket.on('newMessage', onReceiveMessage);

        chatSocket.emit('seenChat', groupId);

        return () => {
            chatSocket.off('newMessage');
            chatSocket.emit('leaveChat', groupId);
        };
    }, [])

    useEffect(() => {
        const fetchInitialMessages = async () => {
            setIsLoadingEarlier(true);
            const initialMessages = await getMessages(groupId, limit, 0);
            if (initialMessages) {
                if (initialMessages.length < limit)
                    setIsEarlierMessagesAvailable(false);
                setMessages(initialMessages);
                setOffset(offset + limit);
            }
            setIsLoadingEarlier(false);
        };
        fetchInitialMessages();
    }, []);
    // console.log('messages', messages);

    const onReceiveMessage = (message: any) => {
        chatSocket.emit('seenChat', groupId);

        if (message.user._id == user.profile.email) {
            setMessages((previousMessages) => {
                for (let i = 0; i < previousMessages.length; i++) {
                    if (previousMessages[i]._id === message._id) {
                        previousMessages[i] = { ...previousMessages[i], sent: true }
                        break;
                    }
                }
                return previousMessages;
            });
            return;
        }

        // console.log('onReceiveMessage', message);
        message.user.avatar = message.user.avatar ? message.user.avatar : '';
        setMessages((previousMessages) => GiftedChat.append(previousMessages, [message]));
    }

    const onSend = useCallback((messages: IMessage[] = []) => {
        // const sentMessages = [{ ...messages[0], }]
        setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
        for (let mes of messages) {
            chatSocket.emit('sendMessage', {
                groupId,
                content: mes.text,
                messageId: mes._id
            });
        }
    }, []);

    const onLoadEarlier = useCallback(async () => {
        setIsLoadingEarlier(true);
        const earlierMessages = await getMessages(groupId, limit, offset);
        if (earlierMessages) {
            if (earlierMessages.length < limit) {
                setIsEarlierMessagesAvailable(false);
            }
            setMessages((previousMessages) =>
                GiftedChat.prepend(previousMessages, earlierMessages)
            );
            setOffset(offset + limit);
        }
        setIsLoadingEarlier(false);
    }, [offset]);

    const onEndReached = ({ distanceFromEnd }: any) => {
        if (
            isEarlierMessagesAvailable &&
            !isLoadingEarlier &&
            Platform.OS !== 'web') {
            onLoadEarlier();
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ChatHeader closeChat={closeChat} groupName={groupName} groupImg={groupImg} otherParticipantName={otherParticipantName} />
            <GiftedChat
                messages={messages}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: user.profile.email ? user.profile.email : -1,
                }}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                renderComposer={renderComposer}
                renderSend={renderSend}
                messagesContainerStyle={{ backgroundColor: '#fff', paddingBottom: 8 }}
                alwaysShowSend
                // renderAvatar={props => <Avatar {...props} />}
                // showAvatarForEveryMessage={true}
                renderAvatar={renderAvatar}


                loadEarlier={isEarlierMessagesAvailable}
                isLoadingEarlier={isLoadingEarlier}
                onLoadEarlier={onLoadEarlier}
                infiniteScroll={true}

                listViewProps={{
                    // onMomentumScrollEnd: handleScrollEnd,
                    // scrollEventThrottle: 16,

                    onEndReached: onEndReached,
                    onEndReachedThreshold: 2,
                    ListFooterComponent: isLoadingEarlier ? <ActivityIndicator size="small" color="#0000ff" /> : null,
                }}

            />
        </SafeAreaView>


    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: Colors.lightGray,
        borderBottomWidth: 1,
        paddingVertical: 10
    },
    avatarStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 36,
        height: 36,
        borderRadius: 36 / 2,
    },
});
