import React from "react";
import { StatusBar } from "expo-status-bar";
import { Text, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function Welcome() {
    const handleButton = () => {
        // router.replace("(auth)");
        router.push("unauth/login");
    }
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