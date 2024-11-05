import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

interface WorkingHoursSliderProps {
    date: Date;
    onHoursChange: (date: Date, start: Date, end: Date) => void;
}

const WorkingHoursSlider: React.FC<WorkingHoursSliderProps> = ({ date, onHoursChange }) => {
    const [sliderValues, setSliderValues] = useState([44, 52]); // Initial values set to middle

    const onValuesChange = (values: number[]) => {
        setSliderValues(values);
        const startDate = new Date(date);
        startDate.setHours(Math.floor(values[0] / 4), (values[0] % 4) * 15);
        const endDate = new Date(date);
        endDate.setHours(Math.floor(values[1] / 4), (values[1] % 4) * 15);
        onHoursChange(date, startDate, endDate);
    };

    const formatTime = (value: number) => {
        const hours = Math.floor(value / 4);
        const minutes = (value % 4) * 15;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const startDate = new Date(date);
        startDate.setHours(Math.floor(sliderValues[0] / 4), (sliderValues[0] % 4) * 15);
        const endDate = new Date(date);
        endDate.setHours(Math.floor(sliderValues[1] / 4), (sliderValues[1] % 4) * 15);
        onHoursChange(date, startDate, endDate);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>{formatDate(date)}</Text>
            </View>

            <View style={styles.body}>
                <Text style={styles.title}>Set Working Hours</Text>
                <MultiSlider
                    values={sliderValues}
                    sliderLength={SCREEN_WIDTH - 40}
                    onValuesChange={onValuesChange}
                    min={0}
                    max={24 * 4 - 1}
                    step={1}
                    allowOverlap={true}
                    snapped
                    selectedStyle={styles.selectedStyle}
                    unselectedStyle={styles.unselectedStyle}
                    markerStyle={styles.markerStyle}
                    trackStyle={styles.trackStyle}
                />
                <Text style={styles.hoursText}>
                    Working Hours: {formatTime(sliderValues[0])} - {formatTime(sliderValues[1])}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 6,
        backgroundColor: '#E6DFF1',
        borderRadius: 8,
    },
    header: {
        alignItems: 'center',
        marginBottom: 10,
        color: '#333',
        backgroundColor: '#AF9F84',
        width: '100%',
        paddingVertical: 4,
        borderRadius: 8,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    body: {
        textAlign: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
    },
    hoursText: {
        fontSize: 18,
        marginTop: 20,
        color: '#666',
    },
    selectedStyle: {
        backgroundColor: '#4caf50',
        height: 20, // Adjusted height to better align with the marker
    },
    unselectedStyle: {
        backgroundColor: '#d3d3d3',
        height: 20, // Adjusted height to better align with the marker
    },
    markerStyle: {
        backgroundColor: '#3f51b5',
        height: 20, // Keep the height larger for better grip
        width: 20, // Keep the width larger for better grip
        borderRadius: 10, // Half of the height/width to make it circular
        borderColor: '#fff',
        borderWidth: 2,
        top: 9, // Adjust to place the marker in the middle of the track
    },
    trackStyle: {
        height: 10, // Adjusted height of the overall track
        borderRadius: 5, // Rounded corners for the track
    },
});

export default WorkingHoursSlider;