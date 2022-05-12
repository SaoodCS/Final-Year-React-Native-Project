import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';

//COMPONENT FOR THE LOGIN AND REGISTRATION TOP TAB BUTTON STYLES

const LoginRegBtns = ({title, backgroundColor, onPress}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View style={[styles.container, {backgroundColor}]}>
        <Text style={styles.title}>{title}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 45,
    width: '50%',
    backgroundColor: '#B6B6B6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {color: 'white', fontSize: 16},
});

export default LoginRegBtns;
