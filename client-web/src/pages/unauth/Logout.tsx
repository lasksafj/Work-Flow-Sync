// components/Logout.tsx
import React, { useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../apis/authorize/login';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

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

    return (
        <Button
            onClick={handleLogout}
            variant="outlined"
            color="secondary"
            startIcon={<LogoutIcon />}
            sx={{
                fontWeight: 'bold',
                borderRadius: 2,
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white',
                },
            }}
        >
            Logout
        </Button>
    );
};

export default Logout;
