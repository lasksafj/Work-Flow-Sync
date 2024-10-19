import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import WeekDays from './schedule/Weekdays';
import ScheduleDetail from './schedule/ScheduleDetail';
import moment from 'moment';
import { useFocusEffect } from 'expo-router';


const ScheduleScreen: React.FC = () => {
    const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
    const [expandedDate, setExpandedDate] = useState<string | null>(null);
    const scrollViewRef = useRef<ScrollView>(null);
    const itemRefs = useRef<{ [key: string]: View | null }>({});

    const [trigger, setTrigger] = useState(0)
    useFocusEffect(
        useCallback(
            () => {
                // setExpandedDate(prev=>prev);
                setTrigger(prev => prev + 1)
            }
            , [])
    )
    const daysOfWeek = useMemo(
        () =>
            Array.from({ length: 7 }, (v, i) =>
                moment(date).startOf('week').add(i, 'days').format('YYYY-MM-DD')
            ),
        [date]
    );

    const [week, setWeek] = useState<string[]>(daysOfWeek);

    useEffect(() => {
        setWeek(daysOfWeek);
    }, [date]);

    useEffect(() => {
        // Scroll to the selected date and expand it
        if (itemRefs.current[date]) {
            itemRefs.current[date]?.measure((x, y, width, height, pageX, pageY) => {
                scrollViewRef.current?.scrollTo({ y: pageY, animated: true });
                setExpandedDate(date); // Expand the selected date
            });
        }
    }, [date, week]);

    const handleBarPress = (item: string) => {
        setExpandedDate((prev) => (prev === item ? null : item));
        setDate(item); // Navigate to the date when the bar is pressed
    };

    // console.log(week);
    return (
        <View style={styles.container}>

            <View style={styles.calendar}>
                <WeekDays selectedDay={date} setSelectedDay={setDate} daysOfWeek={daysOfWeek} />
            </View>
            <ScrollView ref={scrollViewRef} style={{ flex: 1 }}>
                <View style={styles.tabs}>
                    {week.map((item, index) => (
                        <View
                            key={index}
                            ref={(ref) => { itemRefs.current[item] = ref; }}
                        >
                            <ScheduleDetail detail={item} isExpanded={expandedDate === item} onPress={() => handleBarPress(item)} />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    calendar: {
        flex: 0.125,
        backgroundColor: '#E1D5C9'
    },
    tabs: {
        paddingHorizontal: 2
    }
})

export default ScheduleScreen;