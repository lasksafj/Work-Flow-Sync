// components/Dashboard.tsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import api from '../../apis/api';

const Dashboard: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);

    useEffect(() => {
        api.get('/api/user/protected?number=123987')
            .then((res) => {
                console.log('INDEX API get -----', res.data);
            })
            .catch(err => {
                console.log('INDEX API err----', err);
            });
    })

    return (
        <div>
            <h2>Welcome to your dashboard! {user.profile.firstName}</h2>
        </div>
    );
};

export default Dashboard;
