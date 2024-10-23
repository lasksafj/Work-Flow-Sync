import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Avatar } from '@/components/Avatar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const dateToTime = (date_time: Date) => {
    let hours = date_time.getHours().toString().padStart(2, '0');
    let minutes = date_time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

const workingHours = (start: any, end: any) => {
    let diff = (end - start) / 1000 / 60;  // difference in minutes
    let hours = Math.floor(diff / 60);
    let minutes = diff % 60;
    let formattedHours = hours.toString().padStart(2, '0');
    let formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours} hr-${formattedMinutes} min`;
}

const ScheduleCard = (props: any) => {
    const [userSchedule, setUserSchedule] = useState(props.detail);
    const start = new Date(userSchedule.start_time);
    const end = new Date(userSchedule.end_time);
    const animatedValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        setUserSchedule(props.detail);
    }, [props.detail]);

    const handlePressIn = () => {
        Animated.spring(animatedValue, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(animatedValue, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.container}
        >
            <Animated.View style={[styles.block, { transform: [{ scale: animatedValue }] }]}>
                <View style={styles.first}>
                    <Avatar img={userSchedule.avatar} name={userSchedule.first_name + ' ' + userSchedule.last_name} size={50} />
                </View>
                <View style={styles.second}>
                    <Text style={styles.secondTextPrimary}>
                        {userSchedule.first_name + ' ' + userSchedule.last_name}
                    </Text>
                    <Text style={styles.secondTextSecondary}>
                        {workingHours(start, end)}
                    </Text>
                </View>
                <View style={styles.third}>
                    <View style={styles.timeRow}>
                        <Icon name="access-time" size={20} color="#2C3E50" />
                        <Text style={styles.timeText}>{dateToTime(start)}</Text>
                    </View>
                    <View style={styles.timeRow}>
                        <Icon name="access-time" size={20} color="#2C3E50" />
                        <Text style={styles.timeText}>{dateToTime(end)}</Text>
                    </View>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 2,
        paddingHorizontal: 6,
        height: 100,
        backgroundColor: '#EAF0F6',
        borderRadius: 10,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    block: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: '80%',
    },
    first: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '20%',
    },
    second: {
        paddingLeft: 10,
        textAlign: 'left',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        width: '60%',
    },
    secondTextPrimary: {
        fontSize: 20,
        fontWeight: '500',
        color: '#2C3E50',
    },
    secondTextSecondary: {
        fontSize: 14,
        fontWeight: '400',
        color: '#7F8C8D',
    },
    third: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '20%',
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 18,
        fontWeight: '400',
        marginLeft: 4,
        marginRight: 8,
    }
});

export default ScheduleCard;
