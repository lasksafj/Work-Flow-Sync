import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { G, Circle } from "react-native-svg"

const Charts = ({ workHours, heightNum, widthNum, fontSizeText, isCurrentChart }: any) => {
  const radius = 70
  const circleCircumference = 2 * Math.PI * radius

  const maxHours = 40;

  const strokeDashoffset =
    (circleCircumference - (circleCircumference * (((workHours + 39) % maxHours) / maxHours)));

  const baseStrokeColor = workHours <= maxHours ? 'white' : 'blue';
  const runStrokeColor = workHours <= maxHours ? 'blue' : 'red';

  return (
    <View style={styles.graphWrapper}>
      <Svg height={heightNum} width={widthNum} viewBox="0 0 180 180">
        <G rotation={-90} originX="90" originY="90">
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={baseStrokeColor}
            fill="transparent"
            strokeWidth="40"
          />
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={runStrokeColor}
            fill="transparent"
            strokeWidth="40"
            strokeDasharray={circleCircumference}
            strokeDashoffset={-strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      {isCurrentChart && <Text style={styles.text}>{workHours} Hours</Text>}
    </View>
  )
}

export default Charts

const styles = StyleSheet.create({
  graphWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    position: "absolute",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 20,
    color: "#394867",
  },
})
