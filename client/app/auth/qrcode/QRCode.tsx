import { router } from "expo-router";
import React, { useState } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg";

const QRCodeGenerator = () => {
    const [orgAbbreviation, setOrgAbbreviation] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>QR Code Generator</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Enter Organization Abbreviation"
                value={orgAbbreviation}
                onChangeText={setOrgAbbreviation}
            />

            {orgAbbreviation ? (
                <QRCode value={orgAbbreviation} />
            ) : (
                <Text style={styles.placeholderText}>Enter an abbreviation to generate a QR code.</Text>
            )}

            <TouchableOpacity 
                style={styles.button} 
                onPress={() => {
                    router.push('auth/qrcode/ClockInOutScreen');
                }}
            >
                <Text style={styles.buttonText}>Clock in/out</Text>
            </TouchableOpacity>
        </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        width: '80%',
        marginBottom: 20,
    },
    placeholderText: {
        marginTop: 10,
        color: 'gray',
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default QRCodeGenerator;
