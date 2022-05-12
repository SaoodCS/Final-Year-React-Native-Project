import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Dimensions} from 'react-native';

import CustomHeaderWithBack from '../globalComponent/customerHeaderWithBack';

import {useNavigation} from '@react-navigation/native';

import {FlatList} from 'react-native-gesture-handler';

import {Button} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';

// COMPONENT: DISPLAYS BOTH THE DEFAULT BACK EXERCISES AND USER-CREATED BACK EXERCISES IN ONE FLATLIST FOR THE USER TO PRESS ON AND VIEW THEIR PROGRESS ON THE DISPLAYEXPROGRESS COMPONENT

// DB TO GET AND DISPLAY USER CREATED EXERCISES
var db = openDatabase({name: 'userExercises.db'});

const BackProgress = ({route}, props) => {
  const navigation = useNavigation();

  // DB TO GET AND DISPLAY THE DEFAULT EXERCISES FROM THE JSON FILE IN-APP
  const exercisesdb = require('./exercisesDatabase.json');

  let [savedExflatListItems, setSavedExFlatListItems] = useState([]);

  // USEEFFECT TO GET THE SPECIFIC USER-CREATED MUSCLE GROUP EXERCISES FROM THE SQLITE DB
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM user_exercises WHERE exercise_musclegroup = "Back"',
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

  // FUNCTION TO FILTER OUT ALL OTHER EXERCISES IN THE DEFAULT EXERCISES JSON FILE EXCEPT FOR THE SPECIFIC COMPONENT'S EXERCISE TO DISPLAY ON THE SCREEN
  function filterOutRows(database) {
    const result = database.filter(item => item.MuscleGroup != 'Chest');
    const result2 = result.filter(item => item.MuscleGroup != 'Biceps');
    const result3 = result2.filter(item => item.MuscleGroup != 'Shoulders');
    const result4 = result3.filter(item => item.MuscleGroup != 'Abs');
    const result5 = result4.filter(item => item.MuscleGroup != 'Triceps');
    const result6 = result5.filter(item => item.MuscleGroup != 'Legs');
    const result7 = result6.filter(item => item.MuscleGroup != 'Full Body');

    return result7;
  }
  const backExercises = filterOutRows(exercisesdb);

  // FUNCTION TO CHANGE THE LABEL OF THE USER'S SAVED MUSCLEGROUP EXERCISES SO THAT THEY MATCH THE JSON LABELS AND CAN BE CONCATENATED WITH THE DEFAULT MUSCLEGROUP EXERCISES:
  const changeLabels = savedExflatListItems.map(function (row) {
    return {
      Exercise: row.exercise_name,
      MuscleGroup: row.exercise_musclegroup,
      Type: row.exercise_type,
      Equipment: row.exercise_equipment,
    };
  });

  const concatDefaultNSavedExercises = backExercises.concat(changeLabels);
  return (
    <View style={{backgroundColor: '#171717', height: 700}}>
      <ScrollView>
        <CustomHeaderWithBack
          pageName="Back Exercises Progress"
          backNavScreen="Exercise Progress"
        />

        <View style={{backgroundColor: '#171717', padding: 15}}>
          <FlatList
            data={concatDefaultNSavedExercises}
            keyExtractor={(item, index) => index.toString()}
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
                    marginBottom: 10,
                    marginTop: 10,
                  }}>
                  {item.Exercise}
                </Text>
                <Text
                  style={{fontSize: 13, marginBottom: 10, color: '#CBC3E3'}}>
                  {' '}
                  Type: {item.Type} | Equipment: {item.Equipment}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}>
                  <Button
                    style={{
                      alignSelf: 'center',
                    }}
                    mode="contained"
                    color="#CBC3E3"
                    onPress={() => {
                      navigation.navigate('Display Progress', {
                        nameOfPreviousScrn: 'Back Progress',
                        exerciseName: item.Exercise,
                      });
                    }}>
                    View Progress
                  </Button>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
};
export default BackProgress;
