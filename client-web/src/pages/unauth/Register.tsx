// Register.jsx

import React, { useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerUser } from '../../apis/authorize/register';
import { loginLocal } from '../../apis/authorize/login';
import { useNavigate } from 'react-router-dom'; // Updated import
import moment from 'moment';
import { useAppDispatch } from "../../store/hooks";
import { userLogin } from "../../store/slices/userSlice";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Register.css';
import { AuthContext } from '../../AuthContext';

interface FormData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: Date | null;
}

// Validation schema
const schema = yup.object().shape({
    email: yup.string().email("Must be a valid email").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    phoneNumber: yup.string().matches(/^\+?[1-9]\d{1,14}$/, "Must be a valid phone number").required("Phone number is required"),
    dateOfBirth: yup.date().max(new Date(), "Date of birth must be in the past").required("Date of birth is required"),
});

const Register: React.FC = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            dateOfBirth: undefined,
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    if (!authContext) {
        return null;
    }
    const { setState } = authContext;

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        const { email, password, lastName, firstName, phoneNumber, dateOfBirth } = data;
        const formattedDateOfBirth = moment(dateOfBirth).format("YYYY-MM-DD");
        try {
            const response = await registerUser(
                {
                    email,
                    lastName,
                    firstName,
                    phoneNumber,
                    dateOfBirth: formattedDateOfBirth,
                },
                password
            );

            if (response.status) {
                const loginRes = await loginLocal(email, password);
                if (loginRes.status) {
                    dispatch(userLogin(loginRes.data));
                    setState({
                        loading: false,
                        isAuthenticated: true,
                    });
                    navigate("/"); // Navigate to dashboard

                } else {
                    alert("Login failed after registration.");
                }
            } else {
                alert("Registration failed.");
            }
        } catch (error: any) {
            alert("Registration Failed: " + error.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="register-container">
            <div className="register-inner-container">
                <h1 className="title">Create Account</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Email Field */}
                    <Controller
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <input
                                className={`input ${errors.email ? 'inputError' : ''}`}
                                placeholder="Email"
                                type="email"
                                {...field}
                            />
                        )}
                    />
                    {errors.email && <p className="errorText">{errors.email.message}</p>}

                    {/* Password Field */}
                    <Controller
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <input
                                className={`input ${errors.password ? 'inputError' : ''}`}
                                placeholder="Password"
                                type="password"
                                {...field}
                            />
                        )}
                    />
                    {errors.password && <p className="errorText">{errors.password.message}</p>}

                    {/* First Name Field */}
                    <Controller
                        control={control}
                        name="firstName"
                        render={({ field }) => (
                            <input
                                className={`input ${errors.firstName ? 'inputError' : ''}`}
                                placeholder="First Name"
                                {...field}
                            />
                        )}
                    />
                    {errors.firstName && <p className="errorText">{errors.firstName.message}</p>}

                    {/* Last Name Field */}
                    <Controller
                        control={control}
                        name="lastName"
                        render={({ field }) => (
                            <input
                                className={`input ${errors.lastName ? 'inputError' : ''}`}
                                placeholder="Last Name"
                                {...field}
                            />
                        )}
                    />
                    {errors.lastName && <p className="errorText">{errors.lastName.message}</p>}

                    {/* Phone Number Field */}
                    <Controller
                        control={control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <input
                                className={`input ${errors.phoneNumber ? 'inputError' : ''}`}
                                placeholder="Phone Number"
                                type="tel"
                                {...field}
                            />
                        )}
                    />
                    {errors.phoneNumber && <p className="errorText">{errors.phoneNumber.message}</p>}

                    {/* Date of Birth Field */}
                    <Controller
                        control={control}
                        name="dateOfBirth"
                        render={({ field }) => (
                            <div className={`input ${errors.dateOfBirth ? 'inputError' : ''}`}>
                                <DatePicker
                                    placeholderText="Select Date of Birth"
                                    selected={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    dateFormat="yyyy-MM-dd"
                                    maxDate={new Date()}
                                    showYearDropdown
                                    scrollableYearDropdown
                                    yearDropdownItemNumber={100}
                                />
                            </div>
                        )}
                    />
                    {errors.dateOfBirth && <p className="errorText">{errors.dateOfBirth.message}</p>}

                    {isLoading ? (
                        <div className="loader">
                            <p>Loading...</p>
                        </div>
                    ) : (
                        <button className="button" type="submit">
                            Register
                        </button>
                    )}
                </form>
                <div className="loginContainer">
                    <p className="loginText">Already have an account?</p>
                    <button className="loginButtonText" onClick={() => navigate('/login')}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;