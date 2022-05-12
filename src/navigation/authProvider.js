import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  // THIS IS A GLOBAL CONTEXT PROVIDOR COMPONENT THAT PROVIDES FIREBASE FUNCTIONS TO ALL OTHER COMPONENTS THROUGHOUT THE APP
  // WHERE NEEDED, THE AUTHCONTEXT PROVIDOR IS IMPORTED INTO THE SCREEN COMPONENTS WHEREBY THAT SCREEN ACCESSES THE FIREBASE FUNCTIONS

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        // FUNCTION FOR THE USER TO LOGIN TO THE APPLICATION USING FIREBASE AUTHENTICATION
        login: async (email, password) => {
          try {
            await auth()
              .signInWithEmailAndPassword(email, password)
              .then(() => {})
              .catch(error => {
                if (error.code === 'auth/wrong-password') {
                  Alert.alert(
                    'Incorrect Password',
                    'The password you have entered is incorrect. Please try again. ',
                    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                  );
                }
                if (error.code === 'auth/user-not-found') {
                  Alert.alert(
                    'User Not Found',
                    'There is no user associated with this login email to reset the password for. Please check you have entered your email correctly and try again',
                    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                  );
                }
              });
          } catch (e) {
            console.log(e);
          }
        },

        // FUNCTION FOR THE USER TO REGISTER THEIR ACCOUNT USING FIREBASE AUTHENTICATION
        register: async (fullName, email, password) => {
          try {
            await auth()
              .createUserWithEmailAndPassword(email, password)
              .then(() => {
                auth().currentUser.updateProfile({displayName: fullName});
              })
              .then(() => {
                firestore()
                  .collection('users')
                  .doc(auth().currentUser.uid)
                  .set({
                    fullName: fullName,
                    email: email,
                    age: '',
                    weight: '',
                    height: '',
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
                    bodyfatPercentage: '',
                    idealWeight: '0',
                    BMR: '0',
                    gender: '',
                    activityLevel: '0',
                    bodyfatPercentage: '',
                    TDEE: '0',
                    idealWeeks: '',
                    goalCalories: '0',
                    goalProtein: '0',
                    goalCarbs: '0',
                    goalFats: '0',
                    trainingFrequency: '',
                  });
              })

              .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                  Alert.alert(
                    'Email Already Registered',
                    'The email you are trying to register with has already been registered, try signing in with it or signing up with another email.',
                    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                  );
                }
              });
          } catch (e) {
            console.log(e);
          }
        },
        // FUNCTION FOR THE USER TO LOGOUT OF THE APPLICATION USING FIREBASE AUTHENTICATION
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.log(e);
          }
        },

        // FUNCTION FOR THE USER TO RESET THEIR PASSWORD IF THEY FORGOT THEIR PASSWORD USING THE SENDPASSWORDRESETEMAIL FUNCTION AVAILABLE IN FIREBASE
        forgotPassword: async email => {
          try {
            await auth()
              .sendPasswordResetEmail(email)
              .then(() => {
                Alert.alert(
                  'Email Sent',
                  'An email has been sent to recover your password ',
                  [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                );
              })
              .catch(error => {
                if (error.code === 'auth/network-request-failed') {
                  Alert.alert(
                    'No Network Connection',
                    'Your device currently has no network connection. Please establish a connection and try again ',
                    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                  );
                }
                if (error.code === 'auth/user-not-found') {
                  Alert.alert(
                    'User Not Found',
                    'There is no user associated with this login email to reset the password for. Please check you have entered your email correctly and try again',
                    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                  );
                }
              });
          } catch (e) {
            console.log(e);
          }
        },

        // FUNCTION FOR THE USER TO UPDATE THEIR PROFILE ACCOUNT INFORMATION IN THEIR FIRESTORE DOC ON THE PROFILE SETTINGS COMPONENT
        updateUserFirestore: async (
          fullNameInput,
          ageInput,
          heightInput,
          weightInput,
          BMR,
          TDEE,
          idealWeight,
          idealWeeks,
          goalCalories,
          goalProtein,
          goalCarbs,
          goalFats,
          gender,
        ) => {
          try {
            await firestore()
              .collection('users')
              .doc(auth().currentUser.uid)
              .update({
                fullName: fullNameInput,
                age: ageInput,
                height: heightInput,
                weight: weightInput,
                BMR: BMR,
                TDEE,
                idealWeight: idealWeight,
                idealWeeks: idealWeeks,
                goalCalories: goalCalories,
                goalProtein: goalProtein,
                goalCarbs: goalCarbs,
                goalFats: goalFats,
                gender: gender,
              })
              .then(() => {
                auth().currentUser.updateProfile({displayName: fullNameInput});
              })
              .then(() => {
                Alert.alert(
                  'Details Updated Successfully',
                  'You have successfully updated your profile details',
                  [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                );
              })
              .catch(error => {
                console.log(error.code, error.message);
              });
          } catch (e) {
            console.log(error.code, error.message);
          }
        },

        // FUNCTION FOR THE USER TO UPDATE THEIR MEASUREMENTS IN THEIR FIRESTORE DOC FOR THE CALCULATE BODYFAT % SCREEN COMPONENT
        updateUserMeasurements: async (
          ageInp,
          heightInp,
          weightInp,
          neckCircumInputInp,
          chestCircumInp,
          abdomenCircumInp,
          hipCircumInp,
          thighCircumInp,
          kneeCircumInp,
          ankleCircumInp,
          bicepCircumInp,
          forearmCircumInp,
          WristCircumInp,
          activityLevelInp,
          BMRInp,
          bodyfatPercentageInp,
          TDEEInp,
          idealWeightInp,
          idealWeeksInp,
          goalCaloriesInp,
          goalProteinInp,
          goalCarbsInp,
          goalFatsInp,
          genderInp,
        ) => {
          try {
            await firestore()
              .collection('users')
              .doc(auth().currentUser.uid)
              .update({
                age: ageInp,
                height: heightInp,
                weight: weightInp,
                neckCircum: neckCircumInputInp,
                chestCircum: chestCircumInp,
                abdomenCircum: abdomenCircumInp,
                hipCircum: hipCircumInp,
                thighCircum: thighCircumInp,
                kneeCircum: kneeCircumInp,
                ankleCircum: ankleCircumInp,
                bicepCircum: bicepCircumInp,
                forearmCircum: forearmCircumInp,
                wristCircum: WristCircumInp,
                activityLevel: activityLevelInp,
                BMR: BMRInp,
                bodyfatPercentage: bodyfatPercentageInp,
                TDEE: TDEEInp,
                idealWeight: idealWeightInp,
                idealWeeks: idealWeeksInp,
                goalCalories: goalCaloriesInp,
                goalProtein: goalProteinInp,
                goalCarbs: goalCarbsInp,
                goalFats: goalFatsInp,
                gender: genderInp,
              })
              .then(() => {
                Alert.alert(
                  'Measurements Updated Successfully',
                  'Your Bodyfat % has been Calculated. Go to your Profile Statistics Review',
                  [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                );
              })
              .catch(error => {
                console.log(error.code, error.message);
              });
          } catch (e) {
            console.log(e.code, e.message);
          }
        },

        // FUNCTION FOR THE USER TO UPDATE THEIR DIETARY GOAL IN FIRESTORE FOR THE DIETARY GOAL SCREEN COMPONENT
        updateUserMetrics: async (
          activityLevel,
          fitnessGoal,
          trainingFrequency,
          dietType,
          TDEE,
          idealWeight,
          idealWeeks,
          goalCalories,
          goalProtein,
          goalCarbs,
          goalFats,
        ) => {
          try {
            await firestore()
              .collection('users')
              .doc(auth().currentUser.uid)
              .update({
                activityLevel: activityLevel,
                fitnessGoal: fitnessGoal,
                trainingFrequency: trainingFrequency,
                dietType: dietType,
                TDEE: TDEE,
                idealWeight: idealWeight,
                idealWeeks: idealWeeks,
                goalCalories: goalCalories,
                goalProtein: goalProtein,
                goalCarbs: goalCarbs,
                goalFats: goalFats,
              })
              .then(() => {
                Alert.alert(
                  'Details Updated Successfully',
                  'You have successfully updated your profile details',
                  [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                );
              })
              .catch(error => {
                console.log(error.code, error.message);
              });
          } catch (e) {
            console.log(e.code, e.message);
          }
        },

        // FUNCTION FOR THE USER TO UPDATE THEIR EMAIL ADDRESS FOR THE PROFILE SETTINGS SCREEN COMPONENT
        updateUserEmail: async (newEmail, oldPassword) => {
          try {
            await auth()
              .signInWithEmailAndPassword(auth().currentUser.email, oldPassword)
              .then(() => {
                auth().currentUser.updateEmail(newEmail);
              })
              .then(() => {
                firestore()
                  .collection('users')
                  .doc(auth().currentUser.uid)
                  .update({
                    email: newEmail,
                  });
              })
              .then(() => {
                Alert.alert(
                  'Email Successfully Updated',
                  'You have successfully updated your email address',
                  [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                );
              })

              .catch(error => {
                if (error.code === 'auth/network-request-failed') {
                  Alert.alert(
                    'No Network Connection',
                    'Your device currently has no network connection. Please establish a connection and try again ',
                    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                  );
                }
                if (error.code === 'auth/wrong-password') {
                  Alert.alert(
                    'Incorrect Password',
                    'The password you have entered is incorrect. Please try again. ',
                    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                  );
                }
              });
          } catch (e) {
            console.log(e.code, e.message);
          }
        },
        // FUNCTION FOR THE USER TO UPDATE THEIR PASSWORD FOR THE PROFILE SETTINGS COMPONENT
        updateUserPassword: async (oldPassword, newPassword) => {
          try {
            await auth()
              .signInWithEmailAndPassword(auth().currentUser.email, oldPassword)
              .then(() => {
                auth().currentUser.updatePassword(newPassword);
              })
              .then(() => {
                Alert.alert(
                  'Password Successfullu Updated',
                  'You have successfully updated your password',
                  [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                );
              })
              .catch(error => {
                if (error.code === 'auth/network-request-failed') {
                  Alert.alert(
                    'No Network Connection',
                    'Your device currently has no network connection. Please establish a connection and try again ',
                    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                  );
                }
                if (error.code === 'auth/wrong-password') {
                  Alert.alert(
                    'Incorrect Password',
                    'The password you have entered as your current password is incorrect. Please try again. ',
                    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                  );
                }
              });
          } catch (e) {
            console.log(e.code, e.message);
          }
        },

        // FUNCTION FOR THE USER TO UPDATE THEIR TDEE IN FIRESTORE FOR THE TDEE SCREEN COMPONENT
        updateUserTDEE: async (
          ageInput,
          heightInput,
          weightInput,
          genderInput,
          activityLevelInput,
          BMR,
          TDEE,
          idealWeight,
          idealWeeks,
          goalCalories,
          goalProtein,
          goalCarbs,
          goalFats,
        ) => {
          try {
            await firestore()
              .collection('users')
              .doc(auth().currentUser.uid)
              .update({
                age: ageInput,
                height: heightInput,
                weight: weightInput,
                gender: genderInput,
                activityLevel: activityLevelInput,
                BMR: BMR,
                TDEE: TDEE,
                idealWeight: idealWeight,
                idealWeeks: idealWeeks,
                goalCalories: goalCalories,
                goalProtein: goalProtein,
                goalCarbs: goalCarbs,
                goalFats: goalFats,
              })
              .then(() => {
                Alert.alert(
                  'Details Updated Successfully',
                  'You have successfully updated your profile details',
                  [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                );
              })
              .catch(error => {
                console.log(error.code, error.message);
              });
          } catch (e) {
            console.log(e.code, e.message);
          }
        },

        // FUNCTION FOR THE USER TO UPDATE THEIR FITNESS GOAL IN FIRESTORE FOR THE FITNESS GOAL SCREEN COMPONENT
        updateUserFitnessMetrics: async (
          fitnessGoalInp,
          trainingFrequencyInp,
        ) => {
          try {
            await firestore()
              .collection('users')
              .doc(auth().currentUser.uid)
              .update({
                fitnessGoal: fitnessGoalInp,
                trainingFrequency: trainingFrequencyInp,
              })
              .then(() => {
                Alert.alert(
                  'Details Updated Successfully',
                  'You have successfully updated your profile details',
                  [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                );
              })
              .catch(error => {
                console.log(error.code, error.message);
              });
          } catch (e) {
            console.log(e.code, e.message);
          }
        },

        // FUNCTION FOR THE USER TO UPDATE THEIR DIETARY GOAL IN FIRESTORE FOR THE DIETARY GOAL COMPONENT
        updateUserDietaryGoal: async (
          ageInput,
          heightInput,
          weightInput,
          genderInput,
          activityLevelInput,
          BMR,
          TDEE,
          idealWeightInp,
          idealWeeksInp,
          goalCaloriesInp,
          goalCarbsInp,
          goalProteinInp,
          goalFatsInp,
        ) => {
          try {
            await firestore()
              .collection('users')
              .doc(auth().currentUser.uid)
              .update({
                age: ageInput,
                height: heightInput,
                weight: weightInput,
                gender: genderInput,
                activityLevel: activityLevelInput,
                BMR: BMR,
                TDEE: TDEE,
                idealWeight: idealWeightInp,
                idealWeeks: idealWeeksInp,
                goalCalories: goalCaloriesInp,
                goalCarbs: goalCarbsInp,
                goalProtein: goalProteinInp,
                goalFats: goalFatsInp,
              })
              .then(() => {
                Alert.alert(
                  'Details Updated Successfully',
                  'You have successfully updated your profile details',
                  [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                );
              })
              .catch(error => {
                console.log(error.code, error.message);
              });
          } catch (e) {
            console.log(e.code, e.message);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
