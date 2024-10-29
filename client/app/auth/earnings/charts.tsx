// DonutChart.js
import React from 'react';
import { View, Text } from 'react-native';
import { Svg, Circle, G } from 'react-native-svg';

const convertToHoursAndMinutes = (totalHours: number) => {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return { hours, minutes }; // Return an object with hours and minutes
}

const DonutChart = ({ data, size = 60, strokeWidth = 10 }: any) => {
    data = data.map((item: any) => {
        item.value = Number(item.value);
        return item;
    });
    const total = data.reduce((sum: number, item: any) => sum + item.value, 0);

    if (total === 0) {
        // Return a default circle if total is zero
        return (
            <View>
                <Svg width={size} height={size}>
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={(size - strokeWidth) / 2}
                        stroke="#ccc"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    {/* <Text
                        x={size / 2}
                        y={size / 2}
                        fill="#000"
                        fontSize="12"
                        fontWeight="bold"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                    >
                        {total} hrs
                    </Text> */}
                </Svg>
            </View>
        );
    }

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    let cumulativePercent = 0;

    const slices = data.map((slice: any, index: number) => {
        const { value, color } = slice;
        if (value === 0) {
            return null; // Skip zero values
        }

        const percent = value / total;
        const dashArray = circumference * percent;
        const dashOffset = circumference * (1 - cumulativePercent);

        cumulativePercent += percent;

        return (
            <Circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="butt"
                fill="none"
            />
        );
    });

    const { hours, minutes } = convertToHoursAndMinutes(total);

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size}>
                <G rotation="-90" originX={size / 2} originY={size / 2}>
                    {slices}
                </G>
            </Svg>
            <View style={{
                position: "absolute",
                alignItems: "center",
            }}>
                <Text style={{
                    fontWeight: "bold",
                    fontSize: size / 6,
                }}>
                    {hours} hrs
                </Text>
                <Text style={{
                    fontWeight: "bold",
                    fontSize: size / 6,
                }}>
                    {minutes} min
                </Text>
            </View>
        </View>
    );
};

export default DonutChart;
