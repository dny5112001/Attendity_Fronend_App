import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import React, { useState, useEffect } from "react";
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "./data";

const LoginPage = () => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    ZonaProBold: require("../assets/fonts/zona-pro/ZonaPro-Bold.otf"),
    ZonaExtraLight: require("../assets/fonts/zona-pro/ZonaPro-ExtraLight.otf"),
  });

  const [buttonColor, setButtonColor] = useState("#49cbeb");
  const buttonTextColor = buttonColor === "#49cbeb" ? "black" : "#fff";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          // If token exists, navigate directly to the Tab screen
          navigation.navigate("Tab");
        }
      } catch (error) {
        console.error("Error checking token:", error);
      }
    };

    checkToken();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleLogin = async () => {
    try {
      const response = await fetch(`${url}:3000/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: email,
          Password: password,
        }),
      });

      const contentType = response.headers.get("Content-Type");

      if (response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const result = await response.json();
          const { token, user } = result;

          await AsyncStorage.setItem("token", token);
          console.log(user, token);
          navigation.navigate("Tab");
        } else {
          throw new Error("Invalid response format");
        }
      } else {
        const result = await response.text();
        Alert.alert("Login Failed", result || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", "An error occurred. Please try again.");
    }
  };

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
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Enter password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Pressable
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPress={handleLogin}
          onPressIn={() => setButtonColor("#000")}
          onPressOut={() => setButtonColor("#49cbeb")}
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
