import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { Avatar } from "@/components/Avatar";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { storage, db } from "@/.config/firebase";
import api from "@/apis/api";
import { userLogin } from "@/store/slices/userSlice";

const ImageProfile = () => {
    const user = useAppSelector((state: RootState) => state.user);
    const dispatch = useAppDispatch();
    const [selectedImage, setSelectedImage] = useState<string | null>(
        user.profile.avatar || null
    );

    const saveImageToDatabase = (imageUri: string) => {
        api.put("/api/profile/change-avatar", { avatar: imageUri })
            .then((res) => {
                let updatedData = {
                    profile: res.data,
                    accessToken: user.accessToken,
                };
                dispatch(userLogin(updatedData));
            })
            .catch((err) => {
                console.log(err);
            });
      };

    const uploadImage = async (imageUri: string) => {
        try {
            // Convert URI to Blob
            const response = await fetch(imageUri);
            const blob = await response.blob();
    
            // Create a reference in Firebase Storage
            const storageRef = ref(storage, `avatars/${user.profile.email}-${Date.now()}.jpg`);
    
            // Upload the file to Firebase Storage
            const snapshot = await uploadBytes(storageRef, blob);
    
            // Get the download URL
            const downloadURL = await getDownloadURL(snapshot.ref);
            console.log(downloadURL);
            // Update the database with the download URL
            await saveImageToDatabase(downloadURL);
            
            // Update local state
            setSelectedImage(downloadURL);
    
            Alert.alert("Success", "Profile image updated successfully!");
        } catch (error) {
            console.error("Error uploading image:", error);
            Alert.alert("Error", "Failed to upload image. Please try again.");
        }
    };

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
            quality: 0.00001,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            await uploadImage(imageUri);
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
            quality: 0.00001,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            await uploadImage(imageUri);
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