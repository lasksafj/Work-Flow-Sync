
import React, { useState, useCallback, useMemo, memo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, Easing, PanResponder } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import moment from 'moment';

type weekDatePropType = {
    changeDate: Function 
}

const WeekDays = (props: any) => {
  const [selectedDay, setSelectedDay] = useState(moment().format('YYYY-MM-DD'));
  // const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  
  const animationValue = useRef(new Animated.Value(0)).current;

  const daysOfWeek = useMemo(
    () =>
      Array.from({ length: 7 }, (v, i) =>
        moment(selectedDay).startOf('week').add(i, 'days').format('YYYY-MM-DD')
      ),
    [selectedDay]
  );

  const [selectedWeek, setSelectedWeek] = useState(daysOfWeek)

  useEffect(() => {
    props.changeDate(selectedDay, selectedWeek)
  }, [props, selectedDay, selectedWeek])

  const handleDayPress = useCallback((day: DateData) => {
    setSelectedDay(day.dateString);
    toggleCalendarVisibility(0);
  }, []);

  const handleSelectDay = useCallback((day: string) => {
    setSelectedDay(day);
    props.changeDate(day,selectedWeek)
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
        <Calendar onDayPress={handleDayPress} selectedDay={selectedDay} />
      </Animated.View>

      <Header
        daysOfWeek={daysOfWeek}
        selectedDay={selectedDay}
        onDayPress={handleSelectDay}
      />
      <View style={{ alignItems: 'center', padding: 5, backgroundColor: 'green' }} {...panResponder.panHandlers}>
        <Text>AAA</Text>
      </View>

      <ScreenA selectedDay={selectedDay} />

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
        </TouchableOpacity>
      ))}
    </View>
  )
});

const ScreenA = memo(({ selectedDay }: any) => (
  <View style={styles.screen}>
    <Text>Screen A</Text>
    <Text>Selected Day: {selectedDay}</Text>
  </View>
));


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20
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
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
  },
  dayButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  selectedDayButton: {
    backgroundColor: '#00adf5',
    borderRadius: 5,
    padding: 5,
  },
  dayText: {
    color: '#2d4150',
    fontSize: 16,
  },
  selectedDayText: {
    color: '#fff',
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
});

export default WeekDays;

