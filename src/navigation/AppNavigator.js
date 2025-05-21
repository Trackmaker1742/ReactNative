import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FlashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import OTPVerificationScreen from "../screens/OtpScreen";
import HomeScreen from "../screens/HomeScreen";
import AppointmentScreen from "../screens/AppointmentScreen";
import ProfileScreen from "../screens/ProfileScreen";
import DoctorDetailScreen from "../screens/DoctorDetailScreen";
import DoctorListScreen from "../screens/DoctorListScreen";
import BookingScreen from "../screens/BookingScreen";
import UserInfoScreen from "../screens/UserInfoScreen";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Appointments" component={AppointmentScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="FlashScreen"
      >
        {/* FlashScreen */}
        <Stack.Screen name="FlashScreen" component={FlashScreen} />

        {/* Auth screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="OTPVerification"
          component={OTPVerificationScreen}
        />

        {/* Main app */}
        <Stack.Screen name="MainApp" component={MainTabNavigator} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Appointments" component={AppointmentScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />

        {/* Doctor screens */}
        <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
        <Stack.Screen name="DoctorList" component={DoctorListScreen} />
        <Stack.Screen
          name="BookingScreen"
          component={BookingScreen}
          options={{ title: "Đặt lịch khám" }}
        />
        <Stack.Screen
          name="UserInfo"
          component={UserInfoScreen}
          options={{ title: "Thông tin người dùng" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
