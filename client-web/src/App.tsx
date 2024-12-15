// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';
import Dashboard from './pages/auth/Dashboard';
import Profile from './pages/auth/Profile';
import Request from './pages/auth/request/Request';
import NotificationPage from './pages/auth/notification/NotificationsPage';
import Login from './pages/unauth/Login';
import Register from './pages/unauth/Register';
import NavBar from './pages/NavBar';
import WorkplacePage from './pages/auth/workplacePage/WorkplacePage';
import ShiftAssignment from './pages/auth/scheduler/ShiftAssignment';



const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <NavBar />
                <Routes>
                    {/* Protected Routes */}
                    {/* <Route path="/" element={<PrivateRoute component={Dashboard} />} /> */}

                    <Route path="/" element={<PrivateRoute component={WorkplacePage} />} />
                    <Route path="/profile" element={<PrivateRoute component={Profile} />} />

                    <Route path='/shift' element={<PrivateRoute component={ShiftAssignment} />} />
                    <Route path="/request" element={<PrivateRoute component={Request} />} />


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
