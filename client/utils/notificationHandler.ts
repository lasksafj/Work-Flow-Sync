// NotificationHandler.js
import * as Notifications from 'expo-notifications';
import { chatState } from '@/utils/globalState';

Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
        const { data } = notification.request.content;
        const currentChatId = chatState.currentChatId;
        const shouldSuppressNotification = currentChatId && data?.path == 'chat' && data?.groupId == currentChatId;
        // console.log('!shouldSuppressNotification', !shouldSuppressNotification, 'currentChatId', currentChatId, 'data', notification.request.content);
        // console.log();
        return {
            shouldShowAlert: !shouldSuppressNotification, // Suppress notification if it matches the open modal ID
            shouldPlaySound: false,
            shouldSetBadge: false,
        };
    },
});
