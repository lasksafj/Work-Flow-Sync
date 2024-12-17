import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import api from '@/apis/api';
import { useAppDispatch } from '@/store/hooks';
import { updateOrganization } from '@/store/slices/organizationSlice';

// Define the type for Workplace
interface Workplace {
    abbreviation: string;
    name: string;
    address: string;
}

const SelectWorkplaceScreen: React.FC = () => {
    const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const dispatch = useAppDispatch();

    // Check AsyncStorage for an existing workplace
    useEffect(() => {
        const checkSelectedWorkplace = async () => {
            try {
                const selectedWorkplace = await AsyncStorage.getItem('selectedWorkplace');
                if (selectedWorkplace) {
                    const workplace: Workplace = JSON.parse(selectedWorkplace);
                    dispatch(updateOrganization(workplace));
                    router.replace('/auth/dashboard/DashboardScreen'); // Redirect if a workplace exists
                }
            } catch (error) {
                console.error('Error checking selected workplace:', error);
            }
        };

        checkSelectedWorkplace();
    }, []);

    // Fetch workplaces from API
    useEffect(() => {
        const fetchWorkplaces = async () => {
            try {
                const response = await api.get('/api/workplace/get-org'); // Replace with your API endpoint
                const data: Workplace[] = response.data;
                setWorkplaces(data);
            } catch (error) {
                console.error('Error fetching workplaces:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkplaces();
    }, []);

    // Handle workplace selection
    const handleSelectWorkplace = async (workplace: Workplace) => {
        try {
            dispatch(updateOrganization(workplace));
            // Save the entire workplace object as a JSON string
            await AsyncStorage.setItem('selectedWorkplace', JSON.stringify(workplace));
            router.replace('/auth/dashboard/DashboardScreen'); // Redirect to Dashboard page
        } catch (error) {
            console.error('Error saving workplace:', error);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View>
                    <Text style={{ fontSize: 22, marginBottom: 20, fontWeight: 'bold' }}>
                        Select Your Workplace
                    </Text>
                    <FlatList
                        data={workplaces}
                        keyExtractor={(item) => item.abbreviation}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={{
                                    padding: 15,
                                    marginVertical: 5,
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: 8,
                                }}
                                onPress={() => handleSelectWorkplace(item)}
                            >
                                <Text style={{ fontSize: 18 }}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );
};

export default SelectWorkplaceScreen;
