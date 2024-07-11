// import React, { useState } from 'react';
// import { View, StyleSheet, Text, Dimensions } from 'react-native';
// import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

// const DateRoute = ({ route }: any) => {
//     console.log('asdasdasdasd', route);

//     return (
//         <View style={[styles.scene, { backgroundColor: '#ff4081' }]}>
//             <Text>{route.params.param1}</Text>
//             <Text>{route.params.param2}</Text>
//         </View>
//     )
// };


// const initialLayout = { width: Dimensions.get('window').width };

// const renderTabBar = (props: any) => (
//     <TabBar
//         {...props}
//         indicatorStyle={{ backgroundColor: 'white' }}
//         style={{ backgroundColor: 'tomato' }}
//     />
// );

// const ScheduleScreen = () => {
//     const [index, setIndex] = useState(0);
//     const [routes] = useState([
//         { key: 'mon', title: 'Monday', params: { param1: 'Monday', param2: '11/11/11' } },
//         { key: 'tue', title: 'Tuesday', params: { param1: 'Tuesday', param2: '22/22/22' } },
//     ]);


//     return (
//         <TabView
//             navigationState={{ index, routes }}
//             renderScene={DateRoute}
//             onIndexChange={setIndex}
//             initialLayout={initialLayout}
//             renderTabBar={renderTabBar}
//         />
//     );
// };

// const styles = StyleSheet.create({
//     scene: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// });

// export default ScheduleScreen;

import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const { width, height } = Dimensions.get('window');

// const Tabs = () => {
//     return (
//         <View style={styles.Tab}>

//         </View>
//     )
// }

const ScheduleScreen = () => {
    return (
        <View>
            <Text>ScheduleScreen Page</Text>
        </View>
    )
}

export default ScheduleScreen

const styles = StyleSheet.create({
    Tab: {
        flexDirection: 'row',
        height: width / 7,
        flexWrap: 'wrap',
        alignSelf: 'stretch',
        backgroundColor: '#cccccc',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})