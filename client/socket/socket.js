import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hostDomain } from "@/config/config";

const socket = io(hostDomain, {
    auth: {
        token: AsyncStorage.getItem('accessToken'),
    },
});

socket.on('connect_error', (err) => {
    console.log(`Connection error: ${err.message}`);
});

export default socket;
