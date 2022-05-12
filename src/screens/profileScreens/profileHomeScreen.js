import React, {useContext, useState, useEffect, useRef} from 'react';
import {View, Text, ScrollView, Dimensions, Animated} from 'react-native';
import {AuthContext} from '../../navigation/authProvider';
import TopTabBtns from './components/topTabBtns';
import CustomHeaderComponent from '../globalComponent/customHeaderComponent';
import auth, {firebase} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import ContainerForProfileTabs from './components/containerForProfileTabs';

// COMPONENT: THIS IS THE PROFILE HOME SCREEN: IT CONSISTS OF 2 MAIN COMPONENTS:
//1. MENU --> CONTAINS PRESSABLE TILES THAT NAVIGATE THE USER AROUND THE PROFILE SECTION
//2. STATISTICS --> CONTAINS A REVIEW/ANALYSIS OF THE USER'S PROFILE, BREAKING DOWN ALL KEY INFORMATION RELEVANT TO THE USER.

const {width} = Dimensions.get('window');

export default function ProfileHomeScreen() {
  // FUNCTION FROM AUTHPROVIDER FOR THE LOGOUT TILE WHICH ALLOWS THE USER TO LOGOUT OF THE APP/FIREBASE AND NAVIGATE BACK TO THE LOGIN SCREEN
  const {logout} = useContext(AuthContext);

  //USESTATE FOR DATA COLLECTED FROM THE USER'S FIRESTORE DOC
  const [userData, setUserData] = useState({
    fullName: '',
    BMR: '',
    goalCalories: '',
    goalCarbs: '',
    goalFats: '',
    goalProtein: '',
    bodyfatPercentage: '',
    fitnessGoal: '',
    idealWeight: '',
    idealWeeks: '',
    TDEE: '',
    gender: '',
  });

  // FUNCTION TO GET THE USER'S FIRESTORE PROFILE FROM THE USER'S FIRESTORE DOC
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
  // USEEFFECT TO GET THE FIRESTORE PROFILE WHEN THIS COMPONENT STARTS
  useEffect(() => {
    getUserFirestoreProfile();
  }, []);

  // ANIMATION HORIZONTAL SCROLL EFFECT ON SCREEN:
  // SCROLL LEFT = COMPONENT 1 (TILES FOR NAVIGATING THROUGH PROFILE SECTION)
  // SCROLL RIGHT = COMPONENT 2 (REVIEW/ANALYSIS OF USER'S PROFILE AND HEALTH)

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

  const navigation = useNavigation();

  const {
    fullName,
    BMR,
    goalCalories,
    goalCarbs,
    goalFats,
    goalProtein,
    bodyfatPercentage,
    fitnessGoal,
    weight,
    idealWeight,
    idealWeeks,
    TDEE,
    gender,
  } = userData;

  // Get User's BMR -- IF IT'S NOT SET IE. 0 THEN RETURN A MESSAGE TELLING THE USER TO PRESS HERE TO INPUT DATA FOR THEIR BMR (LINK TO PROFILE SETTING PAGE). OTHERWISE DISPLAY ANALYSIS TEXT.
  function displayBMR() {
    if (userData.BMR == 0) {
      return (
        <View>
          <TouchableOpacity
            onPress={() => navigation.replace('TDEE Calculation')}>
            <Text style={{fontSize: 16, color: 'red', marginBottom: 5}}>
              Press here to insert data to calculate your BMR
            </Text>
          </TouchableOpacity>
          <Text style={{color: 'red', fontSize: 13, fontStyle: 'italic'}}>
            BMR tells you the daily calories to maintain your weight at rest.
          </Text>
        </View>
      );
    } else {
      return (
        <Text>
          Your Basic Metabolic Rate is {Math.round(parseInt(userData.BMR))}{' '}
        </Text>
      );
    }
  }

  // GET USER'S TDEE -- IF IT'S NOT SET I.E. 0 THEN RETURN A MESSAGE TELLING THE USER TO PRESS HERE TO INPUT DATA FOR THEIR TDEE. OTHERWISE DISPLAY ANALYSIS TEXT.

  function displayTDEE() {
    if (userData.TDEE == 0) {
      return (
        <View>
          <TouchableOpacity
            onPress={() => navigation.replace('TDEE Calculation')}>
            <Text style={{color: 'red', fontSize: 16}}>
              Press here to insert data to calculate your TDEE
            </Text>
          </TouchableOpacity>
          <Text style={{color: 'red', fontSize: 13, fontStyle: 'italic'}}>
            TDEE tells you the calories to maintain your weight inc. activity
          </Text>
        </View>
      );
    } else {
      return (
        <Text>
          Your TDEE is {Math.round(parseInt(userData.TDEE))} calories. This
          tells you how many calories you would need to consume per day to
          maintain your current weight{' '}
        </Text>
      );
    }
  }

  // GET USER'S GOALCALORIES -- IF ITS NOT SET IE. 0 THEN RETURN A MESSAGE TELLING THE USER TO PRESS HERE TO INPUT DATA FOR THEIR GOALCALORIES. OTHERWISE DISPLAY ANALYSIS TEXT.

  function displaygoalCalories() {
    const usergoalCalories = userData.goalCalories;
    if (userData.idealWeight == 0) {
      return (
        <View>
          <TouchableOpacity onPress={() => navigation.replace('Dietary Goal')}>
            <Text style={{color: 'red', fontSize: 16}}>
              Press here to insert data for your goal calories.
            </Text>
          </TouchableOpacity>
          <Text style={{color: 'red', fontSize: 13, fontStyle: 'italic'}}>
            Your goal calories require a dietary goal.
          </Text>
        </View>
      );
    } else {
      return (
        <Text>
          Your goal calories per day is {usergoalCalories}. This tells you how
          many calories you would need to consume per day to reach your ideal
          weight
        </Text>
      );
    }
  }

  // DISPLAY FITNESS GOAL - IF ITS NAN THEN RETURN A MESSAGE TELLING THE USER TO PRESS HERE TO INPUT DATA FOR THEIR FITNESS GOAL. OTHERWISE DISPLAY ANALYSIS TEXT.
  function displayFitnessGoal() {
    const userFitnessGoal = userData.fitnessGoal;
    if (userFitnessGoal == null) {
      return (
        <View>
          <TouchableOpacity onPress={() => navigation.replace('Fitness Goal')}>
            <Text style={{color: 'red', fontSize: 16}}>
              Press here to insert a your fitness goal.
            </Text>
          </TouchableOpacity>
          <Text style={{color: 'red', fontSize: 13, fontStyle: 'italic'}}>
            A customised workout plan will be generated once completed
          </Text>
        </View>
      );
    } else {
      return (
        <Text>
          Your current fitness goal is {userFitnessGoal}. We have generated a
          workout split and plan for you to achieve this fitness goal. Visit the
          fitness tab to view this workout plan and create your own workouts.{' '}
        </Text>
      );
    }
  }

  // GET USER'S DIETARY -- IF ITS NOT SET IE. 0 THEN RETURN A MESSAGE TELLING THE USER TO PRESS HERE TO INPUT DATA FOR THEIR DEITARY GOAL. OTHERWISE DISPLAY ANALYSIS TEXT.
  function displayDietaryGoal() {
    const userIdealWeight = userData.idealWeight;
    const userCurrentWeight = userData.weight;
    const userIdealWeeks = userData.idealWeeks;

    if (userData.idealWeight == 0) {
      return (
        <View>
          <TouchableOpacity onPress={() => navigation.replace('Dietary Goal')}>
            <Text style={{color: 'red', fontSize: 16}}>
              Press here to insert a your dietary goal.
            </Text>
          </TouchableOpacity>
          <Text style={{color: 'red', fontSize: 13, fontStyle: 'italic'}}>
            Once set, your goal calories and macronutrients will be calculated
          </Text>
        </View>
      );
    }

    if (parseInt(userIdealWeight) > parseInt(userCurrentWeight)) {
      const difference = userIdealWeight - userCurrentWeight;

      return (
        <Text>
          You are currently aiming to achieve an ideal weight of{' '}
          {userIdealWeight}. In order to achieve this, you would need to gain{' '}
          {difference}kg. We have generated your ideal caloric and macronutrient
          intake to achieve this goal in {userIdealWeeks} weeks. You can log
          your food intake and view your progress on the Diet tab.
        </Text>
      );
    }

    if (parseInt(userIdealWeight) < parseInt(userCurrentWeight)) {
      const difference = userCurrentWeight - userIdealWeight;

      return (
        <Text>
          You are currently aiming to achieve an ideal weight of{' '}
          {userIdealWeight}. In order to achieve this, you would need to lose{' '}
          {difference}kg. We have generated your ideal caloric and macronutrient
          intake to achieve this goal in {userIdealWeeks} weeks. You can log
          your food intake and view your progress on the Diet tab.{' '}
        </Text>
      );
    }
  }

  // GET USER'S BODYFAT % -- IF IT'S NOT SET IE. 0 THEN RETURN A MESSAGE TELLING THE USER TO PRESS HERE TO INPUT DATA FOR THEIR BODYFAT % . OTHERWISE DISPLAY ANALYSIS TEXT.

  function displayBodyfatPercentage() {
    const userBodyfatPercentage = userData.bodyfatPercentage;
    const userGender = userData.gender;
    if (!(userBodyfatPercentage > 0)) {
      return (
        <View>
          <TouchableOpacity onPress={() => navigation.replace('Measurements')}>
            <Text style={{color: 'red', fontSize: 16}}>
              Press here to find out your bodyfat percentage.
            </Text>
          </TouchableOpacity>
          <Text style={{color: 'red', fontSize: 13, fontStyle: 'italic'}}>
            Your bodyfat% is an accurate predictor of your physical health.
          </Text>
        </View>
      );
    }
    if (userGender === 'Male' && userBodyfatPercentage > 24) {
      return (
        <Text>
          Your bodyfat percentage is {Math.round(userBodyfatPercentage)}%. The
          ideal bodyfat % range for males is between 2-24%. Thus we recommend
          you set an ideal weight lower than your current weight.{' '}
        </Text>
      );
    }
    if (userGender === 'Male' && userBodyfatPercentage < 24) {
      return (
        <Text>
          Your bodyfat percentage is {Math.round(userBodyfatPercentage)}%. This
          is within the healthy range for males.{' '}
        </Text>
      );
    }

    if (userGender === 'Female' && userBodyfatPercentage > 31) {
      return (
        <Text>
          Your bodyfat percentage is {Math.round(userBodyfatPercentage)}%. The
          ideal bodyfat % range for females is between 10-31%. Thus we recommend
          you set an ideal weight lower than your current weight.{' '}
        </Text>
      );
    }

    if (userGender === 'Female' && userBodyfatPercentage < 31) {
      return (
        <Text>
          Your bodyfat percentage is {Math.round(userBodyfatPercentage)}%. This
          is within the healthy range for females.{' '}
        </Text>
      );
    }
  }

  return (
    <View style={{backgroundColor: '#CBC3E3', flex: 1, paddingTop: 1}}>
      <View>
        <CustomHeaderComponent pageName={userData.fullName} />
      </View>
      <View style={{flexDirection: 'row', paddingHorizontal: 0}}>
        <TopTabBtns
          backgroundColor={loginColorAnimation}
          title="Menu"
          onPress={() => scrollView.current.scrollTo({x: 0})}
        />
        <TopTabBtns
          backgroundColor={registrationColorAnimation}
          title="My Statistics"
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
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                padding: 25,
              }}>
              <TouchableOpacity
                style={{}}
                onPress={() => navigation.replace('Profile Settings')}>
                <View
                  style={{
                    backgroundColor: '#301934',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 120,
                    width: 140,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#CBC3E3',
                    elevation: 400,
                    borderRadius: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      alignItems: 'center',
                      textAlign: 'center',
                      color: '#E6E6FA',
                    }}>
                    Profile Settings
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{}} onPress={() => logout()}>
                <View
                  style={{
                    backgroundColor: '#301934',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 120,
                    width: 140,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#CBC3E3',
                    elevation: 400,
                    borderRadius: 20,
                    marginLeft: 50,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      alignItems: 'center',
                      textAlign: 'center',
                      color: '#E6E6FA',
                    }}>
                    Logout
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                padding: 25,
              }}>
              <TouchableOpacity
                style={{}}
                onPress={() => navigation.replace('Measurements')}>
                <View
                  style={{
                    backgroundColor: '#301934',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 120,
                    width: 140,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#CBC3E3',
                    elevation: 400,
                    borderRadius: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      alignItems: 'center',
                      textAlign: 'center',
                      color: '#E6E6FA',
                    }}>
                    Bodyfat Percentage Calculator
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{}}
                onPress={() => navigation.replace('TDEE Calculation')}>
                <View
                  style={{
                    backgroundColor: '#301934',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 120,
                    width: 140,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#CBC3E3',
                    elevation: 400,
                    borderRadius: 20,
                    marginLeft: 50,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      alignItems: 'center',
                      textAlign: 'center',
                      color: '#E6E6FA',
                    }}>
                    TDEE Calculation
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                padding: 25,
              }}>
              <TouchableOpacity
                style={{}}
                onPress={() => navigation.replace('Dietary Goal')}>
                <View
                  style={{
                    backgroundColor: '#301934',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 120,
                    width: 140,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#CBC3E3',
                    elevation: 400,
                    borderRadius: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      alignItems: 'center',
                      textAlign: 'center',
                      color: '#E6E6FA',
                    }}>
                    Dietary Goal Form
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{}}
                onPress={() => navigation.replace('Fitness Goal')}>
                <View
                  style={{
                    backgroundColor: '#301934',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 120,
                    width: 140,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#CBC3E3',
                    elevation: 400,
                    borderRadius: 20,
                    marginLeft: 50,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      alignItems: 'center',
                      textAlign: 'center',
                      color: '#E6E6FA',
                    }}>
                    Fitness Goal Form
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{}}></View>
          </View>
        </ContainerForProfileTabs>

        <ScrollView style = {{backgroundColor: '#171717'}}>
          <ContainerForProfileTabs>
            <ScrollView>
              <View style={{}}>
                <View
                  style={{
                    backgroundColor: '#171717',
                    borderColor: '#CBC3E3',
                    padding: 10,
                  }}>
                  <Text style={{fontSize: 17, color: '#CBC3E3', marginTop: 7}}>
                    {displayBMR()}
                  </Text>
                  <Text
                    style={{fontSize: 16, color: '#CBC3E3', marginBottom: 5}}>
                    ___________________________________________________
                  </Text>

                  <Text style={{fontSize: 17, color: '#CBC3E3', marginTop: 5}}>
                    {displayTDEE()}
                  </Text>
                  <Text
                    style={{fontSize: 16, color: '#CBC3E3', marginBottom: 5}}>
                    ___________________________________________________
                  </Text>

                  <Text style={{fontSize: 17, color: '#CBC3E3', marginTop: 5}}>
                    {displaygoalCalories()}
                  </Text>
                  <Text
                    style={{fontSize: 16, color: '#CBC3E3', marginBottom: 5}}>
                    ___________________________________________________
                  </Text>

                  <Text style={{fontSize: 17, color: '#CBC3E3', marginTop: 5}}>
                    {displayBodyfatPercentage()}
                  </Text>
                  <Text
                    style={{fontSize: 16, color: '#CBC3E3', marginBottom: 5}}>
                    ___________________________________________________
                  </Text>

                  <Text style={{fontSize: 17, color: '#CBC3E3', marginTop: 5}}>
                    {displayFitnessGoal()}
                  </Text>
                  <Text
                    style={{fontSize: 16, color: '#CBC3E3', marginBottom: 5}}>
                    ___________________________________________________
                  </Text>

                  <Text style={{fontSize: 17, color: '#CBC3E3', marginTop: 5}}>
                    {displayDietaryGoal()}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </ContainerForProfileTabs>
        </ScrollView>
      </ScrollView>
    </View>
  );
}
