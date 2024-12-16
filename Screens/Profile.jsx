import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useFonts } from "expo-font";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import vector icons
import FontAwesome from "react-native-vector-icons/FontAwesome"; // Import vector icons
import ProfileImg from "../assets/ProfileImage.jpg";

const Profile = () => {
  const [fontsLoaded] = useFonts({
    ZonaProBold: require("../assets/fonts/zona-pro/ZonaPro-Bold.otf"),
    ZonaExtraLight: require("../assets/fonts/zona-pro/ZonaPro-ExtraLight.otf"),
  });
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
            source={ProfileImg}
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
            Joined
          </Text>
          <Text
            style={{
              fontFamily: "ZonaProBold",
              color: "#1C1C1C",
              fontSize: 16,
            }}
          >
            1 year ago
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text
          style={{ fontFamily: "ZonaProBold", fontSize: 25, color: "#1C1C1C" }}
        >
          Deepak
        </Text>
        <Text
          style={{ fontFamily: "ZonaProBold", fontSize: 25, color: "#A4A4A4" }}
        >
          Yadav
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
