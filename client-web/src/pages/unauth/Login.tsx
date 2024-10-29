// Login.tsx

import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginLocal } from "../../apis/authorize/login";
import { useAppDispatch } from "../../store/hooks";
import { userLogin } from "../../store/slices/userSlice";
import { AuthContext } from '../../AuthContext';

import "./Login.css";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    if (!authContext) {
        return null;
    }
    const { setState } = authContext;


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await loginLocal(email.trim(), password);
            if (response.status) {
                dispatch(userLogin(response.data)); // Dispatch user login action

                setState({
                    loading: false,
                    isAuthenticated: true,
                });
                navigate("/"); // Navigate to dashboard


            } else {
                alert("Login failed. Please check your credentials.");
            }
        } catch (err) {
            console.log("Login screen failed", err);
            alert("An error occurred during login.");
        }
        setIsLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-inner-container">
                <h1 className="title">Welcome Back!</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        className="textInput"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        autoComplete="email"
                    />
                    <input
                        className="textInput"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        autoComplete="current-password"
                    />
                    {isLoading ? (
                        <div className="loader">
                            <p>Loading...</p>
                        </div>
                    ) : (
                        <button className="button" type="submit">
                            Login
                        </button>
                    )}
                </form>
                <div className="registerContainer">
                    <p className="registerText">Don't have an account?</p>
                    <button
                        className="registerButtonText"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
