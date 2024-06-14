import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import api from '@/api/api';

const DashboardScreen = () => {
  try {
    api.get('/api/some_view/123987/')
      .then((res) => {
        console.log('dash board api get -----', res);
      })
      .catch(err => {
        console.log('dash board api err----', err);

      })
  }
  catch (err) {
    console.log(err);
  }
  return (
    <View>
      <Text>dashboard</Text>
    </View>
  )
}

export default DashboardScreen

const styles = StyleSheet.create({})