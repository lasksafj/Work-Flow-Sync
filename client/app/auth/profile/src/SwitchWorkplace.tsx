import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text } from "react-native";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

const SwitchWorkplace = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text>Switch Workplace</Text>
            </View>
        </SafeAreaView>
    );
};

export default SwitchWorkplace;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
