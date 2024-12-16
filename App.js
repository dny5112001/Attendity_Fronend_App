import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { StatusBar } from "expo-status-bar";
import TabNavigation from "./Screens/TabNavigation";
import FaceVerification from "./Screens/FaceVerfication";
import LoginPage from "./Screens/LoginPage";
import Register from "./Screens/Register";
import ManageUser from "./Screens/ManageUser";
import LeaveManagement from "./Screens/LeaveManagement";
import PeerAttendance from "./Screens/PeerAttendance";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Tab" component={TabNavigation} />
        <Stack.Screen name="face" component={FaceVerification} />
        <Stack.Screen name="ManageUser" component={ManageUser} />
        <Stack.Screen name="LeaveManagement" component={LeaveManagement} />
        <Stack.Screen name="PeerAttendance" component={PeerAttendance} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
