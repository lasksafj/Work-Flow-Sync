import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ScheduleScreen from './ScheduleScreen';
import AvailabilityScreen from './AvailabilityScreen';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

const Tab = createMaterialTopTabNavigator();

function PlannerTabs() {
    return (
        <Tab.Navigator
            initialRouteName='Schedule'
            screenOptions={{
                tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
                tabBarIndicatorStyle: { backgroundColor: '#00adf5', height: 4 },
                tabBarStyle: { backgroundColor: '#f9f9f9' },
            }}
        >
            <Tab.Screen
                name='Schedule'
                component={ScheduleScreen}
                options={{ tabBarLabel: 'Schedule' }}
            />
            <Tab.Screen
                name='Availability'
                component={AvailabilityScreen}
                options={{ tabBarLabel: 'Availability' }}
            />
        </Tab.Navigator>
    );
}

function PlannerScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.header}>
                <Text style={styles.title}>Planner</Text>
            </View>
            <PlannerTabs />
        </SafeAreaView>
    );
}

export default PlannerScreen;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
});
