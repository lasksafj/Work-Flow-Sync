import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { Avatar } from "@/components/Avatar";

const ImageProfile = () => {
    const user = useAppSelector((state: RootState) => state.user);
    const [selectedImage, setSelectedImage] = useState<string | null>(
        user.profile.avatar || null
    );
    // console.log("selectedImage2222222222", selectedImage);

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
    // console.log("selectedImage3333333333333", selectedImage);
    return (
        <View style={styles.container}>
            <View style={styles.profile}>
                <TouchableOpacity onPress={showImagePickerOptions}>
                    <Avatar img={selectedImage} name={
                        user.profile.firstName +
                        " " +
                        user.profile.lastName
                    } size={100} />
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
});