import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import MyScheduleCalendar from '../components/MyScheduleCalendar';
import WorkingHoursSlider from '../components/WorkingHoursSlider';
import { handleSaveWorkingHours } from '@/apis/userService';
import ToastManager, { Toast } from 'toastify-react-native'


interface WorkingHours {
  date: Date;
  start: Date;
  end: Date;
}

const Availability = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [resetFlag, setResetFlag] = useState(false);

  useEffect(() => {
    // console.log('Selected Dates:', selectedDates);
    // setWorkingHours([]);
  }, [selectedDates]);

  const handleHoursChange = (date: Date, start: Date, end: Date) => {
    setWorkingHours((prevHours) => {
      const existing = prevHours.find((wh) => wh.date.toDateString() === date.toDateString());
      if (existing) {
        return prevHours.map((wh) =>
          wh.date.toDateString() === date.toDateString() ? { date, start, end } : wh
        );
      } 
      else {
        return [...prevHours, { date, start, end }];
      }
    });
  };

  const handleSave = async () => {
    // Process the data as needed
    let res;
    if (workingHours.length > 0){
      const formattedWorkingHours = workingHours.map(wh => ({
        date: wh.date, 
        start: wh.start, 
        end: wh.end
      }));
      
      res = await handleSaveWorkingHours(formattedWorkingHours)
      console.log('handleSave: ', formattedWorkingHours)
      Toast.success('Updated!', 'center')
    }else{
      Toast.warn('Must set working hours', 'center')
    }
    
    
    handleReset()
    // You can send this data to an API or store it as needed
  };

  const handleReset = () => {
    setSelectedDates([]);
    setWorkingHours([]);
    setResetFlag(true); // Set the reset flag to true to trigger the reset in MyScheduleCalendar
  };

  return (
    <View style={styles.container}>
      <MyScheduleCalendar 
        setSelectedDates={setSelectedDates} 
        resetFlag={resetFlag} 
        setResetFlag={setResetFlag} 
      />

      <ScrollView style={styles.workingHour}>
        {selectedDates.length === 0 ? (
          <View>
            <Text>Select Date to Set Working Hours</Text>
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
        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleReset}>
          <Text>Reset</Text>
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
  },
  workingHour: {
    flex: 1,
    backgroundColor: 'black',
  },
  buttons: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btn: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default Availability;
