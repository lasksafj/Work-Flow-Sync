import React, { useState, useCallback, useEffect } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Avatar, Bubble, Composer, GiftedChat, IMessage, InputToolbar } from 'react-native-gifted-chat';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomHeaderTitle = ({ chatId }: any) => {
    return (
        <View style={styles.container}>
            <Image
                src='https://onlinejpgtools.com/images/examples-onlinejpgtools/butterfly-icon.jpg'
                alt='avatar'
                style={styles.image}
            />
            <Text style={styles.text}>AAAA {chatId}</Text>
        </View>
    );
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

const ChatScreen = () => {
    const { chatId } = useLocalSearchParams();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => <CustomHeaderTitle chatId={chatId} />,
        });
    }, []);

    useEffect(() => {
        setMessages([
            {
                _id: 'mes_id',
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: 3,
                    name: 'React Native',
                    avatar: 'https://onlinejpgtools.com/images/examples-onlinejpgtools/butterfly-icon.jpg',
                },
            },
        ]);
    }, []);

    const onSend = useCallback((messages: IMessage[] = []) => {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    }, []);


    return (
        <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
                _id: 1,
            }}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            renderComposer={renderComposer}
            renderSend={renderSend}
            messagesContainerStyle={{ backgroundColor: '#fff', paddingBottom: 8 }}
            alwaysShowSend
            renderAvatar={props => <Avatar {...props} />}
        />

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
});
