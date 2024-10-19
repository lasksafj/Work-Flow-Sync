import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';

import InitialNameAvatar from '@/components/InitialNameAvatar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const dateToTime = (date_time: any) => {
    // let date = new Date(date_time);
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
    const [userSchedule, setUserSchedule] = useState(props.detail)
    const start = new Date(userSchedule.start_time)
    const end = new Date(userSchedule.end_time)
    useEffect(() => {
        setUserSchedule(props.detail)
    }, [props.detail])
    // console.log('ScheduleCard: ', userSchedule)
    // console.log('ScheduleCard: ', start, ' ', end)
    return (
        <TouchableOpacity style={styles.container}>
            <View style={styles.block}>
                <View style={styles.first}>
                    <InitialNameAvatar
                        name={userSchedule.first_name + ' ' + userSchedule.last_name}
                        size={50}
                    />
                </View>
                <View style={styles.second}>
                    <Text style={{ fontSize: 22, fontWeight: '700', }}>
                        {userSchedule.first_name + ' ' + userSchedule.last_name}
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: '400' }}>
                        {workingHours(start, end)}
                    </Text>
                    {/* <Text style={{ fontSize: 18, fontWeight: '400' }}>
                        {userSchedule.name}
                    </Text> */}
                </View>
                <View style={styles.third}>
                    <Text style={{ fontSize: 20, fontWeight: '500' }}>
                        {dateToTime(start)}
                    </Text>
                    <Text style={{ fontSize: 20, fontWeight: '500' }}>
                        {dateToTime(end)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>

    );
};

const styles = StyleSheet.create({
    container: {
        // paddingVertical: 4,
        margin: 2,
        paddingHorizontal: 6,
        height: 100,
        backgroundColor: '#AFC1D6',
        borderRadius: 2,
        justifyContent: 'center'

    },
    block: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: '100%'

    },
    first: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '15%',

    },
    second: {
        paddingLeft: 10,
        textAlign: 'left',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        width: '65%',
    },
    third: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '20%'
    }
});

export default ScheduleCard;