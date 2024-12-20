import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TabNavigation from "./Screens/TabNavigation";
import LoginPage from "./Screens/LoginPage";
import Register from "./Screens/Register";
import ManageUser from "./Screens/ManageUser";
import LeaveManagement from "./Screens/LeaveManagement";
import PeerAttendance from "./Screens/PeerAttendance";
import Notifications from "./Screens/Notifications";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Tab" component={TabNavigation} />
        <Stack.Screen name="ManageUser" component={ManageUser} />
        <Stack.Screen name="LeaveManagement" component={LeaveManagement} />
        <Stack.Screen name="PeerAttendance" component={PeerAttendance} />
        <Stack.Screen name="Notifications" component={Notifications} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
