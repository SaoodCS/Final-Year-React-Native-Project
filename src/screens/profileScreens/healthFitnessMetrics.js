import React, {useState, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {AuthContext} from '../../navigation/authProvider';
import ContainerForProfileTabs from './components/containerForProfileTabs';
import SettingsFormInput from './components/settingsFormInput';
import SaveSettingsbtn from './components/saveSettingsbtn';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';
import CustomHeaderWithBack from '../globalComponent/customerHeaderWithBack';

const outputError = (error, updateState) => {
  updateState(error);
  setTimeout(() => {
    updateState('');
  }, 2500);
};

const validNumberCheck = value => {
  const checkAge = /^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$/; //regular expression to ensure age is a integer
  return checkAge.test(value);
};

const HealthFitnessMetrics = () => {
  const [userMetrics, setUserMetrics] = useState({
    activityLevel: '',
    fitnessGoal: '',
    trainingFrequency: '',
    dietType: '',
    BMR: '',
    idealWeight: '',
    idealWeeks: '',
    TDEE: '',
    weight: '',
    goalCalories: '',
    goalProtein: '',
    goalCarbs: '',
    goalFats: '',
  });

  const {
    activityLevel,
    fitnessGoal,
    trainingFrequency,
    dietType,
    BMR,
    idealWeight,
    idealWeeks,
    TDEE,
    weight,
  } = userMetrics;

  const handleOnChangeText = (value, fieldName) => {
    setUserMetrics({...userMetrics, [fieldName]: value});
  };

  const getUserFirestoreMetrics = async () => {
    //-------------------------------FIRESTORE PART DO AFTER SETTING THE INPUTS
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

  useEffect(() => {
    getUserFirestoreMetrics();
  }, []);

  const validMetricsForm = () => {
    if (activityLevel == null) {
      return outputError('Please choose an activity level', setError);
    }
    if (fitnessGoal == null) {
      return outputError('Please choose a fitness level', setError);
    }
    if (trainingFrequency == null) {
      return outputError(
        'Please choose how often you can train per week',
        setError,
      );
    }
    if (dietType == null) {
      return outputError('Please choose the diet type you are', setError);
    }
    if (!validNumberCheck(idealWeight)) {
      return outputError(
        'Please Insert an Ideal Bodyweight You Would Like To Reach',
        setError,
      );
    }
    if (!validNumberCheck(idealWeeks)) {
      return outputError(
        'Please Insert The Ideal No. Of Weeks You Would Like To Reach Your Bodyweight Goal By',
        setError,
      );
    }
    return true;
  };

  const convertActivityLevel = () => {
    if (activityLevel == 'Sedentary (little or no exercise)') {
      return 1.2;
    }
    if (activityLevel == 'Lightly Active (light exercise 1-3 days/week') {
      return 1.375;
    }
    if (activityLevel == 'Moderately Active (moderate exercise 3-5 days/week') {
      return 1.55;
    }
    if (activityLevel == 'Very Active (hard exercise 6-7 days per week') {
      return 1.725;
    }
    if (
      activityLevel ==
      'Extra Active (very hard exercise + physical job 6-7 days/week'
    ) {
      return 1.9;
    }
  };

  const {updateUserMetrics} = useContext(AuthContext); //NEED TO ADD THIS FUNCTION TO AUTHPROVIDER.JS

  const currentWeightLabel =
    'Ideal Bodyweight (kg) (your current bodyweight is: ' +
    userMetrics.weight +
    'kg)';

  return (
    <ScrollView>
      <CustomHeaderWithBack
        pageName="Goals And Metrics"
        backNavScreen={'Profile Home'}
      />
      <ContainerForProfileTabs>
        {error ? (
          <Text style={{color: 'red', fontSize: 18, textAlign: 'center'}}>
            {error}
          </Text>
        ) : null}

        <Text style={{paddingTop: 10, fontWeight: 'bold', color: 'black'}}>
          Activity Level
        </Text>
        <View
          style={{
            backgroundColor: 'white',
            borderWidth: 1,
            borderRadius: 4,
            marginBottom: 20,
          }}>
          <RNPickerSelect
            value={activityLevel}
            onValueChange={value => handleOnChangeText(value, 'activityLevel')}
            itemTextStyle={{fontSize: 15}}
            activeItemTextStyle={{fontSize: 18, fontWeight: 'bold'}}
            items={[
              {
                label: 'Sedentary (little or no exercise)',
                value: 'Sedentary (little or no exercise)',
              },
              {
                label: 'Lightly Active (light exercise 1-3 days/week',
                value: 'Lightly Active (light exercise 1-3 days/week',
              },
              {
                label: 'Moderately Active (moderate exercise 3-5 days/week',
                value: 'Moderately Active (moderate exercise 3-5 days/week',
              },
              {
                label: 'Very Active (hard exercise 6-7 days per week',
                value: 'Very Active (hard exercise 6-7 days per week',
              },
              {
                label: 'Sedentary (little or no exercise)',
                value: 'Sedentary (little or no exercise)',
              },
              {
                label:
                  'Extra Active (very hard exercise + physical job 6-7 days/week',
                value:
                  'Extra Active (very hard exercise + physical job 6-7 days/week',
              },
            ]}
          />
        </View>

        <Text style={{paddingTop: 1, fontWeight: 'bold', color: 'black'}}>
          Fitness Goal
        </Text>
        <View
          style={{
            backgroundColor: 'white',
            borderWidth: 1,
            borderRadius: 4,
            marginBottom: 20,
          }}>
          <RNPickerSelect
            value={fitnessGoal}
            onValueChange={value => handleOnChangeText(value, 'fitnessGoal')}
            itemTextStyle={{fontSize: 15}}
            activeItemTextStyle={{fontSize: 18, fontWeight: 'bold'}}
            items={[
              {
                label: 'Hypertrophy (Muscle Growth)',
                value: 'Hypertrophy (Muscle Growth)',
              },
              {
                label: 'Muscular Strength',
                value: 'Muscular Strength',
              },
              {
                label: 'Muscular Endurance',
                value: 'Muscular Endurance',
              },
            ]}
          />
        </View>

        <SettingsFormInput
          value={idealWeight}
          onChangeText={value => handleOnChangeText(value, 'idealWeight')}
          label={currentWeightLabel}
          backgroundColor="white"
        />
        <SettingsFormInput
          value={idealWeeks}
          onChangeText={value => handleOnChangeText(value, 'idealWeeks')}
          label="Ideal No. Of Weeks To Achieve Ideal Bodyweight"
          backgroundColor="white"
        />
        <Text style={{paddingTop: 1, fontWeight: 'bold', color: 'black'}}>
          Training Frequency
        </Text>
        <View
          style={{
            backgroundColor: 'white',
            borderWidth: 1,
            borderRadius: 4,
            marginBottom: 20,
          }}>
          <RNPickerSelect
            value={trainingFrequency}
            onValueChange={value =>
              handleOnChangeText(value, 'trainingFrequency')
            }
            itemTextStyle={{fontSize: 15}}
            activeItemTextStyle={{fontSize: 18, fontWeight: 'bold'}}
            items={[
              {
                label: '1x',
                value: '1x',
              },
              {
                label: '2x',
                value: '2x',
              },
              {
                label: '3x',
                value: '3x',
              },
              {
                label: '4x',
                value: '4x',
              },
              {
                label: '5x',
                value: '5x',
              },
              {
                label: '6x',
                value: '6x',
              },
              {
                label: '7x',
                value: '7x',
              },
            ]}
          />
        </View>

        <Text style={{paddingTop: 1, fontWeight: 'bold', color: 'black'}}>
          Diet Type
        </Text>
        <View
          style={{
            backgroundColor: 'white',
            borderWidth: 1,
            borderRadius: 4,
            marginBottom: 20,
          }}>
          <RNPickerSelect
            value={dietType}
            onValueChange={value => handleOnChangeText(value, 'dietType')}
            itemTextStyle={{fontSize: 15}}
            activeItemTextStyle={{fontSize: 18, fontWeight: 'bold'}}
            items={[
              {
                label: 'Vegan',
                value: 'Vegan',
              },
              {
                label: 'Vegetarian',
                value: 'Vegetarian',
              },
              {
                label: 'All Foods',
                value: 'All Foods',
              },
            ]}
          />
        </View>

        <SaveSettingsbtn
          onPress={() => {
            if (validMetricsForm()) {
              const activityLevelValue = convertActivityLevel();
              const TDEE = userMetrics.BMR * activityLevelValue;
              const userCurrentWeight = userMetrics.weight;
              const userIdealWeight = userMetrics.idealWeight;
              const userIdealWeeks = userMetrics.idealWeeks;
              if (userIdealWeight > userCurrentWeight) {
                //if the user wants to gain weight
                //it takes 7700 calories to gain/lose 1kg of bodyweight
                const weightToGain = userIdealWeight - userCurrentWeight;
                const caloriesToGainTotal = 7700 * weightToGain;
                const caloriesToGainWeekly =
                  caloriesToGainTotal / userIdealWeeks;
                const caloriesSurplusDaily = caloriesToGainWeekly / 7;
                userMetrics.goalCalories = Math.round(
                  TDEE + caloriesSurplusDaily,
                );
                //Macros Split for gaining weight = 25% protein, 55% carbs, 20% fats
                //Using the Harris-Benedict Equation:
                userMetrics.goalProtein = Math.round(
                  (userMetrics.goalCalories * 0.25) / 4,
                );
                userMetrics.goalFats = Math.round(
                  (userMetrics.goalCalories * 0.2) / 9,
                );
                userMetrics.goalCarbs = Math.round(
                  (userMetrics.goalCalories * 0.55) / 4,
                );
              } else if (userIdealWeight < userCurrentWeight) {
                //if the user wants to lose
                const weightToLose = userCurrentWeight - userIdealWeight;
                const caloriesToLoseTotal = 7700 * weightToLose;
                const caloriesToLoseWeekly =
                  caloriesToLoseTotal / userIdealWeeks;
                const caloriesDeficitDaily = caloriesToLoseWeekly / 7;
                userMetrics.goalCalories = Math.round(
                  TDEE - caloriesDeficitDaily,
                );
                //Macros Split for losing weight = 30% protein, 55% carbs, 15% fats
                //Using the Harris-Benedict Equation:
                userMetrics.goalProtein = Math.round(
                  (userMetrics.goalCalories * 0.3) / 4,
                );
                userMetrics.goalFats = Math.round(
                  (userMetrics.goalCalories * 0.15) / 9,
                );
                userMetrics.goalCarbs = Math.round(
                  (userMetrics.goalCalories * 0.55) / 4,
                );
              } else if (userIdealWeight == userCurrentWeight) {
                // if user wants to maintain
                userMetrics.goalCalories = Math.round(TDEE);
                // Macros Split for Maintenance = 25% protein, 60% carbs, 15% fats
                userMetrics.goalProtein = Math.round(
                  (userMetrics.goalCalories * 0.25) / 4,
                );
                userMetrics.goalCarbs = Math.round(
                  (userMetrics.goalCalories * 0.6) / 4,
                );
                userMetrics.goalFats = Math.round(
                  (userMetrics.goalCalories * 0.15) / 9,
                );
              }
              updateUserMetrics(
                userMetrics.activityLevel.trim(),
                userMetrics.fitnessGoal,
                userMetrics.trainingFrequency, // CAN GET RID OF THIS HERE METRIC
                userMetrics.dietType, // CAN GET RID OF THIS METRIC
                TDEE,
                userMetrics.idealWeight,
                userMetrics.idealWeeks,
                userMetrics.goalCalories,
                userMetrics.goalProtein,
                userMetrics.goalCarbs,
                userMetrics.goalFats,
              );
            }
          }}
          title="Update Metrics"
        />
      </ContainerForProfileTabs>
    </ScrollView>
  );
};

export default HealthFitnessMetrics;

const styles = StyleSheet.create({
  container: {
    height: 45,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'black,',
  },
  title: {color: 'black', fontSize: 20},
});
//<SettingsFormInput
//value={BMR}
//onChangeText={value => handleOnChangeText(value, 'BMR')}
//label="BMR (DONT CHANGE THIS I NEED TO "
//backgroundColor="white"
///>
