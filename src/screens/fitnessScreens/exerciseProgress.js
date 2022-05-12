import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Dimensions, Image} from 'react-native';

import CustomHeaderWithBack from '../globalComponent/customerHeaderWithBack';

import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';

// COMPONENT: NAVIGATION SCREEN THAT ALLOWS THE USER TO PRESS ON DIFFERENT MUSCLE GROUPS TO SEARCH FOR THEIR EXERCISES AND TO DISPLAY THE PROGRESS MADE ON THAT EXERCISE ON ANOTHER COMPONENT.

const ExerciseProgress = ({route}, props) => {
  const navigation = useNavigation();

  return (
    <View style = {{backgroundColor: '#cbc3e3'}}>
      <CustomHeaderWithBack
        pageName="Search Exercise Progress"
        backNavScreen="Fitness Home"
      />

      <ScrollView>
        <View
          style={{
            marginTop: 20,
            borderBottomWidth: 1,

            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.replace('Shoulders Progress');
            }}>
            <Text
              style={{
                fontSize: 30,
                alignItems: 'center',
                textAlign: 'center',
                color: 'black',
              }}>
              Shoulders
            </Text>
            <Image
              source={require('./MuscleImages/Shoulders.png')}
              style={{width: 300, height: 300}}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 20,
            borderBottomWidth: 1,
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.replace('Back Progress');
            }}>
            <Text
              style={{
                fontSize: 30,
                alignItems: 'center',
                textAlign: 'center',
                color: 'black',
              }}>
              Back
            </Text>
            <Image
              source={require('./MuscleImages/Back.png')}
              style={{width: 300, height: 300}}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 20,
            borderBottomWidth: 1,
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.replace('Chest Progress');
            }}>
            <Text
              style={{
                fontSize: 30,
                alignItems: 'center',
                textAlign: 'center',
                color: 'black',
              }}>
              Chest
            </Text>
            <Image
              source={require('./MuscleImages/Chest.png')}
              style={{width: 300, height: 300}}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 20,
            borderBottomWidth: 1,
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.replace('Triceps Progress');
            }}>
            <Text
              style={{
                fontSize: 30,
                alignItems: 'center',
                textAlign: 'center',
                color: 'black',
              }}>
              Triceps
            </Text>
            <Image
              source={require('./MuscleImages/Triceps.png')}
              style={{width: 300, height: 300}}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 20,
            borderBottomWidth: 1,
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.replace('Bicep Progress');
            }}>
            <Text
              style={{
                fontSize: 30,
                alignItems: 'center',
                textAlign: 'center',
                color: 'black',
              }}>
              Biceps
            </Text>
            <Image
              source={require('./MuscleImages/Biceps.png')}
              style={{width: 300, height: 300}}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 20,
            borderBottomWidth: 1,
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.replace('Legs Progress');
            }}>
            <Text
              style={{
                fontSize: 30,
                alignItems: 'center',
                textAlign: 'center',
                color: 'black',
              }}>
              Legs
            </Text>
            <Image
              source={require('./MuscleImages/Legs.png')}
              style={{width: 300, height: 300}}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 20,
            borderBottomWidth: 1,
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.replace('Abs Progress');
            }}>
            <Text
              style={{
                fontSize: 30,
                alignItems: 'center',
                textAlign: 'center',
                color: 'black',
              }}>
              Abs
            </Text>
            <Image
              source={require('./MuscleImages/Abs.png')}
              style={{width: 300, height: 300}}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 20,
            borderBottomWidth: 1,
            marginBottom: 30,
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.replace('Cardio Progress');
            }}>
            <Text
              style={{
                fontSize: 30,
                alignItems: 'center',
                textAlign: 'center',
                color: 'black',
              }}>
              Cardio
            </Text>
            <Image
              source={require('./MuscleImages/Cardio.png')}
              style={{width: 300, height: 300}}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
export default ExerciseProgress;
