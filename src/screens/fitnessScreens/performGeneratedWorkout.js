import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';

import CustomHeaderComponent from '../globalComponent/customHeaderComponent';

import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {FlatList} from 'react-native-gesture-handler';
import {Alert} from 'react-native';
import {TextInput} from 'react-native-paper';

import {openDatabase} from 'react-native-sqlite-storage';
import {showMessage, hideMessage} from 'react-native-flash-message';
import FlashMessage from 'react-native-flash-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// COMPONENT: DISPLAYS ALL THE EXERCISES ASSOCIATED WITH THE GENERATED WORKOUT THE USER'S CHOSEN TO PERFORM
// INCLUDES A TIMER TO TIME HOW LONG IT TAKES FOR THEM TO COMPLETE THE GENERATED WORKOUT
// INCLUDES INPUTS FOR WEIGHTS AND REPS SO THAT THE USER CAN LOG THEIR WORKOUT AND SO THIS DATA CAN BE USED IN OTHER COMPONENTS TO TRACK THEIR PROGRESS

const screen = Dimensions.get('window');

var db2 = openDatabase({name: 'userWorkoutHistory.db'}); //SQLITE DATABASE FOR STORING USER COMPLETED WORKOUTS

// CONFIGURING THE STOPWATCH: REFERENCE: https://thewebdev.tech/reactnative-simple-timer-app https://www.youtube.com/watch?v=zpSwD5qoVQs
const formatNumber = number => `0${number}`.slice(-2);

const getRemaining = time => {
  const mins = Math.floor(time / 60);
  const secs = time - mins * 60;
  return {mins: formatNumber(mins), secs: formatNumber(secs)};
};

