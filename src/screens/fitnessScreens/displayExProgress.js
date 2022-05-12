import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Dimensions, ActivityIndicator, StyleSheet} from 'react-native';

import CustomHeaderWithBack from '../globalComponent/customerHeaderWithBack';

import {openDatabase} from 'react-native-sqlite-storage';

import {LineChart} from 'react-native-chart-kit';

// SCREEN DISPLAYING LINE GRAPHS ANALYSING THE PROGRESS THE USER HAS BEEN MAKING ON A PARTICULAR EXERCISE THEY PRESSED ON THE PREVIOUS SCREEN

const screenWidth = Dimensions.get('window').width;

// SQLITE DB THAT CONTAINS THE EXERCISE'S HISTORY:
var db = openDatabase({name: 'userWorkoutHistory.db'});

const DisplayExProgress = ({route}, props) => {

    // USESTATE AND USEFFECT USED HERE FOR THE ACTIVITYINDICATOR COMPONENT TO DISPLAY A LOADING ICON FOR A SHORT PERIOD WHILST BACKEND GETS DATA TO IMRPOVE USER EXPERIENCE
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    },[]);


  // GETTING THE NAME OF THE PREVIOUS SCREEN SO THAT WHEN THE USER PRESSES THE BACK BUTTON ON THE HEADER THEY ARE NAVIGATED BACK TO THAT SCREEN
  const nameOfPrevScrn = route.params.nameOfPreviousScrn;

  // GETTING THE NAME OF THE EXERCISE THAT THE USER PRESSED ON THE PREVIOUS SCREEN TO DISPLAY THE PROGRESS FOR THAT PARTICULAR EXERCISE
  const exerciseName = route.params.exerciseName;

  // USESTATE FOR THE EXERCISE'S SQLITE TABLE:
  let [flatListItems, setFlatListItems] = useState([]);

  // THE NAME OF THE EXERCISE'S TABLE STORED IN THE SQLITE DATABASE
  const exerciseNameFormatted = getExerciseTableName(exerciseName);
  // USEEFFECT TO GET THE EXERICE HISTORY FROM THE SQLITE TABLE
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM ' + exerciseNameFormatted,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setFlatListItems(temp);
        },
      );
    });
  }, []);

  // FORMATTING THE EXERCISE NAME FROM THE SQLITE VERSION OF THE NAME SO THAT IT'S ELIGIBLE TO DISPLAY ON THE SCREEN
  function formatExerciseName(exerciseTableName) {
    const exerciseName1 = exerciseTableName.replace(/_/g, ' ');
    const exerciseName = exerciseName1.replace(/(^\w|\s\w)/g, m =>
      m.toUpperCase(),
    ); // REG EXPRESSION TAKEN FROM: https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript
    return exerciseName;
  }

  //FUNCTION TO FORMAT THE EXERCISE'S NAME SO THAT IT'S ELIGIBLE AS A SQLITE TABLE NAME:
  function getExerciseTableName(exerciseName) {
    const exerciseNameTable1 = exerciseName.toLocaleLowerCase();
    const exerciseNameTable2 = exerciseNameTable1.replace(/\s/g, '_');
    const exerciseNameTable3 = exerciseNameTable2.replace(/-/g, '_');
    return exerciseNameTable3;
  }

  // REPS VS DATE ARRAYS FOR GRAPH

  // THIS FUNCTION MAKES USE OF THE REDUCE FUNCTION IN JS ES6:
  // ADD ALL THE EXERCISE REPS TOGETHER WHERE THE DATE (WORKOUT) IS THE SAME VALUE -->
  // THEN APPEND INTO THE NEW ARRAY CALLED FINALRESULT WHERE THE DATE IS THE KEY AND THE REPS ARE THE SUMMED RESULTS.
  // THIS PRODUCES AN ARRAY WHERE EACH DATE OCCUPIES ONE ROW AND EACH ROW HAS A COLUMN THAT IS THE SUM OF ALL THE REPS COMPLETED ON THAT DATE FOR THE EXERCISE.
  const newResults = flatListItems.reduce(
    (acc, item) => ({
      ...acc,
      [item.today_date]: (acc[item.today_date] || 0) + item.exercise_reps,
    }),
    {},
  );

  const finalResult = Object.keys(newResults).map(key => ({
    date: key,
    reps: newResults[key],
  }));

  // SEPERATING THE DATE ARRAY AND REPS ARRAY FOR USE IN THE LINE GRAPH COMPONENT:
  let dateArray = finalResult.map((item, index, arr) => {
    return item.date;
  });

  let repsArray = finalResult.map((item, index, arr) => {
    return item.reps;
  });

  // DOING THE SAME FOR THE NUMBER OF SETS, EXCEPT THIS TIME THE NUMBER OF SETS IS SIMPLY HOW MANY OF THE SAME DATE ENTRY ROWS THERE ARE IN THE TABLE
  const setsPerWorkout = flatListItems.reduce(function (r, a) {
    r[a.today_date] = (r[a.today_date] || 0) + 1;
    return r;
  }, {});

  const setsVals = Object.keys(setsPerWorkout).map(key => setsPerWorkout[key]);

  // DOING THE SAME THING AS DONE FOR REPS BUT FOR WEIGHT LIFTED:
  const newResults2 = flatListItems.reduce(
    (acc, item) => ({
      ...acc,
      [item.today_date]: (acc[item.today_date] || 0) + item.exercise_weight,
    }),
    {},
  );

  const finalResult2 = Object.keys(newResults2).map(key => ({
    date: key,
    weight: newResults2[key],
  }));

  let weightArray = finalResult2.map((item, index, arr) => {
    return item.weight;
  });

  //FINDING THE AVERAGE WEIGHT LIFTED BY DIVIDING THE SUMMED WEIGHTS BY THE NUMBER OF SETS COMPLETED
  var weightAvgArray = weightArray.map(function (n, i) {
    return n / setsVals[i];
  });

  // CALCULATE THE VOLUME BY: REPS X SETS (WHICH IS ALREADY DONE BY SUMMING UP ALL THE REPS OF THAT EXERCISE IN THE WORKOUT) X AVG WEIGHT:
  var volume = weightAvgArray.map(function (n, i) {
    return n * repsArray[i];
  });

  // GET THE HIGHEST WEIGHT VALUE FROM THE ARRAY TO SHOW THE PERSONAL RECORDS:
  var maxWeightVal = Math.max.apply(
    Math,
    flatListItems.map(function (o) {
      return o.exercise_weight;
    }),
  );
