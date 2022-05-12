import React, {useContext, useEffect} from 'react';
import {View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

// COMPONENT: HEADER FOR SCREENS THAT REQUIRE A BACK ARROW TO NAVIGATE TO A PREVIOUS SCREEN

const CustomHeaderWithBack = props => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        backgroundColor: '#CBC3E3',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          padding: 5,
        }}>
        <TouchableOpacity
          onPress={() => navigation.replace(props.backNavScreen)}>
          <MaterialCommunityIcons
            name="arrow-left"
            color="black"
            size={30}></MaterialCommunityIcons>
        </TouchableOpacity>
      </View>

      <View
        style={{flexDirection: 'row', justifyContent: 'center', padding: 5}}>
        <Text style={{fontSize: 20, color: 'black'}}>{props.pageName}</Text>
      </View>
    </View>
  );
};

export default CustomHeaderWithBack;
