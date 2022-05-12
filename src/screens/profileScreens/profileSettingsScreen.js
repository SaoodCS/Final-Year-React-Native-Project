import React, {useContext, useRef, useState, useEffect} from 'react';
import {AuthContext} from '../../navigation/authProvider';

import TopTabBtns from './components/topTabBtns';
import CustomHeaderWithBack from '../globalComponent/customerHeaderWithBack';

import {Button} from 'react-native-paper';
import {TextInput} from 'react-native-paper';
import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';
import {showMessage, hideMessage} from 'react-native-flash-message';
import FlashMessage from 'react-native-flash-message';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import ContainerForProfileTabs from './components/containerForProfileTabs';

import {ScrollView, View, Dimensions, Animated} from 'react-native';

// COMPONENT: THIS SCREEN CONSISTS OF 2 MAIN COMPONENTS:
//1. PROFILE SETTINGS FORM WHICH ALLOWS THE USER TO CHANGE INFORMATION RELATED TO THEIR PROFILE IN FIREBASE SUCH AS NAME, AGE, HEIGHT, WEIGHT
//2. AUTHENTICATION FORMS WHICH INCLUDES FORMS FOR THE USER TO CHANGE EMAIL THEIR CHANGE PASSWORD ASSOCIATED WITH THEIR ACCOUNT LINKED TO FIREBASE

const {width} = Dimensions.get('window');

