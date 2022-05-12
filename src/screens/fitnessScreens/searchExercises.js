import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';

import CustomHeaderComponent from '../globalComponent/customHeaderComponent';

import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {openDatabase} from 'react-native-sqlite-storage';

// COMPONENT WHERE THE USER CAN SELECT A MUSCLE GROUP TO SEARCH EXERCISES FOR THE WORKOUT THEY ARE CREATING:

const {width} = Dimensions.get('window');
const screen = Dimensions.get('window');

const SearchExercises = ({route}, props) => {
  const navigation = useNavigation();

  // GETTING THE NAME OF THE WORKOUT THAT THE USER INPUTTED IN THE PREVIOUS SCREEN:
  const workoutTableName = route.params.workoutNamePassed;
  const workoutName = route.params.actualWorkoutName;

  // THE SQLITE DATABASE THAT INCLUDES THE TABLE FOR THE USER'S CREATED WORKOUT
  var db = openDatabase({name: 'userWorkouts.db'});

  // IF THE USER PRESSES CANCEL ON CREATING THE WORKOUT, THE WORKOUT TABLE IN THE SQLITE DATABASE WILL BE DELETED
  const deleteTable = workoutNamePassed => {
    db.transaction(function (tx) {
      tx.executeSql(
        'DROP TABLE IF EXISTS ' + workoutNamePassed,
        [],
        (tx, results) => {
          console.log('Table Deleted Successfully...');
        },
        (tx, error) => {
          console.log(error);
        },
      );
    });
  };

  return (
    <View style={{width: width, backgroundColor: '#cbc3e3'}}>
      <CustomHeaderComponent pageName={workoutName} />

      <View
        style={{
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          borderBottomColor: 'black',
          borderWidth: 1,
          backgroundColor: '#301935',
        }}>
        <View style={{alignContent: 'center', flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              navigation.replace('Create Exercises', {
                workoutdbTableName: workoutTableName,
                workoutActualName: workoutName,
              });
            }}
            style={[styles.button, styles.buttonReset]}>
            <Text style={[styles.buttonText, styles.buttonTextReset]}>
              Create
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              deleteTable(workoutTableName);

              navigation.replace('Fitness Home', {
                workoutdbTableName: workoutTableName,
                workoutActualName: workoutName,
              });
            }}
            style={[styles.button, styles.buttonReset]}>
            <Text style={[styles.buttonText, styles.buttonTextReset]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.replace('Created Workout Overview', {
                workoutdbTableName: workoutTableName,
                workoutActualName: workoutName,
              });
            }}
            style={[styles.button, styles.buttonReset]}>
            <Text style={[styles.buttonText, styles.buttonTextReset]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        <View
          style={{
            marginTop: 20,
            borderBottomWidth: 1,

            alignSelf: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.replace('Shoulders', {
                workoutdbTableName: workoutTableName,
                workoutActualName: workoutName,
              });
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
              navigation.replace('Back', {
                workoutdbTableName: workoutTableName,
                workoutActualName: workoutName,
              });
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
              navigation.replace('Chest', {
                workoutdbTableName: workoutTableName,
                workoutActualName: workoutName,
              });
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
              navigation.replace('Triceps', {
                workoutdbTableName: workoutTableName,
                workoutActualName: workoutName,
              });
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
              navigation.replace('Biceps', {
                workoutdbTableName: workoutTableName,
                workoutActualName: workoutName,
              });
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
              navigation.replace('Legs', {
                workoutdbTableName: workoutTableName,
                workoutActualName: workoutName,
              });
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
              navigation.replace('Abs', {
                workoutdbTableName: workoutTableName,
                workoutActualName: workoutName,
              });
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
              navigation.replace('Cardio', {
                workoutdbTableName: workoutTableName,
                workoutActualName: workoutName,
              });
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
export default SearchExercises;

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: '#B9AAFF',
    width: screen.width / 8,
    height: screen.width / 8,
    borderRadius: screen.width / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#171717',
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
