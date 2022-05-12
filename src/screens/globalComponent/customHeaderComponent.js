import React, {useContext, useEffect} from 'react';
import {View, Text} from 'react-native';

// COMPONENT: HEADER FOR PARENT SCREENS THAT ARE USUALLY AT THE TOP OF THE NAVIGATION STACKS

const CustomHeaderComponent = props => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        backgroundColor: '#CBC3E3',
      }}>
      <View>
        <Text style={{fontSize: 20, color: 'black'}}>{props.pageName}</Text>
      </View>
    </View>
  );
};

export default CustomHeaderComponent;
