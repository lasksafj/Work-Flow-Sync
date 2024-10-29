// components/Profile.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const Profile: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);


    //   const { user } = authContext;

    return (
        <div>
            <h2>User Profile</h2>
            {user ? (
                <ul>
                    <li>Username: {user.profile.firstName}</li>
                    {/* Add more user details if available */}
                </ul>
            ) : (
                <p>No user data available.</p>
            )}
        </div>
    );
};

export default Profile;
