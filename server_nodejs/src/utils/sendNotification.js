const db = require('../config/db');
const logger = require('./logger');

exports.sendPushNotification = async (userId, receriverInfo, notificationData) => {
    try {
        let { receiverId, receiverEmail } = receriverInfo;
        let receiver;
        if (!receiverId) {
            const result = await db.query('SELECT * FROM users WHERE email = $1', [receiverEmail]);
            receiver = result.rows[0];
        }
        else {
            const result = await db.query('SELECT * FROM users WHERE id = $1', [receiverId]);
            receiver = result.rows[0];
        }
        if (!receiver) throw new Error('Receiver not found');
        if (userId == receiver.id || !receiver.expo_push_token)
            return;

        let { title, body, data } = notificationData;
        const message = {
            to: receiver.expo_push_token,
            sound: 'default',
            title,
            body,
            data,
        };

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    } catch (error) {
        logger.error('Send Notification Error', error.message);

    }

}