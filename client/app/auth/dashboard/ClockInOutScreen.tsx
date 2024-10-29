import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import api from "@/apis/api";
import { router } from "expo-router";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

export default function ClockInOutScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null); // Camera permission state
    const [scanned, setScanned] = useState(false); // Scan state
    const cameraRef = useRef(null);

    const organization = useAppSelector(
        (state: RootState) => state.organization
    ); // Get organization data from Redux store

    // Request camera permissions on component mount
    useEffect(() => {
        (async () => {
            const { status } = await requestPermission();
            setHasPermission(status === 'granted');
        })();
    }, []);

    // Handler for when a barcode is scanned
    const handleBarCodeScanned = async ({ type, data }: any) => {
        setScanned(true);

        // Verify that the scanned data matches the organization's abbreviation
        if (organization.abbreviation !== data) {
            Alert.alert('Error', 'You are not authorized for this organization. Please try again.');
            setScanned(false);
            router.back();
            return;
        }
        
        try {
            // Get clock-in status
            const statusResponse = await api.get(
                `/api/timesheets/status`,
                { params: { org_abbreviation: organization.abbreviation } }
            );
    
            const isClockedIn = statusResponse.data.clockedIn;
            const organizationName = statusResponse.data.org_name;
    
            // Ask for confirmation
            Alert.alert(
                isClockedIn ? 'Clock Out' : 'Clock In',
                `Are you sure you want to ${isClockedIn ? 'clock out from' : 'clock in to'} ${organizationName}?`,
                [
                    { text: 'Cancel', style: 'cancel', onPress: () => { setScanned(false); } },
                    { text: 'OK', onPress: async () => {
                        try {
                            // Send POST request to clock in/out
                            const response = await api.post(
                                `/api/timesheets/clock-in-out`,
                                { org_abbreviation: organization.abbreviation }
                            );
                            Alert.alert(
                                'Success', 
                                response.data.message);
                        } catch (error: any) {
                            Alert.alert('Error', error.response?.data?.error || 'An error occurred');
                        }
    
                        router.back();
                        setScanned(false);
                    } },
                ],
                { cancelable: false }
            );
        } catch (error: any) {
            // Handle errors from the API
            Alert.alert('Error', error.response?.data?.error || 'An error occurred');
        }

        // Navigate back after handling the scan
        router.back();
        setScanned(false);
    };

    // Render different views based on camera permission status
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
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                  }}
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
