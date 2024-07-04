import React from "react";
import { router, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Svg, Circle, Text as SvgText } from "react-native-svg";

interface ImageProfileProps {
  initials: string;
  imageUrl: string | null;
}

const ImageProfile: React.FC<ImageProfileProps> = ({ initials, imageUrl }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f6f6f6" }}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            // handle onPress
            alert("Change Image Pressed!");
          }}
        >
          <View style={styles.profile}>
            {/* <View style={styles.profileAction}>
              <FeatherIcon name="edit" size={16} color="#fff" />
            </View> */}
            {imageUrl ? (
              <Image
                style={styles.profileAvatar}
                source={{
                  uri: imageUrl,
                }}
                alt="Profile Picture"
              />
            ) : (
              <View style={styles.initialsContainer}>
                <Svg height="100" width="100">
                  <Circle cx="50" cy="50" r="50" fill="#6200EE" />
                  <SvgText
                    fill="white"
                    fontSize="40"
                    fontWeight="bold"
                    x="50"
                    y="65"
                    textAnchor="middle"
                  >
                    {initials}
                  </SvgText>
                </Svg>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ImageProfile;

const styles = StyleSheet.create({
  container: {
    // paddingVertical: 48,
    // flex: 1,
  },
  profile: {
    padding: 16,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: "#e3e3e3",
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 9999,
  },
  profileAction: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    borderRadius: 12,
  },
  profileActionText: {
    marginRight: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  initialsContainer: {
    width: 80,
    height: 80,
    borderRadius: 9999,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
});
