import { View, Text } from 'react-native'

import WeekDays from '../components/WeekDays'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import ScheduleDetail from '../components/ScheduleDetail'
import { useState } from 'react'


const Schedule = () => {
  const [date, setDate] = useState<String>("")
  const [week, setWeek] = useState<String[]>([])
  const changeDate = (newDate: String, daysOfWeek: Array<String>) => {
    setDate(newDate)
    setWeek(daysOfWeek)
  }
  console.log('---------', week)
  return (
    <SafeAreaView>
      <ScrollView>
        <View> 
          <WeekDays changeDate={changeDate}/>
        </View>
        <View>
          <ScheduleDetail />
        </View>
        <Text>
          {date}
        </Text>
      </ScrollView>
    </SafeAreaView>
    
  )
}

export default Schedule