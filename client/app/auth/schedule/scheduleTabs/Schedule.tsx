import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, ScrollView } from 'react-native';
import WeekDays from '../components/WeekDays';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScheduleDetail from '../components/ScheduleDetail';
import moment from 'moment';

const Schedule: React.FC = () => {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const itemRefs = useRef<{ [key: string]: View | null }>({});

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

  return (
    <SafeAreaView>
      <ScrollView ref={scrollViewRef}>
        <View>
          <WeekDays selectedDay={date} setSelectedDay={setDate} daysOfWeek={daysOfWeek} />
        </View>
        <View>
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
    </SafeAreaView>
  );
};

export default Schedule;
