import { Image, StyleSheet, Platform, Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { RootState } from '@/store/store';
import { useAppSelector } from '@/store/hooks';
import { useAppDispatch } from '@/store/hooks';
import { userLogout } from '@/store/slices/userSlice';
import { router } from 'expo-router';
import { logout } from '@/apis/authorize/login';
import api from '@/apis/api';
import { useEffect } from 'react';
import { updateOrganization } from '@/store/slices/organizationSlice';

export default function HomeScreen() {

    const user = useAppSelector((state: RootState) => state.user)
    const dispatch = useAppDispatch()

    // console.log('HomeScreen', user);

    // Example
    useEffect(() => {
        api.get('/api/user/protected?number=123987')
            .then((res) => {
                console.log('INDEX API get -----', res.data);
            })
            .catch(err => {
                console.log('INDEX API err----', err);
                // if (err.unauthorized) {
                //     alert('LOGOUT');
                //     router.replace('');
                //     logout();
                //     dispatch(userLogout());
                // }
            });

        dispatch(updateOrganization({
            abbreviation: 'ORG1',
            name: 'Organization One',
            address: '123 Main St'
        }));
    }, []);




    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <Image
                    source={require('@/assets/images/partial-react-logo.png')}
                    style={styles.reactLogo}
                />
            }>

            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">User data</ThemedText>
                <ThemedText>
                    {/* {user.profile.email}  {user.profile.dateOfBirth?.toLocaleString()} */}
                    {JSON.stringify(user.profile)}
                </ThemedText>
                <ThemedText>
                    {user.profile.firstName} {user.profile.lastName} {user.profile.phoneNumber}
                </ThemedText>
            </ThemedView>

            <Button title="Logout" onPress={() => {
                logout();
                dispatch(userLogout());
                router.replace('');
            }} />


        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
});
