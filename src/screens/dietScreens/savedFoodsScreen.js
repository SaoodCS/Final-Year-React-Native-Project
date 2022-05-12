import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';

import {Alert} from 'react-native';
import {TextInput} from 'react-native-paper';

import {openDatabase} from 'react-native-sqlite-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import CustomHeaderWithBack from '../globalComponent/customerHeaderWithBack';
import {showMessage, hideMessage} from 'react-native-flash-message';
import FlashMessage from 'react-native-flash-message';
// COMPONENT: GETS THE USERS CREATED FOODS DB TABLE --> DISPLAYS THEM --> ALLOWS THE USER TO ADD TO TODAY'S INTAKE:

var db = openDatabase({name: 'userFoods.db'}); //SQLITE DATABASE FOR DISPLAYING THE FOODS THE USER HAS CREATED
var db2 = openDatabase({name: 'foodsIntakeHistory.db'}); //SQLITE DATABASE FOR THE USER ADDING THE FOODS TO TODAY'S FOOD INTAKE

const SavedFoodsScreen = () => {
  const navigation = useNavigation();

  // USESTATE FOR THE USERS SAVED FOODS DISPLAYED IN A FLATLIST ON THE SCREEN
  let [flatListItems, setFlatListItems] = useState([]);
  //USESTATE FOR THE USER'S GRAMS INPUT
  const [gramsInput, setUserGramsInput] = useState('');

  //USE-EFFECT FOR SHOWING THE USER'S SAVED FOODS LIST FROM THE demo_food table
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM demo_food', //DEMO FOOD IS THE TABLE IN THE USERFOODS DATABASE THAT CONTAINS THE DUMMY DATA FOR THE USERS SAVED FOODS
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setFlatListItems(temp);
        },
      );
    });
  }, []);

  // THE NAME OF THE TABLE STORING TODAY'S INTAKE:
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  const tableNameDate = '_' + date + '_' + month + '_' + year;

  // USEEFFECT FOR CREATING THE TODAY'S INTAKE TABLE IF IT IS NOT ALREADY CREATED:
  useEffect(() => {
    db2.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=" +
          "'" +
          tableNameDate +
          "'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS ' + tableNameDate, []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS ' +
                tableNameDate +
                '(food_id INTEGER PRIMARY KEY AUTOINCREMENT, food_name VARCHAR(30), food_grams INT(15), food_calories INT(15), food_protein INT(15), food_fats INT(15), food_carbs INT(15))',
              [],
            );
          }
        },
      );
    });
  }, []);

  //FUNCTION FOR INSERTING DATA INTO THE TODAYS DATE INTAKE TABLE IN THE FOODINTAKEHISTORY DATABASE
  const InsertData = (foodName, grams, calories, protein, fats, carbs) => {
    db2.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO ' +
          tableNameDate +
          ' (food_name, food_grams, food_calories, food_protein, food_fats, food_carbs) VALUES (?,?,?,?,?,?)',
        [foodName, grams, calories, protein, fats, carbs],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            alert('Data Inserted Successfully....');
          } else alert('failed....');
        },
      );
    });
  };

  //FUNCTION FOR USER DELETING THE FOOD THE USER HAS CREATED
  const deleteData = foodID => {
    db.transaction(function (tx) {
      tx.executeSql(
        'DELETE FROM demo_food where food_id=?',
        [foodID],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            alert('Data Deleted Successfully....');
          } else alert('Failed...'); 
        },
      );
    });
  };

  // FUNCTION FOR ENSURING THE USER HAS INSERTED A VALID NUMBER FOR THEIR GRAMS INPUT -- IF NOT DISPLAY AN ERROR MESSAGE INFORMING THEM
  const validNumberCheck = value => {
    const checkNum =
      /^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$/; //regular expression to ensure grams is a integer
    return checkNum.test(value);
  };

  function validateGramsInput(gramsInput) {
    if (!validNumberCheck(gramsInput.trim())) {
      return showMessage({
        message: 'Please Enter a Valid Number of Reps',
        type: 'info',
        color: 'black',
        backgroundColor: 'red',
      });
    } else {
      return true;
    }
  }

  // MAIN RENDER
  return (
    <View>
      <CustomHeaderWithBack pageName="Saved Foods" backNavScreen="Add Foods" />

      <View
        style={{
          height: '92.75%',
          backgroundColor: '#171717',
          borderColor: '#CBC3E3',
          padding: 10,

          borderBottomWidth: 2,
          borderTopWidth: 1,
        }}>
        <FlatList
          data={flatListItems}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{alignContent: 'center'}}
          //
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                width: '100%',
                backgroundColor: '#CBC3E3',
                alignContent: 'center',
                alignItems: 'center',
              }}
            />
          )}
          ListEmptyComponent={() => (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  padding: 20,
                }}>
                <MaterialCommunityIcons
                  name="database-off"
                  color="#CBC3E3"
                  size={100}
                />
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Text style={{color: '#CBC3E3', fontSize: 20}}>
                  {' '}
                  No User Created Foods.{' '}
                </Text>
              </View>
            </View>
          )}
          renderItem={({item}) => (
            <View>
              <Text
                style={{
                  fontSize: 20,
                  color: '#CBC3E3',
                  marginBottom: 10,
                  marginTop: 5,
                  marginLeft: 10,
                }}>
                {item.food_name}
              </Text>

              <View style={{flexDirection: 'row', marginLeft: 10}}>
                <TextInput
                  placeholder="Amount (g)"
                  onChangeText={gramsInput => setUserGramsInput(gramsInput)}
                  defaultValue={gramsInput}
                  backgroundColor="#301934"
                  style={{
                    width: '65%',
                    height: 40,
                    marginBottom: 5,
                    fontSize: 15,
                    mode: 'contained',
                  }}
                  theme={{
                    colors: {
                      text: 'white',
                      placeholder: 'white',
                      primary: 'white',
                    },
                  }}
                />

                <TouchableOpacity
                  style={{marginLeft: 14}}
                  onPress={() => {
                    if (validateGramsInput(gramsInput)) {
                      const updatedCalories = Math.round(
                        (parseFloat(item.food_calories) / 100) * gramsInput,
                      ); //Over 100 because default grams is 100
                      const updatedProtein = Math.round(
                        (parseFloat(item.food_protein) / 100) * gramsInput,
                      );
                      const updatedCarbs = Math.round(
                        (parseFloat(item.food_carbs) / 100) * gramsInput,
                      );
                      const updatedFats = Math.round(
                        (parseFloat(item.food_fats) / 100) * gramsInput,
                      );

                      Alert.alert(
                        'Would You Like To Add ' +
                          item.food_name +
                          "To Today's Intake?",
                        'Grams: ' +
                          gramsInput +
                          'g' +
                          ' Calories: ' +
                          updatedCalories +
                          'g' +
                          ' Protein: ' +
                          updatedProtein +
                          'g' +
                          ' Fats: ' +
                          updatedFats +
                          'g' +
                          ' Carbs: ' +
                          updatedCarbs +
                          'g',
                        [
                          {
                            text: 'OK',
                            onPress: () => {
                              InsertData(
                                item.food_name,
                                String(gramsInput),
                                String(updatedCalories),
                                String(updatedProtein),
                                String(updatedFats),
                                String(updatedCarbs),
                              );
                            },
                          },
                        ],
                      );
                    }
                  }}>
                  <MaterialCommunityIcons
                    name="basket-plus-outline"
                    color="green"
                    size={45}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginLeft: 3, marginTop: 1}}
                  onPress={() => {
                    Alert.alert('Delete' + item.food_name, '?', [
                      {
                        text: 'YES',
                        onPress: () => {
                          //DELETE ITEM FROM SQL FUNCTION GOES HERE
                          deleteData(item.food_id);
                          navigation.replace('Add Foods');
                        },
                      },
                    ]);
                  }}>
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    color="#8b0000"
                    size={45}
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  fontSize: 13,
                  color: '#CBC3E3',
                  marginBottom: 10,
                  marginTop: 10,
                  marginLeft: 10,
                  marginRight: 10,
                }}>
                Per 100g: Calories: {item.food_calories} | Protein:{' '}
                {item.food_protein}g | Fats: {item.food_fats}g | Carbs:{' '}
                {item.food_carbs}g
              </Text>
            </View>
          )}
        />
      </View>

      <FlashMessage position="top" />
    </View>
  );
};

export default SavedFoodsScreen;
