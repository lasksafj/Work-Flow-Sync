// components/Logout.tsx
import React, { useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../apis/authorize/login';

const Logout: React.FC = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    if (!authContext) {
        return null;
    }

    const { setState } = authContext;

    const handleLogout = async () => {
        try {
            logout();
            setState({ loading: false, isAuthenticated: false });
            navigate('/login', { replace: true }); // Redirect to login page
        } catch {
            alert('Logout failed');
        }
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
