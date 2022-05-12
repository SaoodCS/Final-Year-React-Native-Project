import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
import {ScrollView} from 'react-native-gesture-handler';

import CustomHeaderWithBack from '../globalComponent/customerHeaderWithBack';

import {LineChart} from 'react-native-chart-kit';

import {Dimensions} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
// COMPONENT: DISPLAYS THE USERS DIETARY PROGRESS IN RELATION TO THEIR INTAKES DAY BY DAY AND THE DIETARY GOAL THEY SET IN THE PROFILE SECTION OF THE APP

const screenWidth = Dimensions.get('window').width;

// THE SQLITE DATABASE THAT STORES THE USERS NUTRITIONAL INTAKE HISTORY
var db = openDatabase({name: 'foodsIntakeHistory.db'});

const DailyIntakeProgressScreen = ({route}) => {

    // USESTATE AND USEFFECT USED HERE FOR THE ACTIVITYINDICATOR COMPONENT TO DISPLAY A LOADING ICON FOR A SHORT PERIOD WHILST BACKEND GETS DATA TO IMRPOVE USER EXPERIENCE
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    },[]);





  // USESTATE'S FOR ALL THE COLUMNS FROM THE DB TABLE
  let [dateHistory, setDateHistory] = useState([]);
  let [caloriesHistory, setCaloriesHistory] = useState([]);
  let [proteinHistory, setProteinHistory] = useState([]);
  let [fatsHistory, setFatsHistory] = useState([]);
  let [carbsHistory, setCarbsHistory] = useState([]);

  //USESTATES FOR THE USERS DIETARY GOAL DATA FROM FIRESTORE
  const [userGoals, setUserGoals] = useState({
    fitnessGoal: '',
    idealWeight: '',
    idealWeeks: '',
    TDEE: '',
    goalCalories: '',
    goalProtein: '',
    goalCarbs: '',
    goalFats: '',
  });

  // USEEFFECTS TO GET ALL THE USERS FOOD INTAKE HISTORY FROM THE SQLITE DB TABLE:

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT today_date FROM total_daily_nutrients',
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
        'SELECT total_cals FROM total_daily_nutrients',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setCaloriesHistory(temp);
        },
      );
    });
  }, []);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT total_protein FROM total_daily_nutrients',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setProteinHistory(temp);
        },
      );
    });
  }, []);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT total_carbs FROM total_daily_nutrients',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setCarbsHistory(temp);
        },
      );
    });
  }, []);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT total_fats FROM total_daily_nutrients',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setFatsHistory(temp);
        },
      );
    });
  }, []);

  const {
    fitnessGoal,
    idealWeight,
    idealWeeks,
    TDEE,
    goalCalories,
    goalProtein,
    goalCarbs,
    goalFats,
  } = userGoals;

  // FUNCTION TO GET THE USER'S DIETARY GOALS FROM FIRESTORE
  const getUserFirestoreMetrics = async () => {
    await firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserGoals(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    getUserFirestoreMetrics();
  }, []);

  // FUNCTION: FORMATS THE DATE ARRAY FROM SQLITE SO THAT IT'S ELIGIBLE FOR USE IN THE LINECHART COMPONENT:
  var dateHistoryArray = new Array();

  function formatDateHistoryArray(dateHistory) {
    const dateHistoryString = JSON.stringify(dateHistory);
    const formatDateHistory = dateHistoryString.replace(/today_date/g, '');
    const formatDateHistory2 = formatDateHistory.replace(/_/g, '/');
    const formatDateHistory3 = formatDateHistory2.replace(/":"/g, '');
    const formatDateHistory4 = formatDateHistory3.replace(/{/g, '');
    const formatDateHistory5 = formatDateHistory4.replace(/}/g, '');
    const formatDateHistory6 = formatDateHistory5.replace(/"/g, '');
    const formatDateHistory7 = formatDateHistory6.replace(/[\[\]']+/g, '');
    dateHistoryArray = formatDateHistory7.split(',');
    return dateHistoryArray;
  }

  // FUNCTION: FORMATS THE CALORIES ARRAY FROM SQLITE SO THAT IT'S ELIGIBLE FOR USE IN THE LINECHART COMPONENT:
  var calsHistoryArray = new Array();
  function formatCalsHistoryArray(caloriesHistory) {
    const caloriesHistoryString = JSON.stringify(caloriesHistory);
    const formatCalsHistory = caloriesHistoryString.replace(/total_cals/g, '');
    const formatCalsHistory2 = formatCalsHistory.replace(/_/g, '/');
    const formatCalsHistory3 = formatCalsHistory2.replace(/":"/g, '');
    const formatCalsHistory4 = formatCalsHistory3.replace(/{/g, '');
    const formatCalsHistory5 = formatCalsHistory4.replace(/}/g, '');
    const formatCalsHistory6 = formatCalsHistory5.replace(/"/g, '');
    const formatCalsHistory7 = formatCalsHistory6.replace(/[\[\]']+/g, '');
    const formatCalsHistory8 = formatCalsHistory7.replace(/:/g, '');
    const formatCalsHistory9 = formatCalsHistory8.replace(/NaN/g, '0');
    var calsHistoryArrayPre = new Array();
    calsHistoryArrayPre = formatCalsHistory9.split(',');
    calsHistoryArray = calsHistoryArrayPre.map(Number);

    return calsHistoryArray;
  }

  // CALORIES VS DATE DATA TO BE SHOWN ON THE LINE GRAPH:
  const caloriesData = {
    labels: formatDateHistoryArray(dateHistory),
    datasets: [
      {
        data: formatCalsHistoryArray(caloriesHistory),
      },
    ],
  };

  // THE CONFIGURATION AND DESIGN FOR THE CALORIES VS DATE LINE GRAPH:
  const chartConfigCalories = {
    backgroundGradientFrom: '#171717',
    backgroundGradientFromOpacity: 2,
    backgroundGradientTo: '#171717',
    backgroundGradientToOpacity: 0.7,
    color: (opacity = 1) => `rgba(203, 195, 227, ${opacity})`,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  // FUNCTION: FORMATS THE PROTEIN ARRAY FROM SQLITE SO THAT IT'S ELIGIBLE FOR USE IN THE LINECHART COMPONENT:
  var proteinHistoryArray = new Array();
  function formatProteinHistoryArray(proteinHistory) {
    const proteinHistoryString = JSON.stringify(proteinHistory);
    const formatProteinHistory = proteinHistoryString.replace(
      /"total_protein"/g,
      '',
    );
    const formatProteinHistory1 = formatProteinHistory.replace(/NaN/g, '0');
    const formatProteinHistory2 = formatProteinHistory1.replace(/{/g, '');
    const formatProteinHistory3 = formatProteinHistory2.replace(/"/g, '');
    const formatProteinHistory4 = formatProteinHistory3.replace(/}/g, '');
    const formatProteinHistory5 = formatProteinHistory4.replace(/:/g, '');
    const formatProteinHistory6 = formatProteinHistory5.replace(
      /[\[\]']+/g,
      '',
    );
    var proteinHistoryArrayPre = new Array();
    proteinHistoryArrayPre = formatProteinHistory6.split(',');
    proteinHistoryArray = proteinHistoryArrayPre.map(Number);

    return proteinHistoryArray;
  }

  // PROTEIN VS DATE DATA TO BE SHOWN ON THE LINE GRAPH:
  const proteinData = {
    labels: formatDateHistoryArray(dateHistory),
    datasets: [
      {
        data: formatProteinHistoryArray(proteinHistory),
      },
    ],
  };
  // THE CONFIGURATION AND DESIGN FOR THE PROTEIN VS DATE LINE GRAPH:
  const chartConfigProtein = {
    backgroundGradientFrom: '#DCDCDC',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#DCDCDC',
    backgroundGradientToOpacity: 0.7,
    color: (opacity = 1) => `rgba(128,0,128, ${opacity})`,
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  // FUNCTION: FORMATS THE FATS ARRAY FROM SQLITE SO THAT IT'S ELIGIBLE FOR USE IN THE LINECHART COMPONENT:
  var fatsHistoryArray = new Array();

  function formatFatsHistoryArray(fatsHistory) {
    const fatsHistoryString = JSON.stringify(fatsHistory);
    const formatFatsHistory = fatsHistoryString.replace(/"total_fats"/g, '');
    const formatFatsHistory1 = formatFatsHistory.replace(/NaN/g, '0');
    const formatFatsHistory2 = formatFatsHistory1.replace(/{/g, '');
    const formatFatsHistory3 = formatFatsHistory2.replace(/"/g, '');
    const formatFatsHistory4 = formatFatsHistory3.replace(/}/g, '');
    const formatFatsHistory5 = formatFatsHistory4.replace(/:/g, '');
    const formatFatsHistory6 = formatFatsHistory5.replace(/[\[\]']+/g, '');
    var fatsHistoryArrayPre = new Array();
    fatsHistoryArrayPre = formatFatsHistory6.split(',');
    fatsHistoryArray = fatsHistoryArrayPre.map(Number);

    return fatsHistoryArray;
  }

  // FATS VS DATE DATA TO BE SHOWN ON THE LINE GRAPH:
  const fatsData = {
    labels: formatDateHistoryArray(dateHistory),
    datasets: [
      {
        data: formatFatsHistoryArray(fatsHistory),
      },
    ],
  };

  // THE CONFIGURATION AND DESIGN FOR THE FATS VS DATE LINE GRAPH:
  const chartConfigFats = {
    backgroundGradientFrom: '#DCDCDC',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#DCDCDC',
    backgroundGradientToOpacity: 0.7,
    color: (opacity = 1) => `rgba(128,0,128, ${opacity})`,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  // FUNCTION: FORMATS THE CARBS ARRAY FROM SQLITE SO THAT IT'S ELIGIBLE FOR USE IN THE LINECHART COMPONENT:

  var carbsHistoryArray = new Array();

  function formatCarbsHistoryArray(carbsHistory) {
    const carbsHistoryString = JSON.stringify(carbsHistory);
    const formatCarbsHistory = carbsHistoryString.replace(/"total_carbs"/g, '');
    const formatCarbsHistory1 = formatCarbsHistory.replace(/NaN/g, '0');
    const formatCarbsHistory2 = formatCarbsHistory1.replace(/{/g, '');
    const formatCarbsHistory3 = formatCarbsHistory2.replace(/"/g, '');
    const formatCarbsHistory4 = formatCarbsHistory3.replace(/}/g, '');
    const formatCarbsHistory5 = formatCarbsHistory4.replace(/:/g, '');
    const formatCarbsHistory6 = formatCarbsHistory5.replace(/[\[\]']+/g, '');
    var carbsHistoryArrayPre = new Array();
    carbsHistoryArrayPre = formatCarbsHistory6.split(',');
    carbsHistoryArray = carbsHistoryArrayPre.map(Number);

    return carbsHistoryArray;
  }

  // CARBS VS DATE DATA TO BE SHOWN ON THE LINE GRAPH:
  const carbsData = {
    labels: formatDateHistoryArray(dateHistory),
    datasets: [
      {
        data: formatCarbsHistoryArray(carbsHistory),
      },
    ],
  };
  // THE CONFIGURATION AND DESIGN FOR THE CARBS VS DATE LINE GRAPH:
  const chartConfigCarbs = {
    backgroundGradientFrom: '#DCDCDC',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#DCDCDC',
    backgroundGradientToOpacity: 0.7,
    color: (opacity = 1) => `rgba(128,0,128, ${opacity})`,
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  // FUNCTION FOR CALCULATING AVERAGE CALORIES AND MACROS CONSUMED DAILY: REFERENCE: https://flexiple.com/get-average-of-array-javascript
  function calculateAverage(array) {
    var total = 0;
    var count = 0;

    array.forEach(function (item, index) {
      total += item;
      count++;
    });

    return total / count;
  }

  function getAvgCals(caloriesHistory) {
    const calsArray = formatCalsHistoryArray(caloriesHistory);
    return calculateAverage(calsArray);
  }

  function getAvgProtein(proteinHistory) {
    const proteinArray = formatProteinHistoryArray(proteinHistory);
    return calculateAverage(proteinArray);
  }

  function getAvgCarbs(carbsHistory) {
    const carbsArray = formatCarbsHistoryArray(carbsHistory);
    return calculateAverage(carbsArray);
  }

  function getAvgFats(fatsHistory) {
    const fatsArray = formatFatsHistoryArray(fatsHistory);
    return calculateAverage(fatsArray);
  }

  // FUNCTION FOR TELLING THE USER THEIR PROGRESS IN TERMS OF THEIR DAILY FOOD INTAKE AND THEIR DIETARY GOAL IF THEIR DIETARY GOAL HAS BEEN SET
  // DISPLAYS A MESSAGE WHETHER THEY ARE, OVERALL, ON TRACK, EXCEEDING, OR FALLING BEHIND THEIR DIETARY GOAL
  function userCaloricAnalysis(caloriesHistory) {
    if (userGoals.idealWeight == 0) {
      return;
    } else {
      const userAverageCalories = getAvgCals(caloriesHistory);
      if (userAverageCalories > goalCalories) {
        const difference = Math.round(userAverageCalories - goalCalories);
        return (
          'You are exceeding your target calories (on average) by ' +
          difference +
          ' kcals'
        );
      }
      if (userAverageCalories < goalCalories) {
        const difference = Math.round(goalCalories - userAverageCalories);
        return (
          'You are below your target calories (on average) by ' +
          difference +
          ' kcals'
        );
      }
      if (userAverageCalories == goalCalories) {
        return 'You are on track for achieving your dietary goal! Keep going!';
      }
    }
  }

  function userProteinAnalysis(proteinHistory) {
    if (userGoals.idealWeight == 0) {
      return;
    } else {
      const userAverageProtein = getAvgProtein(proteinHistory);
      if (userAverageProtein > goalProtein) {
        const difference = Math.round(userAverageProtein - goalProtein);
        return (
          'You are exceeding your target protein intake (on average) by ' +
          difference +
          'g'
        );
      }
      if (userAverageProtein < goalProtein) {
        const difference = Math.round(goalProtein - userAverageProtein);
        return (
          'You are below your target protein (on average) by ' +
          difference +
          'g'
        );
      }
      if (userAverageProtein == goalProtein) {
        return 'You are on track in terms of your daily average protein intake! Keep going!';
      }
    }
  }

  function userCarbsAnalysis(carbsHistory) {
    if (userGoals.idealWeight == 0) {
      return;
    } else {
      const userAverageCarbs = getAvgCarbs(carbsHistory);
      if (userAverageCarbs > goalCarbs) {
        const difference = Math.round(userAverageCarbs - goalCarbs);
        return (
          'You are exceeding your target carbs intake (on average) by ' +
          difference +
          'g'
        );
      }
      if (userAverageCarbs < goalCarbs) {
        const difference = Math.round(goalCarbs - userAverageCarbs);
        return (
          'You are below your target carbs (on average) by ' +
          difference +
          'g'
        );
      }
      if (userAverageCarbs == goalCarbs) {
        return 'You are on track in terms of your average carbs intake! Keep going!';
      }
    }
  }

  function userFatsAnalysis(fatsHistory) {
    if (userGoals.idealWeight == 0) {
      return;
    } else {
      const userAverageFats = getAvgFats(fatsHistory);
      if (userAverageFats > goalFats) {
        const difference = Math.round(userAverageFats - goalFats);
        return (
          'You are exceeding your target fats intake (on average) by ' +
          difference +
          'g'
        );
      }
      if (userAverageFats < goalFats) {
        const difference = Math.round(goalFats - userAverageFats);
        return (
          'You are below your target fats (on average) by ' +
          difference +
          'g'
        );
      }
      if (userAverageFats == goalFats) {
        return 'You are on track in terms of your daily average fats intake! Keep going!';
      }
    }
  }

  // MAIN RENDER:
  return (
    <View style = {{backgroundColor: '#cbc3e3', height: 700}}>
      <CustomHeaderWithBack
        pageName="Dietary Progress"
        backNavScreen="Diet Home"
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
      <ScrollView style = {{backgroundColor: '#171717'}}>
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
            Calories Progress
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#171717',
            alignItems: 'center',
            padding: 3,
            margintop: 10

          }}>
          <Text
            style={{
              color: '#cbc3e3',
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 15,
              fontStyle: 'italic',
              marginTop: 25,
              paddingRight: 20,
              paddingLeft: 20
            }}>
            {userCaloricAnalysis(caloriesHistory)}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#171717',
            alignItems: 'center',
            padding: 15,
            marginRight: 20,
            width: 360
          }}>
          <LineChart
            data={caloriesData}
            width={Dimensions.get('window').width - 16}
            height={200}
            chartConfig={chartConfigCalories}
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
            Fats Progress
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#171717',
            alignItems: 'center',
       
            margintop: 10
      
          }}>
          <Text
            style={{
              color: '#cbc3e3',
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 15,
              fontStyle: 'italic',
              marginTop: 30,
              paddingRight: 20,
              paddingLeft: 20
            }}>
            {userFatsAnalysis(fatsHistory)}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#171717',
            alignItems: 'center',
            padding: 15,
            marginRight: 20,
            width: 360
          }}>
          <LineChart
            data={fatsData}
            width={Dimensions.get('window').width - 16}
            height={200}
            chartConfig={chartConfigCalories}
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
            Protein Progress
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#171717',
            alignItems: 'center',
       
            margintop: 10

          }}>
          <Text
            style={{
              color: '#cbc3e3',
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 15,
              fontStyle: 'italic',
              marginTop: 30,
              paddingRight: 22,
              paddingLeft: 22
            }}>
            {userProteinAnalysis(proteinHistory)}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#171717',
            alignItems: 'center',
            padding: 15,
            marginRight: 20,
            width: 360
          }}>
          <LineChart
            data={proteinData}
            width={Dimensions.get('window').width - 16}
            height={200}
            chartConfig={chartConfigCalories}
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
            Carbs Progress{' '}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#171717',
            alignItems: 'center',
       
            margintop: 10

          }}>
          <Text
            style={{
              color: '#cbc3e3',
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 15,
              fontStyle: 'italic',
              marginTop: 30,
              paddingRight: 20,
              paddingLeft: 20
            }}>
            {userCarbsAnalysis(carbsHistory)}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#171717',
            alignItems: 'center',
            padding: 15,
            marginRight: 20,
            width: 360
          }}>
          <LineChart
            data={carbsData}
            width={Dimensions.get('window').width - 16}
            height={200}
            chartConfig={chartConfigCalories}
          />
        </View>


      </ScrollView>
          </>
        )}








    </View>
  );
};

export default DailyIntakeProgressScreen;

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
  