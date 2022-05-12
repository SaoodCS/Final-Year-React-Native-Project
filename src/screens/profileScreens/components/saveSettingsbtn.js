import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

// COMPONENT (NOT IN USE)

const SaveSettingsbtn = ({title, onPress}) => {
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
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
});

export default SaveSettingsbtn;
