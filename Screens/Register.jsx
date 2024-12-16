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

const Register = () => {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const [buttonColor, setButtonColor] = useState("#49cbeb");
  const buttonTextColor = buttonColor === "#49cbeb" ? "black" : "#fff"; // New variable for text color
  const [fontsLoaded] = useFonts({
    ZonaProBold: require("../assets/fonts/zona-pro/ZonaPro-Bold.otf"),
    ZonaExtraLight: require("../assets/fonts/zona-pro/ZonaPro-ExtraLight.otf"),
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
      setImageUri(result.assets[0].uri);
      console.log(result.assets[0].uri);
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
          <TextInput placeholder="Name" style={styles.textInput} />
          <TextInput
            placeholder="Email"
            style={styles.textInput}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.row}>
          <TextInput
            placeholder="Phone"
            style={styles.textInput}
            keyboardType="phone-pad"
          />
          <TextInput placeholder="Designation" style={styles.textInput} />
        </View>

        <TextInput
          placeholder="Address"
          style={[styles.textInput, styles.addressInput]}
          multiline={true}
          numberOfLines={3}
        />
        <TextInput
          placeholder="Department"
          style={[styles.textInput, { width: "100%", marginTop: 15 }]}
        />
        <TextInput
          placeholder="Office Location"
          style={[styles.textInput, { width: "100%", marginTop: 15 }]}
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
    paddingTop: 70,
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
