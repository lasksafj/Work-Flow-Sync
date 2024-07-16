import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Text,
    Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Svg, Circle, Text as SvgText } from "react-native-svg";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";

// interface ImageProfileProps {
//     initials: string;
//     imageUrl: string | null;
// }

const ImageProfile = () => {
    const user = useAppSelector((state: RootState) => state.user);
    const imageUrl: string = "https://reactjs.org/logo-og.png";
    // const imageUrl = null;
    const initials = `${user.profile.firstName?.[0] ?? ""}${
        user.profile.lastName?.[0] ?? ""
    }`.toUpperCase();
    // console.log("imageUrl111111", imageUrl);
    const [selectedImage, setSelectedImage] = useState<string | null>(imageUrl);
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
            "Select Image",
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
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f6f6f6" }}>
            <View style={styles.container}>
                <TouchableOpacity onPress={showImagePickerOptions}>
                    <View style={styles.profile}>
                        {selectedImage ? (
                            <Image
                                style={styles.profileAvatar}
                                source={{
                                    uri: selectedImage,
                                }}
                                alt="Profile Picture"
                            />
                        ) : (
                            <View style={styles.initialsContainer}>
                                <Svg height="100" width="100">
                                    <Circle
                                        cx="50"
                                        cy="50"
                                        r="50"
                                        fill="#6200EE"
                                    />
                                    <SvgText
                                        fill="white"
                                        fontSize="40"
                                        fontWeight="bold"
                                        x="50"
                                        y="65"
                                        textAnchor="middle"
                                    >
                                        {initials}
                                    </SvgText>
                                </Svg>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
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
    profileAvatar: {
        width: 80,
        height: 80,
        borderRadius: 9999,
    },
    initialsContainer: {
        width: 80,
        height: 80,
        borderRadius: 9999,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },
});
