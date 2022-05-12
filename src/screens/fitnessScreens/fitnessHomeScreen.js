import React, {useContext, useState, useEffect} from 'react';
import {View, Text} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import CustomHeaderComponent from '../globalComponent/customHeaderComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



// COMPONENT: FITNESS SECTION HOME SCREEN DISPLAYING TOUCHABLE TILES THAT THE USER CAN PRESS ON TO NAVIGATE AROUND THE FITNESS HOME SECTION

const FitnessHomeScreen = () => {

  const navigation = useNavigation();

  return (
    <View style={{backgroundColor: '#cbc3e3', height: '100%'}}>
      <CustomHeaderComponent pageName="Fitness Home" />
    

      <View style={{alignItems: 'center'}}>
        <MaterialCommunityIcons
          name="weight-lifter"
          color="#171717"
          size={250}
        />
      </View>
      <View
        style={{flexDirection: 'row', justifyContent: 'center', padding: 25}}>
        <TouchableOpacity
          style={{}}
          onPress={() => {
            navigation.replace('Create Workout');
          }}>
          <View
            style={{
              backgroundColor: '#301934',
              justifyContent: 'center',
              alignItems: 'center',
              height: 140,
              width: 140,
              padding: 10,
              borderWidth: 1,
              borderColor: '#CBC3E3',
              elevation: 400,
              borderRadius: 20,
            }}>
            <Text
              style={{
                fontSize: 20,
                alignItems: 'center',
                textAlign: 'center',
                color: '#E6E6FA',
              }}>
              Create Workout
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{}}
          onPress={() => {
            navigation.replace('Begin Workout');
          }}>
          <View
            style={{
              backgroundColor: '#301934',
              justifyContent: 'center',
              alignItems: 'center',
              height: 140,
              width: 140,
              padding: 10,
              borderWidth: 1,
              borderColor: '#CBC3E3',
              elevation: 400,
              borderRadius: 20,
              marginLeft: 50,
            }}>
            <Text
              style={{
                fontSize: 20,
                alignItems: 'center',
                textAlign: 'center',
                color: '#E6E6FA',
              }}>
              Begin Workouts
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          padding: 25,
        }}>
        <TouchableOpacity
          style={{}}
          onPress={() => navigation.replace('View Progress')}>
          <View
            style={{
              backgroundColor: '#301934',
              justifyContent: 'center',
              alignItems: 'center',
              height: 140,
              width: 140,
              padding: 10,
              borderWidth: 1,
              borderColor: '#CBC3E3',
              elevation: 400,
              borderRadius: 20,
            }}>
            <Text
              style={{
                fontSize: 20,
                alignItems: 'center',
                textAlign: 'center',
                color: '#E6E6FA',
              }}>
              View Workout Progress
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{}}
          onPress={() => {
            navigation.replace('Exercise Progress');
          }}>
          <View
            style={{
              backgroundColor: '#301934',
              justifyContent: 'center',
              alignItems: 'center',
              height: 140,
              width: 140,
              padding: 10,
              borderWidth: 1,
              borderColor: '#CBC3E3',
              elevation: 400,
              borderRadius: 20,
              marginLeft: 50,
            }}>
            <Text
              style={{
                fontSize: 20,
                alignItems: 'center',
                textAlign: 'center',
                color: '#E6E6FA',
              }}>
              View Exercise Progress
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FitnessHomeScreen;
