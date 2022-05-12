import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';

import CustomHeaderWithBack from '../globalComponent/customerHeaderWithBack';

import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {TextInput} from 'react-native-paper';

import {showMessage, hideMessage} from 'react-native-flash-message';
import FlashMessage from 'react-native-flash-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// COMPONENT: DISPLAYS TEXTINPUT FOR INSERTING A WORKOUT NAME THE USER WOULD LIKE TO CREATE AND A PRESSABLE TILE FOR THE USER TO SEARCH EXERCISES TO INCLUDE

const CreateWorkout = props => {
  const navigation = useNavigation();

  // USESTATE FOR THE INPUTTED WORKOUT NAME
  const [createdWorkout, setCreatedWorkout] = useState({
    workoutName: '',
  });

  const {workoutName} = createdWorkout;

  // FOR THE TEXTINPUT COMPONENT SO THAT IT ASSOCIATES WITH THE CREATEDWORKOUT STATE VARIABLE
  const handleOnChangeText = (value, fieldName) => {
    setCreatedWorkout({...createdWorkout, [fieldName]: value});
  };

  // FUNCTION TO MAKE THE INPUTTED WORKOUT NAME ELIGIBLE AS AN SQLITE DATABASE TABLE NAME
  function getWorkoutTableName(workoutName) {
    const workoutNameTable1 = workoutName.toLocaleLowerCase();
    const workoutNameTable2 = workoutNameTable1.replace(/\s/g, '_');
    return workoutNameTable2;
  }

  // FUNCTION TO ENSURE THAT THE USER HAS INPUTTED A WORKOUT NAME BEFORE CREATING A WORKOUT. IF NOT THEN THE USER IS INFORMED TO DO SO VIA AN ERROR MSG.
  function workoutNameValidation(workoutNameInput) {
    if (workoutNameInput.trim() == '') {
      return showMessage({
        message: 'Please Enter a Name For Your Workout',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    } else {
      return true;
    }
  }

  return (
    <View>
      <CustomHeaderWithBack
        pageName="Create Workout"
        backNavScreen="Fitness Home"
      />

      <View
        style={{
          backgroundColor: '#171717',
          height: '100%',
          alignItems: 'center',
        }}>
        <MaterialCommunityIcons
          name="run-fast"
          color="#CBC3E3"
          size={180}
          style={{marginTop: 80}}
        />

        <View
          style={{
            backgroundColor: '#301934',
            borderWidth: 2,
            borderRadius: 4,
            marginBottom: 10,
            width: 350,
            borderColor: '#CBC3E3',
            alignSelf: 'center',
            marginTop: 20,
          }}>
          <TextInput
            label="Workout Name"
            value={workoutName}
            onChangeText={value => handleOnChangeText(value, 'workoutName')}
            backgroundColor="#301934"
            color="white"
            mode="flat"
            style={{
              underlineColor: 'white',
            }}
            theme={{
              colors: {text: 'white', placeholder: 'white', primary: 'white'},
            }}
          />
        </View>

        <View
          style={{flexDirection: 'row', justifyContent: 'center', padding: 25}}>
          <TouchableOpacity
            style={{}}
            onPress={() => {
              if (workoutNameValidation(createdWorkout.workoutName)) {
                const workoutTableName = getWorkoutTableName(
                  createdWorkout.workoutName,
                );

                navigation.replace('Search Exercises', {
                  workoutNamePassed: workoutTableName,
                  actualWorkoutName: workoutName,
                });
              }
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
                Search Exercises
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <FlashMessage position="top" />
    </View>
  );
};
export default CreateWorkout;
