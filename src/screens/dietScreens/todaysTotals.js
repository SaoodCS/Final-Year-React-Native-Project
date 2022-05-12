import React, {useState, useEffect} from 'react';
import {View, Text,   StyleSheet,
  Button,
  ActivityIndicator,} from 'react-native';

import PieChart from 'react-native-pie-chart';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import CustomHeaderWithBack from '../globalComponent/customerHeaderWithBack';
// COMPONENT: GETS THE CALORIES AND MACROS THAT THE USER HAS INGESTED TODAY AS PROPS FROM THE PREVIOUS SCREEN
// GETS THE GOAL CALORIES AND MACROS OF THE USER FROM FIREBASE (BASED ON THEIR DIETARY GOAL)
// THEN DISPLAYS A PIE CHART SHOWING HOW MANY CALORIES THEY'VE INGESTED AND HOW MANY CALORIES THEY HAVE LEFT

const TodaysTotals = ({route}) => {


  // USESTATE AND USEFFECT USED HERE FOR THE ACTIVITYINDICATOR COMPONENT TO DISPLAY A LOADING ICON FOR A SHORT PERIOD WHILST BACKEND GETS DATA TO IMRPOVE USER EXPERIENCE
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  },[]);




  // USESTATE FOR USERS GOAL CALORIES AND MACROS FROM FIRESTORE:
  const [userMetrics, setUserMetrics] = useState({
    goalCalories: '',
    goalProtein: '',
    goalCarbs: '',
    goalFats: '',
  });

  const {
    goalCalories,
    goalCarbs,
    goalFats,
    goalProtein,
  } = userMetrics;

  // FUNCTION TO GET USER DIETARY GOALS FROM FIRESTORE
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
  // USEEFFECT TO RUN THE FUNCTION TO GET THE USER'S DIETARY GOALS FROM FIRESTORE:
  useEffect(() => {
    getUserFirestoreMetrics();
  }, []);






