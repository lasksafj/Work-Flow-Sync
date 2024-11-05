import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import Constants from "expo-constants";

const MyScheduleCalendar = (props: any) => {
    const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(undefined);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(undefined);

    const onDateChange = (date: any, type: "START_DATE" | "END_DATE") => {
        if (type === "END_DATE") {
            setSelectedEndDate(date);
        } else {
            setSelectedStartDate(date);
            setSelectedEndDate(undefined);
            props.setSelectedDates([]);
        }
    };

    useEffect(() => {
        if (selectedStartDate && selectedEndDate) {
            const start = new Date(selectedStartDate);
            const end = new Date(selectedEndDate);
            const dates = getDatesInRange(start, end);
            props.setSelectedDates(dates);
        } else if (selectedStartDate) {
            props.setSelectedDates([selectedStartDate]);
        }
    }, [selectedStartDate, selectedEndDate]);

    const getDatesInRange = (start: Date, end: Date): Date[] => {
        const date = new Date(start);
        const dates = [];

        while (date <= end) {
            dates.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }

        return dates;
    };

    const resetDates = () => {
        setSelectedStartDate(undefined);
        setSelectedEndDate(undefined);
        props.setSelectedDates([]);
    };

    useEffect(() => {
        if (props.resetFlag) {
            resetDates();
            props.setResetFlag(false); // Reset the flag after resetting dates
        }
    }, [props.resetFlag]);

    const minDate = new Date(); // Today
    const maxDate = new Date(2030, 6, 3); // Example max date

    return (
        <View style={styles.container}>
            <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                minDate={minDate}
                maxDate={maxDate}
                todayBackgroundColor="#f2e6ff"
                selectedDayColor="#7300e6"
                selectedDayTextColor="#FFFFFF"
                onDateChange={onDateChange}
                width={Constants.screenWidth}
                selectedStartDate={selectedStartDate}
                selectedEndDate={selectedEndDate}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
});

export default MyScheduleCalendar;