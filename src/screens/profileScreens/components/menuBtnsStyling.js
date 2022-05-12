import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

// STYLING FOR THE TOP HEADER (STATISTICS AND MENU) OF THE PROFILE HOME SCREEN

const MenuBtnsStyling = ({title, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={{fontSize: 18, color: 'white'}}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 45,
    backgroundColor: '#181818',

    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0.4,
  },
});

export default MenuBtnsStyling;
