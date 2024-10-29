// Welcome.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated import
import { validateToken } from '../apis/authorize/login';
import { useAppDispatch } from "../store/hooks";
import { userLogin } from "../store/slices/userSlice";
import './Welcome.css';
// import logoImage from '../assets/images/splash.jpg';

const Welcome = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate(); // Updated from useHistory to useNavigate

    const handleButton = () => {
        navigate('/login'); // Updated from history.push to navigate
    };

    useEffect(() => {
        console.log('START APP');

        async function prepare() {
            const response = await validateToken();

            if (response.status) {
                dispatch(userLogin(response.data));
                navigate('/auth', { replace: true }); // Updated from history.replace
            }
        }
        prepare();
    }, [dispatch, navigate]);

    return (
        <div className="container">
            <div className="backgroundImage" style={{ backgroundImage: `` }}>
                <div className="overlay">
                    <div className="contentContainer">
                        <h1 className="title">Workflow Sync</h1>
                        <p className="subtitle">
                            Streamline your workflow and boost productivity.
                        </p>
                        <button className="button" onClick={handleButton}>
                            Get Started
                        </button>
                        <button
                            className="secondaryButton"
                            onClick={() => {
                                navigate('/register');
                            }}
                        >
                            Create an Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
