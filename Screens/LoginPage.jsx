import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import React, { useState } from "react";
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const LoginPage = () => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    ZonaProBold: require("../assets/fonts/zona-pro/ZonaPro-Bold.otf"),
    ZonaExtraLight: require("../assets/fonts/zona-pro/ZonaPro-ExtraLight.otf"),
  });

  const [buttonColor, setButtonColor] = useState("#49cbeb");

  const buttonTextColor = buttonColor === "#49cbeb" ? "black" : "#fff"; // New variable

  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#f4f5f6" />
      <View style={styles.header}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.textInput}
          placeholder="Enter password"
          secureTextEntry={true}
        />
        <Pressable
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPress={() => {
            navigation.navigate("Tab");
          }}
          onPressIn={() => setButtonColor("#000")} // Darker color on press
          onPressOut={() => setButtonColor("#49cbeb")} // Original color on release
        >
          <Text style={[styles.buttonText, { color: buttonTextColor }]}>
            Login
          </Text>
        </Pressable>
        <Text style={styles.registerText}>
          Not registered yet?
          <Text
            style={{ color: "#49cbeb" }}
            onPress={() => {
              navigation.navigate("Register");
            }}
          >
            Register
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f5f6",
  },

  header: {
    width: "80%",
    justifyContent: "center",
    padding: 10,
  },

  title: {
    textAlign: "center",
    fontFamily: "ZonaProBold",
    fontSize: 32,
    marginBottom: 20,
    color: "#000",
  },

  textInput: {
    height: 45,
    width: "100%",
    justifyContent: "center",
    backgroundColor: "#fff",
    fontFamily: "ZonaProBold",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    elevation: 10,
  },

  button: {
    padding: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    elevation: 200,
  },

  buttonText: {
    fontSize: 16,
    fontFamily: "ZonaProBold",
  },

  registerText: {
    textAlign: "center",
    fontFamily: "ZonaProBold",
    marginTop: 20,
    color: "#000",
    fontSize: 16,
  },
});
