// components/NavBar.tsx
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoutButton from './unauth/Logout';
import { AuthContext } from '../AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const NavBar: React.FC = () => {
    const authContext = useContext(AuthContext);
    const location = useLocation();

    if (!authContext) {
        return null;
    }

    const { isAuthenticated } = authContext;

    // Function to check if a route is active
    const isActive = (path: string) => location.pathname === path;

    return (
        <div style={{ paddingBottom: 20 }}>
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
                                    sx={{
                                        borderBottom: isActive('/') ? '2px solid white' : 'none',
                                        fontWeight: isActive('/') ? 'bold' : 'normal',
                                    }}
                                >
                                    Dashboard
                                </Button>
                                <Button
                                    component={Link}
                                    to="/profile"
                                    color="inherit"
                                    sx={{
                                        borderBottom: isActive('/profile') ? '2px solid white' : 'none',
                                        fontWeight: isActive('/profile') ? 'bold' : 'normal',
                                    }}
                                >
                                    Profile
                                </Button>
                                <Button
                                    component={Link}
                                    to="/notification"
                                    color="inherit"
                                    sx={{
                                        borderBottom: isActive('/notification') ? '2px solid white' : 'none',
                                        fontWeight: isActive('/notification') ? 'bold' : 'normal',
                                    }}
                                >
                                    Notification
                                </Button>
                                <Button
                                    component={Link}
                                    to="/workplace"
                                    color="inherit"
                                    sx={{
                                        borderBottom: isActive('/workplace') ? '2px solid white' : 'none',
                                        fontWeight: isActive('/workplace') ? 'bold' : 'normal',
                                    }}
                                >
                                    Manage Workplace
                                </Button>
                                <Button
                                    component={Link}
                                    to="/shift"
                                    color="inherit"
                                    sx={{
                                        borderBottom: isActive('/shift') ? '2px solid white' : 'none',
                                        fontWeight: isActive('/shift') ? 'bold' : 'normal',
                                    }}
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
                                    sx={{
                                        borderBottom: isActive('/login') ? '2px solid white' : 'none',
                                        fontWeight: isActive('/login') ? 'bold' : 'normal',
                                    }}
                                >
                                    Login
                                </Button>
                                <Button
                                    component={Link}
                                    to="/register"
                                    color="inherit"
                                    sx={{
                                        borderBottom: isActive('/register') ? '2px solid white' : 'none',
                                        fontWeight: isActive('/register') ? 'bold' : 'normal',
                                    }}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default NavBar;
