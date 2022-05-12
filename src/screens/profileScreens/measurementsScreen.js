import React, {useState, useContext, useEffect, useRef} from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {AuthContext} from '../../navigation/authProvider';
import ContainerForProfileTabs from './components/containerForProfileTabs';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';
import CustomHeaderWithBack from '../globalComponent/customerHeaderWithBack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from 'react-native-paper';
import {TextInput} from 'react-native-paper';
import {showMessage, hideMessage} from 'react-native-flash-message';
import FlashMessage from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/native';

// COMPONENT = BODYFAT % CALCULATION FORM WHICH PREDICTS THE USER'S BODYFAT PERCENTAGE USING A TRAINED NN (ALSO UPDATES ANY OTHER CALCULATIONS SUCH AS BMR ETC. IF NECESSARY)

// NUMBER VALIDATION FOR THE ASSOCAITED INPUTS THAT REQUIRE A NUMBER
const validNumberCheck = value => {
  const checkAge = /^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$/;
  return checkAge.test(value);
};

// FLOAT VALIDATION FOR THE ASSOCAITED INPUTS THAT REQUIRE A FLOAT
const validFloatCheck = value => {
  const checkFloat = /^[+-]?\d+(\.\d+)?$/;
  return checkFloat.test(value);
};

const MeasurementsScreen = () => {
  const navigation = useNavigation();
  // FUNCTION TAKEN FROM AUTHPROVIDER TO UPDATE THE USER'S MEASUREMENT INFORMATION IF THEY CHANGE IT AND PRESS SUBMIT
  const {updateUserMeasurements} = useContext(AuthContext);

  // USESTATE FOR FOR THE USERSMEASUREMENTS TO DISPLAY FROM FIRESTORE AND FOR THE USER TO CHANGE + FOR ANY RECALCULATIONS TO OCCUR WHERE NECESSARY
  const [userMeasurements, setUserMeasurements] = useState({
    age: '',

    height: '',
    weight: '',
    neckCircum: '',
    chestCircum: '',
    abdomenCircum: '',
    hipCircum: '',
    thighCircum: '',
    kneeCircum: '',
    ankleCircum: '',
    bicepCircum: '',
    forearmCircum: '',
    wristCircum: '',
    gender: '',
    activityLevel: '',
    BMR: '',
    bodyfatPercentage: '',
    TDEE: '',
    idealWeight: '',
    idealWeeks: '',
    goalCalories: '',
    goalProtein: '',
    goalCarbs: '',
    goalFats: '',
  });
  // FUNCTION TO GET THE FIRESTORE METRICS FROM THE USER'S FIRESTORE DOC
  const getUserFirestoreMeasurements = async () => {
    await firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserMeasurements(documentSnapshot.data());
        }
      });
  };
  // USEEFFECT TO GET THE FIRESTORE MEASUREMENTS WHEN THIS COMPONENT STARTS SO THAT THE INPUTS ARE SET TO METRICS THAT THE USER HAS ALREADY SET
  useEffect(() => {
    getUserFirestoreMeasurements();
  }, []);

  const {
    age,
    height,
    weight,
    neckCircum,
    chestCircum,
    abdomenCircum,
    hipCircum,
    thighCircum,
    kneeCircum,
    ankleCircum,
    bicepCircum,
    forearmCircum,
    wristCircum,
    gender,
    activityLevel,
    BMR,
    bodyfatPercentage,
    TDEE,
    idealWeight,
    idealWeeks,
    goalCalories,
    goalProtein,
    goalCarbs,
    goalFats,
  } = userMeasurements;

  // HANDLEONCHANGETEXT FOR THE INPUTS SO THAT THEY ARE ASSOCIATED WITH THE RELATED PROPERTIES IN USERMEASUREMENTS
  const handleOnChangeText = (value, fieldName) => {
    setUserMeasurements({...userMeasurements, [fieldName]: value});
  };

  // FUNCTION TO VALIDATE THE USERS FORM BY CHECKING IF A NUMBER/FLOAT/STRING INPUT IS INCLUDED WHERE REQUIRED -- IF NOT A RELATED ERROR MESSAGE IS DISPLAYED ON SCREEN
  const validMeasurementsForm = () => {
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
    if (!validFloatCheck(neckCircum.trim())) {
      return showMessage({
        message: 'Please Enter a Valid Neck Circumference',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }
    if (!validFloatCheck(chestCircum.trim())) {
      return showMessage({
        message: 'Please Enter a Valid Chest Circumference',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }
    if (!validFloatCheck(abdomenCircum.trim())) {
      return showMessage({
        message: 'Please Enter a Valid Abdomen Circumference',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }
    if (!validFloatCheck(hipCircum.trim())) {
      return showMessage({
        message: 'Please Enter a Valid Hip Circumference',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }
    if (!validFloatCheck(thighCircum.trim())) {
      return showMessage({
        message: 'Please Enter a Valid Thigh Circumference',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }
    if (!validFloatCheck(kneeCircum.trim())) {
      return showMessage({
        message: 'Please Enter a Valid Knee Circumference',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }
    if (!validFloatCheck(ankleCircum.trim())) {
      return showMessage({
        message: 'Please Enter a Valid Ankle Circumference',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }
    if (!validFloatCheck(bicepCircum.trim())) {
      return showMessage({
        message: 'Please Enter a Valid Bicep Circumference',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }
    if (!validFloatCheck(forearmCircum.trim())) {
      return showMessage({
        message: 'Please Enter a Valid Forearm Circumference',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }
    if (!validFloatCheck(wristCircum.trim())) {
      return showMessage({
        message: 'Please Enter a Valid Wrist Circumference',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }
    if (!validFloatCheck(userMeasurements.activityLevel)) {
      return showMessage({
        message: 'Please Enter a Valid Activity Level',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }
    if (
      userMeasurements.gender != 'Male' &&
      userMeasurements.gender != 'Female'
    ) {
      return showMessage({
        message: 'Select Your Birth Gender',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }

    return true;
  };

  //CREATING THE NEURAL NETWORK FOR MENS BODYFAT% PREDICTION:

  //Functions for Standardising the User's Inputs: (REF: FORMULA FROM CHRIS DAWSON'S ANN AI METHODS LECTURE IN PART 2 OF THIS COURSE)
  function standardiseInputAge(value) {
    return (value - 22) / (81 - 22);
  }

  function standardiseInputHeight(value) {
    return (value - 74.93) / (197.485 - 74.93);
  }
  function standardiseInputWeight(value) {
    return (value - 52.7507) / (164.7221 - 53.7507);
  }
  function standardiseInputNeck(value) {
    return (value - 31.1) / (51.2 - 31.1);
  }

  function standardiseInputChest(value) {
    return (value - 79.3) / (136.2 - 79.3);
  }

  function standardiseInputChest(value) {
    return (value - 79.3) / (136.2 - 79.3);
  }

  function standardisedInputAbs(value) {
    return (value - 69.4) / (148.1 - 69.4);
  }

  function standardisedInputHips(value) {
    return (value - 85) / (147.7 - 85);
  }
  function standardisedInputThigh(value) {
    return (value - 47.2) / (87.3 - 47.2);
  }

  function standardisedInputKnee(value) {
    return (value - 33) / (49.1 - 33);
  }

  function standardisedInputAnkle(value) {
    return (value - 19.1) / (33.9 - 19.1);
  }

  function StandardisedInputBicep(value) {
    return (value - 24.8) / (45 - 24.8);
  }

  function StandardisedInputForearm(value) {
    return (value - 21) / (34.9 - 21);
  }

  function StandardisedInputWrist(value) {
    return (value - 15.8) / (21.4 - 15.8);
  }

  function destandardisedBFOutput(value) {
    return value * (47.5 - 0) + 0;
  }

  //FUNCTION FOR LOADING THE MALE USER'S DATA INTO THE TRAINED NN
  function MaleUsersBodyfatPercentage(
    userAge,
    userHeight,
    userWeight,
    userNeck,
    userChest,
    userAbs,
    userHips,
    userThigh,
    userKnee,
    userAnkle,
    userBicep,
    userForearm,
    userWrist,
  ) {
    // LOADING THE TRAINED MENS BF% NEURAL NETWORK
    const brain = require('brain.js');
    //CONFIGURING THE NEURAL NETWORK'S ACTIVAITION
    var mensBfNN = new brain.NeuralNetwork({
      activation: 'sigmoid', // activation function
      hiddenLayers: [9], //1 hidden layer 2/3rds of the size of the input
    });
    const mensTrainedNN = require('./maleTrainedNN.json');
    mensBfNN.fromJSON(mensTrainedNN);

    var mBodyfatOutput = destandardisedBFOutput(
      mensBfNN.run([
        standardiseInputAge(userAge),
        standardiseInputHeight(userHeight),
        standardiseInputWeight(userWeight),
        standardiseInputNeck(userNeck),
        standardiseInputChest(userChest),
        standardisedInputAbs(userAbs),
        standardisedInputHips(userHips),
        standardisedInputThigh(userThigh),
        standardisedInputKnee(userKnee),
        standardisedInputAnkle(userAnkle),
        StandardisedInputBicep(userBicep),
        StandardisedInputForearm(userForearm),
        StandardisedInputWrist(userWrist),
      ]),
    );
    return mBodyfatOutput;
  }

  //CREATING THE NEURAL NETWORK FOR WOMENS BODYFAT % PREDICTION:

  //Functions for Standardising the User's Inputs:
  function femaleStandardiseInputAge(value) {
    return (value - 18) / (25 - 18);
  }

  function femaleStandardiseInputHeight(value) {
    return (value - 153.67) / (180.34 - 153.67);
  }
  function femaleStandardiseInputWeight(value) {
    return (value - 42.1848) / (85.184 - 42.1848);
  }
  function femaleStandardiseInputNeck(value) {
    return (value - 26) / (36 - 26);
  }

  function femaleStandardiseInputChest(value) {
    return (value - 43) / (100 - 43);
  }

  function femaleStandardiseInputHips(value) {
    return (value - 82.5) / (115 - 82.5);
  }

  function femaleStandardiseInputThigh(value) {
    return (value - 45) / (86.5 - 45);
  }

  function femaleStandardiseInputKnee(value) {
    return (value - 24.7) / (42 - 24.7);
  }

  function femaleStandardiseInputAnkle(value) {
    return (value - 18) / (25 - 18);
  }

  function femaleStandardiseInputBicep(value) {
    return (value - 20.5) / (34.5 - 20.5);
  }

  function femaleStandardiseInputForearm(value) {
    return (value - 20) / (29 - 20);
  }

  function femaleStandardiseInputWrist(value) {
    return (value - 13.5) / (19 - 13.5);
  }

  function femaleDetandardiseBFOutput(value) {
    return value * (38.49 - 7.47) + 7.47;
  }

  //FUNCTION FOR LOADING THE FEMALE USER'S DATA INTO THE TRAINED NN
  function FemaleUsersBodyfatPercentage(
    userAge,
    userHeight,
    userWeight,
    userNeck,
    userChest,
    userHips,
    userThigh,
    userKnee,
    userAnkle,
    userBicep,
    userForearm,
    userWrist,
  ) {
    // LOADING THE TRAINED WOMENS BF% NEURAL NETWORK
    const brain = require('brain.js');
    var womensBfNN = new brain.NeuralNetwork({
      activation: 'sigmoid',
      hiddenLayers: [9],
    });
    const womensTrainedNN = require('./femaleTrainedNN.json'); //CHANGE TO femaleTrainedNN.json AFTER I'VE COPIED IT INTO THE DIRECTORY
    womensBfNN.fromJSON(womensTrainedNN);

    var fBodyfatOutput = femaleDetandardiseBFOutput(
      womensBfNN.run([
        femaleStandardiseInputAge(userAge),
        femaleStandardiseInputHeight(userHeight),
        femaleStandardiseInputWeight(userWeight),
        femaleStandardiseInputNeck(userNeck),
        femaleStandardiseInputChest(userChest),
        femaleStandardiseInputHips(userHips),
        femaleStandardiseInputThigh(userThigh),
        femaleStandardiseInputKnee(userKnee),
        femaleStandardiseInputAnkle(userAnkle),
        femaleStandardiseInputBicep(userBicep),
        femaleStandardiseInputForearm(userForearm),
        femaleStandardiseInputWrist(userWrist),
      ]),
    );
    return fBodyfatOutput;
  }
  //--------------------------------------------------------------------------------------------------------------------------



  // USEREF HOOKS TO NAVIGATE TO THE NEXT TEXTINPUT ON KEYBOARD PRESSING ENTER 
  const heightRef = useRef();
  const weightRef = useRef();
  const neckCircumRef = useRef();
  const chestCircumRef = useRef();
  const absCircumRef = useRef();
  const hpCircumRef = useRef();
  const thighCircumRef = useRef();
  const kneeCircumRef = useRef();
  const ankleCircumRef = useRef();
  const forearmCircumRef = useRef();
  const bicepCircumRef = useRef();
  const wristCircumRef = useRef();

  





  return (
    <View style={{backgroundColor: '#CBC3E3', flexGrow: 1,}}>
      <CustomHeaderWithBack
        pageName="Calculate Your Bodyfat Percentage"
        backNavScreen={'Profile Home'}
      />

<View
        style={{
          marginTop: 20,

          alignSelf: 'center',
        }}>
        <MaterialCommunityIcons
          name="pencil-ruler"
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
              returnKeyType="next"
              onSubmitEditing={() => {
                heightRef.current.focus();
              }}
              onChangeText={value => handleOnChangeText(value, 'age')}

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
              ref = {heightRef}
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
            marginBottom: 10,
            width: 350,
            borderColor: '#CBC3E3',
            alignSelf: 'center',
            marginTop: 20,
          }}>
          <TextInput
              label="Weight (kg)"
              value={weight}
              ref = {weightRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                neckCircumRef.current.focus();
              }}
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
            marginBottom: 10,
            width: 350,
            borderColor: '#CBC3E3',
            alignSelf: 'center',
            marginTop: 20,
          }}>
          <TextInput
              label="Neck Cirumference (cm)"
              value={neckCircum}
              ref = {neckCircumRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                chestCircumRef.current.focus();
              }}
              onChangeText={value => handleOnChangeText(value, 'neckCircum')}
   
      
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
              label="Chest Cirumference (cm)"
              value={chestCircum}
              ref = {chestCircumRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                absCircumRef.current.focus();
              }}
              onChangeText={value => handleOnChangeText(value, 'chestCircum')}
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
              label="Abdomen Cirumference (cm)"
              value={abdomenCircum}
              ref = {absCircumRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                hpCircumRef.current.focus();
              }}
              onChangeText={value => handleOnChangeText(value, 'abdomenCircum')}
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
              label="Hip Cirumference (cm)"
              value={hipCircum}
              ref = {hpCircumRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                thighCircumRef.current.focus();
              }}
              onChangeText={value => handleOnChangeText(value, 'hipCircum')}
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
              label="Thigh Cirumference (cm)"
              value={thighCircum}
              ref = {thighCircumRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                kneeCircumRef.current.focus();
              }}
              onChangeText={value => handleOnChangeText(value, 'thighCircum')}
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
              label="Knee Cirumference (cm)"
              value={kneeCircum}
              ref = {kneeCircumRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                ankleCircumRef.current.focus();
              }}
              onChangeText={value => handleOnChangeText(value, 'kneeCircum')}
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
              label="Ankle Cirumference (cm)"
              value={ankleCircum}
              ref = {ankleCircumRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                forearmCircumRef.current.focus();
              }}
              onChangeText={value => handleOnChangeText(value, 'ankleCircum')}
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
              label="Forearm Cirumference (cm)"
              value={forearmCircum}
              ref = {forearmCircumRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                bicepCircumRef.current.focus();
              }}
              onChangeText={value => handleOnChangeText(value, 'forearmCircum')}
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
              label="Bicep Cirumference (cm)"
              value={bicepCircum}
              ref = {bicepCircumRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                wristCircumRef.current.focus();
              }}
              onChangeText={value => handleOnChangeText(value, 'bicepCircum')}
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
              label="Writst Cirumference (cm)"
              value={wristCircum}
              ref = {wristCircumRef}
              onChangeText={value => handleOnChangeText(value, 'wristCircum')}
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
              marginBottom: 27,
              marginTop: 20,
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
              title="Fitness Goal"
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
                value: '',
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
            labelStyle={{color:  '#c3cbe3', fontSize: 15}}
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

              if (validMeasurementsForm()) {
                //RUN THE mensNN ON MALE USER'S DATA AND THEN UPDATE MEASUREMENTS
                if (userMeasurements.gender.trim() == 'Male') {
                  userMeasurements.bodyfatPercentage =
                    MaleUsersBodyfatPercentage(
                      userMeasurements.age.trim(),
                      userMeasurements.height.trim(),
                      userMeasurements.weight.trim(),
                      userMeasurements.neckCircum.trim(),
                      userMeasurements.chestCircum.trim(),
                      userMeasurements.abdomenCircum.trim(),
                      userMeasurements.hipCircum.trim(),
                      userMeasurements.thighCircum.trim(),
                      userMeasurements.kneeCircum.trim(),
                      userMeasurements.ankleCircum.trim(),
                      userMeasurements.bicepCircum.trim(),
                      userMeasurements.forearmCircum.trim(),
                      userMeasurements.wristCircum.trim(),
                    );
                  // HARRISON BENEDICT FORMULA FOR MALE BMR:
                  userMeasurements.BMR =
                    66.5 +
                    13.75 * userMeasurements.weight.trim() +
                    5.003 * userMeasurements.height.trim() -
                    6.75 * userMeasurements.age.trim();
                }

                //RUN THE womensNN ON FEMALE USER'S DATA AND THEN UPDATE MEASUREMENTS....

                if (userMeasurements.gender.trim() == 'Female') {
                  userMeasurements.bodyfatPercentage =
                    FemaleUsersBodyfatPercentage(
                      userMeasurements.age.trim(),
                      userMeasurements.height.trim(),
                      userMeasurements.weight.trim(),
                      userMeasurements.neckCircum.trim(),
                      userMeasurements.chestCircum.trim(),
                      userMeasurements.hipCircum.trim(),
                      userMeasurements.thighCircum.trim(),
                      userMeasurements.kneeCircum.trim(),
                      userMeasurements.ankleCircum.trim(),
                      userMeasurements.bicepCircum.trim(),
                      userMeasurements.forearmCircum.trim(),
                      userMeasurements.wristCircum.trim(),
                    );
                  userMeasurements.BMR =
                    655.1 +
                    9.563 * userMeasurements.weight.trim() +
                    1.85 * userMeasurements.height.trim() -
                    4.676 * userMeasurements.age.trim();

                  //SAVE THE CALCULATED BF% TO FIRESTORE
                }

                // CALCULATE TDEE:

                userMeasurements.TDEE =
                  userMeasurements.BMR * userMeasurements.activityLevel;

                // CALCULATE GOAL CALORIES ETC:

                if (!(userMeasurements.idealWeight == 0)) {
                  if (userMeasurements.idealWeight > userMeasurements.weight) {
                    const weightToGain =
                      userMeasurements.idealWeight - userMeasurements.weight;
                    const caloriesToGainTotal = 7700 * weightToGain;
                    const caloriesToGainWeekly =
                      caloriesToGainTotal / userMeasurements.idealWeeks;
                    const caloriesSurplusDaily = caloriesToGainWeekly / 7;

                    userMeasurements.goalCalories = Math.round(
                      userMeasurements.TDEE + caloriesSurplusDaily,
                    );

                    userMeasurements.goalProtein = Math.round(
                      (userMeasurements.goalCalories * 0.25) / 4,
                    );
                    userMeasurements.goalFats = Math.round(
                      (userMeasurements.goalCalories * 0.2) / 9,
                    );
                    userMeasurements.goalCarbs = Math.round(
                      (userMeasurements.goalCalories * 0.55) / 4,
                    );
                  }

                  if (userMeasurements.idealWeight < userMeasurements.weight) {
                    const weightToLose =
                      userMeasurements.weight - userMeasurements.idealWeight;
                    const caloriesToLoseTotal = 7700 * weightToLose;
                    const caloriesToLoseWeekly =
                      caloriesToLoseTotal / userMeasurements.idealWeeks;
                    const caloriesDeficitDaily = caloriesToLoseWeekly / 7;

                    userMeasurements.goalCalories = Math.round(
                      userMeasurements.TDEE - caloriesDeficitDaily,
                    );

                    userMeasurements.goalProtein = Math.round(
                      (userMeasurements.goalCalories * 0.3) / 4,
                    );
                    userMeasurements.goalFats = Math.round(
                      (userMeasurements.goalCalories * 0.15) / 9,
                    );
                    userMeasurements.goalCarbs = Math.round(
                      (userMeasurements.goalCalories * 0.55) / 4,
                    );
                  }

                  if (userMeasurements.idealWeight == userMeasurements.weight) {
                    userMeasurements.goalCalories = Math.round(
                      userMeasurements.TDEE,
                    );

                    userMeasurements.goalProtein = Math.round(
                      (userMeasurements.goalCalories * 0.25) / 4,
                    );
                    userMeasurements.goalFats = Math.round(
                      (userMeasurements.goalCalories * 0.6) / 9,
                    );
                    userMeasurements.goalCarbs = Math.round(
                      (userMeasurements.goalCalories * 0.15) / 4,
                    );
                  }
                }

                updateUserMeasurements(
                  userMeasurements.age,
                  userMeasurements.height,
                  userMeasurements.weight,
                  userMeasurements.neckCircum,
                  userMeasurements.chestCircum,
                  userMeasurements.abdomenCircum,
                  userMeasurements.hipCircum,
                  userMeasurements.thighCircum,
                  userMeasurements.kneeCircum,
                  userMeasurements.ankleCircum,
                  userMeasurements.bicepCircum,
                  userMeasurements.forearmCircum,
                  userMeasurements.wristCircum,
                  userMeasurements.activityLevel,
                  userMeasurements.BMR,
                  userMeasurements.bodyfatPercentage,
                  userMeasurements.TDEE,
                  userMeasurements.idealWeight,
                  userMeasurements.idealWeeks,
                  userMeasurements.goalCalories,
                  userMeasurements.goalProtein,
                  userMeasurements.goalCarbs,
                  userMeasurements.goalFats,
                  userMeasurements.gender,
                );
                navigation.replace("Profile Home")
              }

            }}>
            Calculate Bodyfat %
          </Button>
        </View>
      </ScrollView>


      <FlashMessage position="top" />
    </View>
  );
};

export default MeasurementsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#333333',
  },
});
