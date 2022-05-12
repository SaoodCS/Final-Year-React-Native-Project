import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileHomeScreen from '../screens/profileScreens/profileHomeScreen';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import DietHomeScreen from '../screens/dietScreens/dietHomeScreen';
import FitnessHomeScreen from '../screens/fitnessScreens/fitnessHomeScreen';
import ProfileSettingsScreen from '../screens/profileScreens/profileSettingsScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Dimensions, Text} from 'react-native';
import MeasurementsScreen from '../screens/profileScreens/measurementsScreen';
import HealthFitnessMetrics from '../screens/profileScreens/healthFitnessMetrics';
import SavedFoodsScreen from '../screens/dietScreens/savedFoodsScreen';
import CreateFoodScreen from '../screens/dietScreens/createFoodScreen';
import AddFoods from '../screens/dietScreens/addFoods';
import TodaysTotals from '../screens/dietScreens/todaysTotals';
import DailyIntakeProgressScreen from '../screens/dietScreens/dailyIntakeProgressScreen';
import TDEECalcForm from '../screens/profileScreens/tdeeCalcForm';
import DietaryGoalForm from '../screens/profileScreens/dietaryGoalForm';
import FitnessGoalForm from '../screens/profileScreens/fitnessGoalForm';
import CreateWorkout from '../screens/fitnessScreens/createWorkout';
import SearchExercises from '../screens/fitnessScreens/searchExercises';
import CreateExercises from '../screens/fitnessScreens/createExercises';
import ViewProgress from '../screens/fitnessScreens/viewProgress';
import BeginWorkout from '../screens/fitnessScreens/beginWorkout';
import Shoulders from '../screens/fitnessScreens/shoulders';
import Legs from '../screens/fitnessScreens/legs';
import Back from '../screens/fitnessScreens/back';
import Abs from '../screens/fitnessScreens/abs';
import Chest from '../screens/fitnessScreens/chest';
import Triceps from '../screens/fitnessScreens/triceps';
import Biceps from '../screens/fitnessScreens/biceps';
import Cardio from '../screens/fitnessScreens/cardio';
import CreatedWorkoutOverview from '../screens/fitnessScreens/createdWorkoutOverview';
import PerformWorkout from '../screens/fitnessScreens/performWorkout';
import CompletedWorkoutOverview from '../screens/fitnessScreens/completedWorkoutOverview';
import ExerciseProgress from '../screens/fitnessScreens/exerciseProgress';
import DisplayExProgress from '../screens/fitnessScreens/displayExProgress';
import AbsProgress from '../screens/fitnessScreens/absProgress';
import BackProgress from '../screens/fitnessScreens/backProgress';
import BicepProgress from '../screens/fitnessScreens/bicepProgress';
import CardioProgress from '../screens/fitnessScreens/cardioProgress';
import ChestProgress from '../screens/fitnessScreens/chestProgress';
import LegsProgress from '../screens/fitnessScreens/legsProgress';
import ShouldersProgress from '../screens/fitnessScreens/shouldersProgress';
import TricepsProgress from '../screens/fitnessScreens/tricepsProgress';
import PerformGeneratedWorkout from '../screens/fitnessScreens/performGeneratedWorkout';
import CompletedGeneratedWOverview from '../screens/fitnessScreens/completedGeneratedWOverview';

// THIS COMPONENT USES REACT NAVIGATION TO NAVIGATE THROUGHOUT THE APP
// ALL SCREEN COMPONENTS ARE IMPORTED INTO THIS COMPONENT SO THAT THEY CAN BE INCLUDED IN THE STACK NAVIGATOR

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const fullScreenWidth = Dimensions.get('window').width;

const ProfileStack = ({navigation}) => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Profile Home" component={ProfileHomeScreen} />

    <Stack.Screen name="Profile Settings" component={ProfileSettingsScreen} />
    <Stack.Screen name="Measurements" component={MeasurementsScreen} />
    <Stack.Screen
      name="Health and Fitness Metrics"
      component={HealthFitnessMetrics}
    />
    <Stack.Screen name="TDEE Calculation" component={TDEECalcForm} />
    <Stack.Screen name="Dietary Goal" component={DietaryGoalForm} />
    <Stack.Screen name="Fitness Goal" component={FitnessGoalForm} />
  </Stack.Navigator>
);

const DietStack = ({navigation}) => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Diet Home" component={DietHomeScreen} />
    <Stack.Screen name="Add Foods" component={AddFoods} />
    <Stack.Screen name="Saved Foods" component={SavedFoodsScreen} />
    <Stack.Screen name="Create Food" component={CreateFoodScreen} />
    <Stack.Screen name="Today's Totals" component={TodaysTotals} />
    <Stack.Screen
      name="Daily Intake Progress"
      component={DailyIntakeProgressScreen}
    />
  </Stack.Navigator>
);

const FitnessStack = ({navigation}) => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Fitness Home" component={FitnessHomeScreen} />
    <Stack.Screen name="Create Workout" component={CreateWorkout} />
    <Stack.Screen name="Search Exercises" component={SearchExercises} />
    <Stack.Screen name="Create Exercises" component={CreateExercises} />
    <Stack.Screen name="View Progress" component={ViewProgress} />
    <Stack.Screen name="Begin Workout" component={BeginWorkout} />

    <Stack.Screen name="Shoulders" component={Shoulders} />
    <Stack.Screen name="Biceps" component={Biceps} />
    <Stack.Screen name="Back" component={Back} />
    <Stack.Screen name="Abs" component={Abs} />
    <Stack.Screen name="Chest" component={Chest} />
    <Stack.Screen name="Triceps" component={Triceps} />
    <Stack.Screen name="Legs" component={Legs} />
    <Stack.Screen name="Cardio" component={Cardio} />
    <Stack.Screen
      name="Created Workout Overview"
      component={CreatedWorkoutOverview}
    />
    <Stack.Screen name="Perform Workout" component={PerformWorkout} />
    <Stack.Screen
      name="Completed Workout Overview"
      component={CompletedWorkoutOverview}
    />
    <Stack.Screen name="Exercise Progress" component={ExerciseProgress} />
    <Stack.Screen name="Display Progress" component={DisplayExProgress} />
    <Stack.Screen name="Abs Progress" component={AbsProgress} />
    <Stack.Screen name="Back Progress" component={BackProgress} />
    <Stack.Screen name="Bicep Progress" component={BicepProgress} />
    <Stack.Screen name="Cardio Progress" component={CardioProgress} />
    <Stack.Screen name="Chest Progress" component={ChestProgress} />
    <Stack.Screen name="Legs Progress" component={LegsProgress} />
    <Stack.Screen name="Shoulders Progress" component={ShouldersProgress} />
    <Stack.Screen name="Triceps Progress" component={TricepsProgress} />
    <Stack.Screen
      name="Perform Generated Workout"
      component={PerformGeneratedWorkout}
    />
    <Stack.Screen
      name="Completed Generated Workout Overview"
      component={CompletedGeneratedWOverview}
    />
  </Stack.Navigator>
);

const AppStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="FitnessTab"
      activeColor="white"
      barStyle={{backgroundColor: '#301935', width: fullScreenWidth}}>
      <Tab.Screen
        name="FitnessTab"
        component={FitnessStack}
        options={{
          tabBarLabel: 'Fitness',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="weight-lifter"
              color={color}
              size={26}
            />
          ),
        }}
      />

      <Tab.Screen
        name="DietTab"
        component={DietStack}
        options={{
          tabBarLabel: 'Diet',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="food-apple" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppStack;
