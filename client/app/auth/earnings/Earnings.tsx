import { SafeAreaView, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Charts from './charts'
import Pays from './pays'
import api from '@/apis/api';

// const DATA = [
//   {
//     id: '1',
//     workHours: 75,
//     date: 'Jun 1 - Jun 15',
//     payment: 2345,
//     chartSize: 180,
//     dateSize: 20,
//     paymentSize: 18,
//     isCurrentChart: true,
//     isCurrentHour: true
//   },
//   {
//     id: '2',
//     workHours: 35,
//     date: 'May 15 - May 30',
//     payment: 3456,
//     chartSize: 90,
//     dateSize: 16,
//     paymentSize: 14,
//     isCurrentChart: false,
//     isCurrentHour: false
//   },
//   {
//     id: '3',
//     workHours: 15,
//     date: 'May 1 - May 15',
//     payment: 4567,
//     chartSize: 90,
//     dateSize: 16,
//     paymentSize: 14,
//     isCurrentChart: false,
//     isCurrentHour: false
//   },
//   {
//     id: '4',
//     workHours: 15,
//     date: 'May 1 - May 15',
//     payment: 4567,
//     chartSize: 90,
//     dateSize: 16,
//     paymentSize: 14,
//     isCurrentChart: false,
//     isCurrentHour: false
//   },
//   {
//     id: '5',
//     workHours: 15,
//     date: 'May 1 - May 15',
//     payment: 4567,
//     chartSize: 90,
//     dateSize: 16,
//     paymentSize: 14,
//     isCurrentChart: false,
//     isCurrentHour: false
//   },
//   {
//     id: '6',
//     workHours: 15,
//     date: 'May 1 - May 15',
//     payment: 4567,
//     chartSize: 90,
//     dateSize: 16,
//     paymentSize: 14,
//     isCurrentChart: false,
//     isCurrentHour: false
//   },
//   {
//     id: '7',
//     workHours: 15,
//     date: 'May 1 - May 15',
//     payment: 4567,
//     chartSize: 90,
//     dateSize: 16,
//     paymentSize: 14,
//     isCurrentChart: false,
//     isCurrentHour: false
//   },
//   {
//     id: '8',
//     workHours: 15,
//     date: 'May 1 - May 15',
//     payment: 4567,
//     chartSize: 90,
//     dateSize: 16,
//     paymentSize: 14,
//     isCurrentChart: false,
//     isCurrentHour: false
//   },
// ];

const Item = ({ workHours, date, payment, chartSize, dateSize, paymentSize, isCurrentChart, isCurrentHour }: any) => (
  <View style={styles.containerMain}>
    <View style={styles.chartContainerMain}>
      <Charts workHours={workHours} heightNum={chartSize} widthNum={chartSize} isCurrentChart={isCurrentChart} />
    </View>
    <View style={styles.payContainerMain}>
      <Pays workHours={workHours} date={date} payment={payment} fontSizeDate={dateSize} fontSizePayment={paymentSize} isCurrentHour={isCurrentHour} />
    </View>
  </View>
);

type ItemProps = {
  id: string,
  workHours: number,
  date: string,
  payment: number,
  chartSize: number,
  dateSize: number,
  paymentSize: number,
  isCurrentChart: boolean,
  isCurrentHour: boolean
};

const Index = () => {
  const [data, setData] = useState<ItemProps[]>([])
  useEffect(() => {
    api.get('/api/earnings/earning')
      .then(response => {
        let a = response.data as ItemProps[];
        // console.log(a
        a[0] = {
          ...a[0], id: '0',
          chartSize: 180,
          dateSize: 20,
          paymentSize: 18,
          isCurrentChart: true,
          isCurrentHour: true
        }

        for (let i = 1; i < a.length; i++) {
          a[i] = {
            ...a[i], id: i.toString(),
            chartSize: 90,
            dateSize: 16,
            paymentSize: 14,
            isCurrentChart: false,
            isCurrentHour: false
          }
        }
        setData(a);
      })
      .catch(error => {
        console.log(error);
      });
  }, [])
  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.pageName}>Earnings</Text> */}
      <FlatList
        data={data}
        renderItem={({ item }) =>
          <Item workHours={item.workHours}
            date={item.date}
            payment={item.payment}
            chartSize={item.chartSize}
            dateSize={item.dateSize}
            paymentSize={item.paymentSize}
            isCurrentChart={item.isCurrentChart}
            isCurrentHour={item.isCurrentHour} />}


        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  )
}

export default Index

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageName: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "600",
    paddingBottom: 10,
  },
  containerMain: {
    flexDirection: 'row',
    paddingTop: 15,
  },
  eachContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  chartContainerMain: {
    flex: 5,
  },
  eachChartContainer: {
    flex: 3
  },
  payContainerMain: {
    justifyContent: 'center',
    flex: 5,
  },
  eachPayContainer: {
    justifyContent: 'center',
    flex: 7
  }
})
