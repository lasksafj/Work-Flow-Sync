import React, { useState, useCallback, useMemo, memo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, Easing, PanResponder, Dimensions } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons'
import Constants from 'expo-constants';

const itemWidth = Dimensions.get('window').width / 9;
const WeekDays = (props: any) => {

    const animationValue = useRef(new Animated.Value(0)).current;

    const handleDayPress = useCallback((day: DateData) => {
        props.setSelectedDay(day.dateString);
        toggleCalendarVisibility(0);
    }, []);

    const handleSelectDay = useCallback((day: string) => {
        props.setSelectedDay(day);
        // setSelectedWeek(daysOfWeek);
        // props.changeDate(day, selectedWeek)
    }, []);

    const toggleCalendarVisibility = (value: number) => {
        // setIsCalendarVisible((prev) => !prev);

        Animated.timing(animationValue, {
            toValue: value,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) >= 5,
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 5) {
                    toggleCalendarVisibility(1);
                } else if (gestureState.dy < -5) {
                    toggleCalendarVisibility(0);
                }
            },
        })
    ).current;

    const calendarHeight = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 350], // Adjust this value to match the height of your calendar
    });


    return (
        <View style={styles.container}>
            <Animated.View style={{ overflow: 'hidden', height: calendarHeight }}>
                <Calendar onDayPress={handleDayPress} selectedDay={props.selectedDay} />
            </Animated.View>
            <View style={styles.weeks} {...panResponder.panHandlers}>
                <Header
                    daysOfWeek={props.daysOfWeek}
                    selectedDay={props.selectedDay}
                    onDayPress={handleSelectDay}

                />

            </View>

            {/* <ScreenA selectedDay={props.selectedDay} selectedWeek={props.daysOfWeek} /> */}

            {/* <TimeSchedule /> */}

        </View>
    );
};

const CalendarComponent = memo(({ onDayPress, selectedDay }: any) => (
    <Calendar
        onDayPress={onDayPress}
        markedDates={{ [selectedDay]: { selected: true, selectedColor: '#00aaa5' } }}
    />
));

const Header = memo(({ daysOfWeek, selectedDay, onDayPress }: any) => {

    return (
        <View style={styles.header}>
            {daysOfWeek.map((day: string) => (
                <TouchableOpacity
                    key={day}
                    style={[
                        styles.dayButton,
                        day === selectedDay && styles.selectedDayButton,
                    ]}
                    onPress={() => onDayPress(day)}
                >
                    <View style={styles.item}>
                        <Text
                            style={[
                                styles.dayText,
                                day === selectedDay && styles.selectedDayText,
                            ]}
                        >
                            {moment(day).format('ddd')}
                        </Text>
                        <Text
                            style={[
                                styles.dayText,
                                day === selectedDay && styles.selectedDayText,
                            ]}
                        >
                            {moment(day).format('D')}
                        </Text>
                    </View>

                </TouchableOpacity>
            ))}

        </View>
    )
});

const ScreenA = memo(({ selectedDay, selectedWeek }: any) => (
    <View style={styles.screen}>
        <Text>Screen A</Text>
        <Text>Selected Day: {selectedDay}</Text>
        <Text>Day of the Week: {selectedWeek}</Text>

    </View>
));


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // marginTop: 20
    },
    toggleButton: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#00adf5',
    },
    toggleButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: 10,
        backgroundColor: '#E1D5C9',
        paddingHorizontal: 2,
        // flex: 1
    },
    dayButton: {
        alignItems: 'center',
        paddingVertical: 4,
    },
    selectedDayButton: {
        backgroundColor: '#00adf5',
        borderRadius: 5,
        padding: 4,
    },
    dayText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 400
    },
    selectedDayText: {
        color: '#BAC4FE',
        fontWeight: 'bold'
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    navButton: {
        padding: 10,
        borderRadius: 5,
    },
    selectedNavButton: {
        backgroundColor: '#00adf5',
    },
    navButtonText: {
        fontSize: 18,
    },
    selectedNavButtonText: {
        color: '#fff',
    },
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    weeks: {
        width: Constants.screenWidth,
        // paddingHorizontal: 2,

    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
        width: itemWidth,
        backgroundColor: '#36413D',
        borderColor: 'black',
        borderRadius: 4,
        // borderBlockColor: 'black',
        height: 50
    }
});

export default WeekDays;