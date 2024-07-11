import { View, Text, TouchableOpacity, Button } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import MyScheduleCalendar from '../components/MyScheduleCalendar'
const Availability = () => {
  return (
    <View>
      <MyScheduleCalendar />
    </View>
  )
}

export default Availability