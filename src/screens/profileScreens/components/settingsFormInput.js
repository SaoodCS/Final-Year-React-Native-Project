import React from 'react';
import {Text, StyleSheet, TextInput} from 'react-native';

// COMPONENT: STYLING FOR THE PROFILE SETTINGS TEXT INPUTS

const SettingsFormInput = props => {
  const {placeholder, label} = props;
  return (
    <>
      <Text style={{color: 'black', fontWeight: 'bold'}}>{label}</Text>
      <TextInput
        {...props}
        placeholder={placeholder}
        placeholderTextColor="black"
        style={styles.input}
      />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#4C4C4C',
    height: 40,
    borderRadius: 4,
    fontSize: 16,
    paddingLeft: 10,
    marginBottom: 20,
  },
});

export default SettingsFormInput;
