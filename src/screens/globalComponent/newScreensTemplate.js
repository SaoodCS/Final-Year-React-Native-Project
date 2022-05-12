// 1. COPY AND PASTE THE FOLLOWING INTO EACH NEW SCREEN:
import React, {useContext, useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {AuthContext} from '../../navigation/authProvider';
import CustomHeaderComponent from '../globalComponent/customHeaderComponent'; //1.5 import these correctly - test it
import CustomHeaderWithBack from '../globalComponent/customerHeaderWithBack'; // 1.5 import this correctly - test it
import auth, {firebase} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import {FlatList} from 'react-native-gesture-handler';
import {Alert} from 'react-native';
import {TextInput} from 'react-native-paper';
import {Button, Searchbar} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';
import {showMessage, hideMessage} from 'react-native-flash-message';
import FlashMessage from 'react-native-flash-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const {width} = Dimensions.get('window');

const NewScreenTemplate = ({route}, props) => {
  ///2. REPLACE NewScreenTemplate with the screen's name.
  const navigation = useNavigation();

  return (
    <View>
      {/*
            <CustomHeaderWithBack pageName = "The Name of This Screen"
            backNavScreen = 'The Name of The Screen To Navigate Back To'/>
    */}
      {/*
            <CustomHeaderComponent pageName = "The Name of This Screen"/>
    */}
    </View>
  );
};
export default NewScreenTemplate; // 3. REPLACE NewScreenTemplate with the screen's name

// NEW SCREEN SETUP AFTER CREATING THIS FILE FOR THE NEW SCREEN:
// 4. OPEN THE APPSTACK FILE --> ADD THIS FILE AS AN IMPORT --> ADD THIS SCREEN AS ANOTHER <STACKSCREEN> COMPONENT
// 5. OPEN THE FILE OF THE SCREEN THAT NAVIGATES TO THIS ONE --> ADD THE OnPress function as navigate.replace.
// 6. TEST THE ON PRESS FUNCTION TO MAKE SURE IT WORKS
// 7. Uncomment Either the CustomeHeaderComponentWithBack OR the CustomerHeaderComponent
// 8. SET THE PAGE NAME AND (IF APPLICABLE) THE BackNavScreen PROP FOR THE UNCOMMENTED HEADER COMPONENT.
