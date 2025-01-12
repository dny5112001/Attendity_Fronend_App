import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Picker } from "@react-native-picker/picker"; // Import from @react-native-picker/picker
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "./data";

const LeaveManagement = () => {
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [buttonColor, setButtonColor] = useState("#49cbeb");
  const buttonTextColor = buttonColor === "#49cbeb" ? "black" : "#fff"; // Text color change based on button state

  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    ZonaProBold: require("../assets/fonts/zona-pro/ZonaPro-Bold.otf"),
    ZonaExtraLight: require("../assets/fonts/zona-pro/ZonaPro-ExtraLight.otf"),
  });
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken); // Set the token in state if found
        } else {
          console.log("No token found");
        }
      } catch (error) {
        console.error("Error fetching token from AsyncStorage", error);
      }
    };

    fetchToken();
  }, []); // This effect runs only once when the component mounts

  const handleSubmit = async () => {
    if (!startDate || !endDate || !leaveReason) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(`${url}:3000/applyLeave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass token in the Authorization header
        },
        body: JSON.stringify({
          LeaveType: leaveType,
          StartDate: startDate,
          EndDate: endDate,
          LeaveStatus: "Pending", // Default status can be set here
          LeaveReason: leaveReason,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Leave request submitted successfully!");
      } else {
        alert(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
      alert("An error occurred while submitting the leave request.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Leave Management</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Leave Type</Text>
        <View style={[styles.pickerWrapper]}>
          <Picker
            selectedValue={leaveType}
            onValueChange={(itemValue) => setLeaveType(itemValue)}
            style={styles.picker}
            fontFamily="ZonaProBold"
          >
            <Picker.Item label="Casual Leave" value="Casual Leave" />
            <Picker.Item label="Sick Leave" value="Sick Leave" />
            <Picker.Item label="Earned Leave" value="Earned Leave" />
            <Picker.Item label="Maternity Leave" value="Maternity Leave" />
          </Picker>
        </View>

        <Text style={[styles.label, { marginTop: 20 }]}>Start Date</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Start Date"
          value={startDate}
          onChangeText={(text) => setStartDate(text)}
        />

        <Text style={styles.label}>End Date</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter End Date"
          value={endDate}
          onChangeText={(text) => setEndDate(text)}
        />

        <Text style={styles.label}>Reason for Leave</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="Enter the reason for your leave"
          multiline={true}
          numberOfLines={4}
          value={leaveReason}
          onChangeText={(text) => setLeaveReason(text)}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#1C1C1C" }]}
            onPress={handleSubmit}
          >
            <Text style={[styles.buttonText, { color: "#49cbeb" }]}>Apply</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#1C1C1C" }]}
          >
            <Text style={[styles.buttonText, { color: "#24D294" }]}>Track</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    alignItems: "center",
    backgroundColor: "#f4f5f6",
    paddingHorizontal: 20,
  },

  title: {
    fontFamily: "ZonaProBold",
    fontSize: 24,
    marginBottom: 30,
    color: "#000",
    textAlign: "left",
    width: "100%",
  },

  form: {
    width: "100%",
  },

  label: {
    fontFamily: "ZonaProBold",
    fontSize: 16,
    marginBottom: 10,
    color: "#000",
  },
  pickerWrapper: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10, // Apply borderRadius here
    overflow: "hidden", // Ensure that the border radius clips the picker content
    elevation: 5, // Optional: for shadow effect on Android
  },

  picker: {
    height: 55,
    width: "100%",
  },

  textInput: {
    height: 45,
    width: "100%",
    backgroundColor: "#fff",
    fontFamily: "ZonaProBold",
    borderRadius: 10,
    paddingHorizontal: 15,
    elevation: 10,
    marginBottom: 20,
  },

  textArea: {
    height: 220,
    textAlignVertical: "top",
  },

  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 10,
    marginTop: 30,
    width: "46%",
    elevation: 10,
  },

  buttonText: {
    fontSize: 16,
    fontFamily: "ZonaProBold",
    color: "#1C1C1C",
  },
});

export default LeaveManagement;
