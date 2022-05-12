import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import AuthStack from './authStack';
import AppStack from './appStack';
import {AuthContext} from './authProvider';
import auth from '@react-native-firebase/auth';

// THIS COMPONENT DETERMINES THE ROUTE OF THE APPLICATION
// IF THE USER IS LOGGED IN, THEN THEY ARE NAVIGATED TO THE MAIN APP STACK COMPONENTS
// IF THE USER IS NOT LOGGED IN, THEN THEY ARE NAVIGATED TO THE AUTH STACK COMPONENTS -->
//(WHICH CHECKS IF ITS THE INITIAL LAUNCH OR NOT TO DETERMINE IF THEY ARE NAVIGATED TO ONBOARDING OR LOGIN SCREENS)

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#C8C8C8',
  },
};

const Routes = () => {
  const {user, setUser} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = user => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer theme={AppTheme}>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;
