import React from 'react';
import {StyleSheet, Dimensions, KeyboardAvoidingView} from 'react-native';

// COMPONENT: WRAPPED AROUND FORMS ON OTHER SCREENS TO AVOID THE KEYBOARD GETTING IN THE WAY OF THE TEXTINPUT

const ContainerForProfileTabs = ({children}) => {
  return (
    <KeyboardAvoidingView style={styles.container}>
      {children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    //paddingHorizontal: 10,
  },
});

export default ContainerForProfileTabs;
