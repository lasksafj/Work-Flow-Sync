import React, { useState, useCallback, useEffect } from 'react';
import { Avatar, Bubble, Composer, GiftedChat, IMessage, InputToolbar } from 'react-native-gifted-chat';
import { View, Image, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'
import { Colors } from '@/constants/Colors';
import { chatSocket } from '@/socket/socket';
import { getMessagesApi } from '@/apis/chat/chatApi';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import InitialNameAvatar from '@/components/InitialNameAvatar';


const ChatHeader = ({ closeChat, groupName }: any) => {
    return (
        <View style={styles.chatHeader}>
            <TouchableOpacity
                onPress={closeChat}
                style={{ width: 50, alignItems: 'center' }}
            >
                <Icon name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
                <Image
                    src='https://onlinejpgtools.com/images/examples-onlinejpgtools/butterfly-icon.jpg'
                    alt='avatar'
                    style={{ width: 30, height: 30, marginRight: 10, }}
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold', }}>{groupName}</Text>
            </View>
            <View style={{ width: 50, alignItems: 'center' }} />
        </View>
    )
}

const renderBubble = (props: any) => {
    return (
        <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: '#0084ff',
                },
                left: {
                    backgroundColor: '#e5e5ea',
                },
            }}
        />
    );
};

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
                    <InitialNameAvatar name={currentMessage.user.name} size={35} />
            }
        </>

    );
};

const ChatScreen = ({ group, closeChat }: any) => {
    const user = useAppSelector((state: RootState) => state.user);

    const { groupId, groupName } = group;
    const [messages, setMessages] = useState<IMessage[]>([]);
    // const { groupId, groupName } = useLocalSearchParams();
    // const navigation = useNavigation();
    // useEffect(() => {
    //     navigation.setOptions({
    //         headerTitle: () => <CustomHeaderTitle groupName={groupName} />,
    //     });
    // }, []);
    useEffect(() => {
        const limit = 20;
        const offset = 0;
        async function getMessages() {
            const res = await getMessagesApi(groupId, limit, offset);
            if (!res)
                return;
            let newMessages = res.map((mes: any) => {
                return {
                    _id: mes.id,
                    createdAt: mes.create_time,
                    text: mes.content,
                    user: {
                        _id: mes.email,
                        name: mes.first_name + ' ' + mes.last_name,
                        avatar: mes.avatar ? mes.avatar : ''
                    }
                }
            });
            setMessages(newMessages);
        }
        getMessages();
    }, []);

    const onReceiveMessage = (message: any) => {
        if (message.user._id == user.profile.email)
            return;
        // console.log('onReceiveMessage', message);
        message.user.avatar = message.user.avatar ? message.user.avatar : '';

        setMessages((previousMessages) => GiftedChat.append(previousMessages, [message]));
    }

    useEffect(() => {
        chatSocket.emit('joinChat', groupId);
        chatSocket.on('newMessage', onReceiveMessage);

        return () => {
            chatSocket.off('newMessage');
        };
    })

    const onSend = useCallback((messages: IMessage[] = []) => {
        for (let mes of messages) {
            chatSocket.emit('sendMessage', {
                groupId,
                content: mes.text
            });
        }
        setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    }, []);


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ChatHeader closeChat={closeChat} groupName={groupName} />
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
                renderAvatar={renderAvatar}
            // showAvatarForEveryMessage={true}
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
        borderBottomColor: Colors.lightGray,
        borderBottomWidth: 1,
        paddingVertical: 15
    },
    avatarStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
    },
});
