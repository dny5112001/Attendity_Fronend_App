import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./Home";
import History from "./History";
import Profile from "./Profile";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import vector icons
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const [fontsLoaded] = useFonts({
    ZonaProBold: require("../assets/fonts/zona-pro/ZonaPro-Bold.otf"),
    ZonaExtraLight: require("../assets/fonts/zona-pro/ZonaPro-ExtraLight.otf"),
  });

  return (
    //   <StatusBar style="auto" backgroundColor="#f4f5f6" />
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 70,
          backgroundColor: "#1C1C1C",
          paddingTop: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "History") {
            iconName = focused ? "time" : "time-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          // Return the corresponding icon
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#98E2F5", // Active icon color
        tabBarInactiveTintColor: "gray", // Inactive icon color
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "ZonaProBold", // Use custom fonts
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default TabNavigation;

const styles = StyleSheet.create({});
