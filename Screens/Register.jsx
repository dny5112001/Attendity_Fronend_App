import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ScrollView,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useFonts } from "expo-font";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "./data";

const Register = () => {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const [buttonColor, setButtonColor] = useState("#49cbeb");
  const buttonTextColor = buttonColor === "#49cbeb" ? "black" : "#fff"; // New variable for text color
  const [fontsLoaded] = useFonts({
    ZonaProBold: require("../assets/fonts/zona-pro/ZonaPro-Bold.otf"),
    ZonaExtraLight: require("../assets/fonts/zona-pro/ZonaPro-ExtraLight.otf"),
  });

  // Form state
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Password, setPassword] = useState("");
  const [Department, setDepartment] = useState("");
  const [Designation, setDesignation] = useState("");
  const [DateOfJoining, setDateOfJoining] = useState("");

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaType: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }
  };
  const handleRegister = async () => {
    if (
      !FirstName ||
      !LastName ||
      !Email ||
      !Phone ||
      !Password ||
      !Department ||
      !Designation ||
      !DateOfJoining
    ) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    const DeviceId =
      Device.deviceName +
      "-" +
      Device.brand +
      "-" +
      Device.osBuildFingerprint +
      "-" +
      Device.deviceType;

    const formData = new FormData();
    formData.append("FirstName", FirstName);
    formData.append("LastName", LastName);
    formData.append("Email", Email);
    formData.append("Phone", Phone);
    formData.append("Password", Password);
    formData.append("Department", Department);
    formData.append("Designation", Designation);
    formData.append("DateOfJoining", DateOfJoining);
    formData.append("DeviceId", DeviceId);

    if (imageUri) {
      const image = {
        uri: imageUri,
        type: "image/jpeg", // or the appropriate mime type for your image
        name: "profile.jpg",
      };
      formData.append("profilePic", image);
    }

    try {
      const response = await fetch(`${url}:3000/register`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      // AsyncStorage.setItem("token", data.token);

      if (response.ok) {
        Alert.alert("Success", "User registered successfully!");
        navigation.navigate("Tab"); // Navigate to another screen on success
      } else {
        Alert.alert("Error", data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      Alert.alert("Error", "An error occurred during registration.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      <Pressable style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Select Photo</Text>
        )}
      </Pressable>

      <View style={styles.form}>
        <View style={styles.row}>
          <TextInput
            placeholder="First name"
            style={styles.textInput}
            value={FirstName}
            onChangeText={setFirstName}
          />
          <TextInput
            placeholder="Last name"
            style={styles.textInput}
            value={LastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            placeholder="Phone"
            style={styles.textInput}
            keyboardType="phone-pad"
            value={Phone}
            onChangeText={setPhone}
          />
          <TextInput
            placeholder="Designation"
            style={styles.textInput}
            value={Designation}
            onChangeText={setDesignation}
          />
        </View>

        <TextInput
          placeholder="Email"
          style={[styles.textInput, styles.addressInput]}
          keyboardType="email-address"
          value={Email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Department"
          style={[styles.textInput, { width: "100%", marginTop: 15 }]}
          value={Department}
          onChangeText={setDepartment}
        />
        <TextInput
          placeholder="Password"
          style={[styles.textInput, { width: "100%", marginTop: 15 }]}
          secureTextEntry
          value={Password}
          onChangeText={setPassword}
        />
        <TextInput
          placeholder="Date of joining"
          style={[styles.textInput, { width: "100%", marginTop: 15 }]}
          value={DateOfJoining}
          onChangeText={setDateOfJoining}
        />

        <Pressable
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPressIn={() => setButtonColor("#000")}
          onPressOut={() => setButtonColor("#49cbeb")}
          onPress={handleRegister} // Register on button press
        >
          <Text style={[styles.buttonText, { color: buttonTextColor }]}>
            Register
          </Text>
        </Pressable>

        <Text
          style={{
            textAlign: "center",
            fontFamily: "ZonaProBold",
            marginTop: 20,
            color: "#000",
            fontSize: 16,
          }}
        >
          Already have an account?
          <Text
            style={{ color: "#1BB6B6" }}
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            Login
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 50,
    alignItems: "center",
    backgroundColor: "#f4f5f6",
    padding: 20,
  },

  title: {
    textAlign: "center",
    fontFamily: "ZonaProBold",
    fontSize: 32,
    marginBottom: 20,
    color: "#000",
  },

  imagePicker: {
    width: 120,
    height: 120,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
    marginBottom: 40,
  },

  imagePickerText: {
    fontFamily: "ZonaProBold",
    color: "#888",
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  form: {
    width: "100%",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  textInput: {
    height: 45,
    width: "48%",
    backgroundColor: "#fff",
    fontFamily: "ZonaProBold",
    borderRadius: 10,
    paddingHorizontal: 15,
    elevation: 10,
  },

  addressInput: {
    width: "100%",
    elevation: 10,
  },

  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 50,
  },

  buttonText: {
    fontSize: 16,
    fontFamily: "ZonaProBold",
  },
});
