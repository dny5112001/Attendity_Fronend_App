import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useFonts } from "expo-font";

const PeerAttendance = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [photo, setPhoto] = useState(null);
  const [fontsLoaded] = useFonts({
    ZonaProBold: require("../assets/fonts/zona-pro/ZonaPro-Bold.otf"),
  });

  // Request permission to access camera/gallery
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "You need to grant camera access to use this feature."
      );
    }
  };

  const handleCapture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      aspect: [5, 5],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!employeeId || !photo) {
      Alert.alert("Error", "Please enter Employee ID and capture photo.");
      return;
    }
    // Implement attendance logic (e.g., API calls)
    Alert.alert("Success", "Attendance marked successfully!");
  };

  // Request permission on component mount
  React.useEffect(() => {
    requestPermission();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", flex: 1 }}>
        <Text style={styles.title}>Peer Attendance</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Employee ID"
          value={employeeId}
          onChangeText={setEmployeeId}
          keyboardType="numeric"
        />

        <Pressable style={styles.captureButton} onPress={handleCapture}>
          <Text style={styles.captureButtonText}>Capture Photo</Text>
        </Pressable>

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Mark Attendance</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 70,
    backgroundColor: "#f4f5f6",
  },
  title: {
    fontSize: 24,
    fontFamily: "ZonaProBold",
    color: "#000",
    marginBottom: 30,
    textAlign: "center",
    marginTop: 200,
  },
  label: {
    fontFamily: "ZonaProBold",
    fontSize: 17,
    marginBottom: 10,
    color: "#000",
    marginTop: 200,
    width: "100%",
  },

  textInput: {
    height: 45,
    width: "100%",
    backgroundColor: "#fff",
    fontFamily: "ZonaProBold",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 5,
  },
  captureButton: {
    backgroundColor: "#1C1C1C",
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 45,
    width: "100%",
    elevation: 10,
  },
  captureButtonText: {
    fontSize: 16,
    color: "#49cbeb",
    fontFamily: "ZonaProBold",
    textAlign: "center",
    elevation: 10,
  },
  photoPreview: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: "#1C1C1C",
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    height: 45,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    color: "#49cbeb",
    fontFamily: "ZonaProBold",
    textAlign: "center",
  },
});

export default PeerAttendance;
