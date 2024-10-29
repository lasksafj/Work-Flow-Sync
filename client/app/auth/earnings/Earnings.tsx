// PayrollScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import DonutChart from './charts'; // Import the DonutChart component
import api from '@/apis/api';
import { FlashList } from '@shopify/flash-list';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { Colors } from '@/constants/Colors';


function convertHourToHourMinutes(decimalHours: number) {
    const hours = Math.floor(decimalHours);  // Extract the whole hours
    const minutes = Math.round((decimalHours - hours) * 60);  // Convert the decimal part to minutes

    return `${hours} hrs ${minutes} min`;
}

const PayrollScreen = () => {
    const [data, setData] = useState<any[]>([]);
    const limit = 15;
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [dataAvailable, setDataAvailable] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // New state for refreshing

    const organization = useAppSelector(
        (state: RootState) => state.organization
    );

    const fetchData = async (offset: number) => {
        setIsLoadingMore(true);
        try {
            let response = await api.get(`/api/earnings/earning?org=${organization.abbreviation}&&limit=${limit}&&offset=${offset}`);
            let res = response.data;
            if (res) {
                if (res.length < limit) {
                    setDataAvailable(false);
                }

                res = res.map((elem: any, index: number) => {
                    let n_elem = { ...elem, id: index + data.length };

                    return n_elem;
                });

                setData(prevData => {
                    return [...prevData, ...res];
                });
            }
        }
        catch (err: any) {
            console.log('Fetch Payroll Error', err);
            alert('Network Error');
        }
        setIsLoadingMore(false);
    };

    const handleLoadMore = () => {
        if (!isLoadingMore && dataAvailable) {
            fetchData(data.length);
        }
    };

    const renderFooter = () => {
        if (!isLoadingMore || refreshing) return null;
        return <ActivityIndicator size="large" color={Colors.primary} />;
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        setData([]); // Clear existing data
        setDataAvailable(true); // Reset data availability
        await fetchData(0); // Fetch fresh data
        setRefreshing(false);
    };

    useEffect(() => {
        fetchData(data.length);
    }, []);

    const renderItem = ({ item }: any) => {
        const chartData = [
            {
                value: item.normalWorkHours,
                color: '#4caf50', // Green for normal hours
            },
            {
                value: item.overtimeWorkHours,
                color: '#f44336', // Red for overtime hours
            },
        ];

        return (
            <View style={styles.card}>
                <View style={styles.row}>
                    <DonutChart data={chartData} size={80} strokeWidth={10} />
                    <View style={styles.infoContainer}>
                        <Text style={styles.date}>{item.date}</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Normal:</Text>
                            <Text style={styles.value}>{convertHourToHourMinutes(item.normalWorkHours)}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Overtime:</Text>
                            <Text style={styles.value}>{convertHourToHourMinutes(item.overtimeWorkHours)}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Gross payment:</Text>
                            <Text style={styles.value}>${item.payment}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <FlashList
            data={data}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            estimatedItemSize={100} // Set estimated item size for better performance
            contentContainerStyle={styles.container}

            onEndReached={dataAvailable ? handleLoadMore : null}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}

            refreshing={refreshing} // Add refreshing state
            onRefresh={handleRefresh} // Add onRefresh handler
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        // Shadows and elevation
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center', // Align items vertically centered
    },
    infoContainer: {
        flex: 1,
        marginLeft: 16,
    },
    date: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    label: {
        fontSize: 16,
        color: '#555',
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
    },
});


export default PayrollScreen;
