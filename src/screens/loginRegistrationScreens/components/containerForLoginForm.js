import React from 'react';
import {StyleSheet, Dimensions, KeyboardAvoidingView} from 'react-native';

// COMPONENT: IMPORTED AND WRAPPED AROUND FORMS TO HIDE KEYBOARD

const ContainerForLoginForm = ({children}) => {
  return (
    <KeyboardAvoidingView style={styles.container}>
      {children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    paddingHorizontal: 20,
  },
});

export default ContainerForLoginForm;
