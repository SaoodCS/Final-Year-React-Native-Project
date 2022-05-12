import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ScrollView, Alert, Dimensions,} from 'react-native';

import ContainerForProfileTabs from '../profileScreens/components/containerForProfileTabs';

import {openDatabase} from 'react-native-sqlite-storage';

import {useNavigation} from '@react-navigation/native';
import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput} from 'react-native-paper';
import {Button} from 'react-native-paper';
import {showMessage, hideMessage} from 'react-native-flash-message';
import FlashMessage from 'react-native-flash-message';
import {TouchableOpacity} from 'react-native-gesture-handler';

// COMPONENT: DISPLAYS AN INPUT FORM FOR THE USER TO CREATE A NEW EXERCISE TO INCLUDE IN THEIR CREATED WORKOUT

// SQLITE DATABASE THAT STORES THE USER'S CREATED EXERCISES
var db = openDatabase({name: 'userExercises.db'});

// SQLITE DATABASE THAT STORES THE USER'S CREATED WORKOUT
var db2 = openDatabase({name: 'userWorkouts.db'});

const CreateExercises = ({route}, props) => {
  // GETTING THE NAME OF THE WORKOUT THAT THE USER PASSED ALONG WITH THE NAME OF THE WORKOUT TABLE TO INSERT INTO THE SQLITE DATABASE
  const workoutNamePassed = route.params.workoutdbTableName;
  const actualWorkoutName = route.params.workoutActualName;

  const navigation = useNavigation();

  //USESTATE FOR THE TEXTINPUTS OF THE USERS CREATED EXERCISE
  const [createdExercise, setCreatedExercise] = useState({
    exerciseName: '',
    muscleGroup: '',
    type: '',
    equipment: '',
    sets: '',
    reps: '',
  });

  // USEEFFECT TO CREATE THE USER EXERCISES TABLE IF IT DOWS NOT ALREADY EXIST (WHERE THE EXERCISE WILL BE STORED)
  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='user_exercises'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS user_exercises', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS user_exercises(exercise_id INTEGER PRIMARY KEY AUTOINCREMENT, exercise_name VARCHAR(30), exercise_musclegroup VARCHAR(30), exercise_type VARCHAR(30), exercise_equipment VARCHAR(30))',
              [],
            );
          }
        },
      );
    });
  }, []);

  // USEEFFECT TO CREATE THE USER CREATED WORKOUT TABLE IF IT DOWS NOT ALREADY EXIST (WHERE THE EXERCISE WILL BE ADDED TO)
  useEffect(() => {
    db2.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=" +
          "'" +
          workoutNamePassed +
          "'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS ' + workoutNamePassed, []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS ' +
                workoutNamePassed +
                '(exercise_id INTEGER PRIMARY KEY AUTOINCREMENT, exercise_name VARCHAR(30), exercise_musclegroup VARCHAR(30), exercise_type VARCHAR(30), exercise_equipment VARCHAR(30), exercise_sets INT(15), exercise_reps INT(15))',
              [],
            );
          }
        },
      );
    });
  }, []);

  // FUNCTION FOR INSERTING THE CREATED EXERCISE IN THE USER_EXERCISES SQLITE TABLE THAT INCLUDES ALL THE USER'S CREATED EXERCISES
  const InsertData = (exerciseName, muscleGroup, type, equipment) => {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO user_exercises (exercise_name, exercise_musclegroup, exercise_type, exercise_equipment) VALUES (?,?,?,?)',
        [exerciseName, muscleGroup, type, equipment],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          console.log(results);
          if (results.rowsAffected > 0) {
            Alert.alert('Exercise Created And Saved To Workout');
          } else console.log('failed....');
        },
      );
    });
  };

  const {exerciseName, muscleGroup, type, equipment, sets, reps} =
    createdExercise;

  // HANDLING THE TEXT INPUTS SO THAT THEY ARE ASSOCIATED WITH THE INITIALISED VARIABLES
  const handleOnChangeText = (value, fieldName) => {
    setCreatedExercise({...createdExercise, [fieldName]: value});
  };

  // FUNCTION TO VALIDATE THE USER'S EXERCISE FORM AND ENSURE THAT THEY HAVE FILLED IN THE EXERCISE FORM CORRECTLY. IF NOT, THE ASSOCIATED ERROR MESSAGE WILL DISPLAY ON SCREEN
  const validExerciseForm = () => {
    if (exerciseName.trim() == '') {
      return showMessage({
        message: 'Please Enter An Exercise Name',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }
    if (muscleGroup.trim() == '') {
      return showMessage({
        message: 'Please Choose the Muscle Group For Your Exercise',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }

    if (type.trim() === '') {
      return showMessage({
        message: 'Please Choose the Type for Your Exercise',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }
    if (equipment.trim() == '') {
      return showMessage({
        message: 'Please Choose The Equipment For Your Exercise',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    } else {
      return true;
    }
  };

  // INSERT CREATED EXERCISE INTO THE CREATED WORKOUT TABLE FUNCTION:
  const InsertData2 = (
    exerciseName,
    muscleGroup,
    type,
    equipment,
    setsInput,
    repsInput,
  ) => {
    db2.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO ' +
          workoutNamePassed +
          ' (exercise_name, exercise_musclegroup, exercise_type, exercise_equipment, exercise_sets, exercise_reps) VALUES (?,?,?,?,?,?)',
        [exerciseName, muscleGroup, type, equipment, setsInput, repsInput],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('Data Inserted Successfully....');
          } else console.log('failed....');
        },
      );
    });
  };




   // USEREF HOOK TO NAVIGATE TO THE NEXT TEXTINPUT ON KEYBOARD PRESSING ENTER 


  
   const targetRepsRef = useRef();



  return (
    <View style= {{backgroundColor: '#CBC3E3', flexGrow: 1,}}>
      <View
        style={{
          flexDirection: 'row',
          padding: 5,
          borderBottomWidth: 1,
          borderBottomColor: 'grey',
          backgroundColor: '#CBC3E3',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            padding: 5,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.replace('Search Exercises', {
                workoutNamePassed: workoutNamePassed,
                actualWorkoutName: actualWorkoutName,
              });
            }}>
            <MaterialCommunityIcons
              name="arrow-left"
              color="black"
              size={30}></MaterialCommunityIcons>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            padding: 5,
          }}>
          <Text style={{fontSize: 20, color: 'black'}}>
            Create Exercise for {actualWorkoutName}
          </Text>
        </View>
      </View>

    

      <ScrollView 
        style={{
          //backgroundColor: '#1B1212',
 
       
          flexGrow: 1, marginBottom: 60,
          alignSelf: 'center',
        }}>
        <ContainerForProfileTabs>
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
              label="Exercise Name"
              value={exerciseName}
              onChangeText={value => handleOnChangeText(value, 'exerciseName')}
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
            style={{
              backgroundColor: '#301934',
              borderWidth: 2,
              borderRadius: 4,
              marginBottom: 20,
              marginTop: 12,
              width: 350,
              marginLeft: 1,
              borderColor: '#CBC3E3',
              alignSelf: 'center',
              height: 66,
            }}>
            <RNPickerSelect
              placeholder={{
                label: 'Select a Muscle Group',
                value: null,
              }}
              value={muscleGroup}
              onValueChange={value => handleOnChangeText(value, 'muscleGroup')}
              style={{
                inputAndroid: {color: 'white'},
                placeholder: {
                  color: 'white',
                },
              }}
              itemTextStyle={{fontSize: 15}}
              activeItemTextStyle={{fontSize: 18, fontWeight: 'bold'}}
              items={[
                {
                  label: 'Shoulders',
                  value: 'Shoulders',
                },
                {
                  label: 'Chest',
                  value: 'Chest',
                },
                {
                  label: 'Back',
                  value: 'Back',
                },
                {
                  label: 'Abs',
                  value: 'Abs',
                },
                {
                  label: 'Legs',
                  value: 'Legs',
                },
                {
                  label: 'Biceps',
                  value: 'Biceps',
                },
                {
                  label: 'Triceps',
                  value: 'Triceps',
                },
                {
                  label: 'Full Body (Cardio)',
                  value: 'fullBody',
                },
              ]}
            />
          </View>

          <View
            style={{
              backgroundColor: '#301934',
              borderWidth: 2,
              borderRadius: 4,
              marginBottom: 20,
              width: 350,
              marginLeft: 1,
              borderColor: '#CBC3E3',
              alignSelf: 'center',
              height: 66,
            }}>
            <RNPickerSelect
              placeholder={{
                label: 'Select an Exercise Type',
                value: null,
              }}
              value={type}
              onValueChange={value => handleOnChangeText(value, 'type')}
              style={{
                inputAndroid: {color: 'white'},
                placeholder: {
                  color: 'white',
                },
              }}
              itemTextStyle={{fontSize: 15}}
              activeItemTextStyle={{fontSize: 18, fontWeight: 'bold'}}
              items={[
                {
                  label: 'Cardio',
                  value: 'Cardio',
                },
                {
                  label: 'Weighted',
                  value: 'Weighted',
                },
                {
                  label: 'Bodyweight',
                  value: 'Bodyweight',
                },
              ]}
            />
          </View>
          <View
            style={{
              backgroundColor: '#301934',
              borderWidth: 2,
              borderRadius: 4,
              marginBottom: 20,
              width: 350,
              marginLeft: 1,
              borderColor: '#CBC3E3',
              alignSelf: 'center',
              height: 66,
            }}>
            <RNPickerSelect
              placeholder={{
                label: 'Select The Equipment',
                value: null,
              }}
              value={equipment}
              onValueChange={value => handleOnChangeText(value, 'equipment')}
              style={{
                inputAndroid: {color: 'white'},
                placeholder: {
                  color: 'white',
                },
              }}
              itemTextStyle={{fontSize: 15}}
              activeItemTextStyle={{fontSize: 18, fontWeight: 'bold'}}
              items={[
                {
                  label: 'Machine',
                  value: 'Machine',
                },
                {
                  label: 'Dumbbell',
                  value: 'Dumbbell',
                },
                {
                  label: 'Floor Mat',
                  value: 'Floor Mat',
                },
                {
                  label: 'Barbell',
                  value: 'Barbell',
                },
              ]}
            />
          </View>

          <View
            style={{
              backgroundColor: '#301934',
              borderWidth: 2,
              borderRadius: 4,
              marginBottom: 10,
              width: 350,
              borderColor: '#CBC3E3',
              alignSelf: 'center',
              marginTop:2,
            }}>
            <TextInput
              label="Target Sets"
              value={sets}
              returnKeyType="next"
              onSubmitEditing={() => {
                targetRepsRef.current.focus();
              }}
              onChangeText={value => handleOnChangeText(value, 'sets')}
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
            style={{
              backgroundColor: '#301934',
              borderWidth: 2,
              borderRadius: 4,
              marginBottom: 25,
              width: 350,
              borderColor: '#CBC3E3',
              alignSelf: 'center',
              marginTop: 13,
            }}>
            <TextInput
              label="Target Reps"
              value={reps}
              ref={targetRepsRef}
              onChangeText={value => handleOnChangeText(value, 'reps')}
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

          <Button
            mode="contained"
            color="white"
            labelStyle={{color: '#CBC3E3', fontSize: 15}}
            style={{
              backgroundColor: '#1B1212',
              borderWidth: 2,
              marginBottom: 30,
              width: 250,
              marginTop: 10,
              borderColor: '#CBC3E3',
              alignSelf: 'center',
              textAlign: 'center',
              height: 55,
              borderRadius: 40,
              fontStyle: 'bold',
            }}
            contentStyle={{marginTop: 7}}
            onPress={() => {
              if (validExerciseForm()) {
                InsertData(
                  createdExercise.exerciseName.trim(),
                  createdExercise.muscleGroup.trim(),
                  createdExercise.type.trim(),
                  createdExercise.equipment.trim(),
                );

                InsertData2(
                  createdExercise.exerciseName.trim(),
                  createdExercise.muscleGroup.trim(),
                  createdExercise.type.trim(),
                  createdExercise.equipment.trim(),
                  createdExercise.sets.trim(),
                  createdExercise.reps.trim(),
                );
                // BOTH THE INSERT FUNCTIONS ABOVE HAVE BEEN TESTED AND WORK CORRECTLY!

                navigation.replace('Search Exercises', {
                  workoutNamePassed: workoutNamePassed,
                  actualWorkoutName: actualWorkoutName,
                });
              }
            }}>
            Save Exercise
          </Button>
        </ContainerForProfileTabs>
      </ScrollView>
      <FlashMessage position="top" />
    </View>
  );
};
export default CreateExercises;
