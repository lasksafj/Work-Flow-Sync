import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";

interface AvatarProps {
    firstName: string;
    lastName: string;
    size?: number;
    backgroundColor?: string;
    textColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({
    firstName,
    lastName,
    size = 50,
    backgroundColor = "#000",
    textColor = "#FFF",
}) => {
    const initials = `${firstName.charAt(0)}${lastName.charAt(
        0
    )}`.toUpperCase();

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg height={size} width={size}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={size / 2}
                    fill={backgroundColor}
                />
                <SvgText
                    x="50%"
                    y="50%"
                    alignmentBaseline="middle"
                    textAnchor="middle"
                    fill={textColor}
                    fontSize={size / 2}
                    fontWeight="bold"
                >
                    {initials}
                </SvgText>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 50,
        borderRadius: 9999,
        marginRight: 12,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
});

export default Avatar;
