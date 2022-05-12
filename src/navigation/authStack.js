import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginRegistrationScreen from '../screens/loginRegistrationScreens/loginRegistrationScreen';
import OnboardingScreen from '../screens/onboardingScreens/onboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// THIS COMPONENT IS USED FOR THE ROUTING OF THE APP.
// THE ASYNCSTORAGE STORES WHETHER THE USER HAS LAUNCHED THE APPLICATION BEFORE OR NOT -->
// IF THE APPLICATION HASN'T BEEN LAUNCHED BEFORE THEN THE USER IS INITIALLY NAVIGATED TO THE ONBOARDING SCREENS
// OTHERWISE THEY ARE NAVIGATED TO THE LOGIN/REGISTRATION SCREEN
// USE STATE AND USEEFFECT USED SO THAT AS SOON AS THE COMPONENT IS CALLED IT CHECKS WHETHER THE USER HAS LAUNCHED THE APP OR NOT STRAIGHT AWAY

const Stack = createStackNavigator();

const AuthStack = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  let routeName;

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch === true) {
    routeName = 'Onboarding';
  } else {
    routeName = 'LoginRegistrationScreen';
  }

  return (
    <Stack.Navigator
      initialRouteName={routeName}
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        screenOptions={{headerShown: false}}
        name="Onboarding"
        component={OnboardingScreen}
      />
      <Stack.Screen
        screenOptions={{headerShown: false}}
        name="LoginRegistrationScreen"
        component={LoginRegistrationScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
