import {
  Button,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/FontAwesome5";
import Entypo from "react-native-vector-icons/Entypo";
import { TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Asset } from "expo-asset";

import ProfileImage from "../assets/ProfileImage.jpg";
import ReservationList from "react-native-calendars/src/agenda/reservation-list";

const Home = () => {
  const [fontsLoaded] = useFonts({
    ZonaProBold: require("../assets/fonts/zona-pro/ZonaPro-Bold.otf"),
    ZonaExtraLight: require("../assets/fonts/zona-pro/ZonaPro-ExtraLight.otf"),
  });
  const [wasInside, setWasInside] = useState(false);
  const [statusData, setStatusData] = useState([]); // Initialize as an empty array

  const [showModal, setShowModal] = useState(false);
  const [imageUri, setImageUri] = useState(null); // For storing the captured image

  // Function to calculate distance between two points (Haversine formula)
  const calculateDistance = (lat, lon) => {
    const targetLat = 19.077005; // Replace with the target location's latitude
    const targetLon = 72.847765; // Replace with the target location's longitude
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
        alert("Success");

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

      const response = await fetch("http://192.168.0.103:5000/compare_faces", {
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

    const isInside = distance <= 0.006; // 0.2 km or 200 meters threshold
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
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setImageUri(result.assets[0]); // Store the image URI correctly
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkLocation();
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval); // Clean up on component unmount
  }, [wasInside]);

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
            <TouchableOpacity
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
            </TouchableOpacity>
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
        >
          <Text
            style={{
              color: "#323232",
              fontFamily: "ZonaProBold",
              fontSize: 14,
              lineHeight: 23,
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
        >
          <Text
            style={{
              color: "#323232",
              fontFamily: "ZonaProBold",
              fontSize: 14,
              lineHeight: 23,
              textAlign: "left",
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
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: "ZonaProBold",
              fontSize: 14,
              lineHeight: 23,
              textAlign: "left",
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
