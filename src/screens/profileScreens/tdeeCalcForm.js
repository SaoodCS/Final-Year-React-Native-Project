import React, {useContext, useState, useEffect, useRef} from 'react';
import {View, ScrollView} from 'react-native';
import {AuthContext} from '../../navigation/authProvider';
import auth, {firebase} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import CustomHeaderWithBack from '../globalComponent/customerHeaderWithBack';
import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';

import ContainerForProfileTabs from './components/containerForProfileTabs';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from 'react-native-paper';
import {TextInput} from 'react-native-paper';
import {showMessage, hideMessage} from 'react-native-flash-message';
import FlashMessage from 'react-native-flash-message';

// COMPONENT = TDEE CALC FORM WHICH CALCULATES THE USER TOTAL DAILY ENERGY EXPENDITURE BASED ON INPUTS (ALSO UPDATES ANY OTHER CALCULATIONS SUCH AS BMR ETC. IF NECESSARY)

const TDEECalcForm = props => {
  const navigation = useNavigation();
  // USESTATE FOR FOR THE USER'S METRICS TO DISPLAY FROM FIRESTORE AND FOR THE USER TO CHANGE
  const [userMetrics, setUserMetrics] = useState({
    activityLevel: '',
    height: '',
    weight: '',
    age: '',
    gender: '',
    BMR: '',
    TDEE: '',
    idealWeight: '',
    idealWeeks: '',
    goalCalories: '',
    goalProtein: '',
    goalCarbs: '',
    goalFats: '',
  });

  // FUNCTION FROM AUTHPROVIDER TO UPDATE THE USER'S TDEE IN THEIR FIRESTORE DOC (AS WELL AS ANY OTHER RE-CALCULATIONS)
  const {updateUserTDEE} = useContext(AuthContext);

  // FUNCTION TO GET THE FIRESTORE METRICS FROM THE USER'S FIRESTORE DOC
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
  // USEEFFECT TO GET THE FIRESTORE METRICS WHEN THIS COMPONENT STARTS SO THAT THE INPUTS ARE SET TO METRICS THAT THE USER HAS ALREADY SET
  useEffect(() => {
    getUserFirestoreMetrics();
  }, []);

  // NUMBER VALIDATION FOR THE ASSOCAITED INPUTS THAT REQUIRE A NUMBER
  const validNumberCheck = value => {
    const checkAge =
      /^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$/;
    return checkAge.test(value);
  };

  // FLOAT VALIDATION FOR THE ASSOCAITED INPUTS THAT REQUIRE A FLOAT
  const validFloatCheck = value => {
    const checkFloat = /^[+-]?\d+(\.\d+)?$/;
    return checkFloat.test(value);
  };

  const {
    activityLevel,
    height,
    weight,
    age,
    gender,
    BMR,
    TDEE,
    idealWeight,
    idealWeeks,
    goalCalories,
    goalProtein,
    goalCarbs,
    goalFats,
  } = userMetrics;

  // HANDLEONCHANGETEXT FOR THE INPUTS TO THAT THEY ARE ASSOCIATED WITH THE RELATED PROPERTIES IN USERMETRICS
  const handleOnChangeText = (value, fieldName) => {
    setUserMetrics({...userMetrics, [fieldName]: value});
  };

  // FUNCTION TO VALIDATE THE USERS FORM BY CHECKING IF A NUMBER/FLOAT/STRING INPUT IS INCLUDED WHERE REQUIRED -- IF NOT A RELATED ERROR MESSAGE IS DISPLAYED ON SCREEN
  const validMetricsForm = (age, height, weight, gender) => {
    if (!validNumberCheck(age.trim())) {
      return showMessage({
        message: 'Please Enter a Valid Age',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }
    if (!validFloatCheck(height.trim())) {
      return showMessage({
        message: 'Please Enter a Valid Height',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }
    if (!validFloatCheck(weight.trim())) {
      return showMessage({
        message: 'Please Enter a Valid Weight',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }
    if (!validFloatCheck(userMetrics.activityLevel)) {
      return showMessage({
        message: 'Please Choose Your Current Activity Level',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }

    if (userMetrics.gender != 'Male' && userMetrics.gender != 'Female') {
      return showMessage({
        message: 'Please Select Your Birth Gender',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }

    return true;
  };







  // USEREF HOOKS TO NAVIGATE TO THE NEXT TEXTINPUT ON KEYBOARD PRESSING ENTER 


  const heightRef = useRef();
  const weightRef = useRef();
 

















  return (

    <View style={{backgroundColor: '#CBC3E3', flexGrow: 1,}}>
      <CustomHeaderWithBack
        pageName="TDEE Calculation Form"
        backNavScreen="Profile Home"
      />

      <View
        style={{
          marginTop: 20,

          alignSelf: 'center',
        }}>
        <MaterialCommunityIcons
          name="scale-bathroom"
          color="#301934"
          size={200}
        />
      </View>
















      <ScrollView style={{flexGrow: 1, marginBottom: 300}}>
        <View
          style={{
            backgroundColor: '#301934',
            borderWidth: 2,
            borderRadius: 4,
            marginBottom: 10,
            width: 350,
            borderColor: '#CBC3E3',
            alignSelf: 'center',
            marginTop: 20,
          }}>
          <TextInput
              label="Age"
              value={age}
              onChangeText={value => handleOnChangeText(value, 'age')}
              returnKeyType="next"
              onSubmitEditing={() => {
                heightRef.current.focus();
              }}
          
            backgroundColor="#301934"
            color="white"
            mode="flat"
            style={{
              underlineColor: 'white',
            }}
            theme={{
              colors: {text: 'white', placeholder: 'white', primary: 'white'},
            }}
          />
        </View>

        <View
          style={{
            backgroundColor: '#301934',
            borderWidth: 2,
            borderRadius: 4,
            marginBottom: 10,
            width: 350,
            borderColor: '#CBC3E3',
            alignSelf: 'center',
            marginTop: 20,
          }}>
          <TextInput
              label="Height (cm)"
              value={height}
              ref={heightRef} 
              returnKeyType="next"
              onSubmitEditing={() => {
                weightRef.current.focus();
              }}
              onChangeText={value => handleOnChangeText(value, 'height')}
 

  
   
            backgroundColor="#301934"
            color="white"
            mode="flat"
            style={{
              underlineColor: 'white',
            }}
            theme={{
              colors: {text: 'white', placeholder: 'white', primary: 'white'},
            }}
          />
        </View>

        <View
          style={{
            backgroundColor: '#301934',
            borderWidth: 2,
            borderRadius: 4,
            marginBottom: 28,
            width: 350,
            borderColor: '#CBC3E3',
            alignSelf: 'center',
            marginTop: 20,
          }}>
          <TextInput
              label="Weight (kg)"
              value={weight}
              ref={weightRef} 
              onChangeText={value => handleOnChangeText(value, 'weight')}
    
   
     
            backgroundColor="#301934"
            color="white"
            mode="flat"
            style={{
              underlineColor: 'white',
            }}
            theme={{
              colors: {text: 'white', placeholder: 'white', primary: 'white'},
            }}
          />
        </View>


          <View
            style={{
              backgroundColor: '#301934',
              borderWidth: 2,
              borderRadius: 4,
              marginBottom: 28,
              width: 350,
              marginLeft: 1,
              borderColor: '#CBC3E3',
              alignSelf: 'center',
              height: 66,
            }}>
            <RNPickerSelect
              placeholder={{
                label: 'Select a Gender',
                value: null,
              }}
              value={gender}
              onValueChange={value => handleOnChangeText(value, 'gender')}
              style={{
                inputAndroid: {color: 'white'},
                placeholder: {
                  color: 'white',
                },
              }}
              itemTextStyle={{fontSize: 15}}
              activeItemTextStyle={{fontSize: 18, fontWeight: 'bold'}}
              items={[
                {
                  label: 'Male',
                  value: 'Male',
                },
                {
                  label: 'Female',
                  value: 'Female',
                },
              ]}
            />
          </View>

          <View
            style={{
              backgroundColor: '#301934',
              borderWidth: 2,
              borderRadius: 4,
              marginBottom: 20,
              width: 350,
              marginLeft: 1,
              borderColor: '#CBC3E3',
              alignSelf: 'center',
              height: 66,
            }}>
            <RNPickerSelect
              placeholder={{
                label: 'Select an Activity Level',
                value: null,
              }}
              value={activityLevel}
              onValueChange={value =>
                handleOnChangeText(value, 'activityLevel')
              }
              style={{
                inputAndroid: {color: 'white'},
                placeholder: {
                  color: 'white',
                },
              }}
              itemTextStyle={{fontSize: 15}}
              activeItemTextStyle={{fontSize: 18, fontWeight: 'bold'}}
              title="Fitness Goal"
              items={[
                {
                  label: 'Sedentary (little or no exercise)',
                  value: 1.2,
                },
                {
                  label: 'Lightly Active (light exercise 1-3 days/week',
                  value: 1.375,
                },
                {
                  label: 'Moderately Active (moderate exercise 3-5 days/week',
                  value: 1.55,
                },
                {
                  label: 'Very Active (hard exercise 6-7 days per week',
                  value: 1.725,
                },
                {
                  label:
                    'Extra Active (very hard exercise + physical job 6-7 days/week',
                  value: 1.9,
                },
              ]}
            />
          </View>



        <View style={{}}>
          <Button
            //icon="camera"
            mode="contained"
            color="white"
            labelStyle={{color: '#c3cbe3', fontSize: 15}}
            //loading = 'true'
            style={{
              backgroundColor: '#1B1212',
              borderWidth: 2,
              marginBottom: 40,
              width: 250,
              marginTop: 10,
              borderColor: 'black',
              alignSelf: 'center',
              textAlign: 'center',
              height: 55,
              borderRadius: 40,
              fontStyle: 'bold',
            }}
            contentStyle={{marginTop: 7}}
            onPress={() => {
              // ON PRESS IT RECALCULATES THE USER'S GOAL CALORIES AND GOAL MACRONUTRIENTS IF IDEAL WEIGHT DOES NOT EQUAL 0
              if (
                validMetricsForm(
                  userMetrics.age.trim(),
                  userMetrics.height.trim(),
                  userMetrics.weight.trim(),
                  userMetrics.gender,
                )
              ) {
                if (userMetrics.gender.trim() === 'Male') {
                  userMetrics.BMR =
                    66.47 +
                    13.75 * userMetrics.weight.trim() +
                    5.003 * userMetrics.height.trim() -
                    6.75 * userMetrics.age.trim();
                }
                if (userMetrics.gender.trim() === 'Female') {
                  userMetrics.BMR =
                    655.1 +
                    9.563 * userMetrics.weight.trim() +
                    1.85 * userMetrics.height.trim() -
                    4.676 * userMetrics.age.trim();
                }

                userMetrics.TDEE = userMetrics.BMR * userMetrics.activityLevel;

                //Calculate Goal Calories:

                if (!(userMetrics.idealWeight == 0)) {
                  if (userMetrics.idealWeight > userMetrics.weight) {
                    const weightToGain =
                      userMetrics.idealWeight - userMetrics.weight;
                    const caloriesToGainTotal = 7700 * weightToGain;
                    const caloriesToGainWeekly =
                      caloriesToGainTotal / userMetrics.idealWeeks;
                    const caloriesSurplusDaily = caloriesToGainWeekly / 7;

                    userMetrics.goalCalories = Math.round(
                      userMetrics.TDEE + caloriesSurplusDaily,
                    );

                    userMetrics.goalProtein = Math.round(
                      (userMetrics.goalCalories * 0.25) / 4,
                    );
                    userMetrics.goalFats = Math.round(
                      (userMetrics.goalCalories * 0.2) / 9,
                    );
                    userMetrics.goalCarbs = Math.round(
                      (userMetrics.goalCalories * 0.55) / 4,
                    );
                  }

                  if (userMetrics.idealWeight < userMetrics.weight) {
                    const weightToLose =
                      userMetrics.weight - userMetrics.idealWeight;
                    const caloriesToLoseTotal = 7700 * weightToLose;
                    const caloriesToLoseWeekly =
                      caloriesToLoseTotal / userMetrics.idealWeeks;
                    const caloriesDeficitDaily = caloriesToLoseWeekly / 7;

                    userMetrics.goalCalories = Math.round(
                      userMetrics.TDEE - caloriesDeficitDaily,
                    );

                    userMetrics.goalProtein = Math.round(
                      (userMetrics.goalCalories * 0.3) / 4,
                    );
                    userMetrics.goalFats = Math.round(
                      (userMetrics.goalCalories * 0.15) / 9,
                    );
                    userMetrics.goalCarbs = Math.round(
                      (userMetrics.goalCalories * 0.55) / 4,
                    );
                  }

                  if (userMetrics.idealWeight == userMetrics.weight) {
                    userMetrics.goalCalories = Math.round(userMetrics.TDEE);

                    userMetrics.goalProtein = Math.round(
                      (userMetrics.goalCalories * 0.25) / 4,
                    );
                    userMetrics.goalFats = Math.round(
                      (userMetrics.goalCalories * 0.15) / 9,
                    );
                    userMetrics.goalCarbs = Math.round(
                      (userMetrics.goalCalories * 0.6) / 4,
                    );
                  }
                }

                updateUserTDEE(
                  userMetrics.age.trim(),
                  userMetrics.height.trim(),
                  userMetrics.weight.trim(),
                  userMetrics.gender.trim(),
                  userMetrics.activityLevel,
                  userMetrics.BMR,
                  userMetrics.TDEE,
                  userMetrics.idealWeight,
                  userMetrics.idealWeeks,
                  userMetrics.goalCalories,
                  userMetrics.goalProtein,
                  userMetrics.goalCarbs,
                  userMetrics.goalFats,
                  //ADD PARAMETERS FOR IDEAL WEIGHT/WEEKS AND GOAL CALS/MACROS HERE AND IN THE AUTHPROVIDOR UPDATEUSERTDEE FILE
                );
                navigation.replace("Profile Home")
              }
            }}>
            Update TDEE 
          </Button>
        </View>
      </ScrollView>







































      <FlashMessage position="top" />
    </View>
  );
};
export default TDEECalcForm;
