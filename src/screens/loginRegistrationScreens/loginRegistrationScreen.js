import React, {useRef} from 'react';

import {ScrollView, StyleSheet, View, Dimensions, Animated} from 'react-native';

import LoginForm from './components/loginForm';
import LoginRegBtns from './components/loginRegBtns';
import LoginRegFormHeader from './components/loginRegFormHeader';
import RegistrationForm from './components/registrationForm';

// COMPONENT: THE LOGIN/REGISTRATION SCREEN WHERE THE USER EITHER LOGS IN OR REGISTERS TO THE APP.
// THIS SCREEN IS NAVIGATED TO IF THE USER IS NOT ALREADY LOGGED IN

const {width} = Dimensions.get('window');

export default function LoginRegistration() {
  // ANIMATION: SCROLL RIGHT TO GO TO THE SIGN UP FORM AND SCROLL LEFT TO GO TO THE SIGN IN FORM
  const animation = useRef(new Animated.Value(0)).current;
  const scrollView = useRef();

  const loginColorAnimation = animation.interpolate({
    inputRange: [0, width],
    outputRange: ['#301934', '#171717'],
  });

  const registrationColorAnimation = animation.interpolate({
    inputRange: [0, width],
    outputRange: ['#171717', '#301934'],
  });

  return (
    <View style={{backgroundColor: '#CBC3E3', flex: 1, paddingTop: 60}}>
      <View style={{height: 190}}>
        <LoginRegFormHeader />
      </View>
      <View
        style={{flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20}}>
        <LoginRegBtns
          backgroundColor={loginColorAnimation}
          title="Login"
          onPress={() => scrollView.current.scrollTo({x: 0})}
        />
        <LoginRegBtns
          backgroundColor={registrationColorAnimation}
          title="Sign Up"
          onPress={() => scrollView.current.scrollTo({x: width})}
        />
      </View>
      <ScrollView
        ref={scrollView}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: animation}}}],
          {useNativeDriver: false},
        )}>
        <LoginForm />
        <ScrollView>
          <RegistrationForm />
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
});
