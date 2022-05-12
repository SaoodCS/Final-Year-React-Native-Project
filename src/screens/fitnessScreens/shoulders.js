import React, {useState, useEffect} from 'react';
import {View, Text, Dimensions} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {FlatList} from 'react-native-gesture-handler';
import {Alert} from 'react-native';
import {TextInput} from 'react-native-paper';

import {openDatabase} from 'react-native-sqlite-storage';
import {showMessage, hideMessage} from 'react-native-flash-message';
import FlashMessage from 'react-native-flash-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// COMPONENT: DISPLAYS BOTH THE DEFAULT SHOULDERS EXERCISES AND USER-CREATED SHOULDERS EXERCISES IN ONE FLATLIST FOR THE USER TO ADD TO THE WORKOUT THEY ARE CREATING:

// DB TO GET USER CREATED EXERCISES
var db = openDatabase({name: 'userExercises.db'});

// DB TO INSERT THE CHOSEN EXERCISES INTO THE CREATED WORKOUT TABLE
var db2 = openDatabase({name: 'userWorkouts.db'});

const Shoulders = ({route}, props) => {
  const navigation = useNavigation();
  //USESTATES FOR THE USERS SETS AND REPS INPUTS:
  const [setsInput, setSetsInput] = useState('');
  const [repsInput, setRepsInput] = useState('');
  let [savedExflatListItems, setSavedExFlatListItems] = useState([]);
  // DB TO GET AND DISPLAY THE DEFAULT EXERCISES FROM THE JSON FILE IN-APP
  const exercisesdb = require('./exercisesDatabase.json');
  // THE TABLE AND REAL NAME OF THE WORKOUT THE USER IS CREATING, PASSED AS A PROP FROM THE SEARCH EXERCISES COMPONENT:
  const workoutNamePassed = route.params.workoutdbTableName;
  const actualWorkoutName = route.params.workoutActualName;

  // USEEFFECT TO GET THE SPECIFIC USER-CREATED MUSCLE GROUP EXERCISES FROM THE SQLITE DB
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM user_exercises WHERE exercise_musclegroup = "Shoulders"',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setSavedExFlatListItems(temp);
        },
      );
    });
  }, []);

  // USEEFFECT TO CREATE A TABLE FOR THE WORKOUT WHERE THE EXERCISES WILL BE INSERTED IF IT DOES NOT ALREADY EXIST:
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

  // FUNC TO VALIDATE THAT THE USER HAS INSERTED A NUMBER FOR THEIR SETS AND REPS INPUT:
  const validNumberCheck = value => {
    const checkAge =
      /^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$/; //regular expression
    return checkAge.test(value);
  };

  // FUNCTION TO FILTER OUT ALL OTHER EXERCISES IN THE DEFAULT EXERCISES JSON FILE EXCEPT FOR THE SPECIFIC COMPONENT'S EXERCISE TO DISPLAY ON THE SCREEN
  function filterOutRows(database) {
    const result = database.filter(item => item.MuscleGroup != 'Chest');
    const result2 = result.filter(item => item.MuscleGroup != 'Biceps');
    const result3 = result2.filter(item => item.MuscleGroup != 'Back');
    const result4 = result3.filter(item => item.MuscleGroup != 'Abs');
    const result5 = result4.filter(item => item.MuscleGroup != 'Triceps');
    const result6 = result5.filter(item => item.MuscleGroup != 'Legs');
    const result7 = result6.filter(item => item.MuscleGroup != 'Full Body');
    return result7;
  }

  const shoulderExercises = filterOutRows(exercisesdb);

  // FUNCTION TO CHANGE THE LABEL OF THE USER'S SAVED MUSCLEGROUP EXERCISES SO THAT THEY MATCH THE JSON LABELS AND CAN BE CONCATENATED WITH THE DEFAULT MUSCLEGROUP EXERCISES:
  const changeLabels = savedExflatListItems.map(function (row) {
    return {
      Exercise: row.exercise_name,
      MuscleGroup: row.exercise_musclegroup,
      Type: row.exercise_type,
      Equipment: row.exercise_equipment,
    };
  });

  const concatDefaultNSavedExercises = shoulderExercises.concat(changeLabels);

  // FUNCTION FOR INSERTING THE EXERCISE INTO THE SQLITE DB CREATED WORKOUT TABLE:
  const InsertData = (
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
            alert('Exercise Has Been Added To The Workout');
          } else console.log('failed....');
        },
      );
    });
  };

  // FUNCTION FOR ENSURING THAT THE USER INPUTS A NUMBER FOR REPS AND SETS, OTHERWISE IT DISPLAYS AN ERROR MESSAGE TELLING THE USER THEY HAVE TO DO SO:
  function setsAndRepsValidation(setsInput, repsInput) {
    if (!validNumberCheck(setsInput.trim())) {
      return showMessage({
        message: 'Please Enter a Valid Number of Sets',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }

    if (!validNumberCheck(repsInput.trim())) {
      return showMessage({
        message: 'Please Enter a Valid Number of Reps',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    } else {
      return true;
    }
  }

  // MAIN RETURN:
  return (
    <View>
      <View>
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
              Add Shoulder Exercises For: {actualWorkoutName}
            </Text>
          </View>
        </View>

        <View
          style={{
            height: '100%',
            backgroundColor: '#171717',
            borderColor: '#CBC3E3',
            padding: 10,
            marginTop: 0.5,
            borderBottomWidth: 2,
            borderTopWidth: 1,
          }}>
          <FlatList
            data={concatDefaultNSavedExercises}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{alignContent: 'center'}}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  width: '100%',
                  backgroundColor: '#CBC3E3',
                  alignContent: 'center',
                  alignItems: 'center',
                }}
              />
            )}
            renderItem={({item}) => (
              <View
                style={{
                  width: '100%',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#CBC3E3',

                    marginTop: 5,
                  }}>
                  {item.Exercise}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: '#CBC3E3',
                    marginBottom: 10,
                    marginTop: 10,
                  }}>
                  {' '}
                  Type: {item.Type} | Equipment: {item.Equipment}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 10,
                  }}>
                  <TextInput
                    placeholder="Target Sets"
                    onChangeText={setsInput => setSetsInput(setsInput)}
                    defaultValue={setsInput}
                    backgroundColor="#301934"
                    style={{
                      width: '28%',
                      height: 40,
                      marginBottom: 5,
                      marginRight: 10,
                      fontSize: 15,
                      mode: 'Contained',
                    }}
                    theme={{
                      colors: {
                        text: 'white',
                        placeholder: 'white',
                        primary: 'white',
                      },
                    }}
                  />

                  <TextInput
                    placeholder="Target Reps"
                    onChangeText={repsInput => setRepsInput(repsInput)}
                    defaultValue={repsInput}
                    backgroundColor="#301934"
                    style={{
                      width: '28%',
                      height: 40,
                      marginBottom: 5,
                      fontSize: 15,
                      mode: 'contained',
                    }}
                    theme={{
                      colors: {
                        text: 'white',
                        placeholder: 'white',
                        primary: 'white',
                      },
                    }}
                  />

                  <TouchableOpacity
                    style={{marginLeft: 10}}
                    onPress={() => {
                      if (setsAndRepsValidation(setsInput, repsInput)) {
                        Alert.alert(
                          'Add ' +
                            item.Exercise +
                            'To ' +
                            actualWorkoutName +
                            '?',
                          ' Sets: ' + setsInput + ' Reps: ' + repsInput,
                          [
                            {
                              text: 'OK',
                              onPress: () => {
                                InsertData(
                                  item.Exercise,
                                  item.MuscleGroup,
                                  item.Type,
                                  item.Equipment,
                                  setsInput,
                                  repsInput,
                                );
                              },
                            },
                          ],
                        );
                      }
                    }}>
                    <MaterialCommunityIcons
                      name="folder-plus-outline"
                      color="green"
                      size={35}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </View>
      <FlashMessage position="top" />
    </View>
  );
};
export default Shoulders;
