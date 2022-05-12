import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

// COMPONENT: SUBMIT LOGIN FORM BUTTON STYLE

const SubmitLogin = ({title, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={{fontSize: 18, color: 'white'}}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    backgroundColor: '#1B1212',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
});

export default SubmitLogin;
