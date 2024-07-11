import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CalendarPicker from "react-native-calendar-picker";
import Constants from 'expo-constants';

const MyScheduleCalendar = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const minDate = new Date(2017, 6, 3); // Today
  const maxDate = new Date(2027, 6, 3);

  const onDateChange = (date: any) => {
    console.log(date)
    setSelectedDate(date)
  }

  return (
    <View style={styles.containerStyle}>
        <CalendarPicker
          startFromMonday={true}
          allowRangeSelection={false}
          minDate={minDate}
          maxDate={maxDate}
          todayBackgroundColor="#f2e6ff"
          selectedDayColor="#7300e6"
          selectedDayTextColor="#FFFFFF"
          onDateChange={onDateChange}
          width={Constants.screenWidth}
          
        />
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:8,
    padding: 5,
  },
});

export default MyScheduleCalendar;
