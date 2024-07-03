import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { register } from '@/apis/authorize/register';
import { loginLocal } from '@/apis/authorize/login';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { userLogin } from '@/store/slices/userSlice';
import { useAppDispatch } from '@/store/hooks';


// Define the validation schema using yup
const schema = yup.object().shape({
    email: yup.string().email("Must be a valid email").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    phoneNumber: yup.string().matches(/^\+?[1-9]\d{1,14}$/, "Must be a valid phone number").required("Phone number is required"),
    dateOfBirth: yup.date().max(new Date(), "Date of birth must be in the past").required("Date of birth is required")
});

const RegisterScreen = () => {
    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            dateOfBirth: new Date('2000-12-12'),
        }

    });

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch()

    const onChangeDatePicker = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        setValue('dateOfBirth', currentDate, { shouldValidate: true });  // Update form state
    };

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        let { email, password, lastName, firstName, phoneNumber, dateOfBirth } = data;
        dateOfBirth = moment(dateOfBirth).format('YYYY-MM-DD');
        try {
            const response = await register({
                email, lastName, firstName, phoneNumber, dateOfBirth
            }, password);

            if (response.status) {
                const loginRes = await loginLocal(email, password);
                if (loginRes.status) {
                    dispatch(userLogin(loginRes.data))
                    router.push('auth');
                }
            }
        } catch (error: any) {
            Alert.alert("Registration Failed", error.message);
        }
        setIsLoading(false);
    };

    return (
        <ScrollView>
            <View style={styles.container}>
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
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Password"
                            secureTextEntry
                        />
                    )}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

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
                {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}

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
                {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}

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
                {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>}

                <Controller
                    control={control}
                    name="dateOfBirth"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View>
                            <Button title="Choose Date" onPress={() => setShow(true)} />
                            {show && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode="date"
                                    display="default"
                                    onChange={onChangeDatePicker}
                                    maximumDate={new Date()}
                                />
                            )}
                            <Text style={styles.input}>{value ? moment(value).format('YYYY-MM-DD') : 'Select Date'}</Text>
                        </View>
                    )}
                />
                {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth.message}</Text>}



                {isLoading ? (
                    <ActivityIndicator size="small" color="#0000ff" />
                ) : (
                    <Button title="Register" onPress={handleSubmit(onSubmit)} />
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    input: {
        width: 300,
        height: 40,
        marginBottom: 10,
        borderWidth: 1,
        padding: 10,
    },
    errorText: {
        color: 'red',
    },
});

export default RegisterScreen;
