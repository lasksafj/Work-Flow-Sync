import React, { useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Modal, TextInput, Button } from "react-native";
import api from "@/apis/api";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SafeAreaView } from "react-native";
import { Feather as FeatherIcon, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Props type for the ChangePassword component
type ChangePasswordProps = {
    changePasswordVisible: boolean;
    setChangePasswordVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

// Type for password fields
type PasswordProp = {
    currentPassword: string;
    newPassword: string;
}

// Define the validation schema using yup
const schema = yup.object().shape({
    currentPassword: yup.string().min(6, 'Password must be at least 6 characters').required("Current Password is required"),
    newPassword: yup.string().min(6, 'Password must be at least 6 characters').required("New Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword"), undefined], "Passwords must match"),
});

// Component to handle password change logic
const ChangePassword = ({
    changePasswordVisible,
    setChangePasswordVisible,
}: ChangePasswordProps) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    // Function to reset form values to default
    const handleReset = () => {
        reset({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    // Function to submit new password to API
    const onSubmit = (data: PasswordProp) => {
        api.put("/api/profile/profile-putChangePassword", data)
            .then((res) => {
                if (res.status === 200) {
                    setChangePasswordVisible(false);
                    router.dismissAll();
                    router.push("/auth");
                }
            })
            .catch((error) => {
                alert(error.response.data.error);
            })
    };

    // Header component for the modal
    const Header = () => (
        <View style={styles.header}>
            <TouchableOpacity
                onPress={() => {
                    setChangePasswordVisible(false);
                    handleReset();
                }}
            >
                <FeatherIcon
                    name="chevron-left"
                    size={25}
                    color="white"
                    style={styles.title}
                />

            </TouchableOpacity>
            <Text style={styles.title}>Change Password</Text>
            <Text style={styles.spacer} />
        </View>
    );

    // State to toggle password visibility
    const [showPassword, setShowPassword] = useState(false);
    const passwordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={changePasswordVisible}
            onRequestClose={() => {
                setChangePasswordVisible(false);
            }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <Header /> {/* Render the header component */}

                <View style={styles.section}>
                    <View>
                        {/* Current Password Input */}
                        <View style={styles.rowWraper}>
                            <View style={styles.row}>
                                <Text style={styles.rowLabel}>Current password</Text>
                                <View style={styles.rowSpacer} />
                                <TouchableOpacity onPress={passwordVisibility}>
                                    <Text style={{ fontSize: 15, color: "#0000FF" }}>
                                        {showPassword ? "HIDE" : "SHOW"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <View style={styles.rowWraper}>
                            <View style={styles.row}>
                                <Controller
                                    control={control}
                                    name="currentPassword"
                                    render={({
                                        field: { onChange, onBlur, value },
                                    }) => (
                                        <TextInput
                                            style={styles.rowValue}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            placeholder="Enter current password"
                                            placeholderTextColor="#999"
                                            secureTextEntry={!showPassword}
                                        />
                                    )}
                                />
                            </View>
                            {errors.currentPassword && (
                                <Text style={styles.errorText}>
                                    {errors.currentPassword.message}
                                </Text>
                            )}
                        </View>
                        {/* New Password Input */}
                        <View style={styles.rowWraper}>
                            <View style={styles.row}>
                                <Text style={styles.rowLabel}>New password</Text>
                            </View>
                        </View>
                        <View style={styles.rowWraper}>
                            <View style={styles.row}>
                                <Controller
                                    control={control}
                                    name="newPassword"
                                    render={({
                                        field: { onChange, onBlur, value },
                                    }) => (
                                        <View style={styles.passwordContainer}>
                                            <TextInput
                                                style={styles.rowValue}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                placeholder="Enter new password"
                                                placeholderTextColor="#999"
                                                secureTextEntry={!showPassword}
                                            />
                                        </View>
                                    )}
                                />
                            </View>
                            {errors.newPassword && (
                                <Text style={styles.errorText}>
                                    {errors.newPassword.message}
                                </Text>
                            )}
                        </View>
                        {/* Confirm Password Input */}
                        <View style={styles.rowWraper}>
                            <View style={styles.row}>
                                <Controller
                                    control={control}
                                    name="confirmPassword"
                                    render={({
                                        field: { onChange, onBlur, value },
                                    }) => (
                                        <TextInput
                                            style={styles.rowValue}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            placeholder="Confirm new password"
                                            placeholderTextColor="#999"
                                            secureTextEntry={!showPassword}
                                        />
                                    )}
                                />
                            </View>
                            {errors.confirmPassword && (
                                <Text style={styles.errorText}>
                                    {errors.confirmPassword.message}
                                </Text>
                            )}
                        </View>
                        <View style={styles.rowWraper} />
                        {/* Submit button to update the password */}
                        <Button
                            title="Update"
                            onPress={handleSubmit(onSubmit)}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

export default ChangePassword;

// Style
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f6f6f6",
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 6,
        marginTop: 6,
    },
    section: {
        // paddingTop: 12,
    },
    rowWraper: {
        paddingLeft: 24,
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
        backgroundColor: "#fff",
    },
    rowSpacer: {
        flex: 1,
    },
    row: {
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingRight: 24,
    },
    rowLabel: {
        fontSize: 17,
        fontWeight: "500",
        color: "#0000FF",
    },
    rowValue: {
        fontSize: 17,
        color: "#616161",
        marginRight: 4,
        textAlign: "left",
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
    spacer: {
        width: 25,
    },
});