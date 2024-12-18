const logger = require('../utils/logger');
const chatService = require('../services/chatService');
const notification = require('../utils/sendNotification')

exports.sendMessage = async (io, data) => {
    try {
        const { userId, groupId, content, messageId } = data;
        let newMessage = await chatService.createMessage(groupId, userId, content, messageId);
        io.to(groupId).emit('newMessage', newMessage);
        console.log('Socket sendMessage:', data);

        // emit newMessage for ChatListScreen to update
        const participants = await chatService.getParticipants(groupId);
        const groupInfo = await chatService.getGroupInfo(groupId);
        const lastActiveTime = await chatService.getLastActiveTimeParticipant(userId, groupId)
        for (const participant of participants) {
            let dataToEmit = {
                groupId,
                groupName: groupInfo.name,
                lastMessageTime: newMessage.createdAt,
                lastMessage: newMessage.text,
                lastActiveTime,
                // add group img to database??
                groupImg: groupInfo.img
            };
            io.to('ChatList:' + participant.email).emit('ChatList:newMessage', dataToEmit);

            let notificationData = {
                title: 'From: ' + newMessage.user.name,
                body: newMessage.text,
                data: {
                    path: 'chat',
                    groupId: groupId,
                    groupName: groupInfo.name,
                    groupImg: groupInfo.img,
                }
            }
            let receriverInfo = { receiverId: '', receiverEmail: participant.email };
            notification.sendPushNotification(userId, receriverInfo, notificationData);
        }
    }
    catch (error) {
        logger.error('Socket sendMessage:', error);
    }
}

exports.seenChat = async (io, data) => {
    try {
        const { userId, groupId } = data;
        await chatService.updateActiveTimeParticipant(userId, groupId);
        // io.to(groupId).emit('seenChat', ) ????
    }
    catch (error) {
        logger.error('Socket seenChat:', error);
    }
}