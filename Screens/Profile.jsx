import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import vector icons
import FontAwesome from "react-native-vector-icons/FontAwesome"; // Import vector icons
import ProfileImg from "../assets/ProfileImage.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    ZonaProBold: require("../assets/fonts/zona-pro/ZonaPro-Bold.otf"),
    ZonaExtraLight: require("../assets/fonts/zona-pro/ZonaPro-ExtraLight.otf"),
  });
  const [imageUri, setImageUri] = useState(null);

  const [formData, setFormData] = useState({
    Firstname: "",
    LastName: "",
    dateOfJoining: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch("http://192.168.0.101:3000/getProfile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token for authentication
        },
      });

      const responseData = await response.json();
      if (response.ok) {
        // Populate formData with the profile data from the backend
        const { profile } = responseData;
        setFormData({
          Firstname: profile.FirstName,
          LastName: profile.LastName,
          dateOfJoining: profile.DateOfJoining, // You can map this to a specific field if needed
        });

        if (profile.ProfilePic) {
          // console.log(profile.ProfilePic);
          setImageUri(profile.ProfilePic); // Set the profile image if available
        }
      } else {
        console.error("Error fetching profile data:", responseData.message);
      }
    } catch (error) {
      console.error("Error during API request:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split("T")[0]; // This will return 'YYYY-MM-DD'
    return formattedDate;
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="chevron-back"
          color={"black"}
          style={{ fontSize: 25 }}
        />
        <Ionicons
          name="ellipsis-vertical"
          color={"black"}
          style={{ fontSize: 23 }}
        />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            elevation: 20, // Adjust elevation as needed
            shadowColor: "#000", // iOS shadow
            shadowOffset: { width: 0, height: 4 }, // iOS shadow
            shadowOpacity: 0.3, // iOS shadow
            shadowRadius: 4.65, // iOS shadow
            borderRadius: 60, // Slightly larger than the image's border radius
            height: 120, // Slightly larger than the image height
            width: 120, // Slightly larger than the image width
            alignItems: "center", // Center the image
            justifyContent: "center", // Center the image
            marginTop: 20,
          }}
        >
          <Image
            source={{ uri: imageUri }}
            style={{
              height: 120,
              width: 120,
              borderRadius: 60,
            }}
          />
        </View>
        <View style={{ width: "50%" }}>
          <Text
            style={{
              fontFamily: "ZonaProBold",
              color: "#B1B1B1",
              fontSize: 16,
            }}
          >
            Joined on
          </Text>
          <Text
            style={{
              fontFamily: "ZonaProBold",
              color: "#1C1C1C",
              fontSize: 16,
            }}
          >
            {formData.dateOfJoining
              ? formatDate(formData.dateOfJoining)
              : "Not available"}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text
          style={{ fontFamily: "ZonaProBold", fontSize: 25, color: "#1C1C1C" }}
        >
          {formData.Firstname}
        </Text>
        <Text
          style={{ fontFamily: "ZonaProBold", fontSize: 25, color: "#A4A4A4" }}
        >
          {formData.LastName}
        </Text>
      </View>

      <View style={{ marginTop: 50 }}>
        <Text style={{ fontFamily: "ZonaProBold", fontSize: 18 }}>Profile</Text>
        <View
          style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "#FBF0E6",
                width: 50,
                height: 50,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 25,
              }}
            >
              <FontAwesome
                name="dot-circle-o"
                color={"#ECAE8A"}
                style={{
                  fontSize: 25,
                }}
              />
            </View>
            <Text style={{ fontFamily: "ZonaProBold", fontSize: 14 }}>
              Manage user
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "lightgray",
              height: 30,
              width: 30,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
            }}
            onPress={() => {
              navigation.navigate("ManageUser");
            }}
          >
            <Ionicons
              name="chevron-forward-sharp"
              style={{ fontSize: 24 }}
              color={"gray"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ marginTop: 50 }}>
        <Text style={{ fontFamily: "ZonaProBold", fontSize: 18 }}>
          Settings
        </Text>
        <View
          style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "#DCFFF2",
                width: 50,
                height: 50,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 25,
              }}
            >
              <FontAwesome
                name="bell-o"
                color={"#82F5CB"}
                style={{
                  fontSize: 25,
                }}
              />
            </View>
            <Text style={{ fontFamily: "ZonaProBold", fontSize: 14 }}>
              Notifications
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "lightgray",
              height: 30,
              width: 30,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <Ionicons
              name="chevron-forward-sharp"
              style={{ fontSize: 24 }}
              color={"gray"}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "#C2F0FA",
                width: 50,
                height: 50,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 25,
              }}
            >
              <FontAwesome
                name="moon-o"
                color={"#49CBEB"}
                style={{
                  fontSize: 25,
                }}
              />
            </View>
            <Text style={{ fontFamily: "ZonaProBold", fontSize: 14 }}>
              Dark Mode
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "lightgray",
              height: 30,
              width: 30,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <Ionicons
              name="chevron-forward-sharp"
              style={{ fontSize: 24 }}
              color={"gray"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#1C1C1C",
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          height: 40,
          width: 100,
          marginTop: 50,
        }}
        onPress={() => {
          AsyncStorage.removeItem("token");
          navigation.navigate("Login");
        }}
      >
        <Text style={{ fontFamily: "ZonaProBold", color: "#49CBEB" }}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 70,
    backgroundColor: "#f4f5f6",
  },
});
