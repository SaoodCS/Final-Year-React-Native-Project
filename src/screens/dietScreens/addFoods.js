import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {Alert} from 'react-native';
import {TextInput} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {openDatabase} from 'react-native-sqlite-storage';
import CustomHeaderWithBack from '../globalComponent/customerHeaderWithBack';
import {showMessage, hideMessage} from 'react-native-flash-message';
import FlashMessage from 'react-native-flash-message';


// COMPONENT: DISPLAYS IN-APP FOODS THAT THE USER CAN ADD TO THEIR DAILY INTAKE

// SQLITE DATABASE FOR THE USER TO ADD THEIR DAILY INTAKE INTO:
var db = openDatabase({name: 'foodsIntakeHistory.db'});

const screen = Dimensions.get('window');

const AddFoods = () => {


  // IN-APP DEFAULT NUTRITIONAL DATABASE TO BE DISPLAYED IN A FLATLIST ON THE SCREEN
  const nutritionalData = require('./nutritionalDatabase.json');

  // USESTATE FOR THE USER'S GRAMS TEXTINPUT
  const [gramsInput, setUserGramsInput] = useState('');

  const navigation = useNavigation();

  // THE NAME OF THE DAILY INTAKE DB TABLE IS TODAY'S DATE
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  const tableNameDate = '_' + date + '_' + month + '_' + year;

  // ON COMPONENT MOUNT: CREATE A TABLE FOR TODAY'S DAILY INTAKE IF IT DOESN'T ALREADY EXIST:
  useEffect(() => {
    db.transaction(function (txn) {
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

  // FUNCTION FOR INSERTING FOOD DATA INTO THE DAILY INTAKE DB TABLE
  const InsertData = (foodName, grams, calories, protein, fats, carbs) => {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO ' +
          tableNameDate +
          ' (food_name, food_grams, food_calories, food_protein, food_fats, food_carbs) VALUES (?,?,?,?,?,?)',
        [foodName, grams, calories, protein, fats, carbs],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            alert(foodName + "Has Been Added To Today's Intake");
          } else alert('failed....');
        },
      );
    });
  };

  // REG EXPRESSION TO ENSURE THE USER HAS TYPED IN A NUMBER FOR THEIR GRAMS INPUT, OTHERWISE DISPLAY A MESSAGE TELLING THEM TO DO SO
  const validNumberCheck = value => {
    const checkNum =
      /^([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$/;
    return checkNum.test(value);
  };

  function validateGramsInput() {
    if (!validNumberCheck(gramsInput.trim())) {
      return showMessage({
        message: 'Please Enter The Weight (Grams) of Your Food Item',
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
      <CustomHeaderWithBack pageName="Add Foods" backNavScreen="Diet Home" />
      <View>
        <View
          style={{
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            borderBottomColor: 'black',
            backgroundColor: '#301934',
          }}>
          <View style={{alignContent: 'center', flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                navigation.replace('Create Food');
              }}
              style={[styles.button, styles.buttonReset]}>
              <Text style={[styles.buttonText, styles.buttonTextReset]}>
                Create
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.replace('Saved Foods');
              }}
              style={[styles.button, styles.buttonReset]}>
              <Text style={[styles.buttonText, styles.buttonTextReset]}>
                Saved
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            height: '86%',
            backgroundColor: '#171717',
            borderColor: '#CBC3E3',
            padding: 10,
            marginTop: 0.5,
            borderBottomWidth: 2,
            borderTopWidth: 1,
          }}>
          <FlatList
            data={nutritionalData}
            keyExtractor={nutritionalData => nutritionalData.Key}
            contentContainerStyle={{alignContent: 'center'}}
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
                  {item.FoodName}
                </Text>
                <View style={{flexDirection: 'row', marginLeft: 10}}>
                  <TextInput
                    placeholder="Amount (g)"
                    onChangeText={gramsInput => setUserGramsInput(gramsInput)}
                    defaultValue={gramsInput}
                    backgroundColor="#301934"
                    style={{
                      width: '70%',
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
                          (parseFloat(item.Calories) / 100) * gramsInput,
                        ); //Over 100 because default grams is 100
                        const updatedProtein = Math.round(
                          (parseFloat(item.Protein) / 100) * gramsInput,
                        );
                        const updatedCarbs = Math.round(
                          (parseFloat(item.Carbs) / 100) * gramsInput,
                        );
                        const updatedFats = Math.round(
                          (parseFloat(item.Fats) / 100) * gramsInput,
                        );
                        const foodName = item.FoodName;
                        console.log(foodName);

                        Alert.alert(
                          'Would You Like To Add ' +
                            item.FoodName +
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
                              text: 'YES',
                              onPress: () => {
                                InsertData(
                                  item.FoodName,
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
                  Per 100g: Calories: {item.Calories} | Protein: {item.Protein}g
                  | Fats: {item.Fats}g | Carbs: {item.Carbs}g
                </Text>
              </View>
            )}
          />
        </View>
        <FlashMessage position="top" />
      </View>
    </View>
  );
};

export default AddFoods;

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: '#B9AAFF',
    width: screen.width / 8,
    height: screen.width / 8,
    borderRadius: screen.width / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B1212',
    marginRight: 8,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 12,
  },
  buttonText: {
    fontSize: 12,
    color: '#CBC3E3',
  },
  timerText: {
    color: '#CBC3E3',
    fontSize: 27,
    marginBottom: 5,
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  buttonReset: {
    marginLeft: 10,

    borderColor: '#CBC3E3',
    marginBottom: 10,
    marginTop: 10,
  },
  buttonTextReset: {
    color: '#CBC3E3',
  },
});
