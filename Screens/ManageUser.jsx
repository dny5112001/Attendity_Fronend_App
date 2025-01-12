import React, { useState, useEffect } from "react";
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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useFonts } from "expo-font";
import ProfileImage from "../assets/ProfileImage.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "./data";

const ManageUser = () => {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const [buttonColor, setButtonColor] = useState("#49cbeb");
  const buttonTextColor = buttonColor === "#49cbeb" ? "black" : "#fff"; // New variable for text color
  const [fontsLoaded] = useFonts({
    ZonaProBold: require("../assets/fonts/zona-pro/ZonaPro-Bold.otf"),
    ZonaExtraLight: require("../assets/fonts/zona-pro/ZonaPro-ExtraLight.otf"),
  });

  const [formData, setFormData] = useState({
    Firstname: "",
    LastName: "",
    email: "",
    phone: "",
    designation: "",
    department: "",
    dateOfJoining: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${url}:3000/getProfile`, {
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
          email: profile.Email,
          phone: profile.Phone,
          designation: profile.Designation,
          dateOfJoining: profile.DateOfJoining, // You can map this to a specific field if needed
          department: profile.Department,
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

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaType: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (typeof uri === "string") {
        setImageUri(uri);
      } else {
        console.error("Picked image URI is not a string");
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split("T")[0]; // This will return 'YYYY-MM-DD'
    return formattedDate;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>User Profile</Text>

      <Pressable style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Image source={ProfileImage} style={styles.image} />
        )}
      </Pressable>

      <View style={styles.form}>
        <View style={styles.row}>
          <TextInput
            placeholder="First name"
            style={styles.textInput}
            value={formData.Firstname}
            onChangeText={(text) => handleChange("name", text)}
          />
          <TextInput
            placeholder="Last name"
            style={styles.textInput}
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.LastName}
            onChangeText={(text) => handleChange("email", text)}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            placeholder="Phone"
            style={styles.textInput}
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => handleChange("phone", text)}
          />
          <TextInput
            placeholder="Designation"
            style={styles.textInput}
            value={formData.designation}
            onChangeText={(text) => handleChange("designation", text)}
          />
        </View>

        <TextInput
          placeholder="Date of joining"
          style={[styles.textInput, styles.addressInput]}
          multiline={true}
          value={
            formData.dateOfJoining ? formatDate(formData.dateOfJoining) : ""
          } // Format date here
          editable={false} // Make it read-only if you don't want the user to edit
        />
        <TextInput
          placeholder="Department"
          style={[styles.textInput, { width: "100%", marginTop: 15 }]}
          value={formData.department}
          onChangeText={(text) => handleChange("department", text)}
        />

        <Pressable
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPressIn={() => setButtonColor("#000")}
          onPressOut={() => setButtonColor("#49cbeb")}
          // Call the handleUpdate function when the button is pressed
        >
          <Text style={[styles.buttonText, { color: buttonTextColor }]}>
            Update
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default ManageUser;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 100,
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

  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  form: {
    width: "100%",
    marginTop: 70,
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
