import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ScheduleScreen from './ScheduleScreen';
import AvailabilityScreen from './AvailabilityScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { SafeAreaView, View, Text } from 'react-native';


const Tab = createMaterialTopTabNavigator();

function PlannerTabs() {
    return (
        <Tab.Navigator
            initialRouteName='Schedule'
            screenOptions={{}}
        >
            <Tab.Screen
                name='Schedule'
                component={ScheduleScreen}
            />
            <Tab.Screen
                name='Availability'
                component={AvailabilityScreen}
            />
        </Tab.Navigator>
    );
}

function PlannerScreen() {
    return (
        < SafeAreaView style={{ flex: 1 }}>
            <PlannerTabs />
        </SafeAreaView >
    );
}

export default PlannerScreen;

const styles = {
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 6,
        marginTop: 6,
    },
};