// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';
import Dashboard from './pages/auth/Dashboard';
import Profile from './pages/auth/Profile';
import NotificationPage from './pages/auth/notification/NotificationPage';
import Login from './pages/unauth/Login';
import Register from './pages/unauth/Register';
import NavBar from './pages/NavBar';



const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <NavBar />
                <Routes>
                    {/* Protected Routes */}
                    <Route path="/" element={<PrivateRoute component={Dashboard} />} />
                    <Route path="/profile" element={<PrivateRoute component={Profile} />} />
                    <Route path="/notification" element={<PrivateRoute component={NotificationPage} />} />
                    <Route path="/logout" element={<PrivateRoute component={() => null} />} />

                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Catch-all Route */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
