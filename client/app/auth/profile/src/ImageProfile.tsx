import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { Avatar } from "@/components/Avatar";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ImageProfile = () => {
    const user = useAppSelector((state: RootState) => state.user);
    const [selectedImage, setSelectedImage] = useState<string | null>(
        user.profile.avatar || null
    );

    const pickImage = async () => {
        // Request permission to access the library
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
            return;
        }

        // Pick an image from the library
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        // Request permission to access the camera
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            alert("Sorry, we need camera permissions to make this work!");
            return;
        }

        // Take a photo using the camera
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const showImagePickerOptions = () => {
        Alert.alert(
            "Select Avatar",
            "Choose an image from your library or take a new photo",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Pick from Library", onPress: pickImage },
                { text: "Take Photo", onPress: takePhoto },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.profile}>
                <TouchableOpacity onPress={showImagePickerOptions}>
                    <Avatar img={selectedImage} name={
                        user.profile.firstName +
                        " " +
                        user.profile.lastName
                    } size={100} />
                    <MaterialCommunityIcons
                        name="camera-outline"
                        size={24}
                        color="#000"
                        style={styles.cameraIcon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ImageProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profile: {
        padding: 16,
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0, // Adjust for position inside the circle
        right: 0,  // Adjust for position inside the circle
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 2, // Add padding for the background behind the icon
    },
});