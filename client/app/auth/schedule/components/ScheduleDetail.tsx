import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, Dimensions } from 'react-native'
import React, { useMemo, useState, useRef, useEffect } from 'react'

const { width } = Dimensions.get('screen')

const ScheduleDetail = () => {
 

  return (
    <SafeAreaView>
        <TouchableOpacity style={styles.container}>
           <View style={styles.wrap}>
                <View style={styles.header}>
                    <Text>
                        Header-Date
                    </Text>
                </View>
                <View style={styles.body}>
                    <View style={styles.item}>
                        <View>
                            <Text>Start</Text>
                        </View>
                        <View>
                            <Text>End</Text>
                        </View>
                    </View >
                    <View style={styles.item}>
                        <Text>Name</Text>
                    </View>
                    <View style={styles.item}>
                        <Text>FullName</Text>
                        <Text>hours</Text>
                        <Text>Company</Text>
                    </View>

                </View>
           </View>
            
        </TouchableOpacity>
    </SafeAreaView>
   
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        width,
        paddingHorizontal:2,
       
    },
    wrap:{
        width: '100%',
        backgroundColor: 'blue',
        borderRadius:4,
        marginVertical:5
    },
    header: {
        width: '100%',
        backgroundColor: 'yellow',
        borderRadius: 4,
        paddingVertical:4,
        paddingLeft:8
    },
    body: {
        flexDirection: "row",
        width:'100%',
        
        alignItems: 'flex-start',
        // justifyContent: 'flex-start',
        marginHorizontal: -1,
        borderEndEndRadius:4,
        paddingVertical:8,

    },
    item:{
        // flex: 1,
        flexDirection: 'column',
        marginHorizontal: 6
    }
})

export default ScheduleDetail

