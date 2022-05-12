import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator,} from 'react-native';

import CustomHeaderWithBack from '../globalComponent/customerHeaderWithBack';

import {openDatabase} from 'react-native-sqlite-storage';

import {LineChart} from 'react-native-chart-kit';

// COMPONENT TO DISPLAY USER'S OVERALL WORKOUT PROGRESS BY READING THEIR WORKOUT HISTORY DATABASE TABLES

// SQLITE DATABASE CONTAINING USER'S WORKOUT HISTORY TABLES
var db = openDatabase({name: 'userWorkoutHistory.db'});

const ViewProgress = props => {

    // USESTATE AND USEFFECT USED HERE FOR THE ACTIVITYINDICATOR COMPONENT TO DISPLAY A LOADING ICON FOR A SHORT PERIOD WHILST BACKEND GETS DATA TO IMRPOVE USER EXPERIENCE
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    },[]);



  // USESTATES FOR THE USERS TOTALS METRICS OF EACH PREVIOUS WORKOUT COMPLETED FROM THE WORKOUT HISTORY DB:
  let [dateHistory, setDateHistory] = useState([]);
  let [targetRepsXSets, setTargetRepsXSets] = useState([]);
  let [actualRepsXSets, setActualRepsXSets] = useState([]);
  let [targetVsActualSets, setTargetVsActualSets] = useState([]);
  let [targetVsActualReps, setTargetVsActualReps] = useState([]);
  let [actualReps, setActualReps] = useState([]);
  let [actualSets, setActualSets] = useState([]);
  let [duration, setDuration] = useState([]);

  //USEFFECTS TO GET ALL THE DIFFERENT COLUMNS IN THE USER TOTAL_DAILY_METRICS TABLE:
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT total_duration FROM total_daily_metrics',
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

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT today_date FROM total_daily_metrics',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setDateHistory(temp);
        },
      );
    });
  }, []);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT actual_sets FROM total_daily_metrics',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setActualSets(temp);
        },
      );
    });
  }, []);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT actual_reps FROM total_daily_metrics',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setActualReps(temp);
        },
      );
    });
  }, []);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT target_vs_actual_sets FROM total_daily_metrics',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setTargetVsActualSets(temp);
        },
      );
    });
  }, []);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT target_vs_actual_reps FROM total_daily_metrics',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setTargetVsActualReps(temp);
        },
      );
    });
  }, []);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT target_reps_x_sets FROM total_daily_metrics',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setTargetRepsXSets(temp);
        },
      );
    });
  }, []);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT actual_reps_x_sets FROM total_daily_metrics',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setActualRepsXSets(temp);
        },
      );
    });
  }, []);

  // FUNCTIONS FOR FORMATTING ALL THE COLUMNS FROM THE SQLITE DATABASE SO THEY CAN BE DISPLAYED IN THE LINE GRAPH AGAINST THE WORKOUT DATE
  var dateHistoryArray = new Array();

  function formatDateHistoryArray(dateHistory) {
    const dateHistoryString = JSON.stringify(dateHistory);
    const formatDate1 = dateHistoryString.replace(/"/g, '');
    const formatDate2 = formatDate1.replace(/today_date/g, '');
    const formatDate3 = formatDate2.replace(/_/g, '/');
    const formatDate4 = formatDate3.replace(/{/g, '');
    const formatDate5 = formatDate4.replace(/}/g, '');
    const formatDate6 = formatDate5.replace(/[\[\]']+/g, '');
    const formatDate7 = formatDate6.replace(/:/g, '');
    dateHistoryArray = formatDate7.split(',');
    return dateHistoryArray;
  }

  var actualRepsArray = new Array();
  function formatActualRepsArray(actualReps) {
    const actualRepsString = JSON.stringify(actualReps);
    const formatReps1 = actualRepsString.replace(/"/g, '');
    const formatReps2 = formatReps1.replace(/actual_reps/g, '');
    const formatReps3 = formatReps2.replace(/:/g, '');
    const formatReps4 = formatReps3.replace(/[\[\]']+/g, '');
    const formatReps5 = formatReps4.replace(/{/g, '');
    const formatReps6 = formatReps5.replace(/}/g, '');
    actualRepsArray = formatReps6.split(',');
    return actualRepsArray.map(Number);
  }

  var actualSetsArray = new Array();
  function formatActualSetsArray(actualSets) {
    const actualRepsString = JSON.stringify(actualSets);
    const formatReps1 = actualRepsString.replace(/"/g, '');
    const formatReps2 = formatReps1.replace(/actual_sets/g, '');
    const formatReps3 = formatReps2.replace(/:/g, '');
    const formatReps4 = formatReps3.replace(/[\[\]']+/g, '');
    const formatReps5 = formatReps4.replace(/{/g, '');
    const formatReps6 = formatReps5.replace(/}/g, '');
    actualSetsArray = formatReps6.split(',');
    return actualSetsArray.map(Number);
  }

  var actualSetsXRepsArray = new Array();
  function formatActualSetsXRepsArray(actualRepsXSets) {
    const actualRepsString = JSON.stringify(actualRepsXSets);
    const formatReps1 = actualRepsString.replace(/"/g, '');
    const formatReps2 = formatReps1.replace(/actual_reps_x_sets/g, '');
    const formatReps3 = formatReps2.replace(/:/g, '');
    const formatReps4 = formatReps3.replace(/[\[\]']+/g, '');
    const formatReps5 = formatReps4.replace(/{/g, '');
    const formatReps6 = formatReps5.replace(/}/g, '');
    actualSetsXRepsArray = formatReps6.split(',');
    return actualSetsXRepsArray.map(Number);
  }

  var targetSetsXRepsArray = new Array();
  function formatTargetSetsXRepsArray(targetRepsXSets) {
    const actualRepsString = JSON.stringify(targetRepsXSets);
    const formatReps1 = actualRepsString.replace(/"/g, '');
    const formatReps2 = formatReps1.replace(/target_reps_x_sets/g, '');
    const formatReps3 = formatReps2.replace(/:/g, '');
    const formatReps4 = formatReps3.replace(/[\[\]']+/g, '');
    const formatReps5 = formatReps4.replace(/{/g, '');
    const formatReps6 = formatReps5.replace(/}/g, '');
    targetSetsXRepsArray = formatReps6.split(',');
    return targetSetsXRepsArray.map(Number);
  }

  var targetVsActualSetsArray = new Array();
  function formattargetVsActualSetsArray(targetVsActualSets) {
    const actualRepsString = JSON.stringify(targetVsActualSets);
    const formatReps1 = actualRepsString.replace(/"/g, '');
    const formatReps2 = formatReps1.replace(/target_vs_actual_sets/g, '');
    const formatReps3 = formatReps2.replace(/:/g, '');
    const formatReps4 = formatReps3.replace(/[\[\]']+/g, '');
    const formatReps5 = formatReps4.replace(/{/g, '');
    const formatReps6 = formatReps5.replace(/}/g, '');
    targetVsActualSetsArray = formatReps6.split(',');
    return targetVsActualSetsArray.map(Number);
  }

  var targetVsActualRepsArray = new Array();
  function formattargetVsActualRepsArray(targetVsActualReps) {
    const actualRepsString = JSON.stringify(targetVsActualReps);
    const formatReps1 = actualRepsString.replace(/"/g, '');
    const formatReps2 = formatReps1.replace(/target_vs_actual_reps/g, '');
    const formatReps3 = formatReps2.replace(/:/g, '');
    const formatReps4 = formatReps3.replace(/[\[\]']+/g, '');
    const formatReps5 = formatReps4.replace(/{/g, '');
    const formatReps6 = formatReps5.replace(/}/g, '');
    targetVsActualRepsArray = formatReps6.split(',');
    return targetVsActualRepsArray.map(Number);
  }

  var durationArray = new Array();
  function formatDurationArray(duration) {
    const actualRepsString = JSON.stringify(duration);
    const formatReps1 = actualRepsString.replace(/"/g, '');
    const formatReps2 = formatReps1.replace(/total_duration/g, '');
    const formatReps3 = formatReps2.replace(/:/g, '');
    const formatReps4 = formatReps3.replace(/[\[\]']+/g, '');
    const formatReps5 = formatReps4.replace(/{/g, '');
    const formatReps6 = formatReps5.replace(/}/g, '');
    durationArray = formatReps6.split(',');
    return durationArray.map(Number);
  }

  // FUNCTION TO DISPLAY A MESSAGE TELLING THE USER ABOUT THEIR PROGRESS:
  // DISPLAY A MESSAGE TELLING THE USER THAT THEY ARE ON TRACK IF THEIR LATEST ACTUAL SETS X REPS IS EQUAL TO OR BIGGER THAN THEIR LATEST TARGET SETS X REPS
  // IF THE ARRAY DOES NOT CONTAIN NUMBERS THEN DON'T DISPLAY ANY MESSAGE
  function displayUserProgressMsg(targetRepsXSets, actualRepsXSets) {
    const repsXSetsTarget = formatTargetSetsXRepsArray(targetRepsXSets);
    const repsXSetsTargetLatest = repsXSetsTarget.slice(-1);
    const repsXSetsActual = formatActualSetsXRepsArray(actualRepsXSets);
    const repsXSetsActualLatest = repsXSetsActual.slice(-1);

    if (repsXSetsActualLatest != 0) {
      if (parseInt(repsXSetsTargetLatest) > parseInt(repsXSetsActualLatest)) {
        return (
          <Text style={{color: '#DC143C', fontSize: 18}}>
            You are currently not on track with your targets.{' '}
          </Text>
        );
      }
      if (parseInt(repsXSetsTargetLatest) < parseInt(repsXSetsActualLatest)) {
        return (
          <Text style={{color: '#90ee90', fontSize: 18}}>
            You are currently exceeding your targets! Keep Going!{' '}
          </Text>
        );
      }

      if (parseInt(repsXSetsTargetLatest) == parseInt(repsXSetsActualLatest)) {
        return (
          <Text style={{color: 'white', fontSize: 18}}>
            You are currently on track with your targets! Keep it Up!{' '}
          </Text>
        );
      }
    } else {
      return (
        <Text style={{color: 'white', fontSize: 18}}>
          No Data To Analyse, Begin a Workout!{' '}
        </Text>
      );
    }
  }

  //MAIN RETURN:
  return (
    <View style = {{backgroundColor: '#cbc3e3', height: 700}}>
      <CustomHeaderWithBack
        pageName="Workout Progress"
        backNavScreen="Fitness Home"
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
      <View
        style={{
          backgroundColor: '#171717',

          padding: 10,
          borderBottomColor: '#CBC3E3',
          borderBottomWidth: 2,
          borderTopWidth: 2,
          borderTopColor: 'black',
        }}>
        <Text
          style={{
            color: '#CBC3E3',
            fontSize: 25,
            marginBottom: 5,
          }}>
          Summary:
        </Text>
        <Text style={{}}>
          {displayUserProgressMsg(targetRepsXSets, actualRepsXSets)}
        </Text>
      </View>

      <ScrollView style={{height: 545}}>
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
            Target VS Actual Sets X Reps Progress
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#171717',
            alignItems: 'center',
            padding: 15,
          }}>
          <LineChart
            bezier
            withHorizontalLabels={true}
            withVerticalLabels={true}
            data={{
              labels: formatDateHistoryArray(dateHistory),
              datasets: [
                {
                  data: formatTargetSetsXRepsArray(targetRepsXSets),
                  strokeWidth: 2,
                  color: (opacity = 1) => `rgba(139,0,0, ${opacity})`,
                },
                {
                  data: formatActualSetsXRepsArray(actualRepsXSets),
                  strokeWidth: 2,
                  color: (opacity = 1) => `rgba(0,100,0, ${opacity})`,
                },
              ],
              legend: ['Target Sets X Reps', 'Actual Sets X Reps'],
            }}
            width={Dimensions.get('window').width - 16}
            height={200}
            chartConfig={{
              backgroundColor: '#171717',
              backgroundGradientFrom: '#171717',
              backgroundGradientFromOpacity: 1,
              backgroundGradientTo: '#171717',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(203, 195, 227, ${opacity})`,
              barPercentage: 0.5,
              useShadowColorFromDataset: false,
            }}
            style={{
              borderRadius: 5,
            }}
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
            Duration
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#171717',
            alignItems: 'center',
            padding: 15,
          }}>
          <LineChart
            data={{
              labels: formatDateHistoryArray(dateHistory),
              datasets: [
                {
                  data: formatDurationArray(duration),
                },
              ],
              legend: ['Time Taken to Complete Workout'],
            }}
            width={Dimensions.get('window').width - 16}
            height={200}
            chartConfig={{
              backgroundColor: '#171717',
              backgroundGradientFrom: '#171717',
              backgroundGradientFromOpacity: 1,
              backgroundGradientTo: '#171717',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(203, 195, 227, ${opacity})`,
              barPercentage: 0.5,
              useShadowColorFromDataset: false,
            }}
            style={{
              borderRadius: 5,
            }}
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
            Target Reps VS Actual Reps Difference
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#171717',
            alignItems: 'center',
            padding: 15,
          }}>
          <LineChart
            data={{
              labels: formatDateHistoryArray(dateHistory),
              datasets: [
                {
                  data: formattargetVsActualRepsArray(targetVsActualReps),
                },
              ],
              legend: ['Actual Reps - Target Reps'],
            }}
            width={Dimensions.get('window').width - 16}
            height={200}
            chartConfig={{
              backgroundColor: '#171717',
              backgroundGradientFrom: '#171717',
              backgroundGradientFromOpacity: 1,
              backgroundGradientTo: '#171717',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(203, 195, 227, ${opacity})`,
              barPercentage: 0.5,
              useShadowColorFromDataset: false,
            }}
            style={{
              borderRadius: 5,
            }}
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
            Target Reps VS Actual Reps Difference
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#171717',
            alignItems: 'center',
            padding: 15,
          }}>
          <LineChart
            data={{
              labels: formatDateHistoryArray(dateHistory),
              datasets: [
                {
                  data: formattargetVsActualSetsArray(targetVsActualSets),
                },
              ],
              legend: ['Actual Sets - Target Sets'],
            }}
            width={Dimensions.get('window').width - 16}
            height={200}
            chartConfig={{
              backgroundColor: '#171717',
              backgroundGradientFrom: '#171717',
              backgroundGradientFromOpacity: 1,
              backgroundGradientTo: '#171717',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(203, 195, 227, ${opacity})`,
              barPercentage: 0.5,
              useShadowColorFromDataset: false,
            }}
            style={{
              borderRadius: 5,
            }}
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
            Target Reps VS Actual Reps Difference
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#171717',
            alignItems: 'center',
            padding: 15,
          }}>
          <LineChart
            data={{
              labels: formatDateHistoryArray(dateHistory),
              datasets: [
                {
                  data: formattargetVsActualRepsArray(targetVsActualReps),
                },
              ],
              legend: ['Actual Reps - Target Reps'],
            }}
            width={Dimensions.get('window').width - 16}
            height={200}
            chartConfig={{
              backgroundColor: '#171717',
              backgroundGradientFrom: '#171717',
              backgroundGradientFromOpacity: 1,
              backgroundGradientTo: '#171717',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(203, 195, 227, ${opacity})`,
              barPercentage: 0.5,
              useShadowColorFromDataset: false,
            }}
            style={{
              borderRadius: 5,
            }}
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
            Actual Sets
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#171717',
            alignItems: 'center',
            padding: 15,
          }}>
          <LineChart
            data={{
              labels: formatDateHistoryArray(dateHistory),
              datasets: [
                {
                  data: formatActualSetsArray(actualSets),
                },
              ],
              legend: ['Actual Sets Per Workout'],
            }}
            width={Dimensions.get('window').width - 16}
            height={200}
            chartConfig={{
              backgroundColor: '#171717',
              backgroundGradientFrom: '#171717',
              backgroundGradientFromOpacity: 1,
              backgroundGradientTo: '#171717',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(203, 195, 227, ${opacity})`,
              barPercentage: 0.5,
              useShadowColorFromDataset: false,
            }}
            style={{
              borderRadius: 5,
            }}
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
            Actual Reps
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#171717',
            alignItems: 'center',
            padding: 15,
          }}>
          <LineChart
            data={{
              labels: formatDateHistoryArray(dateHistory),
              datasets: [
                {
                  data: formatActualRepsArray(actualReps),
                },
              ],
              legend: ['Actual Reps Per Workout'],
            }}
            width={Dimensions.get('window').width - 16}
            height={200}
            chartConfig={{
              backgroundColor: '#171717',
              backgroundGradientFrom: '#171717',
              backgroundGradientFromOpacity: 1,
              backgroundGradientTo: '#171717',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(203, 195, 227, ${opacity})`,
              barPercentage: 0.5,
              useShadowColorFromDataset: false,
            }}
            style={{
              borderRadius: 5,
            }}
          />
        </View>
      </ScrollView>
          </>
        )}


    </View>
  );
};
export default ViewProgress;


const styles = StyleSheet.create({

  // STYLES SHHEETS FOR THE ACTIVITY INDICATOR LOADING
    spinnerTextStyle: {
      color: 'red',
    },
    activityIndicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   }
  });
  