// FUNCTION: IF THE USER'S GOAL CALRORIES ARE NOT SET, THEN RETURN ONLY A LIST TELLING THEM THEIR INTAKE TOTALS FOR TODAY AND RECOMMENDING SETTING A DIETARY GOAL TO GET AN ANALYSIS:
// ELSE --> DISPLAY THE PIE CHARTS SHOWING TARGET MACROS/CALORIES VS ACTUAL MACROS/CALORIES
function checkUserGoals() {
  if (userMetrics.goalCalories == 0) {

    return (
      <View
      style={{
        backgroundColor: '#171717',
        borderWidth: 1,
        borderColor: 'grey',
        padding: 20,
        width: 395,
        height: 700
     

      }}>
      <Text
        style={{
          color: '#cbc3e3',
          fontSize: 18,
          marginTop: 5,
          fontStyle: 'italic',
    
        }}>
        Today's Total Calories: {route.params.caloriesTotalPass}g
      </Text>
      <Text
        style={{
          color:'#cbc3e3',
          fontSize: 18,
          marginTop: 5,
          fontStyle: 'italic',
        }}>
        Today's Total Protein: {route.params.proteinTotalPass}g
      </Text>
      <Text
        style={{
          color: '#cbc3e3',
          fontSize: 18,
          marginTop: 5,
          fontStyle: 'italic',
        }}>
        Today's Total Fats: {route.params.fatsTotalPass}g
      </Text>
      <Text
        style={{
          color: '#cbc3e3',
          fontSize: 18,
          marginTop: 5,
          fontStyle: 'italic',
        }}>
        Today's Total Carbs: {route.params.carbsTotalPass}g
      </Text>
      <MaterialCommunityIcons
              name="chart-arc"
              color= '#cbc3e3'
              size={250}
              style = {{alignSelf: 'center', marginTop: 20, marginBottom: 10}}
            />

      <Text
        style={{
          color: '#32cd32',
          fontSize: 18,
          marginTop: 5,
          fontStyle: 'italic',
       
        }}>
        You Have Not Yet Set A Diet Goal. Add a Diet Goal To Your Profile To See Your Target Vs Actual Nutrients Displayed On a Chart
      </Text>

    </View>
      
    )
  }
  else {
    const chartswidthAndHeight = 150; // The size of the pie chart

    // IF THE USER'S CALORIC GOAL ISN'T SET, THEN SET THE DAILY CALORIC AND MACRONUTRIENTS GOALS TO 0:
  
  
    const caloriesDailyGoal = userMetrics.goalCalories;
    const caloriesConsumed = route.params.caloriesTotalPass;
  
    const caloriesRemaining = caloriesDailyGoal - caloriesConsumed;
    const caloriesSeriesChart = [caloriesConsumed, caloriesRemaining]; 
    const caloriesSliceColorChart = ['#8b0000', '#013220'];
  
  
    const proteinDailyGoal = userMetrics.goalProtein;
    const proteinConsumed = route.params.proteinTotalPass;
  
    const proteinRemaining = proteinDailyGoal - proteinConsumed;
    const proteinSeriesChart = [proteinConsumed, proteinRemaining]; //PROTEIN REMAINING:
    const proteinSliceColorChart = ['#8b0000', '#013220'];
  
    const fatsDailyGoal = userMetrics.goalFats;
    const fatsConsumed = route.params.fatsTotalPass;
  
    const fatsRemaining = fatsDailyGoal - fatsConsumed;
    const fatsSeriesChart = [fatsConsumed, fatsRemaining];
    const fatsSliceColorChart = ['#8b0000', '#013220'];
  
    const carbsDailyGoal = userMetrics.goalCarbs;
    const carbsConsumed = route.params.carbsTotalPass;
  
    const carbsRemaining = carbsDailyGoal - carbsConsumed;
    const carbsSeriesChart = [carbsConsumed, carbsRemaining];
    const carbsSliceColorChart = ['#8b0000', '#013220'];


    // FUNCTION TO TELL THE USER WHERE THEY ARE IN RELATION TO THEIR TARGET NUTRITIONAL GOALS THROUGH TRAFFIC LIGHT COLOR SCHEME 
    function setTextColor(remainingAmount) {
      if (remainingAmount >= 0){
        return '#013220';
      }
      if((remainingAmount < 0) && (remainingAmount >= -20)) {
        return '#d53600';
      }
      if(remainingAmount < -20) {
        return '#8b0000';
      }

    }

    // FUNCTION TO SET THE COLOUR OF THE PIE CHART DEPENDING ON THE USERS PROGRESS:

    function setPieChartColor(consumedAmount, dailyGoal) {
      if (consumedAmount > dailyGoal) {
        const colourScheme = ['#8b0000', '#8b0000']
        return colourScheme;
      }
      else {
        const colourScheme = ['#ff8503', '#013220']
        return colourScheme;
      }
    }



    return (
      <ScrollView>

       <View
          style={{
            backgroundColor: 'white',
            alignItems: 'center',
            padding: 15,
            borderWidth: 1,
            width: 400
            
        
          }}>
          <Text
            style={{
              backgroundColor: 'white',
              color: '#301934',
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 5,
            }}>
            Calories
          </Text>

          <PieChart
            widthAndHeight={chartswidthAndHeight}
            series={caloriesSeriesChart}
            sliceColor={setPieChartColor(caloriesConsumed, caloriesDailyGoal)}
            doughnut={true}
          />

          <Text style={{color: '#301934', fontSize: 18, fontWeight: 'bold'}}>
            Carlories Consumed = {caloriesConsumed}g
          </Text>
          <Text style={{color: '#301934', fontSize: 18, fontWeight: 'bold'}}>
            Daily Calorie Goal = {caloriesDailyGoal}g
          </Text>
          <Text style={{color: setTextColor(caloriesRemaining), fontSize: 18, fontWeight: 'bold'}}>
            Calories Remaining = {caloriesRemaining}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: 'grey',
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
            Protein
          </Text>
          <PieChart
            widthAndHeight={chartswidthAndHeight}
            series={proteinSeriesChart}
            sliceColor={setPieChartColor(proteinConsumed, proteinDailyGoal)}
            doughnut={true}
          />
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
            Protein Consumed = {proteinConsumed}g
          </Text>
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
            Daily Protein Goal = {proteinDailyGoal}g
          </Text>
          <Text style={{color: setTextColor(proteinRemaining), fontSize: 18, fontWeight: 'bold'}}>
            Protein Remaining = {proteinRemaining}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: 'white',
            alignItems: 'center',
            padding: 15,
            borderWidth: 1,
          }}>
          <Text
            style={{
              backgroundColor: 'white',
              color: '#301934',
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 5,
            }}>
            Fats
          </Text>
          <PieChart
            widthAndHeight={chartswidthAndHeight}
            series={fatsSeriesChart}
            sliceColor={setPieChartColor(fatsConsumed, fatsDailyGoal)}
            doughnut={true}
          />
          <Text style={{color: '#301934', fontSize: 18, fontWeight: 'bold'}}>
            Total Fats Consumed Today = {fatsConsumed}g
          </Text>
          <Text style={{color: '#301934', fontSize: 18, fontWeight: 'bold'}}>
            Daily Fats Goal = {fatsDailyGoal}g
          </Text>
          <Text style={{color: setTextColor(fatsRemaining), fontSize: 18, fontWeight: 'bold'}}>
            Fats Remaining = {fatsRemaining}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: 'grey',
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
            Carbs
          </Text>
          <PieChart
            widthAndHeight={chartswidthAndHeight}
            series={carbsSeriesChart}
            sliceColor={setPieChartColor(carbsConsumed, carbsDailyGoal)}
            doughnut={true}
          />
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold', fontWeight: 'bold'}}>
            Carbs Consumed = {carbsConsumed}g
          </Text>
          <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
            Daily Carbs Goal = {carbsDailyGoal}g
          </Text>
          <Text style={{color: setTextColor(carbsRemaining), fontSize: 18, fontWeight: 'bold'}}>
            Carbs Remaining = {carbsRemaining}
          </Text>
        </View>
        
      </ScrollView>

    )
  }
}










// IF THE USER'S CALRIC GOAL ISN'T SET, THEN DISPLAY TEXT INFORMING THEM TO SET THEIR DIETARY GOALS TO SEE A PIE CHART OF THEIR NUTRITIONAL PROGRESS TODAY:

  // MAIN RENDER:
  return (
<ScrollView style = {{backgroundColor: '#cbc3e3'}} >
<CustomHeaderWithBack pageName="Today's Intake" backNavScreen="Diet Home" />
  
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
        <Text >
    {checkUserGoals()}
  </Text>
          </>
        )}

</ScrollView>
  );
};

export default TodaysTotals;


const styles = StyleSheet.create({

// STYLES SHHEETS FOR THE ACTIVITY INDICATOR LOADING
  spinnerTextStyle: {
    color: 'red',
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 560
 }
});
