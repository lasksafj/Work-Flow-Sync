import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { validateToken } from "@/apis/authorize/login";
import { useAppDispatch } from "@/store/hooks";
import { userLogin } from "@/store/slices/userSlice";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function Welcome() {
    const dispatch = useAppDispatch()
    const handleButton = async () => {
        router.push("unauth/login");
    }

    useEffect(() => {
        console.log('START APP');

        async function prepare() {
            // await new Promise(resolve => setTimeout(resolve, 2000));
            const response = await validateToken();

            if (response.status) {
                dispatch(userLogin(response.data));
                router.replace("auth");
            }
            await SplashScreen.hideAsync();
        }
        prepare();

    }, []);


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={{
                    height: "100%",
                }}
            >
                <View style={styles.container}>
                    <Text>Workflow Sync</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleButton()}
                    >
                        <Text>Continue with ...</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { router.push("unauth/register"); }}
                    >
                        <Text>register</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <StatusBar backgroundColor="#161622" style="light" />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
    },
});