export default function ProfileSettingsScreen() {
  // THE ASSOCIATED FUNCTIONS TAKEN FROM THE AUTH PROVIDER TO EITHER UPDATE THE USER'S EMAIL OR UPDATE THE USER'S PASSWORD OR UPDATE THE USERS PROFILE IN FIRESTORE
  const {updateUserEmail} = useContext(AuthContext);
  const {updateUserPassword} = useContext(AuthContext);
  const {updateUserFirestore} = useContext(AuthContext);

  // USESTATE FOR THE USER'S DATA TO DISPLAY FROM FIRESTORE AND FOR THE USER TO CHANGE + FOR ANY RECALCULATIONS TO OCCUR WHERE NECESSARY (COMPONENT 1)
  const [userData, setUserData] = useState({
    fullName: '',
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

  // USESTATE FOR THE USER'S AUTHENTICATION DATA INPUT TO FOR THE USER TO CHANGE (COMPONENT 2)
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    newPassword: '',
    confirmNewPwd: '',
    passwordForEmailReset: '',
  });

  // FUNCTION TO GET THE FIRESTORE METRICS FROM THE USER'S FIRESTORE DOC (1)
  const getUserFirestoreProfile = async () => {
    await firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };
  // USEEFFECT TO GET THE FIRESTORE METRICS WHEN THIS COMPONENT STARTS SO THAT THE INPUTS ARE SET TO METRICS THAT THE USER HAS ALREADY SET (1)
  useEffect(() => {
    getUserFirestoreProfile();
  }, []);

  // NUMBER VALIDATION FOR THE ASSOCAITED INPUTS THAT REQUIRE A NUMBER
  const validNumCheck = value => {
    const checkNum =
      /^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$/;
    return checkNum.test(value);
  };
  // FLOAT VALIDATION FOR THE ASSOCAITED INPUTS THAT REQUIRE A FLOAT
  const validFloatCheck = value => {
    const checkFloat = /^[+-]?\d+(\.\d+)?$/;
    return checkFloat.test(value);
  };

  // ANIMATION: SCROLL RIGHT ON THE SCREEN FOR THE AUTH FORM, SCROLL LEFT ON THE SCREEN FOR THE PROFILE DATA FORM:
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

  //Profile Settings Screen Functions:

  const {
    fullName,
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
  } = userData;
  // HANDLEONCHANGETEXT FOR THE INPUTS TO THAT THEY ARE ASSOCIATED WITH THE RELATED PROPERTIES IN USERDATA
  const handleOnChangeText = (value, fieldName) => {
    setUserData({...userData, [fieldName]: value});
  };

  // FUNCTION TO VALIDATE THE USERS FORM BY CHECKING IF A NUMBER/FLOAT INPUT IS INCLUDED WHERE REQUIRED -- IF NOT A RELATED ERROR MESSAGE IS DISPLAYED ON SCREEN
  function validForm() {
    if (!validNumCheck(age)) {
      return showMessage({
        message: 'Please Enter a Valid Age',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }
    if (!validFloatCheck(height)) {
      return showMessage({
        message: 'Please Enter a Valid Height',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }

    if (!validFloatCheck(weight)) {
      return showMessage({
        message: 'Please Enter a Valid Weight',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    } else {
      return true;
    }
  }

  //FUNCTIONS FOR THE AUTHENTICATIONS SETTINGS SCREEN/FORM:

  // EMAIL VALIDATION FOR THE ASSOCAITED INPUT THAT REQUIRES AN EMAIL ADDRESS
  const validEmailCheck = value => {
    const checkEmail =
      /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; //regular expression for email validation
    return checkEmail.test(value);
  };

  const {email, password, newPassword, confirmNewPwd, passwordForEmailReset} =
    authData;
  // HANDLEONCHANGETEXT FOR THE INPUTS SO THAT THEY ARE ASSOCIATED WITH THE RELATED PROPERTIES IN USERDATA
  const handleOnChangeText2 = (value, fieldName) => {
    //REMEMBER THIS IS HANDLEONCHANGETEXT2
    setAuthData({...authData, [fieldName]: value});
  };

  // FUNCTION TO ENSURE THAT THE FORM TO UPDATE THE USER'S EMAIL IS VALID. IF IT IS NOT, AN ERROR MESSAGE IS DISPLAYED TO THE USER
  function validUpdateEmailForm(passwordForEmailReset) {
    if (!validEmailCheck(email)) {
      return showMessage({
        message: 'Please Enter a Valid Email Address',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }

    if (passwordForEmailReset.trim() == '') {
      return showMessage({
        message: 'Please Enter Your Current Password',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    } else {
      return true;
    }
  }

  // FUNCTION TO ENSURE THAT THE FORM TO UPDATE THE USER'S PASSWORD IS VALID. IF IT IS NOT, AN ERROR MESSAGE IS DISPLAYED TO THE USER
  const validPasswordInput = (password, newPassword, confirmNewPwd) => {
    if (password.trim() == '') {
      return showMessage({
        message: 'Please Enter Your Current Password',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }

    if (newPassword.trim() == '' || newPassword.length < 8) {
      return showMessage({
        message: 'Please Insert a Valid Password of Length 8 or More',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }

    if (newPassword != confirmNewPwd) {
      return showMessage({
        message: 'Passwords Do Not Match. Please Try Again',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }

    if (password.trim() == newPassword.trim()) {
      return showMessage({
        message:
          'Your New Password Cannot Be The Same As Your Current Password Input',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    } else {
      return true;
    }
  };





  // USEREF FOR EACH TEXT INPUT SO THAT ON PRESSING ENTER ON THE KEYBOARD, THE USER IS TAKEN TO THE NEXT TEXT INPUT:
  const ageRef = useRef();
  const heightRef = useRef();
  const weightRef = useRef();




  // USEREF FOR THE LOGIN DETAILS SIDE:
  const newEmailRef = useRef();
  const currentPwdRef = useRef();


  const updatePwdCPwdRef = useRef();
  const updatePwdNPwdRef = useRef();
  const updatePwdConfirmNPwdRef = useRef();





  return (
    <View style={{backgroundColor: '#CBC3E3', flex: 1, paddingTop: 1}}>
      <View>
        <CustomHeaderWithBack
          pageName="Profile Settings"
          backNavScreen={'Profile Home'}
        />
      </View>



      <View
        style={{flexDirection: 'row', paddingHorizontal: 0, marginBottom: 20}}>
        <TopTabBtns
          backgroundColor={loginColorAnimation}
          title="Profile Details"
          onPress={() => scrollView.current.scrollTo({x: 0})}
        />
        <TopTabBtns
          backgroundColor={registrationColorAnimation}
          title="Login Details"
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
          <ScrollView contentContainerStyle = {{height: 600}}>
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
                label="Full Name"
                value={fullName}
                onChangeText={value => handleOnChangeText(value, 'fullName')}
                backgroundColor="#301934"
                color="white"
                mode="flat"
                returnKeyType="next"
                onSubmitEditing={() => {
                  ageRef.current.focus();
                }}
                style={{
                  underlineColor: 'white',
                }}
                theme={{
                  colors: {
                    text: 'white',
                    placeholder: 'white',
                    primary: 'white',
                  },
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
                label="Age"
                value={age}
                onChangeText={value => handleOnChangeText(value, 'age')}
                backgroundColor="#301934"
                color="white"
                mode="flat"
                ref={ageRef} 
                returnKeyType="next"
                onSubmitEditing={() => {
                  heightRef.current.focus();
                }}
                style={{
                  underlineColor: 'white',
                }}
                theme={{
                  colors: {
                    text: 'white',
                    placeholder: 'white',
                    primary: 'white',
                  },
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
                onChangeText={value => handleOnChangeText(value, 'height')}
                backgroundColor="#301934"
                color="white"
                mode="flat"
                ref={heightRef} 
                returnKeyType="next"
                onSubmitEditing={() => {
                  weightRef.current.focus();
                }}
                style={{
                  underlineColor: 'white',
                }}
                theme={{
                  colors: {
                    text: 'white',
                    placeholder: 'white',
                    primary: 'white',
                  },
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
                onChangeText={value => handleOnChangeText(value, 'weight')}
                backgroundColor="#301934"
                color="white"
                mode="flat"
                ref={weightRef} 
                style={{
                  underlineColor: 'white',
                }}
                theme={{
                  colors: {
                    text: 'white',
                    placeholder: 'white',
                    primary: 'white',
                  },
                }}
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
                  label: 'Select Your Birth Gender',
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

            <Button
              //icon="camera"
              mode="contained"
              color="white"
              labelStyle={{color: '#CBC3E3', fontSize: 15}}
              //loading = 'true'
              style={{
                backgroundColor: '#1B1212',
                borderWidth: 2,
                marginBottom: 30,
                width: 250,
                marginTop: 1,
                borderColor: '#CBC3E3',
                alignSelf: 'center',
                textAlign: 'center',
                height: 55,
                borderRadius: 40,
          
              }}
              contentStyle={{marginTop: 7}}
              onPress={() => {
                if (validForm()) {
                  if (
                    !(
                      userData.age == '' ||
                      userData.gender == '' ||
                      userData.height == '' ||
                      userData.weight == ''
                    )
                  ) {
                    if (userData.gender.trim() === 'Male') {
                      userData.BMR =
                        66.5 +
                        13.75 * userData.weight.trim() +
                        5.003 * userData.height.trim() -
                        6.75 * userData.age.trim();
                    }

                    if (userData.gender.trim() === 'Female') {
                      userData.BMR =
                        655.1 +
                        9.563 * userData.weight.trim() +
                        1.85 * userData.height.trim() -
                        4.676 * userData.age.trim();
                    }

                    if (!(userData.activityLevel == 0)) {
                      //if the activity level is set then find TDEE:
                      userData.TDEE = userData.BMR * userData.activityLevel;
                    }

                    //ON PRESS IT ALSO RECALCULATES THE USER'S GOAL CALORIES AND GOAL MACRONUTRIENTS IF IDEAL WEIGHT DOES NOT EQUAL 0
                    if (!(userData.idealWeight == 0)) {
                      if (userData.idealWeight > userData.weight) {
                        const weightToGain =
                          userData.idealWeight - userData.weight;
                        const caloriesToGainTotal = 7700 * weightToGain;
                        const caloriesToGainWeekly =
                          caloriesToGainTotal / userData.idealWeeks;
                        const caloriesSurplusDaily = caloriesToGainWeekly / 7;

                        userData.goalCalories = Math.round(
                          userData.TDEE + caloriesSurplusDaily,
                        );

                        userData.goalProtein = Math.round(
                          (userData.goalCalories * 0.25) / 4,
                        );
                        userData.goalFats = Math.round(
                          (userData.goalCalories * 0.2) / 9,
                        );
                        userData.goalCarbs = Math.round(
                          (userData.goalCalories * 0.55) / 4,
                        );
                      }

                      if (userData.idealWeight < userData.weight) {
                        const weightToLose =
                          userData.weight - userData.idealWeight;
                        const caloriesToLoseTotal = 7700 * weightToLose;
                        const caloriesToLoseWeekly =
                          caloriesToLoseTotal / userData.idealWeeks;
                        const caloriesDeficitDaily = caloriesToLoseWeekly / 7;

                        userData.goalCalories = Math.round(
                          userData.TDEE - caloriesDeficitDaily,
                        );

                        userData.goalProtein = Math.round(
                          (userData.goalCalories * 0.3) / 4,
                        );
                        userData.goalFats = Math.round(
                          (userData.goalCalories * 0.15) / 9,
                        );
                        userData.goalCarbs = Math.round(
                          (userData.goalCalories * 0.55) / 4,
                        );
                      }

                      if (userData.idealWeight == userData.weight) {
                        userData.goalCalories = Math.round(userData.TDEE);

                        userData.goalProtein = Math.round(
                          (userData.goalCalories * 0.25) / 4,
                        );
                        userData.goalFats = Math.round(
                          (userData.goalCalories * 0.6) / 9,
                        );
                        userData.goalCarbs = Math.round(
                          (userData.goalCalories * 0.15) / 4,
                        );
                      }
                    }

                    updateUserFirestore(
                      userData.fullName,
                      userData.age.trim(),
                      userData.height.trim(),
                      userData.weight.trim(),
                      userData.BMR,
                      userData.TDEE,
                      userData.idealWeight,
                      userData.idealWeeks,
                      userData.goalCalories,
                      userData.goalProtein,
                      userData.goalCarbs,
                      userData.goalFats,
                      userData.gender,
                    );
                  }
                }
              }}>
              Save Details
            </Button>
          </ScrollView>
        </ContainerForProfileTabs>

        <ScrollView>
          <View style={{}}>
            <View
              style={{
                borderColor: '#CBC3E3',
                padding: 10,
                marginRight: 10,
              }}>
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
                  label="New Email"
                  value={email}
                  onChangeText={value => handleOnChangeText2(value, 'email')}
                  backgroundColor="#301934"
                  color="white"
                  mode="flat"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    currentPwdRef.current.focus();
                  }}
                  style={{
                    underlineColor: 'white',
                  }}
                  theme={{
                    colors: {
                      text: 'white',
                      placeholder: 'white',
                      primary: 'white',
                    },
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
                  label="Current Password"
                  value={passwordForEmailReset}
                  ref={currentPwdRef} 
                  onChangeText={value =>
                    handleOnChangeText2(value, 'passwordForEmailReset')
                  }
                  backgroundColor="#301934"
                  color="white"
                  mode="flat"
                  secureTextEntry
                  style={{
                    underlineColor: 'white',
                  }}
                  theme={{
                    colors: {
                      text: 'white',
                      placeholder: 'white',
                      primary: 'white',
                    },
                  }}
                />
              </View>

              <Button
                //icon="camera"
                mode="contained"
                color="white"
                labelStyle={{color: '#CBC3E3', fontSize: 15}}
                //loading = 'true'
                style={{
                  backgroundColor: '#1B1212',
                  borderWidth: 2,
                  marginBottom: 30,
                  width: 250,
                  marginTop: 1,
                  borderColor: '#CBC3E3',
                  alignSelf: 'center',
                  textAlign: 'center',
                  height: 55,
                  borderRadius: 40,
                }}
                contentStyle={{marginTop: 7}}
                onPress={() => {
                  if (validUpdateEmailForm(passwordForEmailReset)) {
                    updateUserEmail(authData.email, passwordForEmailReset);
                  }
                }}>
                Update Email
              </Button>

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
                  label="Update Password: Current Password"
                  value={password}
                  ref={updatePwdCPwdRef} 
                  onSubmitEditing={() => {
                    updatePwdNPwdRef.current.focus();
                  }}
                  onChangeText={value => handleOnChangeText2(value, 'password')}
                  backgroundColor="#301934"
                  color="white"
                  mode="flat"
                  secureTextEntry
                  style={{
                    underlineColor: 'white',
                  }}
                  theme={{
                    colors: {
                      text: 'white',
                      placeholder: 'white',
                      primary: 'white',
                    },
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
                  label="Update Password: New Password"
                  value={newPassword}
                  ref={updatePwdNPwdRef} 
                  onSubmitEditing={() => {
                    updatePwdConfirmNPwdRef.current.focus();
                  }}
                  onChangeText={value =>
                    handleOnChangeText2(value, 'newPassword')
                  }
                  backgroundColor="#301934"
                  color="white"
                  mode="flat"
                  secureTextEntry
                  style={{
                    underlineColor: 'white',
                  }}
                  theme={{
                    colors: {
                      text: 'white',
                      placeholder: 'white',
                      primary: 'white',
                    },
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
                  label="Confirm New Password"
                  value={confirmNewPwd}
                  ref={updatePwdConfirmNPwdRef} 
                  onChangeText={value =>
                    handleOnChangeText2(value, 'confirmNewPwd')
                  }
                  backgroundColor="#301934"
                  color="white"
                  mode="flat"
                  secureTextEntry
                  style={{
                    underlineColor: 'white',
                  }}
                  theme={{
                    colors: {
                      text: 'white',
                      placeholder: 'white',
                      primary: 'white',
                    },
                  }}
                />
              </View>

              <Button
                //icon="camera"
                mode="contained"
                color="white"
                labelStyle={{color: '#CBC3E3', fontSize: 15}}
                //loading = 'true'
                style={{
                  backgroundColor: '#1B1212',
                  borderWidth: 2,
                  marginBottom: 30,
                  width: 250,
                  marginTop: 1,
                  borderColor: '#CBC3E3',
                  alignSelf: 'center',
                  textAlign: 'center',
                  height: 55,
                  borderRadius: 40,
                }}
                contentStyle={{marginTop: 7}}
                onPress={() => {
                  if (
                    validPasswordInput(
                      authData.password,
                      authData.newPassword,
                      authData.confirmNewPwd,
                    )
                  ) {
                    updateUserPassword(password, newPassword);
                  }
                }}>
                Update Password
              </Button>
            </View>
          </View>
        </ScrollView>
      </ScrollView>

      <FlashMessage position="top" />
    </View>
  );
}
