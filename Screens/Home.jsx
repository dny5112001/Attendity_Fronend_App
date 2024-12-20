import {
  Button,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
  BackHandler,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/FontAwesome5";
import Entypo from "react-native-vector-icons/Entypo";
import { TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Asset } from "expo-asset";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileImage from "../assets/ProfileImage.jpg";
import ReservationList from "react-native-calendars/src/agenda/reservation-list";
import * as SMS from "expo-sms";

const Home = () => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    ZonaProBold: require("../assets/fonts/zona-pro/ZonaPro-Bold.otf"),
    ZonaExtraLight: require("../assets/fonts/zona-pro/ZonaPro-ExtraLight.otf"),
  });
  const [wasInside, setWasInside] = useState(false);
  const [statusData, setStatusData] = useState([]); // Initialize as an empty array

  const [showModal, setShowModal] = useState(false);
  const [imageUri, setImageUri] = useState(null); // For storing the captured image

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert("Exit App", "Are you sure you want to exit?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "YES",
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true; // Prevent default behavior
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      // Clean up when the screen is unfocused
      return () => backHandler.remove();
    }, [])
  );
  // Function to calculate distance between two points (Haversine formula)
  const calculateDistance = (lat, lon) => {
    const targetLat = 19.176572; // Replace with the target location's latitude
    const targetLon = 72.845215; // Replace with the target location's longitude
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat - targetLat) * Math.PI) / 180;
    const dLon = ((lon - targetLon) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat * Math.PI) / 180) *
        Math.cos((targetLat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const initiateFaceVerification = async () => {
    if (imageUri) {
      // Call your backend API to verify the captured image
      const isVerified = await performFaceVerification(imageUri); // Pass the image URI to the backend API

      if (isVerified) {
        setShowModal(false); // Close modal after successful verification
        alert("Checked In Successfull");

        const checkInTime = new Date().toLocaleTimeString();
        console.log("Check-In Time:", checkInTime);

        // Update the statusData state with the new check-in entry
        setStatusData((prevData) => [
          ...(prevData || []), // Fallback to an empty array if prevData is undefined
          {
            checkIn: checkInTime,
            checkOut: "00:00", // Initialize check-out time as null
          },
        ]);
      } else {
        alert("Face verification failed. Try again.");
      }
    } else {
      alert("No image captured.");
    }
  };

  const performFaceVerification = async (capturedImageUri) => {
    const staticImageUri = Asset.fromModule(
      require("../assets/ProfileImage.jpg")
    ).uri;

    try {
      const formData = new FormData();

      // Append the captured image
      formData.append("img1", {
        uri: capturedImageUri.uri, // Use the captured image URI
        type: "image/jpeg",
        name: "capturedImage.jpg",
      });

      // Append the static image from assets
      formData.append("img2", {
        uri: staticImageUri,
        type: "image/jpeg",
        name: "staticImage.jpg",
      });

      const response = await fetch("http://192.168.138.88:5000/compare_faces", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.json();
      // console.log(result);
      // const verified = await result.verified;
      return result.verified;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const checkLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const distance = calculateDistance(
      location.coords.latitude,
      location.coords.longitude
    );

    const isInside = distance <= 0.5; // 0.2 km or 200 meters threshold
    console.log(distance);

    if (isInside && !wasInside) {
      // Check-In logic

      setWasInside(true);
      const checkInTime = new Date().toLocaleTimeString();
      // console.log(checkInTime);

      setStatusData((prevData) => {
        // Check if the last entry is missing check-out time
        if (
          prevData.length > 0 &&
          prevData[prevData.length - 1].checkOut === "00:00"
        ) {
          // Don't add a new check-in if the last entry has no check-out time
          return prevData;
        }
        setShowModal(true); // Show modal to capture face
      });
    } else if (!isInside && wasInside) {
      // Check-Out logic
      setWasInside(false);
      const checkOutTime = new Date().toLocaleTimeString();

      setStatusData((prevData) => {
        if (prevData.length > 0) {
          const newData = [...prevData];
          newData[newData.length - 1].checkOut = checkOutTime;
          return newData;
        }
        return prevData;
      });
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1,
      aspect: [5, 5],
    });

    if (!result.canceled) {
      setImageUri(result.assets[0]); // Store the image URI correctly
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkLocation();
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval); // Clean up on component unmount
  }, [wasInside]);

  const sendSOS = async () => {
    try {
      // Get the current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Construct the SOS message with coordinates and Google Maps link
      const message = `This is an SOS message. Please help! Location: Latitude: ${latitude}, Longitude: ${longitude}. 
    View on Google Maps: https://www.google.com/maps?q=${latitude},${longitude}`;

      // Array of phone numbers to send SMS to
      const phoneNumbers = ["9136833946"]; // Add more numbers as needed

      // Send the SMS with the SOS message
      const { result } = await SMS.sendSMSAsync(phoneNumbers, message);

      // Prepare data for backend API
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      const response = await fetch("http://192.168.0.101:3000/addSOS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          RecipientContactNumbers: phoneNumbers.join(","),
        }),
      });

      if (response.ok) {
        Alert.alert("SOS message has been sent and recorded!");
      } else {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        Alert.alert("SOS message sent, but failed to record on the server.");
      }
    } catch (error) {
      console.error("Error sending SOS:", error);
      Alert.alert("An error occurred while sending the SOS message.");
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#f4f5f6" />
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#f4f5f6",
              paddingTop: 20,
              borderRadius: 10,
              height: 340,
              paddingHorizontal: 20,
              width: "70%",
            }}
          >
            <Text style={{ fontFamily: "ZonaProBold" }}>
              You're within office range , please capture your face for
              verification
            </Text>
            <TouchableOpacity
              onPress={pickImage}
              style={{
                width: "100%",
                height: 50,
                borderRadius: 10,
                backgroundColor: "black",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 50,
              }}
            >
              <Text style={{ fontFamily: "ZonaProBold", color: "#f4f5f6" }}>
                Capture Face
              </Text>
            </TouchableOpacity>
            {imageUri && (
              <Text style={{ fontFamily: "ZonaExtraLight", marginTop: 10 }}>
                Image has been captured
              </Text>
            )}

            <TouchableOpacity
              onPress={initiateFaceVerification}
              style={{
                width: "100%",
                height: 50,
                borderRadius: 10,
                backgroundColor: "black",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Text style={{ fontFamily: "ZonaProBold", color: "#f4f5f6" }}>
                Verify Face
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={{
                width: "100%",
                height: 50,
                borderRadius: 10,
                backgroundColor: "black",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Text style={{ fontFamily: "ZonaProBold", color: "#f4f5f6" }}>
                Cancel
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </Modal>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontFamily: "ZonaProBold", fontSize: 24 }}>
          Hello , Deepak 👋
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Notifications");
          }}
          style={{
            width: 35,
            height: 35,
            backgroundColor: "#1C1C1C",
            borderRadius: 17.5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Entypo name="bell" color="#f4f5f6" style={{ fontSize: 20 }} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          columnGap: 12,
          rowGap: 20,
          marginTop: 50,
        }}
      >
        <TouchableOpacity
          style={{
            width: "48%",
            height: 180,
            flexDirection: "column",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#1C1C1C",
            borderRadius: 20,
            paddingVertical: 15,
            paddingHorizontal: 15,
            elevation: 100,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: "ZonaProBold",
              fontSize: 14,
              lineHeight: 23,
              // backgroundColor: "red",
              width: "100%",
            }}
          >
            Employee Attendance
          </Text>
          <View
            style={{
              width: "100%",
              backgroundColor: "#323232",
              height: 35,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontFamily: "ZonaExtraLight",
                fontSize: 12,
                lineHeight: 23,
                paddingLeft: 10,
              }}
            >
              Check in
            </Text>
            <View
              style={{
                width: 35,
                height: 35,
                backgroundColor: "#49cbeb",
                borderRadius: 17.5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon
                name="location-arrow"
                color="#323232"
                style={{ fontSize: 18 }}
              />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "48%",
            height: 180,
            flexDirection: "column",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#fff",
            borderRadius: 20,
            paddingVertical: 15,
            paddingHorizontal: 15,
            elevation: 100,
          }}
          onPress={() => {
            navigation.navigate("PeerAttendance");
          }}
        >
          <Text
            style={{
              color: "#323232",
              fontFamily: "ZonaProBold",
              fontSize: 14,
              lineHeight: 23,
              width: "100%",
            }}
          >
            Peer Attendance
          </Text>
          <View
            style={{
              width: "100%",
              backgroundColor: "#F2F2F2",
              height: 35,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: "#323232",
                fontFamily: "ZonaExtraLight",
                fontSize: 12,
                lineHeight: 23,
                paddingLeft: 10,
              }}
            >
              Check in
            </Text>
            <View
              style={{
                width: 35,
                height: 35,
                backgroundColor: "#49cbeb",
                borderRadius: 17.5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon
                name="location-arrow"
                color="#323232"
                style={{ fontSize: 18 }}
              />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "48%",
            height: 180,
            flexDirection: "column",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#fff",
            borderRadius: 20,
            paddingVertical: 15,
            paddingHorizontal: 15,
            elevation: 100,
          }}
          onPress={() => {
            navigation.navigate("LeaveManagement");
          }}
        >
          <Text
            style={{
              color: "#323232",
              fontFamily: "ZonaProBold",
              fontSize: 14,
              lineHeight: 23,
              textAlign: "left",
              width: "100%",
            }}
          >
            Managing Leaves
          </Text>
          <View
            style={{
              width: "100%",
              backgroundColor: "#F2F2F2",
              height: 35,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: "#323232",
                fontFamily: "ZonaExtraLight",
                fontSize: 12,
                lineHeight: 23,
                paddingLeft: 10,
              }}
            >
              Leaves
            </Text>
            <View
              style={{
                width: 35,
                height: 35,
                backgroundColor: "#82F5CB",
                borderRadius: 17.5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon name="calendar" color="#323232" style={{ fontSize: 18 }} />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "48%",
            height: 180,
            flexDirection: "column",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#1C1C1C",
            borderRadius: 20,
            paddingVertical: 15,
            paddingHorizontal: 15,
          }}
          onPress={sendSOS}
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: "ZonaProBold",
              fontSize: 14,
              lineHeight: 23,
              textAlign: "left",
              width: "100%",
            }}
          >
            Emergency (SOS)
          </Text>
          <View
            style={{
              width: "100%",
              backgroundColor: "#323232",
              height: 35,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontFamily: "ZonaExtraLight",
                fontSize: 12,
                lineHeight: 23,
                paddingLeft: 10,
              }}
            >
              SOS
            </Text>
            <View
              style={{
                width: 35,
                height: 35,
                backgroundColor: "#F73E3E",
                borderRadius: 17.5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Entypo name="bell" color="#f4f5f6" style={{ fontSize: 20 }} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginTop: 25,
          backgroundColor: "#fff",
          borderRadius: 10,
          height: 185,
          elevation: 100,
          marginBottom: 100,
          paddingVertical: 15,
          paddingHorizontal: 15,
        }}
      >
        <Text style={{ fontFamily: "ZonaProBold", fontSize: 16 }}>
          Your Local History
        </Text>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={statusData}
          keyExtractor={(item, index) => index.toString()} // Use index as a fallback if no unique ID exists
          renderItem={(
            { item } // Destructure 'item' from the parameter
          ) => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                paddingHorizontal: 3,
                marginTop: 10,
              }}
            >
              <Text style={{ fontFamily: "ZonaExtraLight", fontSize: 12 }}>
                Check In : {item.checkIn}
              </Text>
              <Text style={{ fontFamily: "ZonaExtraLight", fontSize: 12 }}>
                Check Out : {item.checkOut || "00:00"}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f5f6",
    paddingHorizontal: 30,
    paddingTop: 70,
  },
});
