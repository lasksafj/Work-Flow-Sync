import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const getColorFromName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Extract RGB components
    const r = (hash >> 16) & 0xFF;
    const g = (hash >> 8) & 0xFF;
    const b = hash & 0xFF;

    // Darkening factor (e.g., 0.7 for 30% darker)
    const factor = 0.7;

    // Apply darkening factor
    const darkR = Math.floor(r * factor);
    const darkG = Math.floor(g * factor);
    const darkB = Math.floor(b * factor);

    // Convert to hex and pad with 0 if necessary
    const color = `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`;
    return color;
};


const InitialNameAvatar = ({ name, size = 50, style }: any) => {
    const color = getColorFromName(name);
    // Function to get the initials from the name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    };

    return (
        <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }, style]}>
            <Text style={[styles.initials, { fontSize: size / 2 }]}>{getInitials(name)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    avatar: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        color: '#fff',
        // fontSize: 20,
        fontWeight: 'bold',
    },
});

export default InitialNameAvatar;
