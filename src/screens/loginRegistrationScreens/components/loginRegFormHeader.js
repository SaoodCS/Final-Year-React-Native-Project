import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

// COMPONENT FOR THE LOGIN/REGISTRATION SCREEN HEADER, INCLUDES THE STRATEGYM APPLICATION LOGO

const LoginRegFormHeader = ({leftHeading, rightHeading, subHeading}) => {
  return (
    <>
      <View style={styles.container}>
        <Image
          style={{
            height: 175,
            width: 199,
          }}
          source={require('../../../assets/logoImages/LogoBlack.png')}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {fontSize: 30, fontWeight: 'bold', color: 'white'},
  subheading: {fontSize: 20, color: 'white', textAlign: 'center'},
});

export default LoginRegFormHeader;
