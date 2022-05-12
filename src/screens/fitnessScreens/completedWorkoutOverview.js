import React, {useState, useEffect} from 'react';
import {View, Text, Dimensions, StyleSheet,
  ActivityIndicator} from 'react-native';

import CustomHeaderComponent from '../globalComponent/customHeaderComponent';

import {useNavigation} from '@react-navigation/native';

import {FlatList} from 'react-native-gesture-handler';
import {Alert} from 'react-native';

import {Button, Searchbar} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// COMPONENT: FOLLOWS FROM THE PERFORM WORKOUT COMPONENT, DISPLAYS AN OVERVIEW OF THE EXERCISES, WEIGHTS, AND REPS THAT THE USER HAS COMPLETED IN THE WORKOUT THEY CREATED AND PERFORMED.

const windowHeight = Dimensions.get('window').height;

// SQLITE DATABASE FOR READING AND WRITING THE DATA OF THE WORKOUT THE USER HAS COMPLETED.
var db = openDatabase({name: 'userWorkoutHistory.db'});

// SQLITE DATABASE CONTAINING THE USER'S WORKOUTS -- THIS IS TO GET THE TARGET SETS AND REPS THE USER SET FOR THE EXERCISE IN THEIR CREATED WORKOUT PLAN
var db2 = openDatabase({name: 'userWorkouts.db'});

