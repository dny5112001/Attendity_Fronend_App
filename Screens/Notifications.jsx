import React, { useState, useEffect } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import io from "socket.io-client"; // Import the socket.io-client
import AsyncStorage from "@react-native-async-storage/async-storage"; // Add this import for AsyncStorage (or your preferred storage method)
import { url } from "./data";

const Notifications = () => {
  const [friendRequest, setFriendRequest] = useState([
    {
      userId: "Upload your work image",
      firstName: "Admin",
      lastName: "Office",
      profileImage: "",
    },
  ]);

  const [notifications, setNotifications] = useState([]); // State to hold notifications
  const [socket, setSocket] = useState(null); // Store socket connection

  // Initialize Socket.IO client
  useEffect(() => {
    // Connect to socket server
    const socketConnection = io(`${url}:3000`); // Replace with your server's URL
    setSocket(socketConnection); // Store socket connection for cleanup

    // Listen for notification event
    socketConnection.on("notification", (data) => {
      // Add the notification message to the state
      console.log(data);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          message: data.message,
        },
      ]);
    });

    // Cleanup on unmount
    return () => {
      socketConnection.disconnect(); // Disconnect socket on component unmount
    };
  }, []);

  // Register user with token
  useEffect(() => {
    const registerUser = async () => {
      const token = await AsyncStorage.getItem("token"); // Get the token from AsyncStorage or another method

      if (token && socket) {
        // Send register event with token
        socket.emit("register", { token });
        console.log("User registered with token:", token);
      }
    };

    registerUser();
  }, [socket]); // Run this effect when the socket is initialized

  const captureImage = async (userId) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera access is needed to capture an image."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      // Update the profile image for the user
      setFriendRequest((prevRequests) =>
        prevRequests.map((request) =>
          request.userId === userId
            ? { ...request, profileImage: result.assets[0].uri }
            : request
        )
      );

      Alert.alert("Success", "Image captured successfully!");
    }
  };

  const UserCards = ({ request }) => {
    return (
      <View style={styles.cardContainer}>
        <Image
          source={{
            uri:
              request.profileImage ||
              "https://i.pinimg.com/736x/05/0c/cd/050ccd674a970e24c9279ea4ae38c329.jpg",
          }}
          style={styles.avatar}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.userName}>Admin</Text>
          <Text style={styles.lastSeen}>Office</Text>
        </View>

        <TouchableOpacity
          style={{ position: "absolute", right: 20 }}
          onPress={() => captureImage(request.message)}
        >
          <Ionicons name="camera" size={35} color="#48BB78" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
      </View>

      <View style={styles.divider}></View>

      <FlatList
        data={notifications} // Use notifications instead of friendRequest
        keyExtractor={(item, index) => index.toString()} // Use index for keyExtractor since userId might be repeated
        renderItem={({ item }) => <UserCards request={item} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 70,
  },
  header: {
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  lastSeen: {
    fontSize: 14,
    color: "#666",
  },
});
