// import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { getWorkplaces } from '@/apis/authorize/getWorkplaces';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';
// import { TextInput } from 'react-native-gesture-handler';

// const ConfirmScreen = () => {
//     const [workplaces, setWorkplaces] = useState<String[]>([]);
//     const [verifyWorkplace, setVerifyWorkplace] = useState(false);
//     const [code, setCode] = useState('');
//     const [isLoading, setIsLoading] = useState(false);

//     useEffect(() => {
//         async function prepare() {
//             const response = await getWorkplaces();
//             if (response.status) {
//                 const fetchedWorkplaces = response.data as String[];
//                 const currentWorkplace = await AsyncStorage.getItem('currentWorkplace');
//                 if (currentWorkplace && fetchedWorkplaces.includes(currentWorkplace)) {
//                     router.push('auth');
//                 }
//                 else {
//                     if (fetchedWorkplaces.length == 0) {
//                         setVerifyWorkplace(true);
//                     }
//                     else {
//                         setWorkplaces(fetchedWorkplaces);
//                     }
//                 }
//             }
//         }
//         prepare();
//     }, []);

//     const handleSubmitCode = async () => {
//         setIsLoading(true);
//         setIsLoading(false);

//     };

//     if (verifyWorkplace) {
//         return (
//             <View>
//                 <TextInput
//                     style={styles.textInput}
//                     placeholder="Code of the workplace"
//                     value={code}
//                     onChangeText={setCode}
//                 />
//                 {isLoading ? (
//                     <ActivityIndicator size="small" color="#0000ff" />
//                 ) : (
//                     <Button title="Submit" onPress={handleSubmitCode} />
//                 )}
//             </View>
//         )
//     }
//     return (
//         <View>
//             <Text>Confirm Screen</Text>
//         </View>
//     )
// }

// export default ConfirmScreen

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     textInput: {
//         padding: 10,
//         borderWidth: 1,
//         borderRadius: 5,
//         marginBottom: 10,
//         width: 200
//     },
// })