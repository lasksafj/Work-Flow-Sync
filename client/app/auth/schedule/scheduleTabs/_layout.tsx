
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator,
        MaterialTopTabNavigationOptions,
        MaterialTopTabNavigationEventMap
} from '@react-navigation/material-top-tabs'
import { withLayoutContext } from 'expo-router';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Container } from 'inversify';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator);


const Layout = () => {
  return (
    <MaterialTopTabs screenOptions={{

        tabBarStyle: styles.containerStyle,
        tabBarIndicatorStyle: styles.indicator,
        tabBarLabelStyle: styles.label,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'white',
        swipeEnabled: false,
    }}>
        <MaterialTopTabs.Screen name="Schedule" options={{title:'Schedule'}}/>
        <MaterialTopTabs.Screen name="Availability" options={{title:'Availability'}}/>
    </MaterialTopTabs>

  )
}

const styles = StyleSheet.create({
    containerStyle: {
      paddingTop: Constants.statusBarHeight,
      
      backgroundColor: 'black',
      width: '60%',
      alignSelf:'center',
      borderRadius: 8
    },
    indicator: {
      backgroundColor: 'white',
      position: 'absolute',
      zIndex:-1,
      bottom: '15%',
      height: '70%',
      borderRadius:8
    },
    label: {
      fontFamily: 'Poppins_600SemiBold',
      fontWeight: 'bold'
    },
    
})

export default Layout
