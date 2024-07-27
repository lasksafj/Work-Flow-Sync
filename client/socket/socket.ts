import io, { Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hostDomain } from "@/config/config";
import { router } from "expo-router";
import { getNewAccessToken, logout } from "@/apis/authorize/login";


// ----------------------------------------------------------------------------------------

// const socketMiddleware = (socket) => {
//     socket.io.opts.auth = {
//         token: AsyncStorage.getItem('accessToken'),
//     };

//     socket.on('connect', async () => {
//         console.log('Connected to socket');
//         // Optionally, you can verify the token here
//     });

//     socket.on('connect_error', async (err) => {
//         console.log('SOCKET Connection Error:', err.message);
//         if (err.message === 'Authentication error') {
//             const res = await getNewAccessToken();
//             if (res) {
//                 socket.io.opts.auth = {
//                     token: AsyncStorage.getItem('accessToken'),
//                 };
//                 socket.connect();
//             }
//             else {
//                 router.replace('');
//                 logout();
//             }
//         }
//     });
// };

// const chatSocket = io(hostDomain + '/chat', {
//     autoConnect: false, // Prevents auto connection before middleware is set up
// });

// socketMiddleware(chatSocket);

// const connectSockets = () => {
//     console.log('CONNECT SOCKET');
//     chatSocket.connect();
// }

// const disconnectSockets = () => {
//     console.log('DISCONNECT SOCKET');
//     chatSocket.disconnect();
// };

// export { chatSocket, connectSockets, disconnectSockets };

// ----------------------------------------------------------------------------------------

// const socket = io(hostDomain + '/chat', {
//     auth: {
//         token: AsyncStorage.getItem('accessToken'),
//     },
//     autoConnect: false
// });

// socket.on('connect_error', (err) => {
//     console.log(`Connection error: ${err.message}`);
// });

// export default socket;

// ------------------------------------------------------------------------------------------


let chatSocket: Socket;

const createSocket = (namespace: string, token: string) => {
    return io(hostDomain + namespace, {
        query: { token }
    });
};

const connectSockets = async () => {
    console.log('CONNECT SOCKET');
    let accessToken = await AsyncStorage.getItem('accessToken');
    if (!accessToken)
        return;
    chatSocket = createSocket('/chat', accessToken);

    const handleTokenExpired = async (socket: Socket) => {
        socket.on('connect_error', async (error) => {
            console.log('SOCKKET error', error);
            if (error.message === 'Authentication error') {
                let res = await getNewAccessToken();
                if (res) {
                    console.log('SOCKET RECONNECT', res);

                    socket.io.opts.query = {
                        token: res.access
                    };
                    socket.connect();
                }
                else {
                    alert('Unauthorized access. Please log in.');
                    router.replace('');
                    logout();
                }
            }
        });
    };

    handleTokenExpired(chatSocket);
};

const disconnectSockets = () => {
    console.log('DISCONNECT SOCKET');
    if (chatSocket) chatSocket.disconnect();
};

export { connectSockets, disconnectSockets, chatSocket };
