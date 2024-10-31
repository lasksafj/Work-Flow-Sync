// components/NavBar.tsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './unauth/Logout';
import { AuthContext } from '../AuthContext';

const NavBar: React.FC = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        return null;
    }

    const { isAuthenticated } = authContext;

    return (
        <nav>
            {isAuthenticated ? (
                <>
                    <Link to="/">Dashboard</Link> | 
                    <Link to="/profile">Profile</Link> |
                    <Link to="/notification">Notification</Link> |{' '}
                    <LogoutButton />
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
};

export default NavBar;
