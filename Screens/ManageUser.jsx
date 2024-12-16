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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useFonts } from "expo-font";
import ProfileImage from "../assets/ProfileImage.jpg";

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
    name: "Deepak Yadav",
    email: "DeepakY511@gmail.com",
    phone: "8779889761",
    designation: "SDE",
    address: "Worli , Mumbai , Maharashtra",
    department: "IT",
    officeLocation: "Building A, 3rd Floor,Navi Mumbai",
  });

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
            placeholder="Name"
            style={styles.textInput}
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
          />
          <TextInput
            placeholder="Email"
            style={styles.textInput}
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
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
          placeholder="Address"
          style={[styles.textInput, styles.addressInput]}
          multiline={true}
          numberOfLines={3}
          value={formData.address}
          onChangeText={(text) => handleChange("address", text)}
        />
        <TextInput
          placeholder="Department"
          style={[styles.textInput, { width: "100%", marginTop: 15 }]}
          value={formData.department}
          onChangeText={(text) => handleChange("department", text)}
        />
        <TextInput
          placeholder="Office Location"
          style={[styles.textInput, { width: "100%", marginTop: 15 }]}
          value={formData.officeLocation}
          onChangeText={(text) => handleChange("officeLocation", text)}
        />

        <Pressable
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPressIn={() => setButtonColor("#000")}
          onPressOut={() => setButtonColor("#49cbeb")}
          onPress={() => {
            navigation.navigate("Tab");
          }}
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