// THIS IF STATEMENT HANDLES THE CASE IF THE USER HASN'T LOGGED A SET WITH A WEIGHT FOR THIS EXERCISE
  if(!(isFinite(maxWeightVal))) {
    maxWeightVal = 0;
  }

  // FUNCTION TO DISPLAY THE USER'S PERSONAL RECORD SET IN TERMS OF THE HIGHEST WEIGHT THEY HAVE LIFTED 
  function displayWeightPR() {
    if (maxWeightVal == 0) {
      return (
        <Text>You Have Not Yet Performed This Exercise</Text>
      )
    }
    else {
      return (
        <Text>Your Current Personal Record For This Exercise Is {maxWeightVal}kg!</Text>
      )
    }
  }

  // FORMATTING THE WEIGHT ARRAY SO THAT IT MATCHES THE CRITERIA FOR OUTPUTTING THE GRAPH:
  var formattedWeightAvgArray = new Array();

  function formatWeightAvgArray(weightAvgArray) {
    const weightAvgString = JSON.stringify(weightAvgArray);
    const formatWeightAvg1 = weightAvgString.replace(/[\[\]']+/g, '');
    var pre = new Array();
    pre = formatWeightAvg1.split(',');
    formattedWeightAvgArray = pre.map(Number);
    return formattedWeightAvgArray;
  }

  // FORMATTING THE DATE ARRAY SO THAT IT MATCHES THE CRITERIA FOR OUTPUTTING THE GRAPH:
  var formattedDateArray = new Array();

  function formatDateArray(dateArray) {
    const dateString = JSON.stringify(dateArray);
    const formatDate1 = dateString.replace(/"/g, '');
    const formatDate2 = formatDate1.replace(/[\[\]']+/g, '');
    const formatDate3 = formatDate2.replace(/_/g, '/');
    formattedDateArray = formatDate3.split(',');
    return formattedDateArray;
  }

  // AVERAGE WEIGHTS VS DATE DATA TO BE SHOWN ON THE LINE GRAPH:
  const weightData = {
    labels: formatDateArray(dateArray),
    datasets: [
      {
        data: formatWeightAvgArray(weightAvgArray),
      },
    ],
    legend: ['Weight Lifted (kg)'],
  };

  // THE CONFIGURATION AND DESIGN FOR THE WEIGHT VS DATE LINE GRAPH:
  const chartConfigWeight = {
    backgroundColor: '#171717',
    backgroundGradientFrom: '#171717',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#171717',
    backgroundGradientToOpacity: 0.7,
    color: (opacity = 1) => `rgba(203, 195, 227, ${opacity})`,
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  var formattedVolumeArray = new Array();

  // FORMATTING THE VOLUME ARRAY SO THAT IT MATCHES THE CRITERIA FOR OUTPUTTING THE GRAPH:
  function formatVolumeArray(volume) {
    const volumeAvgString = JSON.stringify(volume);
    const formatVol1 = volumeAvgString.replace(/[\[\]']+/g, '');
    var pre = new Array();
    pre = formatVol1.split(',');
    formattedVolumeArray = pre.map(Number);
    return formattedVolumeArray;
  }
  // VOLUME VS DATE DATA TO BE SHOWN ON THE LINE GRAPH:
  const volumeData = {
    labels: formatDateArray(dateArray),
    datasets: [
      {
        data: formatVolumeArray(volume),
      },
    ],
    legend: ['Total Volume (Sets X Reps X Weight)'],
  };

  // THE CONFIGURATION AND DESIGN FOR THE VOLUME VS DATE LINE GRAPH:
  const chartConfigVolume = {
    backgroundColor: '#171717',
    backgroundGradientFrom: '#171717',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#171717',
    backgroundGradientToOpacity: 0.7,
    color: (opacity = 1) => `rgba(203, 195, 227, ${opacity})`,
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  var formattedSetsArray = new Array();
  // FORMATTING THE VOLUME SETS SO THAT IT MATCHES THE CRITERIA FOR OUTPUTTING THE GRAPH:
  function formatSetsArray(setsVals) {
    const setsAvgString = JSON.stringify(setsVals);
    const formatSets1 = setsAvgString.replace(/[\[\]']+/g, '');
    var pre = new Array();
    pre = formatSets1.split(',');
    formattedSetsArray = pre.map(Number);
    return formattedSetsArray;
  }
  // SETS VS DATE DATA TO BE SHOWN ON THE LINE GRAPH:
  const setsData = {
    labels: formatDateArray(dateArray),
    datasets: [
      {
        data: formatSetsArray(setsVals),
      },
    ],
    legend: ['Number of Sets Completed Per Workout'],
  };

  // THE CONFIGURATION AND DESIGN FOR THE SETS VS DATE LINE GRAPH:
  const chartConfigSets = {
    backgroundColor: '#171717',
    backgroundGradientFrom: '#171717',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#171717',
    backgroundGradientToOpacity: 0.7,
    color: (opacity = 1) => `rgba(203, 195, 227, ${opacity})`,
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  return (
    <View style = {{backgroundColor: '#cbc3e3', height: 700}}>
      <CustomHeaderWithBack
        pageName={formatExerciseName(exerciseName)}
        backNavScreen={nameOfPrevScrn}
      />

{loading ? (
          <ActivityIndicator
            //visibility of Overlay Loading Spinner
            visible={loading}
            //Text with the Spinner
            textContent={'Loading...'}
            //Text style of the Spinner Text
            textStyle={styles.spinnerTextStyle}
            size = "large"
            style = {styles.activityIndicator}
          />
        ) : (
          <>
      <ScrollView style={{height: 648}}>
        <View style = {{backgroundColor: '#171717', padding: 20}}>
      <Text style = {{color: '#cbc3e3', fontSize: 20, textAlign: 'center' }}>{displayWeightPR()}</Text></View>
        <View
          style={{
            backgroundColor: '#301934',
            alignItems: 'center',
            padding: 15,
            borderWidth: 1,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 5,
            }}>
            Average Weight Lifted Per Exercise:
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#171717',
            alignItems: 'center',
            padding: 15,
          }}>
          <LineChart
            data={weightData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfigWeight}
          />
        </View>

        <View
          style={{
            backgroundColor: '#301934',
            alignItems: 'center',
            padding: 15,
            borderWidth: 1,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 5,
            }}>
            Volume of Exercise Per Workout:
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#171717',
            alignItems: 'center',
            padding: 15,
          }}>
          <LineChart
            data={volumeData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfigVolume}
          />
        </View>

        <View
          style={{
            backgroundColor: '#301934',
            alignItems: 'center',
            padding: 15,
            borderWidth: 1,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 5,
            }}>
            Number of Exercise Sets Completed :
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#171717',
            alignItems: 'center',
            padding: 15,
          }}>
          <LineChart
            data={setsData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfigSets}
          />
        </View>
      </ScrollView>
          </>
        )}
     

    </View>
  );
};
export default DisplayExProgress;

const styles = StyleSheet.create({

  // STYLES SHHEETS FOR THE ACTIVITY INDICATOR LOADING
    spinnerTextStyle: {
      color: 'red',
    },
    activityIndicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 100
   }
  });
  