import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {FlatList} from 'react-native-gesture-handler';
import {Alert} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Button} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';

// COMPONENT: DISPLAYS AN OVERVIEW OF ALL THE EXERCISES, REPS AND SETS THAT THE USER HAS INCLUDED IN THE WORKOUT THEY HAVE CREATED
const windowHeight = Dimensions.get('window').height;
// SQLITE DATABASE CONTAINING THE USER'S WORKOUTS
var db = openDatabase({name: 'userWorkouts.db'});

const CreatedWorkoutOverview = ({route}, props) => {
  // USESTATE AND USEFFECT USED HERE FOR THE ACTIVITYINDICATOR COMPONENT TO DISPLAY A LOADING ICON FOR A SHORT PERIOD WHILST BACKEND GETS DATA TO IMRPOVE USER EXPERIENCE
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const navigation = useNavigation();

  // GETTING THE NAME OF THE WORKOUT FROM THE PREVIOUS SCREEN
  const workoutNamePassed = route.params.workoutdbTableName;
  const actualWorkoutName = route.params.workoutActualName;

  // USESTATE TO DISPLAY THE DIFFERENT EXERCISES, REPS AND SETS THAT THE USER HAS INCLUDED IN THEIR WORKOUT
  let [flatListItems, setFlatListItems] = useState([]);

  //USEEFFECT TO GET THE DIFFERENT EXERCISES, REPS AND SETS THAT THE USER HAS INCLUDED IN THEIR WORKOUT
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM ' + workoutNamePassed, [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        setFlatListItems(temp);
      });
    });
  }, []);

  // FUNCTION TO FILTER OUT ANY ITEMS IN THE FLATLIST THAT THE USER DELETES FROM THE CREATED WORKOUT AFTER DELETING THEM
  function filterOutDeletedItem(database, exeriseItemID) {
    const result = database.filter(item => item.exercise_id != exeriseItemID);
    setFlatListItems(result);
  }

  //DELETE EXERCISES FROM THE WORKOUT TABLE IF THE USER PRESSES THE BIN ICON ON A FLATLIST ROW
  const deleteData = exerciseID => {
    db.transaction(function (tx) {
      tx.executeSql(
        'DELETE FROM ' + workoutNamePassed + ' where exercise_id=?',
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

  //DELETE THE WORKOUT TABLE IF THE USER CANCELS THE WORKOUT CREATION:
  const deleteTable = workoutNamePassed => {
    db.transaction(function (tx) {
      tx.executeSql(
        'DROP TABLE IF EXISTS ' + workoutNamePassed,
        [],
        (tx, results) => {
          alert('Workout Deleted Successfully');
        },
        (tx, error) => {
          alert(error);
        },
      );
    });
  };

  return (
    <View
      style={{
        backgroundColor: '#171717',
        borderColor: '#CBC3E3',
        height: windowHeight,
      }}>
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
            {actualWorkoutName} Overview
          </Text>
        </View>
      </View>

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
          <View
            style={{
              backgroundColor: '#301934',
              alignItems: 'center',
              color: '#301934',
              padding: 10,
              borderWidth: 1,
              marginTop: 2,
            }}>
            <Text style={{color: 'white', fontSize: 20}}>
              Workout: {actualWorkoutName}
            </Text>
          </View>
          <View
            style={{
              height: 490,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              padding: 10,
              marginTop: 0.5,
              borderBottomWidth: 2,
              borderTopWidth: 1,
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
                  <View
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{color: '#CBC3E3', fontSize: 20}}>
                      {' '}
                      No Exercises Currently in This Workout{' '}
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

                    <Button
                      mode="contained"
                      color="#8b0000"
                      style={{
                        alignSelf: 'center',
                      }}
                      onPress={() => {
                        deleteData(item.exercise_id);
                        filterOutDeletedItem(flatListItems, item.exercise_id);
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
                    <Text
                      style={{fontSize: 12, marginBottom: 5, color: '#CBC3E3'}}>
                      {item.exercise_musclegroup} | {item.exercise_type} |{' '}
                      {item.exercise_equipment} | Sets x Reps:{' '}
                      {item.exercise_sets} x {item.exercise_reps}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>

          <Button
            mode="contained"
            color="#013220"
            style={{
              alignSelf: 'center',
              marginBottom: 10,
              marginTop: 10,
            }}
            onPress={() => {
              navigation.replace('Fitness Home');
            }}>
            Save Workout
          </Button>

          <Button
            mode="contained"
            color="#8b0000"
            style={{
              alignSelf: 'center',
            }}
            onPress={() => {
              deleteTable(workoutNamePassed);
              navigation.replace('Fitness Home');
            }}>
            Delete Workout
          </Button>
        </>
      )}
    </View>
  );
};
export default CreatedWorkoutOverview; //

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
