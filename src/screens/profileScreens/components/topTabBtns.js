import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';

// STYLING FOR THE TOP HEADER (STATISTICS AND MENU) OF THE PROFILE HOME SCREEN

const TopTabBtns = ({title, backgroundColor, onPress}) => {
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
    backgroundColor: '#301934',
    height: 45,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'black,',
  },
  title: {color: 'white', fontSize: 20},
});

export default TopTabBtns;
