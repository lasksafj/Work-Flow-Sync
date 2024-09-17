import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    Alert,
    Platform,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
} from 'react-native';
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
    email: yup.string().email('Must be a valid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    phoneNumber: yup
        .string()
        .matches(/^\+?[1-9]\d{1,14}$/, 'Must be a valid phone number')
        .required('Phone number is required'),
    dateOfBirth: yup
        .date()
        .max(new Date(), 'Date of birth must be in the past')
        .required('Date of birth is required'),
});

const RegisterScreen = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            dateOfBirth: new Date('2000-12-12'),
        },
    });

    const [date, setDate] = useState(new Date('2000-12-12'));
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch();

    const onChangeDatePicker = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        setValue('dateOfBirth', currentDate, { shouldValidate: true }); // Update form state
    };

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        let { email, password, lastName, firstName, phoneNumber, dateOfBirth } = data;
        dateOfBirth = moment(dateOfBirth).format('YYYY-MM-DD');
        try {
            const response = await register(
                {
                    email,
                    lastName,
                    firstName,
                    phoneNumber,
                    dateOfBirth,
                },
                password
            );

            if (response.status) {
                const loginRes = await loginLocal(email, password);
                if (loginRes.status) {
                    dispatch(userLogin(loginRes.data));
                    router.push('auth');
                }
            }
        } catch (error: any) {
            Alert.alert('Registration Failed', error.message);
        }
        setIsLoading(false);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.innerContainer}>
                <Text style={styles.title}>Create Account</Text>

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.email && styles.inputError]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholderTextColor="#7f8c8d"
                        />
                    )}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.password && styles.inputError]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Password"
                            secureTextEntry
                            placeholderTextColor="#7f8c8d"
                        />
                    )}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                <Controller
                    control={control}
                    name="firstName"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.firstName && styles.inputError]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="First Name"
                            placeholderTextColor="#7f8c8d"
                        />
                    )}
                />
                {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}

                <Controller
                    control={control}
                    name="lastName"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.lastName && styles.inputError]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Last Name"
                            placeholderTextColor="#7f8c8d"
                        />
                    )}
                />
                {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}

                <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.phoneNumber && styles.inputError]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Phone Number"
                            keyboardType="phone-pad"
                            placeholderTextColor="#7f8c8d"
                        />
                    )}
                />
                {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>}

                <Controller
                    control={control}
                    name="dateOfBirth"
                    render={({ field: { value } }) => (
                        <View>
                            <TouchableOpacity onPress={() => setShow(true)} style={styles.datePickerButton}>
                                <Text style={styles.datePickerText}>
                                    {value ? moment(value).format('YYYY-MM-DD') : 'Select Date'}
                                </Text>
                            </TouchableOpacity>
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
                        </View>
                    )}
                />
                {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth.message}</Text>}

                {isLoading ? (
                    <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                )}
                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => router.replace('unauth/login')}>
                        <Text style={styles.loginButtonText}> Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
    },
    innerContainer: {
        paddingHorizontal: 30,
        paddingTop: 50,
        paddingBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#dcdde1',
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#2f3640',
    },
    inputError: {
        borderColor: '#e74c3c',
    },
    errorText: {
        color: '#e74c3c',
        marginBottom: 10,
        fontSize: 14,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#2f3640',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#2980b9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    datePickerButton: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#dcdde1',
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    datePickerText: {
        fontSize: 16,
        color: '#2f3640',
    },
    loader: {
        marginVertical: 20,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    loginText: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    loginButtonText: {
        fontSize: 16,
        color: '#3498db',
        fontWeight: 'bold',
    },
});
