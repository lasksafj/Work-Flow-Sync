// components/NavBar.tsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './unauth/Logout';
import { AuthContext } from '../AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const NavBar: React.FC = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        return null;
    }

    const { isAuthenticated } = authContext;

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                {/* Logo or Title */}
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Workflow Sync
                </Typography>

                {/* Navigation Links */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {isAuthenticated ? (
                        <>
                            <Button
                                component={Link}
                                to="/"
                                color="inherit"
                            >
                                Dashboard
                            </Button>
                            <Button
                                component={Link}
                                to="/profile"
                                color="inherit"
                            >
                                Profile
                            </Button>
                            <Button
                                component={Link}
                                to="/workplace"
                                color="inherit"
                            >
                                Manage Workplace
                            </Button>
                            <Button
                                component={Link}
                                to="/shift"
                                color="inherit"
                            >
                                Shift Assignment
                            </Button>

                            {/* Logout Button */}
                            <LogoutButton />
                        </>
                    ) : (
                        <>
                            <Button
                                component={Link}
                                to="/login"
                                color="inherit"
                            >
                                Login
                            </Button>
                            <Button
                                component={Link}
                                to="/register"
                                color="inherit"
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
