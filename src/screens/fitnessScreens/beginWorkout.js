import React, {useContext, useState, useEffect, useRef} from 'react';
import {View, Text, ScrollView, Dimensions, Animated} from 'react-native';

import CustomHeaderWithBack from '../globalComponent/customerHeaderWithBack';
import auth, {firebase} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';
import {FlatList} from 'react-native-gesture-handler';

import ContainerForProfileTabs from '../profileScreens/components/containerForProfileTabs';
import TopTabBtns from '../profileScreens/components/topTabBtns';
import {openDatabase} from 'react-native-sqlite-storage';
import {Button, Searchbar} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// COMPONENT: THE BEGIN WORKOUT SCREEN -- DISPLAYS ALL THE USER CREATED WORKOUT NAMES IN A FLATLIST AND ALL THE GENERATED WORKOUTS RELATED TO THE USER'S FITNESS GOAL IN A FLATLIST:

const {width} = Dimensions.get('window');

var db = openDatabase({name: 'userWorkouts.db'}); // THE SQLITE DATABASE WHERE THE USER'S WORKOUTS ARE STORED

const BeginWorkout = ({route}, props) => {
  //USESTATE TO DISPLAY THE USER'S CREATED EXERCISE:
  let [savedWorkoutflatListItems, setSavedWorkutFlatListItems] = useState([]);

  // USESTATE FOR THE USER'S FITNESS GOAL STORED IN THEIR FIRESTORE DOCUMENT
  const [userMetrics, setUserMetrics] = useState({
    fitnessGoal: '',
    trainingFrequency: '',
  });

  // THE .JS FILES IN THE WORKOUTPLANS FOLDER WHERE THE DIFFERENT WORKOUT PLANS DEPENDING ON THE USER'S GOALS ARE STORED.
  const hypertrophyPlans = require('./workoutPlans/hypertrophyPlans');
  const strengthPlans = require('./workoutPlans/strengthPlans');
  const endurancePlans = require('./workoutPlans/endurancePlans');

  // USEEFFECT FOR GETTING THE USER'S CREATED WORKOUT NAMES
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT name FROM sqlite_master WHERE type = "table"',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setSavedWorkutFlatListItems(temp);
        },
      );
    });
  }, []);

  // FUNCTION TO GET THE USER'S FITNESS GOAL AND TRAINING FREQUENCY FROM THEIR FIRESTORE DOC
  const getUserFirestoreMetrics = async () => {
    await firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserMetrics(documentSnapshot.data());
        }
      });
  };

  // USEEFFECT TO GET THE USER'S FITNESS GOAL AND TRAINING FREQUENCY WHEN THE COMPONENT STARTS
  useEffect(() => {
    getUserFirestoreMetrics();
  }, []);

  const navigation = useNavigation();

  // HORIZONTAL ANIMATION FOR THE TABS (LEFT TAB = USER CREATED WORKOUTS, RIGT TAB = GENERATED WORKOUTS RELATED TO USER FITNESS GOAL)

  const animation = useRef(new Animated.Value(0)).current;
  const scrollView = useRef();

  const loginColorAnimation = animation.interpolate({
    inputRange: [0, width],
    outputRange: ['#171717', '#301934'],
  });

  const registrationColorAnimation = animation.interpolate({
    inputRange: [0, width],
    outputRange: ['#301934', '#171717'],
  });

  // FILTER OUT THE android_metadata and sqlite_sequence table names:
  function filterOutTables(database) {
    const result = database.filter(item => item.name != 'android_metadata');
    const result2 = result.filter(item => item.name != 'sqlite_sequence');
    return result2;
  }

  // FORMAT THE USER CREATED WORKOUT TABLE NAMES BACK TO A PRESENTABLE FORMAT ON THE SCREEN
  function formatWorkoutName(workoutTableName) {
    const workoutName1 = workoutTableName.replace(/_/g, ' ');
    const workoutName = workoutName1.replace(/(^\w|\s\w)/g, m =>
      m.toUpperCase(),
    ); // REG EXPRESSION REF: https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript
    return workoutName;
  }

  const workoutTables = filterOutTables(savedWorkoutflatListItems);

  // DELETE THE CREATED WORKOUT TABLE IF THE USER PRESSES DELETE ICON:
  const deleteTable = workoutNamePassed => {
    db.transaction(function (tx) {
      tx.executeSql(
        'DROP TABLE IF EXISTS ' + workoutNamePassed,
        [],
        (tx, results) => {
          alert('Workout Deleted Successfully');
        },
        (tx, error) => {
          console.log(error);
        },
      );
    });
  };

  let hypertrophyD1;
  let hypertrophyD2;
  let hypertrophyD3;
  let hypertrophyD4;
  let hypertrophyD5;
  let hypertrophyD6;
  let hypertrophyD7;

  let strengthD1;
  let strengthD2;
  let strengthD3;
  let strengthD4;
  let strengthD5;
  let strengthD6;
  let strengthD7;

  let enduranceD1;
  let enduranceD2;
  let enduranceD3;
  let enduranceD4;
  let enduranceD5;
  let enduranceD6;
  let enduranceD7;

  // FUNCTIONS TO GIVE THE USER SOME INFORMATION REGARDING THE GENERATED WORKOUTS ON THE SCREEN (SUMMING THE SETS, REPS, CARDIO OF THE GENERATED WORKOUT ARRAY USING array.reduce())
  function sumSetsInWorkoutArray(workoutArray) {
    const sum = workoutArray.reduce((accumulator, object) => {
      return accumulator + object.Sets;
    }, 0);
    return sum;
  }
  function sumRepsInWorkoutArray(workoutArray) {
    const sum = workoutArray.reduce((accumulator, object) => {
      return accumulator + object.Reps;
    }, 0);
    return sum;
  }
  function sumCardioMinsInWorkoutArray(workoutArray) {
    const sum = workoutArray.reduce((accumulator, object) => {
      return accumulator + object.Duration;
    }, 0);
    return sum;
  }

  // FUNCTION TO DISPLAY THE RELEVANT GENERATED WORKOUT PLAN THAT IS ASSOCIATED WITH THE FITNESS GOAL AND TRAINING FREQUENCY OF THE USER
  function generatedUserPlan(trainingFreq, fitnessGoal) {
    if (trainingFreq == '') {
      return (
        <View
          style={{
            padding: 15,
            backgroundColor: '#171717',
            borderColor: '#CBC3E3',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
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
              Set A Workout Goal First to Receive A Generated Workout Plan{' '}
            </Text>
          </View>
        </View>
      );
    }

    if (trainingFreq == 1 && fitnessGoal == 'Hypertrophy (Muscle Growth)') {
      hypertrophyD1 = hypertrophyPlans.hypertrophyx1;
      return (
        <ScrollView style={{}}>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 1: Full Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Full Body',
                    workoutArray: hypertrophyPlans.hypertrophyx1,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx1)} | Total
                Reps: {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx1)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx1.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }
    if (trainingFreq == 2 && fitnessGoal == 'Hypertrophy (Muscle Growth)') {
      hypertrophyD1 = JSON.stringify(hypertrophyPlans.hypertrophyx2D1); //MAY NEED TO GET RID OF THE JSON.STRINGIFY WHEN PASSING IT ON TO PERFORM THE WORKOUT
      hypertrophyD2 = JSON.stringify(hypertrophyPlans.hypertrophyx2D2); //MAY NEED TO GET RID OF THE JSON.STRINGIFY WHEN PASSING IT ON TO PERFORM THE WORKOUT
      return (
        <ScrollView style={{}}>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 1: Full Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Full Body',
                    workoutArray: hypertrophyPlans.hypertrophyx2D1,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx2D1)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx2D1)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx2D1.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 2: Full Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 2: Full Body',
                    workoutArray: hypertrophyPlans.hypertrophyx2D2,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx2D2)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx2D2)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx2D2.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }
    if (trainingFreq == 3 && fitnessGoal == 'Hypertrophy (Muscle Growth)') {
      hypertrophyD1 = JSON.stringify(hypertrophyPlans.hypertrophyx3D1);
      hypertrophyD2 = JSON.stringify(hypertrophyPlans.hypertrophyx3D2);
      hypertrophyD3 = JSON.stringify(hypertrophyPlans.hypertrophyx3D3);

      return (
        <ScrollView style={{}}>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 1: Full Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Full Body',
                    workoutArray: hypertrophyPlans.hypertrophyx3D1,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx3D1)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx3D1)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx3D1.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 2: Upper Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 2: Upper Body',
                    workoutArray: hypertrophyPlans.hypertrophyx3D2,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx3D2)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx3D2)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx3D2.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 3: Lower Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Lower Body',
                    workoutArray: hypertrophyPlans.hypertrophyx3D3,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx3D3)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx3D3)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx3D3.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }
    if (trainingFreq == 4 && fitnessGoal == 'Hypertrophy (Muscle Growth)') {
      hypertrophyD1 = JSON.stringify(hypertrophyPlans.hypertrophyx4D1);
      hypertrophyD2 = JSON.stringify(hypertrophyPlans.hypertrophyx4D2);
      hypertrophyD3 = JSON.stringify(hypertrophyPlans.hypertrophyx4D3);
      hypertrophyD4 = JSON.stringify(hypertrophyPlans.hypertrophyx4D4);
      return (
        <ScrollView style={{}}>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 1: Lower Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Lower Body',
                    workoutArray: hypertrophyPlans.hypertrophyx4D1,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx4D1)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx4D1)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx4D1.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 2: Upper Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 2: Upper Body',
                    workoutArray: hypertrophyPlans.hypertrophyx4D3,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx4D3)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx4D3)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx4D3.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 3: Lower Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 3: Lower Body',
                    workoutArray: hypertrophyPlans.hypertrophyx4D2,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx4D2)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx4D2)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx4D2.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 4: Upper Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 4: Upper Body',
                    workoutArray: hypertrophyPlans.hypertrophyx4D4,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx4D4)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx4D4)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx4D4.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }
    if (trainingFreq == 5 && fitnessGoal == 'Hypertrophy (Muscle Growth)') {
      hypertrophyD1 = JSON.stringify(hypertrophyPlans.hypertrophyx5D1);
      hypertrophyD2 = JSON.stringify(hypertrophyPlans.hypertrophyx5D2);
      hypertrophyD3 = JSON.stringify(hypertrophyPlans.hypertrophyx5D3);
      hypertrophyD4 = JSON.stringify(hypertrophyPlans.hypertrophyx5D4);
      hypertrophyD5 = JSON.stringify(hypertrophyPlans.hypertrophyx5D5);
      return (
        <ScrollView style={{}}>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 1: Push
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Push',
                    workoutArray: hypertrophyPlans.hypertrophyx5D1,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx5D1)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx5D1)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx5D1.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 2: Pull
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 2: Pull',
                    workoutArray: hypertrophyPlans.hypertrophyx5D2,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx5D2)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx5D2)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx5D2.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 3: Legs
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 3: Legs',
                    workoutArray: hypertrophyPlans.hypertrophyx5D3,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx5D3)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx5D3)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx5D3.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 4: Upper Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 4: Upper Body',
                    workoutArray: hypertrophyPlans.hypertrophyx5D4,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx5D4)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx5D4)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx5D4.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 5: Lower Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 5: Lower Body',
                    workoutArray: hypertrophyPlans.hypertrophyx5D5,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx5D5)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx5D5)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx5D5.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }
    if (trainingFreq == 6 && fitnessGoal == 'Hypertrophy (Muscle Growth)') {
      hypertrophyD1 = JSON.stringify(hypertrophyPlans.hypertrophyx6D1);
      hypertrophyD2 = JSON.stringify(hypertrophyPlans.hypertrophyx6D2);
      hypertrophyD3 = JSON.stringify(hypertrophyPlans.hypertrophyx6D3);
      hypertrophyD4 = JSON.stringify(hypertrophyPlans.hypertrophyx6D4);
      hypertrophyD5 = JSON.stringify(hypertrophyPlans.hypertrophyx6D5);
      hypertrophyD6 = JSON.stringify(hypertrophyPlans.hypertrophyx6D6);

      return (
        <ScrollView style={{}}>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 1: Push
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Push',
                    workoutArray: hypertrophyPlans.hypertrophyx6D1,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx6D1)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx6D1)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx6D1.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 2: Pull
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 2: Pull',
                    workoutArray: hypertrophyPlans.hypertrophyx6D2,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx6D2)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx6D2)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx6D2.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 3: Legs
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 3: Legs',
                    workoutArray: hypertrophyPlans.hypertrophyx6D3,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx6D3)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx6D3)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx6D3.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 4: Push
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 4: Push',
                    workoutArray: hypertrophyPlans.hypertrophyx6D4,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx6D4)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx6D4)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx6D4.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 5: Pull
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 5: Pull',
                    workoutArray: hypertrophyPlans.hypertrophyx6D5,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx6D5)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx6D5)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx6D5.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 6: Legs
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 6: Legs',
                    workoutArray: hypertrophyPlans.hypertrophyx6D6,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx6D6)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx6D6)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx6D6.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }
    if (trainingFreq == 7 && fitnessGoal == 'Hypertrophy (Muscle Growth)') {
      hypertrophyD1 = JSON.stringify(hypertrophyPlans.hypertrophyx7D1);
      hypertrophyD2 = JSON.stringify(hypertrophyPlans.hypertrophyx7D2);
      hypertrophyD3 = JSON.stringify(hypertrophyPlans.hypertrophyx7D3);
      hypertrophyD4 = JSON.stringify(hypertrophyPlans.hypertrophyx7D4);
      hypertrophyD5 = JSON.stringify(hypertrophyPlans.hypertrophyx7D5);
      hypertrophyD6 = JSON.stringify(hypertrophyPlans.hypertrophyx7D6);
      hypertrophyD7 = JSON.stringify(hypertrophyPlans.hypertrophyx7D7);

      return (
        <ScrollView style={{}}>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 1: Shoulders
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Shoulders',
                    workoutArray: hypertrophyPlans.hypertrophyx7D1,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx7D1)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx7D1)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx7D1.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 2: Back
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 2: Back',
                    workoutArray: hypertrophyPlans.hypertrophyx7D2,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx7D2)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx7D2)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx7D2.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 3: Chest
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 3: Chest',
                    workoutArray: hypertrophyPlans.hypertrophyx7D3,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx7D3)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx7D3)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx7D3.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 4: Arms
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 4: Arms',
                    workoutArray: hypertrophyPlans.hypertrophyx7D4,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx7D4)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx7D4)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx7D4.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 5: Legs
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 5: Legs',
                    workoutArray: hypertrophyPlans.hypertrophyx7D5,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx7D5)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx7D5)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx7D5.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 6: Abs
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 6: Abs',
                    workoutArray: hypertrophyPlans.hypertrophyx7D6,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx7D6)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx7D6)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx7D6.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 7: Full Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 7: Full Body',
                    workoutArray: hypertrophyPlans.hypertrophyx7D7,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx7D7)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx7D7)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx7D7.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }

    if (trainingFreq == 1 && fitnessGoal == 'Muscular Strength') {
      strengthD1 = JSON.stringify(strengthPlans.strengthx1);
      return (
        <ScrollView style={{}}>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 1: Full Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Full Body',
                    workoutArray: strengthPlans.strengthx1,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx1)} |
                Total Reps: {sumRepsInWorkoutArray(strengthPlans.strengthx1)} |
                Number of Exercises: {strengthPlans.strengthx1.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }

    if (trainingFreq == 2 && fitnessGoal == 'Muscular Strength') {
      strengthD1 = JSON.stringify(strengthPlans.strengthx2D1);
      strengthD2 = JSON.stringify(strengthPlans.strengthx2D2);
      return (
        <ScrollView style={{}}>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 1: Upper Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Upper Body',
                    workoutArray: strengthPlans.strengthx2D1,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx2D1)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx2D1)} | Number of
                Exercises: {strengthPlans.strengthx2D1.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 2: Lower Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Lower Body',
                    workoutArray: strengthPlans.strengthx2D2,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx2D2)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx2D2)} | Number of
                Exercises: {strengthPlans.strengthx2D2.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }

    if (trainingFreq == 3 && fitnessGoal == 'Muscular Strength') {
      strengthD1 = JSON.stringify(strengthPlans.strengthx3D1);
      strengthD2 = JSON.stringify(strengthPlans.strengthx3D2);
      strengthD3 = JSON.stringify(strengthPlans.strengthx3D3);
      return (
        <ScrollView style={{}}>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 1: Push
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Push',
                    workoutArray: strengthPlans.strengthx3D1,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx3D1)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx3D1)} | Number of
                Exercises: {strengthPlans.strengthx3D1.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 2: Pull
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 2: Pull',
                    workoutArray: strengthPlans.strengthx3D2,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx3D2)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx3D2)} | Number of
                Exercises: {strengthPlans.strengthx3D2.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 3: Legs
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 3: Legs',
                    workoutArray: strengthPlans.strengthx3D3,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx3D3)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx3D3)} | Number of
                Exercises: {strengthPlans.strengthx3D3.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }

    if (trainingFreq == 4 && fitnessGoal == 'Muscular Strength') {
      strengthD1 = JSON.stringify(strengthPlans.strengthx4D1);
      strengthD2 = JSON.stringify(strengthPlans.strengthx4D2);
      strengthD3 = JSON.stringify(strengthPlans.strengthx4D3);
      strengthD4 = JSON.stringify(strengthPlans.strengthx4D4);
      return (
        <ScrollView style={{}}>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 1: Upper Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Upper Body',
                    workoutArray: strengthPlans.strengthx4D1,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx4D1)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx4D1)} | Number of
                Exercises: {strengthPlans.strengthx4D1.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 2: Lower Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 2: Lower Body',
                    workoutArray: strengthPlans.strengthx4D2,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx4D2)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx4D2)} | Number of
                Exercises: {strengthPlans.strengthx4D2.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 3: Upper Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 3: Upper Body',
                    workoutArray: strengthPlans.strengthx4D3,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx4D3)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx4D3)} | Number of
                Exercises: {strengthPlans.strengthx4D3.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 4: Lower Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Lower Body',
                    workoutArray: strengthPlans.strengthx4D4,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx4D4)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx4D4)} | Number of
                Exercises: {strengthPlans.strengthx4D4.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }

    if (trainingFreq == 5 && fitnessGoal == 'Muscular Strength') {
      strengthD1 = JSON.stringify(strengthPlans.strengthx5D1);
      strengthD2 = JSON.stringify(strengthPlans.strengthx5D2);
      strengthD3 = JSON.stringify(strengthPlans.strengthx5D3);
      strengthD4 = JSON.stringify(strengthPlans.strengthx5D4);
      strengthD5 = JSON.stringify(strengthPlans.strengthx5D5);
      return (
        <ScrollView style={{}}>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 1: Push
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Push',
                    workoutArray: strengthPlans.strengthx5D1,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx5D1)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx5D1)} | Number of
                Exercises: {strengthPlans.strengthx5D1.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 2: Pull
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 2: Pull',
                    workoutArray: strengthPlans.strengthx5D2,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx5D2)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx5D2)} | Number of
                Exercises: {strengthPlans.strengthx5D2}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 3: Legs
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 3: Legs',
                    workoutArray: strengthPlans.strengthx5D3,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(hypertrophyPlans.hypertrophyx5D3)} |
                Total Reps:{' '}
                {sumRepsInWorkoutArray(hypertrophyPlans.hypertrophyx5D3)} |
                Number of Exercises: {hypertrophyPlans.hypertrophyx5D3.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 4: Upper Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 4: Upper Body',
                    workoutArray: strengthPlans.strengthx5D4,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx5D4)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx5D4)} | Number of
                Exercises: {strengthPlans.strengthx5D4}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 5: Lower Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 5: Lower Body',
                    workoutArray: strengthPlans.strengthx5D5,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx5D5)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx5D5)} | Number of
                Exercises: {strengthPlans.strengthx5D5.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }

    if (trainingFreq == 6 && fitnessGoal == 'Muscular Strength') {
      strengthD1 = JSON.stringify(strengthPlans.strengthx6D1);
      strengthD2 = JSON.stringify(strengthPlans.strengthx6D2);
      strengthD3 = JSON.stringify(strengthPlans.strengthx6D3);
      strengthD4 = JSON.stringify(strengthPlans.strengthx6D4);
      strengthD5 = JSON.stringify(strengthPlans.strengthx6D5);
      strengthD6 = JSON.stringify(strengthPlans.strengthx6D6);
      return (
        <ScrollView style={{}}>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 1: Push
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Push',
                    workoutArray: strengthPlans.strengthx6D1,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx6D1)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx6D1)} | Number of
                Exercises: {strengthPlans.strengthx6D1.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 2: Pull
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 2: Pull',
                    workoutArray: strengthPlans.strengthx6D2,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx6D2)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx6D2)} | Number of
                Exercises: {strengthPlans.strengthx6D2.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 3: Legs
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 3: Legs',
                    workoutArray: strengthPlans.strengthx6D3,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx6D3)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx6D3)} | Number of
                Exercises: {strengthPlans.strengthx6D3.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 4: Push
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 4: Push',
                    workoutArray: strengthPlans.strengthx6D4,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx6D4)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx6D4)} | Number of
                Exercises: {strengthPlans.strengthx6D4.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 5: Pull
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 5: Pull',
                    workoutArray: strengthPlans.strengthx6D5,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx6D5)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx6D5)} | Number of
                Exercises: {strengthPlans.strengthx6D5.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 6: Legs
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 6: Legs',
                    workoutArray: strengthPlans.strengthx6D6,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx6D6)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx6D6)} | Number of
                Exercises: {strengthPlans.strengthx6D6.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }

    if (trainingFreq == 7 && fitnessGoal == 'Muscular Strength') {
      strengthD1 = JSON.stringify(strengthPlans.strengthx7D1);
      strengthD2 = JSON.stringify(strengthPlans.strengthx7D2);
      strengthD3 = JSON.stringify(strengthPlans.strengthx7D3);
      strengthD4 = JSON.stringify(strengthPlans.strengthx7D4);
      strengthD5 = JSON.stringify(strengthPlans.strengthx7D5);
      strengthD6 = JSON.stringify(strengthPlans.strengthx7D6);
      strengthD7 = JSON.stringify(strengthPlans.strengthx7D7);
      return (
        <ScrollView style={{}}>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 1: Shoulders
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Shoulders',
                    workoutArray: strengthPlans.strengthx7D1,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx7D1)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx7D1)} | Number of
                Exercises: {strengthPlans.strengthx7D1.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 2: Chest
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 2: Chest',
                    workoutArray: strengthPlans.strengthx7D2,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx7D2)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx7D2)} | Number of
                Exercises: {strengthPlans.strengthx7D2.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 3: Back
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 3: Back',
                    workoutArray: strengthPlans.strengthx7D3,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx7D3)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx7D3)} | Number of
                Exercises: {strengthPlans.strengthx7D3.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 4: Biceps
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 4: Biceps',
                    workoutArray: strengthPlans.strengthx7D4,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx7D4)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx7D4)} | Number of
                Exercises: {strengthPlans.strengthx7D4.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 5: Triceps
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 5: Triceps',
                    workoutArray: strengthPlans.strengthx7D5,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx7D5)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx7D5)} | Number of
                Exercises: {strengthPlans.strengthx7D5.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 6: Abs
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 6: Abs',
                    workoutArray: strengthPlans.strengthx7D6,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx7D6)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx7D6)} | Number of
                Exercises: {strengthPlans.strengthx7D6.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 7: Legs
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 7: Legs',
                    workoutArray: strengthPlans.strengthx7D7,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(strengthPlans.strengthx7D7)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(strengthPlans.strengthx7D7)} | Number of
                Exercises: {strengthPlans.strengthx7D7.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }

    if (trainingFreq == 1 && fitnessGoal == 'Muscular Endurance') {
      enduranceD1 = JSON.stringify(endurancePlans.endurancex1);
      return (
        <ScrollView style={{}}>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 1: Full Body + Cardio
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Cardio',
                    workoutArray: endurancePlans.endurancex1,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets: {sumSetsInWorkoutArray(endurancePlans.endurancex1)}{' '}
                | Total Reps:{' '}
                {sumRepsInWorkoutArray(endurancePlans.endurancex1)} | Number of
                Exercises: {endurancePlans.endurancex1.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }

    if (trainingFreq == 2 && fitnessGoal == 'Muscular Endurance') {
      enduranceD1 = JSON.stringify(endurancePlans.endurancex2D1);
      enduranceD2 = JSON.stringify(endurancePlans.endurancex2D2);
      return (
        <ScrollView style={{}}>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 1: Upper Body + Cardio
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Upper Body + Cardio',
                    workoutArray: endurancePlans.endurancex2D1,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex2D1)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex2D1)} |
                Number of Exercises: {endurancePlans.endurancex2D1.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 2: Lower Body + Cardio
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 2: Lower Body + Cardio',
                    workoutArray: endurancePlans.endurancex2D2,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex2D2)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex2D2)} |
                Number of Exercises: {endurancePlans.endurancex2D2.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }

    if (trainingFreq == 3 && fitnessGoal == 'Muscular Endurance') {
      enduranceD1 = JSON.stringify(endurancePlans.endurancex3D1);
      enduranceD2 = JSON.stringify(endurancePlans.endurancex3D2);
      enduranceD3 = JSON.stringify(endurancePlans.endurancex3D3);
      return (
        <ScrollView style={{}}>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 1: Upper Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Upper Body',
                    workoutArray: endurancePlans.endurancex3D1,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex3D1)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex3D1)} |
                Number of Exercises: {endurancePlans.endurancex3D1.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 2: Lower Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 2: Lower Body',
                    workoutArray: endurancePlans.endurancex3D2,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex3D2)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex3D2)} |
                Number of Exercises: {endurancePlans.endurancex3D2.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 3: Cardio
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 3: Cardio',
                    workoutArray: endurancePlans.endurancex3D3,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Duration:{' '}
                {sumCardioMinsInWorkoutArray(endurancePlans.endurancex3D3)}{' '}
                Minutes | Number of Exercises:{' '}
                {endurancePlans.endurancex3D3.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }

    if (trainingFreq == 4 && fitnessGoal == 'Muscular Endurance') {
      enduranceD1 = JSON.stringify(endurancePlans.endurancex4D1);
      enduranceD2 = JSON.stringify(endurancePlans.endurancex4D2);
      enduranceD3 = JSON.stringify(endurancePlans.endurancex4D3);
      enduranceD4 = JSON.stringify(endurancePlans.endurancex4D4);
      return (
        <ScrollView style={{}}>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 1: Upper Body + Cardio
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Upper Body + Cardio',
                    workoutArray: endurancePlans.endurancex4D1,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex4D1)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex4D1)} |
                Number of Exercises: {endurancePlans.endurancex4D1.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 2: Lower Body + Cardio
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 2: Lower Body + Cardio',
                    workoutArray: endurancePlans.endurancex4D2,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex4D2)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex4D2)} |
                Number of Exercises: {endurancePlans.endurancex4D2.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 3: Upper Body + Cardio
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 3: Upper Body + Cardio',
                    workoutArray: endurancePlans.endurancex4D3,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex4D3)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex4D3)} |
                Number of Exercises: {endurancePlans.endurancex4D3.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 4: Lower Body + Cardio
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 4: Lower Body + Cardio',
                    workoutArray: endurancePlans.endurancex4D4,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex4D4)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex4D4)} |
                Number of Exercises: {endurancePlans.endurancex4D4.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }

    if (trainingFreq == 5 && fitnessGoal == 'Muscular Endurance') {
      enduranceD1 = JSON.stringify(endurancePlans.endurancex5D1);
      enduranceD2 = JSON.stringify(endurancePlans.endurancex5D2);
      enduranceD3 = JSON.stringify(endurancePlans.endurancex5D3);
      enduranceD4 = JSON.stringify(endurancePlans.endurancex5D4);
      enduranceD5 = JSON.stringify(endurancePlans.endurancex5D5);
      return (
        <ScrollView style={{}}>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 1: Push + Cardio
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Push + Cardio',
                    workoutArray: endurancePlans.endurancex5D1,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex5D1)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex5D1)} |
                Number of Exercises: {endurancePlans.endurancex5D1.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 2: Pull + Cardio
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 2: Pull + Cardio',
                    workoutArray: endurancePlans.endurancex5D2,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex5D2)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex5D2)} |
                Number of Exercises: {endurancePlans.endurancex5D2.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 3: Legs + Cardio
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 3: Legs + Cardio',
                    workoutArray: endurancePlans.endurancex5D3,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex5D3)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex5D3)} |
                Number of Exercises: {endurancePlans.endurancex5D3.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 4: Upper Body + Cardio
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 4: Upper Body + Cardio',
                    workoutArray: endurancePlans.endurancex5D4,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex5D4)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex5D4)} |
                Number of Exercises: {endurancePlans.endurancex5D4.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 5: Lower Body + Cardio
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 5: Lower Body + Cardio',
                    workoutArray: endurancePlans.endurancex5D5,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex5D5)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex5D5)} |
                Number of Exercises: {endurancePlans.endurancex5D5.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }

    if (trainingFreq == 6 && fitnessGoal == 'Muscular Endurance') {
      enduranceD1 = JSON.stringify(endurancePlans.endurancex6D1);
      enduranceD2 = JSON.stringify(endurancePlans.endurancex6D2);
      enduranceD3 = JSON.stringify(endurancePlans.endurancex6D3);
      enduranceD4 = JSON.stringify(endurancePlans.endurancex6D4);
      enduranceD5 = JSON.stringify(endurancePlans.endurancex6D5);
      enduranceD6 = JSON.stringify(endurancePlans.endurancex6D6);
      return (
        <ScrollView style={{}}>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 1: Push
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Push',
                    workoutArray: endurancePlans.endurancex6D1,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex6D1)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex6D1)} |
                Number of Exercises: {endurancePlans.endurancex6D1.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 2: Pull
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 2: Pull',
                    workoutArray: endurancePlans.endurancex6D2,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex6D2)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex6D2)} |
                Number of Exercises: {endurancePlans.endurancex6D2.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 3: Legs
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 3: Legs',
                    workoutArray: endurancePlans.endurancex6D3,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex6D3)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex6D3)} |
                Number of Exercises: {endurancePlans.endurancex6D3.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 4: Upper Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 4: Upper Body',
                    workoutArray: endurancePlans.endurancex6D4,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex6D4)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex6D4)} |
                Number of Exercises: {endurancePlans.endurancex6D4.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 5: Lower Body
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 5: Lower Body',
                    workoutArray: endurancePlans.endurancex6D5,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex6D5)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex6D5)} |
                Number of Exercises: {endurancePlans.endurancex6D5.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 6: Cardio
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 6: Cardio',
                    workoutArray: endurancePlans.endurancex6D6,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Duration:{' '}
                {sumCardioMinsInWorkoutArray(endurancePlans.endurancex6D6)}{' '}
                Minutes |{sumRepsInWorkoutArray(endurancePlans.endurancex6D6)} |
                Number of Exercises: {endurancePlans.endurancex6D6.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }

    if (trainingFreq == 7 && fitnessGoal == 'Muscular Endurance') {
      enduranceD1 = JSON.stringify(endurancePlans.endurancex7D1);
      enduranceD2 = JSON.stringify(endurancePlans.endurancex7D2);
      enduranceD3 = JSON.stringify(endurancePlans.endurancex7D3);
      enduranceD4 = JSON.stringify(endurancePlans.endurancex7D4);
      enduranceD5 = JSON.stringify(endurancePlans.endurancex7D5);
      enduranceD6 = JSON.stringify(endurancePlans.endurancex7D6);
      enduranceD7 = JSON.stringify(endurancePlans.endurancex7D7);
      return (
        <ScrollView style={{}}>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 1: Push
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 1: Push',
                    workoutArray: endurancePlans.endurancex7D1,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex7D1)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex7D1)} |
                Number of Exercises: {endurancePlans.endurancex7D1.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 2: Pull
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 2: Pull',
                    workoutArray: endurancePlans.endurancex7D2,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex7D2)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex7D2)} |
                Number of Exercises: {endurancePlans.endurancex7D2.length}
              </Text>
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 3: Legs
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 3: Legs',
                    workoutArray: endurancePlans.endurancex7D3,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex7D3)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex7D3)} |
                Number of Exercises: {endurancePlans.endurancex7D3.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 4: Push
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 4: Push',
                    workoutArray: endurancePlans.endurancex7D4,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex7D4)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex7D4)} |
                Number of Exercises: {endurancePlans.endurancex7D4.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 5: Pull
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 5: Pull',
                    workoutArray: endurancePlans.endurancex7D5,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex7D5)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex7D5)} |
                Number of Exercises: {endurancePlans.endurancex7D5.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 6: Legs
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 6: Legs',
                    workoutArray: endurancePlans.endurancex7D6,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Sets:{' '}
                {sumSetsInWorkoutArray(endurancePlans.endurancex7D6)} | Total
                Reps: {sumRepsInWorkoutArray(endurancePlans.endurancex7D6)} |
                Number of Exercises: {endurancePlans.endurancex7D6.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 20, color: '#CBC3E3', marginBottom: 10}}>
              Day 7: Cardio
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Button
                mode="contained"
                color="#CBC3E3"
                onPress={() => {
                  navigation.replace('Perform Generated Workout', {
                    workoutName: 'Day 7: Cardio',
                    workoutArray: endurancePlans.endurancex7D7,
                  });
                }}>
                Perform
              </Button>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#CBC3E3'}}>
                Total Duration:{' '}
                {sumCardioMinsInWorkoutArray(endurancePlans.endurancex7D7)}{' '}
                Minutes | Number of Exercises:{' '}
                {endurancePlans.endurancex7D7.length}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }
  }

  return (
    <View style={{backgroundColor: '#171717', flex: 1, paddingTop: 1}}>
      <View>
        <CustomHeaderWithBack
          pageName="Begin Workout"
          backNavScreen="Fitness Home"
        />
      </View>

      <View style={{flexDirection: 'row', paddingHorizontal: 0}}>
        <TopTabBtns
          backgroundColor={loginColorAnimation}
          title="My Workouts"
          onPress={() => scrollView.current.scrollTo({x: 0})}
        />
        <TopTabBtns
          backgroundColor={registrationColorAnimation}
          title="Generated Plan"
          onPress={() => scrollView.current.scrollTo({x: width})}
        />
      </View>
      <ScrollView
        ref={scrollView}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: animation}}}],
          {useNativeDriver: false},
        )}>
        <ContainerForProfileTabs>
          <View style={{backgroundColor: '#171717', padding: 15}}>
            <FlatList
              //FLATLIST CONFIGURATION
              // ListHeaderComponent={}
              data={workoutTables}
              keyExtractor={(item, index) => index.toString()}
              //ListHeaderComponentStyle={styles.listHeader}
              contentContainerStyle={{alignContent: 'center'}}
              //
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
                <View style={{height: 600}}>
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
                      No Workouts Have Been Created{' '}
                    </Text>
                  </View>
                </View>
              )}
              renderItem={({item}) => (
                <View
                  style={{
                    width: '100%',
                    alignContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MaterialCommunityIcons
                    name="clipboard-account"
                    color="#CBC3E3"
                    size={100}
                  />
                  <View
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text
                      style={{
                        fontSize: 23,
                        color: '#CBC3E3',
                        marginBottom: 10,
                      }}>
                      {formatWorkoutName(item.name)}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      marginBottom: 20,
                    }}>
                    <Button
                      mode="contained"
                      color="#CBC3E3"
                      onPress={() => {
                        navigation.replace('Perform Workout', {
                          workoutNamePassed: item.name,
                          workoutNameFormatted: formatWorkoutName(item.name),
                        });
                      }}>
                      Perform
                    </Button>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginLeft: 15,
                      }}>
                      <Button
                        mode="contained"
                        color="#8b0000"
                        onPress={() => {
                          deleteTable(item.name);
                          navigation.replace('Begin Workout');
                        }}>
                        Delete
                      </Button>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
        </ContainerForProfileTabs>

        <ScrollView>
          <ContainerForProfileTabs>
            <View>
              {generatedUserPlan(
                userMetrics.trainingFrequency,
                userMetrics.fitnessGoal,
              )}
            </View>
          </ContainerForProfileTabs>
        </ScrollView>
      </ScrollView>
    </View>
  );
};
export default BeginWorkout;
