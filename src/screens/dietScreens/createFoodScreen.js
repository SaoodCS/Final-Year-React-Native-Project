import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
import CustomHeaderWithBack from '../globalComponent/customerHeaderWithBack';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from 'react-native-paper';
import {TextInput} from 'react-native-paper';
import {showMessage, hideMessage} from 'react-native-flash-message';
import FlashMessage from 'react-native-flash-message';
// COMPONENT: DISPLAYS A FORM ALLOWING THE USER TO CREATE A FOOD ITEM AND STORE IT IN THEIR DATABASE

// REGEX FOR ENSURING GRAMS INPUT IS NUMBER
const validNumberCheck = value => {
  const checkNum = /^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$/;
  return checkNum.test(value);
};

// FLOAT VALIDATION FOR THE ASSOCAITED INPUTS THAT REQUIRE A FLOAT
const validFloatCheck = value => {
  const checkFloat = /^[+-]?\d+(\.\d+)?$/;
  return checkFloat.test(value);
};


// SQLITE DB FOR THE USER TO ADD THE FOOD ITEM THEY CREATED INTO
var db = openDatabase({name: 'userFoods.db'});

const CreateFoodScreen = () => {
  const navigation = useNavigation();

  const [createdFood, setCreatedFood] = useState({
    foodName: '',
    grams: '',
    calories: '',
    protein: '',
    fats: '',
    carbs: '',
  });

  // ON COMPONENT MOUNT: CREATE THE DB TABLE FOR THE USER TO ADD THEIR CREATED FOOD ITEM INTO IF IT DOESN'T ALREADY EXIST
  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='demo_food'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS demo_food', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS demo_food(food_id INTEGER PRIMARY KEY AUTOINCREMENT, food_name VARCHAR(30), food_grams INT(15), food_calories INT(15), food_protein INT(15), food_fats INT(15), food_carbs INT(15))',
              [],
            );
          }
        },
      );
    });
  }, []);

  // FUNCTION FOR INSERTING THE FOOD ITEM INFO INTO THE USER CREATED FOODS DB TABLE
  const InsertData = (foodName, grams, calories, protein, fats, carbs) => {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO demo_food (food_name, food_grams, food_calories, food_protein, food_fats, food_carbs) VALUES (?,?,?,?,?,?)',
        [foodName, grams, calories, protein, fats, carbs],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert('Data Inserted Successfully....');
          } else Alert.alert('failed....');
        },
      );
    });
  };

  const {foodName, grams, calories, protein, fats, carbs} = createdFood;

  // FUNC FOR CHANGING THE STATE OF THE VARIABLES CONTAINING THE USER'S CREATED FOOD INPUTS
  const handleOnChangeText = (value, fieldName) => {
    setCreatedFood({...createdFood, [fieldName]: value});
  };

  // FUNCTION: VALIDATES THE USERS FORM -- OTHERWISE DISPLAYS AN ERROR MSG TELLING THE USER WHAT PART OF THE FORM IS INVALID
  function validCreatedFoodForm() {
    if (foodName.trim() == '') {
      return showMessage({
        message: 'Please Insert the Name of Your Food',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }
    if (!validNumberCheck(grams.trim())) {
      return showMessage({
        message: 'Please Insert The Weight (grams) of Your Food',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }

    if (!validFloatCheck(calories.trim())) {
      return showMessage({
        message: 'Please Insert the Amount of Calories in your Food',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }

    if (!validFloatCheck(protein.trim())) {
      return showMessage({
        message: 'Please Insert the Amount of Protein in your Food',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }

    if (!validFloatCheck(fats.trim())) {
      return showMessage({
        message: 'Please Insert the Amount of Fats in your Food',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    }

    if (!validFloatCheck(carbs.trim())) {
      return showMessage({
        message: 'Please Insert the Amount of Carbohydrates in your Food',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    } else {
      return true;
    }
  }

  // FUNCTION: FORMULAS FOR CONVERTING THE NUTRITIONAL INFORMATION TO BE PROPORTIONAL TO 100G BEFORE INSERTING INTO THE DB TABLE
  const convertCalsTo100Grams = () => {
    return Math.round(parseFloat((100 / grams) * calories));
  };
  const convertProteinTo100Grams = () => {
    return Math.round(parseFloat((100 / grams) * protein));
  };

  const convertCarbsTo100Grams = () => {
    return Math.round(parseFloat((100 / grams) * carbs));
  };
  const convertFatsTo100Grams = () => {
    return Math.round(parseFloat((100 / grams) * fats));
  };

  const setGramsto100 = () => {
    return 100;
  };




  // USEREF HOOKS TO NAVIGATE TO THE NEXT TEXTINPUT ON KEYBOARD PRESSING ENTER 

 
  const weightRef = useRef();
  const caloriesRef = useRef();
  const proteinRef = useRef();
  const fatsRef = useRef();
  const carbsRef = useRef();





  // MAIN RENDER:
  return (
    <View style={{flexGrow: 1, backgroundColor: '#171717'}}>
      <CustomHeaderWithBack pageName="Create Foods" backNavScreen="Add Foods" />

      <View
        style={{
          marginTop: 20,

          alignSelf: 'center',
        }}>
        <MaterialCommunityIcons
          name="fruit-grapes-outline"
          color="#CBC3E3"
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
            label="Food Name"
            value={foodName}
            returnKeyType="next"
            onSubmitEditing={() => {
              weightRef.current.focus();
            }}
            onChangeText={value => handleOnChangeText(value, 'foodName')}
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
            label="Weight (g)"
            value={grams}
            ref={weightRef} 
            returnKeyType="next"
            onSubmitEditing={() => {
              caloriesRef.current.focus();
            }}
            onChangeText={value => handleOnChangeText(value, 'grams')}
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
            label="Calories"
            value={calories}
            ref={caloriesRef} 
            returnKeyType="next"
            onSubmitEditing={() => {
              proteinRef.current.focus();
            }}
            onChangeText={value => handleOnChangeText(value, 'calories')}
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
            label="Protein (g)"
            value={protein}
            ref={proteinRef} 
            returnKeyType="next"
            onSubmitEditing={() => {
              fatsRef.current.focus();
            }}
            onChangeText={value => handleOnChangeText(value, 'protein')}
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
            label="Fats (g)"
            value={fats}
            ref={fatsRef} 
            returnKeyType="next"
            onSubmitEditing={() => {
              carbsRef.current.focus();
            }}
            onChangeText={value => handleOnChangeText(value, 'fats')}
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
            label="Carbs (g)"
            value={carbs}
            ref={carbsRef} 
            onChangeText={value => handleOnChangeText(value, 'carbs')}
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

        <View style={{}}>
          <Button
            //icon="camera"
            mode="contained"
            color="white"
            labelStyle={{color: '#171717', fontSize: 15}}
            //loading = 'true'
            style={{
              backgroundColor: '#CBC3E3',
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
              if (validCreatedFoodForm()) {
                createdFood.calories = convertCalsTo100Grams();
                createdFood.protein = convertProteinTo100Grams();
                createdFood.carbs = convertCarbsTo100Grams();
                createdFood.fats = convertFatsTo100Grams();
                createdFood.grams = setGramsto100();

                InsertData(
                  createdFood.foodName,
                  String(createdFood.grams),
                  String(createdFood.calories),
                  String(createdFood.protein),
                  String(createdFood.fats),
                  String(createdFood.carbs),
                );
                navigation.replace('Saved Foods');
                //updateUserSavedFoodsDatabase();
              }
            }}>
            Create Food Item
          </Button>
        </View>
      </ScrollView>
      <FlashMessage position="top" />
    </View>
  );
};

export default CreateFoodScreen;

const styles = StyleSheet.create({
  search: {
    //backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignItems: 'center',
    //padding: 20,
    marginBottom: 30,
  },
  button: {
    // backgroundColor: '#f9fafd',
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    //alignItems: 'center',
    //padding: 20,
    marginBottom: 20,
  },

  intakeHistory: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    color: '#333333',
  },
});
