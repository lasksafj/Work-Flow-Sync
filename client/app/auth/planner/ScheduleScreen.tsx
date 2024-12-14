import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import WeekDays from './schedule/Weekdays';
import ScheduleDetail from './schedule/ScheduleDetail';
import moment from 'moment';

// Monday is the first day of the week
moment.updateLocale('en', {
    week: {
        dow: 1, 
    },
});

const ScheduleScreen: React.FC = () => {
    const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
    const [expandedDate, setExpandedDate] = useState<string | null>(null);
    const itemRefs = useRef<{ [key: string]: View | null }>({});

    const daysOfWeek = useMemo(
        () =>
            Array.from({ length: 7 }, (v, i) =>
                moment(date).startOf('week').add(i, 'days').format('YYYY-MM-DD')
            ),
        [date]
    );

    const week = useMemo(() => daysOfWeek, [daysOfWeek]);

    useEffect(() => {
        if (itemRefs.current[date]) {
            itemRefs.current[date]?.measure((x, y, width, height, pageX, pageY) => {
                setExpandedDate(date);
            });
        }
    }, [date, week]);

    const handleBarPress = (item: string) => {
        setExpandedDate((prev) => (prev === item ? null : item));
        setDate(item);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={week}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <View ref={(ref) => (itemRefs.current[item] = ref)}>
                        <ScheduleDetail
                            detail={item}
                            isExpanded={expandedDate === item}
                            onPress={() => handleBarPress(item)}
                        />
                    </View>
                )}
                ListHeaderComponent={
                    <View style={styles.calendar}>
                        <WeekDays selectedDay={date} setSelectedDay={setDate} daysOfWeek={daysOfWeek} />
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    calendar: {
        // backgroundColor: '#000000',
        paddingVertical: 5,
    },
    tabs: {
        paddingHorizontal: 2,
    },
});

export default ScheduleScreen;
