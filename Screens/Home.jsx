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
import * as Device from "expo-device";
import { url } from "./data";

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
  const fetchAttendanceData = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // Retrieve the auth token (use your method)
      const response = await fetch(`${url}:3000/attendance`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Pass token for authentication
        },
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setStatusData(data.attendance); // Update statusData with the fetched attendance records
        // console.log(statusData);
      } else {
        Alert.alert("Error fetching attendance data ", data.message);
        setStatusData([]);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  useEffect(() => {
    fetchAttendanceData(); // Fetch attendance data on component mount
  }, []);

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
    const targetLat = 18.935398; // Replace with the target location's latitude
    const targetLon = 72.825294; // Replace with the target location's longitude
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

  // const initiateFaceVerification = async () => {
  //   if (imageUri) {
  //     // Call your backend API to verify the captured image
  //     const isVerified = await performFaceVerification(imageUri); // Pass the image URI to the backend API

  //     if (isVerified) {
  //       setShowModal(false); // Close modal after successful verification
  //       alert("Checked In Successfull");

  //       const checkInTime = new Date().toLocaleTimeString();
  //       console.log("Check-In Time:", checkInTime);

  //       // Update the statusData state with the new check-in entry
  //       setStatusData((prevData) => [
  //         ...(prevData || []), // Fallback to an empty array if prevData is undefined
  //         {
  //           checkIn: checkInTime,
  //           checkOut: "00:00", // Initialize check-out time as null
  //         },
  //       ]);
  //     } else {
  //       alert("Face verification failed. Try again.");
  //     }
  //   } else {
  //     alert("No image captured.");
  //   }
  // };

  const initiateFaceVerification = async () => {
    if (imageUri) {
      // Call your backend API to verify the captured image
      const isVerified = await performFaceVerification(imageUri); // Pass the image URI to the backend API

      if (isVerified) {
        setShowModal(false); // Close modal after successful verification
        alert("Checked In Successfully");

        const checkInTime = new Date().toLocaleTimeString();
        console.log("Check-In Time:", checkInTime);

        // Generate the DeviceId using Expo's Device module
        const DeviceId =
          Device.deviceName +
          "-" +
          Device.brand +
          "-" +
          Device.osBuildFingerprint +
          "-" +
          Device.deviceType;

        try {
          // Fetch current location
          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;

          // API call to record the check-in time in the backend
          const token = await AsyncStorage.getItem("token"); // Retrieve token from AsyncStorage

          const response = await fetch(`${url}:3000/checkIn`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include token in the request header
            },
            body: JSON.stringify({
              checkInTime, // Pass check-in time to the backend
              checkInLatitude: latitude, // Pass the dynamic latitude
              checkInLongitude: longitude, // Pass the dynamic longitude
              DeviceId, // Include the generated device ID
            }),
          });

          const result = await response.json();

          if (response.ok) {
            // // If check-in is successful, update the statusData state
            // setStatusData((prevData) => [
            //   ...(prevData || []), // Fallback to an empty array if prevData is undefined
            //   {
            //     CheckIn: checkInTime,
            //     CheckOut: null, // Initialize check-out time as null
            //   },
            // ]);

            fetchAttendanceData();
          } else {
            alert(result.message || "Error during check-in.");
          }
        } catch (error) {
          console.error("Error during check-in API call:", error);
          alert("Error during check-in.");
        }
      } else {
        alert("Face verification failed. Try again.");
      }
    } else {
      alert("No image captured.");
    }
  };

  const performFaceVerification = async (capturedImageUri) => {
    // Get the token from AsyncStorage (or any other secure storage)
    const token = await AsyncStorage.getItem("token");

    try {
      // Fetch the profile picture from the backend API
      const response = await fetch(`${url}:3000/getProfilePic`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.profilePic) {
        // Get the profile image URI from the response (it's base64 encoded)
        const staticImageUri = data.profilePic; // The profile image from the server as base64

        // Prepare form data for face comparison
        const formData = new FormData();

        // Append the captured image
        formData.append("img1", {
          uri: capturedImageUri.uri, // Use the captured image URI
          type: "image/jpeg",
          name: "capturedImage.jpg",
        });

        // Append the static image from the backend API (base64 image)
        formData.append("img2", {
          uri: staticImageUri,
          type: "image/jpeg",
          name: "staticImage.jpg",
        });

        // Send the form data to the server for face comparison
        const compareResponse = await fetch(`${url}:5000/compare_faces`, {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const result = await compareResponse.json();
        return result.verified;
      } else {
        console.error(
          "Error fetching profile picture:",
          data.message || "Unknown error"
        );
        return false;
      }
    } catch (error) {
      console.error("Error during face verification:", error);
      return false;
    }
  };

  // const checkLocation = async () => {
  //   const { status } = await Location.requestForegroundPermissionsAsync();
  //   if (status !== "granted") {
  //     console.log("Permission to access location was denied");
  //     return;
  //   }

  //   const location = await Location.getCurrentPositionAsync({});
  //   const distance = calculateDistance(
  //     location.coords.latitude,
  //     location.coords.longitude
  //   );

  //   const isInside = distance <= 0.5; // 0.2 km or 200 meters threshold
  //   console.log(distance);

  //   if (isInside && !wasInside) {
  //     // Check-In logic

  //     setWasInside(true);
  //     const checkInTime = new Date().toLocaleTimeString();
  //     // console.log(checkInTime);

  //     setStatusData((prevData) => {
  //       // Check if the last entry is missing check-out time
  //       if (
  //         prevData.length > 0 &&
  //         prevData[prevData.length - 1].checkOut === "00:00"
  //       ) {
  //         // Don't add a new check-in if the last entry has no check-out time
  //         return prevData;
  //       }
  //       setShowModal(true); // Show modal to capture face
  //     });
  //   } else if (!isInside && wasInside) {
  //     // Check-Out logic
  //     setWasInside(false);
  //     const checkOutTime = new Date().toLocaleTimeString();

  //     setStatusData((prevData) => {
  //       if (prevData.length > 0) {
  //         const newData = [...prevData];
  //         newData[newData.length - 1].checkOut = checkOutTime;
  //         return newData;
  //       }
  //       return prevData;
  //     });
  //   }
  // };

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

    const isInside = distance <= 0.0005; // 0.5 km or 500 meters threshold
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
          prevData[prevData.length - 1].CheckOut === null
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

      // setStatusData((prevData) => {
      //   if (prevData.length > 0) {
      //     const newData = [...prevData];
      //     newData[newData.length - 1].CheckOut = checkOutTime;
      //     return newData;
      //   }
      //   return prevData;
      // });

      const token = await AsyncStorage.getItem("token"); // Retrieve token from AsyncStorage
      // Generate the DeviceId using Expo's Device module
      const DeviceId =
        Device.deviceName +
        "-" +
        Device.brand +
        "-" +
        Device.osBuildFingerprint +
        "-" +
        Device.deviceType;

      // Call check-out API
      try {
        const response = await fetch(`${url}:3000/checkOut`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send the token here for authorization
          },
          body: JSON.stringify({
            checkOutLatitude: location.coords.latitude,
            checkOutLongitude: location.coords.longitude,
            DeviceId: DeviceId, // Send the device ID here
          }),
        });

        const result = await response.json();
        if (response.ok) {
          console.log("Check-out successful:", result.message);
          fetchAttendanceData();
        } else {
          console.error("Check-out failed:", result.message);
        }
      } catch (error) {
        console.error("Error during check-out API call:", error);
      }
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
      const phoneNumbers = ["9369073223", "7709573696", "9967208944"]; // Add more numbers as needed

      // Send the SMS with the SOS message
      const { result } = await SMS.sendSMSAsync(phoneNumbers, message);

      // Prepare data for backend API
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      const response = await fetch(`${url}:3000/addSOS`, {
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

  const formatTime = (time) => {
    if (!time) return "0:0 AM"; // Return default if time is not available

    // Split the time into hour and minute parts
    const [hours, minutes] = time.split(":");

    // Create a new Date object using the hour and minute
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // 12-hour format
    };

    // Convert the time to a 12-hour format with AM/PM
    return date.toLocaleTimeString([], options);
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
                Check In : {formatTime(item.CheckIn)}
              </Text>
              <Text style={{ fontFamily: "ZonaExtraLight", fontSize: 12 }}>
                Check Out : {formatTime(item.CheckOut) || "00:00 AM"}
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
