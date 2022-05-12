import React, {useContext, useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {AuthContext} from '../../navigation/authProvider';

import CustomHeaderWithBack from '../globalComponent/customerHeaderWithBack';
import auth, {firebase} from '@react-native-firebase/auth';

import firestore from '@react-native-firebase/firestore';

import ContainerForProfileTabs from './components/containerForProfileTabs';
import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';

import {Button} from 'react-native-paper';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {showMessage, hideMessage} from 'react-native-flash-message';
import FlashMessage from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/native';

// COMPONENT = FITNESS GOAL FORM WHICH ALLOWS THE USER TO SET A FITNESS GOAL AND THEN WILL LEAD TO A GENERATED WORKOUT PLAN IN THE FITNESS SECTION
const FitnessGoalForm = props => {
  const navigation = useNavigation();
  // USESTATE FOR FOR THE USER'S METRICS TO DISPLAY FROM FIRESTORE AND FOR THE USER TO CHANGE
  const [userMetrics, setUserMetrics] = useState({
    fitnessGoal: '',
    trainingFrequency: '',
  });

  // FUNCTION FROM AUTHPROVIDER TO UPDATE THE USER'S FITNESS GOAL IN THEIR FIRESTORE DOC
  const {updateUserFitnessMetrics} = useContext(AuthContext); //REMEMBER TO CREATE THIS IN THE AUTHPROVIDOR SECTION

  // FUNCTION TO GET THE FIRESTORE METRICS FROM THE USER'S FIRESTORE DOC
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
  // USEEFFECT TO GET THE FIRESTORE METRICS WHEN THIS COMPONENT STARTS SO THAT THE INPUTS ARE SET TO METRICS THAT THE USER HAS ALREADY SET
  useEffect(() => {
    getUserFirestoreMetrics();
  }, []);

  const {fitnessGoal, trainingFrequency} = userMetrics;

  const handleOnChangeText = (value, fieldName) => {
    setUserMetrics({...userMetrics, [fieldName]: value});
  };

  // NUMBER VALIDATION FOR THE ASSOCAITED INPUTS THAT REQUIRE A NUMBER
  const validNumberCheck = value => {
    const checkNum =
      /^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$/; //regular expression to ensure age is a integer
    return checkNum.test(value);
  };

  // FUNCTION TO VALIDATE THE USERS FORM BY CHECKING IF A NUMBER/STRING INPUT IS INCLUDED WHERE REQUIRED -- IF NOT A RELATED ERROR MESSAGE IS DISPLAYED ON SCREEN
  const validMetricsForm = () => {
    if (fitnessGoal == null) {
      return showMessage({
        message: 'Please Choose a Fitness Level',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }

    if (!validNumberCheck(trainingFrequency)) {
      return showMessage({
        message: 'Please Choose a Valid Training Frequency',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    } else {
      return true;
    }
  };

  return (
    <View style={{backgroundColor: '#CBC3E3', height: 700}}>
      <CustomHeaderWithBack
        pageName="Fitness Goal"
        backNavScreen="Profile Home"
      />

      <ContainerForProfileTabs>
        <View
          style={{
            marginTop: 20,

            alignSelf: 'center',
          }}>
          <MaterialCommunityIcons
            name="weight-lifter"
            color="#301934"
            size={200}
          />
        </View>

        <Text
          style={{
            paddingTop: 20,
            fontWeight: 'bold',
            color: '#301934',
            alignSelf: 'center',
            fontSize: 20,
            paddingBottom: 10,
          }}>
          What Is Your Fitness Goal?
        </Text>
        <View
          style={{
            backgroundColor: '#301934',
            borderWidth: 2,
            borderRadius: 4,
            marginBottom: 20,
            width: 350,
            borderColor: '#CBC3E3',
            alignSelf: 'center',
          }}>
          <RNPickerSelect
            value={fitnessGoal}
            onValueChange={value => handleOnChangeText(value, 'fitnessGoal')}
            style={{
              inputAndroid: {color: 'white'},
            }}
            itemTextStyle={{fontSize: 15}}
            activeItemTextStyle={{fontSize: 18, fontWeight: 'bold'}}
            title="Fitness Goal"
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
        <Text
          style={{
            paddingTop: 20,
            fontWeight: 'bold',
            color: '#301934',
            alignSelf: 'center',
            fontSize: 20,
            paddingBottom: 10,
          }}>
          How Often Do You Usually Train Weekly?
        </Text>
        <View
          style={{
            backgroundColor: '#301934',
            borderWidth: 2,
            borderRadius: 4,
            marginBottom: 20,
            width: 350,
            borderColor: '#CBC3E3',
            alignSelf: 'center',
          }}>
          <RNPickerSelect
            value={trainingFrequency}
            onValueChange={value =>
              handleOnChangeText(value, 'trainingFrequency')
            }
            style={{
              inputAndroid: {color: 'white'},
            }}
            itemTextStyle={{fontSize: 15}}
            activeItemTextStyle={{fontSize: 18, fontWeight: 'bold'}}
            items={[
              {
                label: '1x',
                value: 1,
              },
              {
                label: '2x',
                value: 2,
              },
              {
                label: '3x',
                value: 3,
              },
              {
                label: '4x',
                value: 4,
              },
              {
                label: '5x',
                value: 5,
              },
              {
                label: '6x',
                value: 6,
              },
              {
                label: '7x',
                value: 7,
              },
            ]}
          />
        </View>

        <Button
          mode="contained"
          color="white"
          labelStyle={{color: '#CBC3E3', fontSize: 15,}}
          style={{
            backgroundColor: '#1B1212',
            borderWidth: 2,
            marginBottom: 30,
            width: 250,
            marginTop: 10,
            borderColor: '#CBC3E3',
            alignSelf: 'center',
            textAlign: 'center',
            height: 55,
            borderRadius: 40,
     
          }}
          contentStyle={{marginTop: 7}}
          onPress={() => {
            if (validMetricsForm()) {
              updateUserFitnessMetrics(
                userMetrics.fitnessGoal,
                userMetrics.trainingFrequency,
              );
              navigation.replace("Profile Home")
            }
          }}>
          Update Fitness Goal
        </Button>
      </ContainerForProfileTabs>

      <FlashMessage position="top" />
    </View>
  );
};
export default FitnessGoalForm;
