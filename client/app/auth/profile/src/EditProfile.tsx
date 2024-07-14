import React, { useState } from "react";
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    SafeAreaView,
    Modal,
    TextInput,
} from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import api from "@/apis/api";
import { userLogin } from "@/store/slices/userSlice";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type EditProps = {
    editProfileVisible: boolean;
    setEditProfileVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: Date;
}

// Define the validation schema using yup
const schema = yup.object().shape({
    email: yup
        .string()
        .email("Must be a valid email")
        .required("Email is required"),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    phoneNumber: yup
        .string()
        .matches(/^\+?[1-9]\d{1,14}$/, "Must be a valid phone number")
        .required("Phone number is required"),
    dateOfBirth: yup
        .date()
        .max(new Date(), "Date of birth must be in the past")
        .required("Date of birth is required"),
});

const EditProfile = ({
    editProfileVisible,
    setEditProfileVisible,
}: EditProps) => {
    const user = useAppSelector((state: RootState) => state.user);
    const dispatch = useAppDispatch();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
            email: user.profile.email,
            phoneNumber: user.profile.phoneNumber,
            dateOfBirth: user.profile.dateOfBirth,
        },
    });

    const onSubmit = (data: FormValues) => {
        api.put("/api/profile/profile-put", data)
            .then((res) => {
                console.log("EDIT PROFILE", res.data);
                let updatedData = {
                    profile: res.data,
                    accessToken: user.accessToken,
                };
                dispatch(userLogin(updatedData));
                setEditProfileVisible(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={editProfileVisible}
            onRequestClose={() => {
                setEditProfileVisible(!editProfileVisible);
            }}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => setEditProfileVisible(false)}
                    >
                        <Text style={styles.title}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Edit User</Text>
                    <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                        <Text style={styles.title}>Save</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    <Controller
                        control={control}
                        name="firstName"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="First Name"
                            />
                        )}
                    />
                    {errors.firstName && (
                        <Text style={styles.errorText}>
                            {errors.firstName.message}
                        </Text>
                    )}

                    <Controller
                        control={control}
                        name="lastName"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Last Name"
                            />
                        )}
                    />
                    {errors.lastName && (
                        <Text style={styles.errorText}>
                            {errors.lastName.message}
                        </Text>
                    )}

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Email"
                            />
                        )}
                    />
                    {errors.email && (
                        <Text style={styles.errorText}>
                            {errors.email.message}
                        </Text>
                    )}

                    <Controller
                        control={control}
                        name="phoneNumber"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Phone Number"
                            />
                        )}
                    />
                    {errors.phoneNumber && (
                        <Text style={styles.errorText}>
                            {errors.phoneNumber.message}
                        </Text>
                    )}

                    <Controller
                        control={control}
                        name="dateOfBirth"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.input}
                                value={value}
                                placeholder="Date of Birth"
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.dateOfBirth && (
                        <Text style={styles.errorText}>
                            {errors.dateOfBirth.message}
                        </Text>
                    )}
                </View>
            </SafeAreaView>
        </Modal>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f6f6f6",
    },
    header: {
        flexDirection: "row",
        paddingHorizontal: 10,
        backgroundColor: "#008000",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "white",
        marginBottom: 6,
        marginTop: 6,
    },
    form: {
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
});
