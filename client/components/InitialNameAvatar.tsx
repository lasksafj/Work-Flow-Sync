import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const getColorFromName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `#${((hash >> 24) & 0xFF).toString(16).padStart(2, '0')}${((hash >> 16) & 0xFF).toString(16).padStart(2, '0')}${((hash >> 8) & 0xFF).toString(16).padStart(2, '0')}`;
    return color;
};

const InitialNameAvatar = ({ name, size = 50 }: any) => {
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
        <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
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
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default InitialNameAvatar;
