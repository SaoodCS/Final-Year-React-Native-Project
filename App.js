import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect } from "react";

import OnboardingScreen from "./src/screens/onboardingScreens/onboardingScreen";
import LoginRegistrationScreen from "./src/screens/loginRegistrationScreens/loginRegistrationScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Providers from './src/navigation';

const App = () => {
    return <Providers />;
}

export default App;
  
  
  
  
  
  
  
  
  
  
  
  
  
  