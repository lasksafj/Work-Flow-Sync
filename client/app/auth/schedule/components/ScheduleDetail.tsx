import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { handleFetchScheduleData } from '@/apis/userService';
import ScheduleCard from './ScheduleCard';

interface ScheduleDetailProps {
  detail: string;
  isExpanded: boolean;
  onPress: () => void;
}

const ScheduleDetail: React.FC<ScheduleDetailProps> = ({ detail, isExpanded, onPress }) => {
  const [listData, setListData] = useState([]);
  const [height] = useState(new Animated.Value(isExpanded ? (listData.length ? listData.length * 100 : 50) : 0));
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let data = await handleFetchScheduleData(detail);
      setListData(data.data.ED);
      setDataFetched(true);
      Animated.timing(height, {
        toValue: data.data.ED.length ? data.data.ED.length * 100 : 50,
        duration: 300,
        useNativeDriver: false,
      }).start();
    };

    if (isExpanded && !dataFetched) {
      fetchData();
    } else {
      Animated.timing(height, {
        toValue: isExpanded ? (listData.length ? listData.length * 100 : 50) : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isExpanded, dataFetched, listData.length]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.bar}>
        <Text style={styles.barText}>{detail}</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.details, { height }]}>
        {isExpanded && (
          listData.length > 0 ? (
            listData.map((item, index) => (
              <ScheduleCard detail={item} key={index} />
            ))
          ) : (
            <View style={{justifyContent: 'center', alignItems: 'flex-start', height:50}}>
              <Text style={{fontSize:20, fontWeight: '300', paddingLeft: 8}}>
                No Working Schedule
              </Text>
            </View>
          )
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 3,
  },
  bar: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  barText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  details: {
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
  },
  detailContent: {
    padding: 10,
  },
});

export default ScheduleDetail;
