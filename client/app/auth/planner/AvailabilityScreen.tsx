import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import MyScheduleCalendar from './availability/MyScheduleCalendar';
import WorkingHoursSlider from './availability/WorkingHoursSlider';
import { handleSaveWorkingHours } from '@/apis/userService';
import ToastManager, { Toast } from 'toastify-react-native';

interface WorkingHours {
    date: Date;
    start: Date;
    end: Date;
}

const Availability = () => {
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
    const [resetFlag, setResetFlag] = useState(false);

    const handleHoursChange = (date: Date, start: Date, end: Date) => {
        setWorkingHours((prevHours) => {
            const existing = prevHours.find((wh) => wh.date.toDateString() === date.toDateString());
            if (existing) {
                return prevHours.map((wh) =>
                    wh.date.toDateString() === date.toDateString() ? { date, start, end } : wh
                );
            } else {
                return [...prevHours, { date, start, end }];
            }
        });
    };

    const handleSave = async () => {
        if (workingHours.length > 0) {
            const formattedWorkingHours = workingHours.map(wh => ({
                date: wh.date,
                start: wh.start,
                end: wh.end
            }));
            await handleSaveWorkingHours(formattedWorkingHours);
            Toast.success('Updated!', 'center');
        } else {
            Toast.warn('Must set working hours', 'center');
        }
        handleReset();
    };

    const handleReset = () => {
        setSelectedDates([]);
        setWorkingHours([]);
        setResetFlag(true);
    };

    return (
        <View style={styles.container}>
            <MyScheduleCalendar
                setSelectedDates={setSelectedDates}
                resetFlag={resetFlag}
                setResetFlag={setResetFlag}
                style={styles.calendar}
            />

            <ScrollView style={styles.workingHour}>
                {selectedDates.length === 0 ? (
                    <View style={styles.notice}>
                        <Text style={styles.noticeText}>Select Date to Set Working Hours</Text>
                    </View>
                ) : (
                    selectedDates.map((item, idx) => (
                        <WorkingHoursSlider
                            key={idx}
                            date={item}
                            onHoursChange={handleHoursChange}
                        />
                    ))
                )}
            </ScrollView>

            <View style={styles.buttons}>
                <TouchableOpacity onPress={handleSave} style={styles.btnPrimary}>
                    <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleReset} style={styles.btnSecondary}>
                    <Text style={styles.btnText}>Reset</Text>
                </TouchableOpacity>
            </View>

            <ToastManager
                position='center'
                duration={3000}
                animationStyle='zoomInOut'
                theme='dark'
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        paddingHorizontal: 15,
    },
    workingHour: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    btnPrimary: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 30,
        flex: 1,
        marginHorizontal: 5,
    },
    btnSecondary: {
        backgroundColor: '#d1d1d1',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 30,
        flex: 1,
        marginHorizontal: 5,
    },
    btnText: {
        color: '#FFFFFF',
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 16,
    },
    notice: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    noticeText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
    },
    calendar: {
        marginTop: 20,
    },
});

export default Availability;