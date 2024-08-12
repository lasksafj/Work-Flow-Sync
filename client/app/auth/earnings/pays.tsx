import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DATA = [
  {
    title: 'Main dishes',
    data: ['Pizza', 'Burger', 'Risotto'],
  },
  {
    title: 'Sides',
    data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
  },
  {
    title: 'Drinks',
    data: ['Water', 'Coke', 'Beer'],
  },
  {
    title: 'Desserts',
    data: ['Cheese Cake', 'Ice Cream'],
  },
];

const Pays = ({ date, payment, workHours, fontSizeDate, fontSizePayment, isCurrentHour }: any) => {
  return (
    <View >
      <Text style={[styles.period, { fontSize: fontSizeDate }]}>{date}</Text>
      <View style={styles.hour}>
        {!isCurrentHour && <Text style={[{ fontSize: fontSizePayment }]}>{workHours} hours - </Text>}
        <Text style={[styles.gross, { fontSize: fontSizePayment }]}>Gross pay: ${payment}</Text>
      </View>
    </View>
  )
}

export default Pays

const styles = StyleSheet.create({
  period: {
    textAlign: "center",
    fontWeight: "600",
    paddingBottom: 10,
  },
  hour: {
    flexDirection: "row",
    justifyContent: "center",
  },
  gross: {
    textAlign: "center",
  }
})
