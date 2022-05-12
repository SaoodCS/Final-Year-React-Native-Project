import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';

import {Alert} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import {openDatabase} from 'react-native-sqlite-storage';

import CustomHeaderComponent from '../globalComponent/customHeaderComponent';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// COMPONENT: THE MAIN DIET HOME SCREEN WHEN THE USER PRESSES THE DIET TAB IN THE BOTTOM NAVIGATOR

// SQLITE DATABASE FOR DISPLAYING THE USER'S INTAKE HISTORY TODAY
var db = openDatabase({name: 'foodsIntakeHistory.db'});

const DietHomeScreen = () => {

  // USESTATES FOR THE SQLITE DATA:
  let [flatListItems, setFlatListItems] = useState([]);
  let [calories, setCalories] = useState([]);
  let [protein, setProtein] = useState([]);
  let [fats, setFats] = useState([]);
  let [carbs, setCarbs] = useState([]);

  const navigation = useNavigation();

  // THE NAME OF THE SQLITE TABLE THAT STORES TODAY'S FOOD INTAKE:
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  const viewTodaysDate = date + '/' + month + '/' + year;
  const tableNameDate = '_' + date + '_' + month + '_' + year;

  // USEEFFECT GETS TODAY'S INTAKE TABLE TO DISPLAY IN FLATLIST + OTHER USEEFFECTS TO GET EACH INDIVIDUAL COLUMN FROM THE TABLE:
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM ' + tableNameDate, [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        setFlatListItems(temp);
      });
    });
  }, []);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT food_calories FROM ' + tableNameDate,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setCalories(temp);
        },
      );
    });
  }, []);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT food_protein FROM ' + tableNameDate,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setProtein(temp);
        },
      );
    });
  }, []);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT food_carbs FROM ' + tableNameDate,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setCarbs(temp);
        },
      );
    });
  }, []);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT food_fats FROM ' + tableNameDate,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setFats(temp);
        },
      );
    });
  }, []);

  // USEEFFECT TO CREATE A TABLE STORING THE USERS DAILY NUTRIENTS TODAY IF IT DOESN'T ALREADY EXIST:
  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='total_daily_nutrients'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS total_daily_nutrients', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS total_daily_nutrients(date_id INTEGER PRIMARY KEY AUTOINCREMENT, today_date VARCHAR(30), total_cals INT(15), total_protein INT(15), total_fats INT(15), total_carbs INT(15))',
              [],
            );
          }
        },
      );
    });
  }, []);

  // FUNCTION FOR THE DELETE BUTTON TO DELETE ANY FOOD ITEMS FROM THE TODAY'S INTAKE TABLE:
  const deleteData = foodID => {
    db.transaction(function (tx) {
      tx.executeSql(
        'DELETE FROM ' + tableNameDate + ' where food_id=?',
        [foodID],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('Food Item Deleted');
          } else console.log('Failed');
        },
      );
    });
  };

  // FUNCTION FOR INSERTING THE TOTAL CALORIES AND MACROS CONSUMED TODAY INTO THE TOTAL DAILY NUTRIENTS TABLE
  // THE TOTAL DAILY NUTRIENTS TABLE CONTAINS A ROW FOR EACH DATE WHICH CONTAINS THE TOTAL CALORIES AND MACRONUTRIENTS INTAKE FOR THAT DATE
  const InsertTotalsData = (
    todaysDate,
    totalCals,
    totalProtein,
    totalFats,
    totalCarbs,
  ) => {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO total_daily_nutrients (today_date, total_cals, total_protein, total_fats, total_carbs) VALUES (?,?,?,?,?)',
        [todaysDate, totalCals, totalProtein, totalFats, totalCarbs],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('Data Inserted Successfully....');
          } else console.log('failed....');
        },
      );
    });
  };

  // FUNCTION: IF TODAY'S DATE IS ALREADY A ROW IN THE TABLE THEN UPDATE THE TOTALS IN THAT ROW:
  const updateTotalsData = (
    totalCals,
    totalProtein,
    totalFats,
    totalCarbs,
    todaysDate,
  ) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE total_daily_nutrients set total_cals=?, total_protein=?, total_fats=?, total_carbs=? where today_date=?',
        [totalCals, totalProtein, totalFats, totalCarbs, todaysDate],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Your Totals Have Been Updated Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => console.log('Ok Pressed'),
                },
              ],
              {cancelable: false},
            );
          } else alert('Update Failed');
        },
      );
    });
  };

  // FUNCTION: IF TODAY'S DATE EXISTS IN THE TABLE, THEN RUN THE UPDATE FUNCTION, OTHERWISE, RUN THE INSERT FUNCTION TO INSERT THE ROW FOR TODAY'S DATE
  const searchTableForDate = (
    totalCals,
    totalProtein,
    totalFats,
    totalCarbs,
    todaysDate,
  ) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM total_daily_nutrients where today_date = ?',
        [todaysDate],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            updateTotalsData(
              totalCals,
              totalProtein,
              totalFats,
              totalCarbs,
              todaysDate,
            );
          } else {
            InsertTotalsData(
              todaysDate,
              totalCals,
              totalProtein,
              totalFats,
              totalCarbs,
            );
          }
        },
      );
    });
  };

  // FUNCTION TO SUM UP THE NUMBERS IN A STRING TO GET THE TOTAL CALORIES, AND TOTAL MACRONUTRIENTS
  // REFERENCE: https://stackoverflow.com/questions/53897373/js-how-to-got-the-sum-of-numbers-from-a-string
  function sumNumbers(string) {
    let pos = 1;
    let numArray = [];
    let numString = null;

    for (let num of string) {
      let isParsed = isNaN(parseInt(num));
      if (!numString && !isParsed && pos === string.length) {
        numArray.push(num);
      } else if (!numString && !isParsed && pos !== string.length) {
        numString = num;
      } else if (numString && !isParsed && pos === string.length) {
        numString += num;
        numArray.push(numString);
      } else if (numString && isParsed && pos === string.length) {
        numArray.push(numString);
      } else if (numString && !isParsed) {
        numString += num;
      } else if (numString && isParsed && pos !== string.length) {
        numArray.push(numString);
        numString = null;
      } else if (!numString && isParsed && pos === string.length) {
        numString += num;
        numArray.push(numString);
      }
      pos++;
    }
    console.log('numAray:', numArray);
    let result = null;

    for (let num of numArray) {
      let value = parseInt(num);
      result += value;
    }

    return NaNCheck(result);
  }

  // IF THE RESULT IS NaN, set the variable to 0:

  function NaNCheck(result) {
    if (isNaN(result)) {
      result = 0;
    }
    return result;
  }

  // FUNCTION TO GET THE CALORIES/MACROS DATA, FORMAT IT SO THAT IT CAN RUN IN THE SUMNUMBERS FUNCTION, AND THEN SUM UP THE MACROS/CALORIES TO GET THE TOTALS:
  function formatColumnDataThenSum(columnObject) {
    const stringifiedColumnObject = JSON.stringify(columnObject);
    const formatStringForFunc = stringifiedColumnObject.replace(/[^\d+]/g, 'a');
    const formatStringForFuncPt2 = formatStringForFunc.slice(0, -1);
    return sumNumbers(formatStringForFuncPt2);
  }

  //MAIN RENDER:
  return (
    <View style={{backgroundColor: '#CBC3E3'}}>
      <CustomHeaderComponent pageName="Diet Home" />

      <ScrollView>
        <View>
          <View
            style={{
              backgroundColor: '#301934',
              alignItems: 'center',
              color: '#301934',
              padding: 10,
              borderWidth: 1,
              marginTop: 2,
            }}>
            <Text style={{color: 'white', fontSize: 20}}>
              Food Intake: {viewTodaysDate}
            </Text>
          </View>
          <View
            style={{
              height: 240,
              backgroundColor: '#171717',
              borderColor: '#CBC3E3',
              padding: 10,
              marginTop: 0.5,
              borderBottomWidth: 2,
              borderTopWidth: 1,
            }}>
            <FlatList
              data={flatListItems}
              keyExtractor={(item, index) => index.toString()}
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
                      No Food Items Added Today{' '}
                    </Text>
                  </View>
                </View>
              )}
              renderItem={({item}) => (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      flexGrow: 1,
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        color: '#CBC3E3',
                        marginBottom: 5,
                        marginTop: 10,
                      }}>
                      {item.food_name}
                    </Text>

                    <TouchableOpacity
                      style={{marginLeft: 3, marginTop: 3}}
                      onPress={() => {
                        deleteData(item.food_id);
                        navigation.replace('Diet Home');
                      }}>
                      <MaterialCommunityIcons
                        name="trash-can-outline"
                        color="#8b0000"
                        size={45}
                      />
                    </TouchableOpacity>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 12,
                        marginBottom: 10,
                        color: '#CBC3E3',
                      }}>
                      Grams: {item.food_grams}g | Calories: {item.food_calories}{' '}
                      | Protein: {item.food_protein}g | Fats: {item.food_fats}g
                      | Carbs: {item.food_carbs}g
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>

          <ScrollView>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                padding: 25,
              }}>
              <TouchableOpacity
                style={{}}
                onPress={() => navigation.replace('Add Foods')}>
                <View
                  style={{
                    backgroundColor: '#301934',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 140,
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
                    Add Foods
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{}}
                onPress={() => {
                  const caloriesTotal = formatColumnDataThenSum(calories);
                  const proteinTotal = formatColumnDataThenSum(protein);
                  const fatsTotal = formatColumnDataThenSum(fats);
                  const carbsTotal = formatColumnDataThenSum(carbs);

                  navigation.replace("Today's Totals", {
                    caloriesTotalPass: caloriesTotal,
                    proteinTotalPass: proteinTotal,
                    fatsTotalPass: fatsTotal,
                    carbsTotalPass: carbsTotal,
                  });
                }}>
                <View
                  style={{
                    backgroundColor: '#301934',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 140,
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
                    Today's Totals
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                padding: 10,
              }}>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  const caloriesTotal = formatColumnDataThenSum(calories);
                  const proteinTotal = formatColumnDataThenSum(protein);
                  const fatsTotal = formatColumnDataThenSum(fats);
                  const carbsTotal = formatColumnDataThenSum(carbs);

                  // if (isNaN(caloriesTotal)) {
                  //    caloriesTotal = 0;
                  // }
                  // if (isNaN(proteinTotal)) {
                  //   caloriesTotal = 0;
                  // }
                  // if (isNaN(fatsTotal)) {
                  //   caloriesTotal = 0;
                  //  }
                  //  if (isNaN(carbsTotal)) {
                  //    caloriesTotal = 0;
                  //   }

                  Alert.alert(
                    'Your Totals for: ' + viewTodaysDate,
                    'Total Calories: ' +
                      caloriesTotal +
                      'g' +
                      ' Total Protein: ' +
                      proteinTotal +
                      'g' +
                      ' Total Fats: ' +
                      fatsTotal +
                      'g' +
                      ' Total Carbs: ' +
                      carbsTotal +
                      'g',
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          searchTableForDate(
                            String(caloriesTotal),
                            String(proteinTotal),
                            String(fatsTotal),
                            String(carbsTotal),
                            tableNameDate,
                          );

                          //InsertTotalsData(tableNameDate, String(caloriesTotal), String(proteinTotal), String(fatsTotal), String(carbsTotal));
                        },
                      },
                    ],
                  );

                  // INSERT THE TOTALS INTO A NEW DATABASE TABLE HERE FUNCTION
                }}>
                <View
                  style={{
                    backgroundColor: '#301934',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 140,
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
                    Save Today's Intake
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{}}
                onPress={() => {
                  navigation.replace('Daily Intake Progress');
                }}>
                <View
                  style={{
                    backgroundColor: '#301934',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 140,
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
                    View Progress (Save First for Latest)
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/*
<Text>Total Calories Consumed: {formatColumnDataThenSum(calories)}</Text>
<Text>Total Carbs Consumed: {formatColumnDataThenSum(carbs)}</Text>
<Text>Total Protein Consumed: {formatColumnDataThenSum(protein)}</Text>
<Text>Total Fats Consumed: {formatColumnDataThenSum(fats)}</Text>
*/}
        </View>
      </ScrollView>
    </View>
  );
};

export default DietHomeScreen;

const styles = StyleSheet.create({
  calender: {
    //backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignItems: 'center',
    //padding: 20,
    marginBottom: 20,
  },
  button: {
    // backgroundColor: '#f9fafd',
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    //alignItems: 'center',
    //padding: 20,
    //marginBottom: 10,
  },

  calorieWheel: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
    marginTop: 30,
  },
  macrosWheels: {
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