const PerformGeneratedWorkout = ({route}, props) => {
  const navigation = useNavigation();

  // GET THE WORKOUT NAME FROM THE PREVIOUS SCREEN IN ORDER TO GET ITS DATA FROM THE SQLITE DATABASE TABLE:
  const generatedWorkoutName = route.params.workoutName;
  const generatedWorkoutArray = route.params.workoutArray;

  // USESTATE FOR THE USERS INPUT OF NUMBER OF REPS AND WEIGHT LIFTED
  const [repsInput, setRepsInput] = useState('');
  const [weightInput, setWeightInput] = useState('');
  // CONFIGURING THE STOPWATCH: REFERENCE: https://thewebdev.tech/reactnative-simple-timer-app https://www.youtube.com/watch?v=zpSwD5qoVQs
  const [remainingSecs, setRemainingSecs] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const {mins, secs} = getRemaining(remainingSecs);

  var toggle = () => {
    setIsActive(!isActive);
  };

  var reset = () => {
    setRemainingSecs(0);
    setIsActive(false);
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setRemainingSecs(remainingSecs => remainingSecs + 1);
      }, 1000);
    } else if (!isActive && remainingSecs !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, remainingSecs]);

  // THE NAME OF THE SQLITE TABLE THAT LOGS THE USER'S WORKOUT THAT THEY ARE PERFORMING
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();

  const tableNameDate = '_' + date + '_' + month + '_' + year;

  //USEFFECT TO CREATE A DB TABLE (IF NOT CREATED ALREADY) FOR TODAYS DATE TO LOG THE USERS CURRENT WORKOUT PERFORMANCE
  useEffect(() => {
    db2.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=" +
          "'" +
          tableNameDate +
          "'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS ' + tableNameDate, []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS ' +
                tableNameDate +
                '(exercise_id INTEGER PRIMARY KEY AUTOINCREMENT, exercise_name VARCHAR(30), exercise_reps INT(15), exercise_weight INT(15), exercise_duration INT(15))',
              [],
            );
          }
        },
      );
    });
  }, []);

  // ADD THE DATE, EXERCISE INFO, AND TIME TAKEN TO THE WORKOUT PERFORMANCE TABLE
  const InsertData = (exerciseName, reps, weight, duration) => {
    db2.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO ' +
          tableNameDate +
          ' (exercise_name, exercise_reps, exercise_weight, exercise_duration) VALUES (?,?,?,?)',
        [exerciseName, reps, weight, duration],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert('Set Added');
          } else console.log('failed....');
        },
      );
    });
  };

  // DELETE TODAY'S WORKOUT LOG PERFORMANCE TABLE IF THE USER PRESSES CANCEL:
  const deleteTable = tableNameDate => {
    db2.transaction(function (tx) {
      tx.executeSql(
        'DROP TABLE IF EXISTS ' + tableNameDate,
        [],
        (tx, results) => {
          Alert.alert('Workout Performance Cancelled');
        },
        (tx, error) => {
          alert(error);
        },
      );
    });
  };

  //ADD THE EXERCISE HISTORY TO THE EXERCISE'S OWN TABLE SO THAT THE USER CAN VIEW THEIR PROGRESS FOR SPECIFIC EXERCISES ON ANOTHER COMPONENT:
  const InsertData2 = (exerciseName, todaysDate, reps, weight) => {
    db2.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO ' +
          exerciseName +
          ' (today_date, exercise_reps, exercise_weight) VALUES (?,?,?)',
        [todaysDate, reps, weight],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('Data Inserted Successfully....');
          } else console.log('failed....');
        },
      );
    });
  };

  // FUNCTION TO CREATE THE TABLE IF IT DOES NOT ALREADY EXIST
  const createTable = exerciseName => {
    db2.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=" +
          "'" +
          exerciseName +
          "'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS ' + exerciseName, []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS ' +
                exerciseName +
                '(date_id INTEGER PRIMARY KEY AUTOINCREMENT, today_date VARCHAR(30), exercise_reps INT(15), exercise_weight INT(15))',
              [],
            );
          }
        },
      );
    });
    console.log(' SQLite Database and Table Successfully Created ${}...');
  };

  //FUNCTION TO FORMAT THE EXERCISE'S NAME SO THAT IT'S ELIGIBLE AS A SQLITE TABLE NAME:
  function getExerciseTableName(exerciseName) {
    const exerciseNameTable1 = exerciseName.toLocaleLowerCase();
    const exerciseNameTable2 = exerciseNameTable1.replace(/\s/g, '_');
    const exerciseNameTable3 = exerciseNameTable2.replace(/-/g, '_');
    return exerciseNameTable3;
  }

  // CHECK FOR VALID Reps AND WEIGHTS INPUT, OTHERWISE DISPLAY AN ERROR MESSAGE:

  const validNumberCheck = value => {
    const checkNum =
      /^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$/; //regular expression
    return checkNum.test(value);
  };

  function validateRepsWeightInput(repsInput, weightInput) {
    if (!validNumberCheck(repsInput.trim())) {
      return showMessage({
        message: 'Please Enter the Number of Reps You Performed',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }
    if (!validNumberCheck(weightInput.trim())) {
      return showMessage({
        message: 'Please Enter The Weight You Lifted',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    } else {
      return true;
    }
  }

  return (
    <View style={{backgroundColor: '#CBC3E3'}}>
      <CustomHeaderComponent pageName={generatedWorkoutName} />

      <View
        style={{
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          borderBottomColor: 'black',
          backgroundColor: '#301934',
        }}>
        <View style={{alignContent: 'center', flexDirection: 'row'}}>
          <TouchableOpacity onPress={toggle} style={styles.button}>
            <Text style={styles.buttonText}>
              {isActive ? 'Pause' : 'Start'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={reset}
            style={[styles.button, styles.buttonReset]}>
            <Text style={[styles.buttonText, styles.buttonTextReset]}>
              Reset
            </Text>
          </TouchableOpacity>
          <Text style={styles.timerText}>{`${mins}:${secs}`}</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.replace('Completed Generated Workout Overview', {
                generatedWorkoutName: generatedWorkoutName,
                generatedWorkoutArray: generatedWorkoutArray,
              });
            }}
            style={[styles.button, styles.buttonReset]}>
            <Text style={[styles.buttonText, styles.buttonTextReset]}>
              Finish
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              deleteTable(tableNameDate);
              navigation.replace('Begin Workout');
            }}
            style={[styles.button, styles.buttonReset]}>
            <Text style={[styles.buttonText, styles.buttonTextReset]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          height: '85%',
          backgroundColor: '#171717',
          borderColor: '#CBC3E3',
          padding: 10,
          marginTop: 0.5,
          borderBottomWidth: 2,
          borderTopWidth: 1,
        }}>
        <FlatList
          data={generatedWorkoutArray}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{alignContent: 'center', height:  1000}}
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
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  flexGrow: 1,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#CBC3E3',
                    marginBottom: 5,
                    marginTop: 5,
                  }}>
                  {item.Exercise}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Text style={{fontSize: 12, marginBottom: 5, color: '#CBC3E3'}}>
                  Target Sets: {item.Sets} | Target Reps: {item.Reps} | Previous
                  Record: {}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  flexGrow: 1,
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    color: 'white',
                    marginTop: 8,
                    marginRight: 5,
                    fontSize: 20,
                  }}>
                  Sets:{' '}
                </Text>
                <TextInput
                  placeholder="Reps"
                  onChangeText={repsInput => setRepsInput(repsInput)}
                  defaultValue={repsInput}
                  style={{
                    width: '20%',
                    height: 40,
                    marginBottom: 5,

                    fontSize: 15,
                    mode: 'outlined',
                  }}
                />
                <TextInput
                  placeholder="Weight"
                  onChangeText={weightInput => setWeightInput(weightInput)}
                  defaultValue={weightInput}
                  style={{
                    width: '20%',
                    height: 40,
                    marginBottom: 5,
                    marginLeft: 10,
                    fontSize: 15,
                    mode: 'outlined',
                  }}
                />
                <TouchableOpacity
                  style={{marginLeft: 10}}
                  onPress={() => {
                    if (validateRepsWeightInput(repsInput, weightInput)) {
                      createTable(getExerciseTableName(item.Exercise));
                      InsertData2(
                        getExerciseTableName(item.Exercise),
                        tableNameDate,
                        String(repsInput),
                        String(weightInput),
                      );
                      InsertData(
                        item.Exercise,
                        String(repsInput),
                        String(weightInput),
                        String(remainingSecs),
                      );
                    }
                  }}>
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    color="green"
                    size={35}
                  />
                </TouchableOpacity>
              </View>
              <View></View>
            </View>
          )}
        />
        
      </View>
      <FlashMessage position="top" />
    </View>
  );
};
export default PerformGeneratedWorkout;

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: '#B9AAFF',
    width: screen.width / 8,
    height: screen.width / 8,
    borderRadius: screen.width / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B1212',
    marginRight: 8,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 12,
  },
  buttonText: {
    fontSize: 12,
    color: '#CBC3E3',
  },
  timerText: {
    color: '#CBC3E3',
    fontSize: 27,
    marginBottom: 5,
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  buttonReset: {
    marginLeft: 10,

    borderColor: '#CBC3E3',
    marginBottom: 10,
    marginTop: 10,
  },
  buttonTextReset: {
    color: '#CBC3E3',
  },
});

// NEW SCREEN SETUP AFTER CREATING THIS FILE FOR THE NEW SCREEN:
// 4. OPEN THE APPSTACK FILE --> ADD THIS FILE AS AN IMPORT --> ADD THIS SCREEN AS ANOTHER <STACKSCREEN> COMPONENT
// 5. OPEN THE FILE OF THE SCREEN THAT NAVIGATES TO THIS ONE --> ADD THE OnPress function as navigate.replace.
// 6. TEST THE ON PRESS FUNCTION TO MAKE SURE IT WORKS
// 7. Uncomment Either the CustomeHeaderComponentWithBack OR the CustomerHeaderComponent
// 8. SET THE PAGE NAME AND (IF APPLICABLE) THE BackNavScreen PROP FOR THE UNCOMMENTED HEADER COMPONENT.
