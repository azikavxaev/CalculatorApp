import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { Dimensions } from "react-native";
import { Vibration } from "react-native";
import { Platform } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const screenHeight = Dimensions.get("screen").height;

const ButtonComponent = (props) => {
  return (
    <Pressable
      style={({ pressed }) => {
        return pressed ? [styles.pressed] : null;
      }}
      onPress={({ buttonValue }) => {
        props.onPressProp();
        Platform.OS == "android" ? Vibration.vibrate(1) : null;
      }}
      onLongPress={props.onLongPressProp}
    >
      <View
        style={[
          styles.buttonContainer,
          { backgroundColor: props.isDarkMode ? "#3636385c" : "#8185866d" },
          props.style,
        ]}
      >
        <Text style={[styles.buttonText, props.styleText]}>
          {props.buttonValue}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressed: { opacity: 0.9 },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
    width: 0.22 * windowWidth,
    height: 0.1 * screenHeight,
    borderRadius: 22,
    shadowOpacity: 0.44,
    shadowOffset: { width: 3, color: "black" },
    shadowRadius: 2,
    elevation: 58,
  },
  buttonText: { fontSize: 40 },
});

export default ButtonComponent;
