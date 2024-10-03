import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import api from "@/apis/api";
import { router } from "expo-router";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

export default function ClockInOutScreen({ navigation }: any) {
    const [permission, requestPermission] = useCameraPermissions();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const cameraRef = useRef(null);

    const organization = useAppSelector(
        (state: RootState) => state.organization
    );

    useEffect(() => {
        (async () => {
            const { status } = await requestPermission();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = async ({ type, data }: any) => {
        setScanned(true);
        if (organization.abbreviation !== data) {
            alert('You are not authorized for this organization. Please try again.');
            router.back();
            setScanned(false);
            return;
        }
        const orgAbbreviation = organization.abbreviation; // The QR code contains the organization's abbreviation
        console.log(data);
        
        try {
            // Send a POST request to the backend API
            const response = await api.post(
                `/api/timesheets/clock-in-out`,
                { org_abbreviation: orgAbbreviation }
            );
            Alert.alert('Success', response.data.message);
        } catch (error: any) {
            // const errorMessage = (error as any).response?.data?.error || 'An error occurred';
            Alert.alert('Error', error);
        }
        router.back();

        setScanned(false);
    };

    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text>Requesting camera permission...</Text>
            </View>
        );
    }
    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text>No access to camera.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>QR Code Scanner</Text>
            <CameraView
                ref={cameraRef}
                style={StyleSheet.absoluteFillObject}
                // type={Camera.Constants.Type.back}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                // barCodeScannerSettings={{
                //     barCodeTypes: [Camera.Constants.BarCodeType.qr],
                // }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        color: "white",
        fontSize: 40,
        textAlign: 'center',
        marginVertical: 20,
    },
});
