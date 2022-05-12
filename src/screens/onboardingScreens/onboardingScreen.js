import React from 'react';
import {StyleSheet, Image} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

// COMPONENT: 3 ONBOARDING SCREENS THAT GIVE AN INTRODUCTION TO THE APPLICATION AND ITS FEATURES
// THIS SCREEN IS NAVIGATED TO ONLY IF THE USER HAS NOT LAUNCHED THE STRATEGYM APPLICATION BEFORE
// OTHERWISE THE USER IS NAVIGATED TO THE LOGIN/REG SCREEN

const OnboardingScreen = ({navigation}) => {
  return (
    <Onboarding
      onSkip={() => navigation.replace('LoginRegistrationScreen')}
      onDone={() => navigation.navigate('LoginRegistrationScreen')}
      pages={[
        {
          backgroundColor: '#E9DAC4',
          image: (
            <Image
              style={{
                height: 140,
                width: 190,
              }}
              source={require('../../assets/miscFitnessImages/LaptopHeartMonitor.png')}
            />
          ),
          title: 'Manage Your Health Profile',
          subtitle:
            'Keep track of information regarding your physical wellbeing in response to your health metrics. Use this information to examine what goal you should set for yourself or let us recommend a goal for you.',
        },
        {
          backgroundColor: '#D1B780',
          image: (
            <Image
              style={{
                height: 163,
                width: 200,
              }}
              source={require('../../assets/miscFitnessImages/HeartMonitor1.png')}
            />
          ),
          title: 'Strategise and Track Your Diet',
          subtitle:
            'Strategise your diet or generate a diet plan based on your goal, whether to lose weight, gain weight, or maintain weight. Auto-generated caloric and macronutrient intake based on the goals you set.',
        },
        {
          backgroundColor: '#D6CEC0',
          image: (
            <Image
              style={{
                height: 170,
                width: 200,
              }}
              source={require('../../assets/miscFitnessImages/FitnessTracking1.png')}
            />
          ),
          title: 'Strategise Your Fitness',
          subtitle:
            'Strategise your workout plan or generate a workout plan based on your fitness goal, whether to build muscle, build strength, or maintain muscle and strength.',
        },
      ]}
    />
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