const CompletedWorkoutOveriview = ({route}, props) => {

      // USESTATE AND USEFFECT USED HERE FOR THE ACTIVITYINDICATOR COMPONENT TO DISPLAY A LOADING ICON FOR A SHORT PERIOD WHILST BACKEND GETS DATA TO IMRPOVE USER EXPERIENCE
      const [loading, setLoading] = useState(false);
      useEffect(() => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }, []);
    




  const navigation = useNavigation();

  // THE NAME OF THE TABLE OF THE WORKOUT THAT THE USER HAS COMPLETED:
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  const tableNameDate = '_' + date + '_' + month + '_' + year;

  // USESTATE TO DISPLAY THE DATA OF THE WORKOUT THE USER PERFORMED IN A FLATLIST
  let [flatListItems, setFlatListItems] = useState([]);

  //USESTATES FOR THE DATA OF THE WORKOUT THE USER HAS PERFORMED, IN ORDER TO MANIPULATE THE DATA, CALCULATE TOTALS AND DIFFERENCES FOR THE VIEW WORKOUT PROGRESS COMPONENT
  let [reps, setReps] = useState([]);
  let [duration, setDuration] = useState([]);
  let [workoutTargetReps, setWorkoutTargetReps] = useState([]);
  let [workoutTargetSets, setWorkoutTargetSets] = useState([]);

  // THE NAME OF THE WORKOUT PASSED AS A PROP FROM THE PREVIOUS SCREEN SO THE WORKOUT CAN BE SEARCHED IN THE DB AND THE TARGET REPS AND SETS CAN BE FOUND AND COMPARED WITH THE ACTUAL SETS AND REPS THE USER COMPLETED
  const userCreatedWorkoutName = route.params.userCreatedWorkoutName;
  const userCreatedWorkoutTableName = route.params.userCreatedWorkoutTableName;

  // GET THE TABLE FOR TODAYS WORKOUT THAT HAS JUST BEEN PERFORMED:
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM ' + tableNameDate, [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        setFlatListItems(temp);
      });
    });
  }, []);

  // USEEFFECT TO GET THE DATA OF THE WORKOUT THE USER HAS PERFORMED, IN ORDER TO MANIPULATE THE DATA, CALCULATE TOTALS AND DIFFERENCES FOR THE VIEW WORKOUT PROGRESS COMPONENT
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT exercise_reps FROM ' + tableNameDate,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setReps(temp);
        },
      );
    });
  }, []);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT exercise_duration FROM ' + tableNameDate,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setDuration(temp);
        },
      );
    });
  }, []);

  //USEEFFECT TO CREATE THE TABLE THAT WILL INCLUDE THE TOTALS FROM THE WORKOUT IF IT DOES NOT ALREADY EXIST
  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='total_daily_metrics'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS total_daily_metrics', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS total_daily_metrics(date_id INTEGER PRIMARY KEY AUTOINCREMENT, today_date VARCHAR(30), target_vs_actual_sets INT(15), target_vs_actual_reps INT(15), total_duration INT(15), actual_reps INT(15), actual_sets INT(15), actual_reps_x_sets INT(15), target_reps_x_sets INT(15))',
              [],
            );
          }
        },
      );
    });
  }, []);

  //USEEFFECT TO GET THE TARGET REPS AND SETS OF THE WORKOUT THE USER CREATED
  useEffect(() => {
    db2.transaction(tx => {
      tx.executeSql(
        'SELECT exercise_reps FROM ' + userCreatedWorkoutTableName,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setWorkoutTargetReps(temp);
        },
      );
    });
  }, []);

  useEffect(() => {
    db2.transaction(tx => {
      tx.executeSql(
        'SELECT exercise_sets FROM ' + userCreatedWorkoutTableName,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setWorkoutTargetSets(temp);
        },
      );
    });
  }, []);

  // FUNCTION TO DELETE AN EXERCISE FROM TODAY'S WORKOUT TABLE IF THE USER PRESSES THE DELETE ICON
  const deleteData = exerciseID => {
    db.transaction(function (tx) {
      tx.executeSql(
        'DELETE FROM ' + tableNameDate + ' where exercise_id=?',
        [exerciseID],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('Data Deleted Successfully....');
          } else console.log('Failed...');
        },
      );
    });
  };

  // FUNCTION TO FILTER OUT THE DELETED ITEM
  function filterOutDeletedItem(database, exeriseItemID) {
    const result = database.filter(item => item.exercise_id != exeriseItemID);
    setFlatListItems(result);
  }

  // FUNCTION TO INSERT THE CALCULATED DATA OF THE WORKOUT INTO THE total_daily_metrics TABLE
  const InsertData = (
    todaysDate,
    targetVsActualSetsDiff,
    targetVsActualRepsDiff,
    totalDuration,
    actualReps,
    actualSets,
    actualRepsXSets,
    targetRepsXSets,
  ) => {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO total_daily_metrics (today_date, target_vs_actual_sets, target_vs_actual_reps, total_duration, actual_reps, actual_sets, actual_reps_x_sets, target_reps_x_sets) VALUES (?,?,?,?,?,?,?,?)',
        [
          todaysDate,
          targetVsActualSetsDiff,
          targetVsActualRepsDiff,
          totalDuration,
          actualReps,
          actualSets,
          actualRepsXSets,
          targetRepsXSets,
        ],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert('Your Workout Performed has been Saved');
          } else console.log('failed....');
        },
      );
    });
  };

  // FUNCTION FOR SUMMING UP THE NUMBERS IN A STRING, USED FOR CALCULATING THE TOTAL REPS, VOLUME ETC. OF THE WORKOUT
  //REFERENCE: https://stackoverflow.com/questions/53897373/js-how-to-got-the-sum-of-numbers-from-a-string
  function sumNumbers(string) {
    let pos = 1;
    let numArray = [];
    let numString = null;

    for (let num of string) {
      let isParsed = isNaN(parseInt(num));
      if (!numString && !isParsed && pos === string.length) {
        numArray.push(num);
      } else if (!numString && !isParsed && pos !== string.length) {
        numString = num;
      } else if (numString && !isParsed && pos === string.length) {
        numString += num;
        numArray.push(numString);
      } else if (numString && isParsed && pos === string.length) {
        numArray.push(numString);
      } else if (numString && !isParsed) {
        numString += num;
      } else if (numString && isParsed && pos !== string.length) {
        numArray.push(numString);
        numString = null;
      } else if (!numString && isParsed && pos === string.length) {
        numString += num;
        numArray.push(numString);
      }
      pos++;
    }
    console.log('numAray:', numArray);
    let result = null;

    for (let num of numArray) {
      let value = parseInt(num);
      result += value;
    }

    return NaNCheck(result);
  }

  function NaNCheck(result) {
    if (isNaN(result)) {
      result = 0;
    }
    return result;
  }

  // FUNCTION FOR FORMATTING THE REPS AND SETS ARRAYS
  function formatColumnDataThenSum(columnObject) {
    const stringifiedColumnObject = JSON.stringify(columnObject);
    const formatStringForFunc = stringifiedColumnObject.replace(/[^\d+]/g, 'a');
    const formatStringForFuncPt2 = formatStringForFunc.slice(0, -1);
    return sumNumbers(formatStringForFuncPt2);
  }

  // SUM UP THE NUMBER OF REPS COMPLETED --> THEN SUBTRACT THE NUMBER OF REPS COMPLETED FROM THE NUMBER OF TARGET REPS FOR THE ENTIRE WORKOUT
  function calculateRepsDifference(workoutTargetReps, reps) {
    const totalTargetReps = formatColumnDataThenSum(workoutTargetReps);
    const actualReps = formatColumnDataThenSum(reps);
    const differenceReps = actualReps - totalTargetReps;
    return differenceReps;
  }

  // SUM UP THE NUMBER OF SETS COMPLETED (I.E. THE NUMBER OF ROWS) --> THEN SUBTRACT THE NUMBER OF SETS COMPLETED FROM THE NUMBER OF TARGET SETS FOR THE ENTIRE WORKOUT
  function calculateSetsDifference(workoutTargetSets, flatListItems) {
    const totalTargetSets = formatColumnDataThenSum(workoutTargetSets);
    const actualSets = flatListItems.length;
    const differenceSets = actualSets - totalTargetSets;
    return differenceSets;
  }

  // CALCULATE THE TARGET SETS X REPS OF THE WORKOUT VS THE ACUTAL SETS X REPS OF THE WORKOUT
  function calculateTargetSetsXReps(workoutTargetSets, workoutTargetReps) {
    const totalTargetSets = formatColumnDataThenSum(workoutTargetSets);
    const totalTargetReps = formatColumnDataThenSum(workoutTargetReps);
    const targetSetsXReps = totalTargetSets * totalTargetReps;
    return targetSetsXReps;
  }

  function calculateActualSetsXReps(flatListItems, reps) {
    const actualSets = flatListItems.length;
    const actualReps = formatColumnDataThenSum(reps);
    const actualSetsXReps = actualSets * actualReps;
    return actualSetsXReps;
  }

  // GET THE DURATION OF THE WORKOUT: [get the last number in the duration array]:
  function extractValue(arr, prop) {
    // FUNCTION FOR GETTING THE ACTUAL VALUE OF THE OBJECT PROPERTY DURATION (https://www.programiz.com/javascript/examples/extract-value-array)

    let extractedValue = arr.map(item => item[prop]);

    return extractedValue;
  }
  function calculateWorkoutDuration(duration) {
    const workoutDuration = duration.slice(-1);
    const workoutDurationValue = extractValue(
      workoutDuration,
      'exercise_duration',
    );
    const workoutDuration2 = parseInt(workoutDurationValue);
    return workoutDuration2;
  }

  return (
    <View
      style={{
        backgroundColor: '#171717',
        borderColor: '#CBC3E3',
        height: windowHeight,
      }}>
      <CustomHeaderComponent pageName="Overview" />






      {loading ? (
        <ActivityIndicator
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
          size="large"
          style={styles.activityIndicator}
        />
      ) : (
        <>
      <Button
        mode="contained"
        color="#013220"
        style={{
          alignSelf: 'center',
          marginTop: 10,
          marginRight: 10,
        }}
        onPress={() => {
          InsertData(
            tableNameDate,
            String(calculateSetsDifference(workoutTargetSets, flatListItems)),
            String(calculateRepsDifference(workoutTargetReps, reps)),
            String(calculateWorkoutDuration(duration)),
            String(formatColumnDataThenSum(reps)),
            String(flatListItems.length),
            String(calculateActualSetsXReps(flatListItems, reps)),
            String(
              calculateTargetSetsXReps(workoutTargetSets, workoutTargetReps),
            ),
          );
          navigation.replace('Fitness Home');
        }}>
        Submit Workout: {userCreatedWorkoutName}
      </Button>

      <View
        style={{
          height: 590,
          backgroundColor: '#171717',
          borderColor: '#CBC3E3',
          padding: 10,
          borderTopColor: '#CBC3E3',

          borderTopWidth: 6,

          marginTop: 10,
        }}>
        <FlatList
          data={flatListItems}
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
          ListEmptyComponent={() => (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  padding: 20,
                }}>
                <MaterialCommunityIcons
                  name="database-off"
                  color="#CBC3E3"
                  size={100}
                />
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Text style={{color: '#CBC3E3', fontSize: 20}}>
                  {' '}
                  Empty Workout{' '}
                </Text>
              </View>
            </View>
          )}
          renderItem={({item}) => (
            <View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexGrow: 1,
                  marginBottom: 5,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#CBC3E3',
                    marginBottom: 5,
                    marginTop: 5,
                  }}>
                  {item.exercise_name}
                </Text>
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexGrow: 1,
                  marginBottom: 5,
                }}>
                <Button
                  mode="contained"
                  color="#8b0000"
                  style={{
                    alignSelf: 'center',
                  }}
                  onPress={() => {
                    Alert.alert('Delete ' + item.exercise_name, '?', [
                      {
                        text: 'YES',
                        onPress: () => {
                          //DELETE ITEM FROM SQL FUNCTION GOES HERE
                          deleteData(item.exercise_id);
                          filterOutDeletedItem(flatListItems, item.exercise_id);
                        },
                      },
                    ]);
                  }}>
                  Delete
                </Button>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexGrow: 1,
                  marginBottom: 5,
                }}>
                <Text style={{fontSize: 12, marginBottom: 5, color: '#CBC3E3'}}>
                  Reps Completed: {item.exercise_reps} | Weight Lifted:{' '}
                  {item.exercise_weight} | Time In Workout: {item.exercise_duration}{' '}
                  Seconds
                </Text>
              </View>
            </View>
          )}
        />
      </View>
      <Button
        onPress={() => {
          InsertData(
            tableNameDate,
            String(calculateSetsDifference(workoutTargetSets, flatListItems)),
            String(calculateRepsDifference(workoutTargetReps, reps)),
            String(calculateWorkoutDuration(duration)),
            String(formatColumnDataThenSum(reps)),
            String(flatListItems.length),
            String(calculateActualSetsXReps(flatListItems, reps)),
            String(
              calculateTargetSetsXReps(workoutTargetSets, workoutTargetReps),
            ),
          );
          navigation.replace('Fitness Home');
        }}>
        Complete
      </Button>
        </>
      )}

    </View>
  );
};
export default CompletedWorkoutOveriview;


const styles = StyleSheet.create({
  // STYLES SHHEETS FOR THE ACTIVITY INDICATOR LOADING
  spinnerTextStyle: {
    color: 'red',
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
