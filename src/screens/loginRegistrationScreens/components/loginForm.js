import React, {useState, useContext, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import ContainerForLoginForm from './containerForLoginForm';
import LoginFormInput from './loginFormInput';
import SubmitLogin from './submitLogin';
import {AuthContext} from '../../../navigation/authProvider';

// COMPONENT: THE LOGIN FORM FOR THE USER TO LOGIN TO THE APPLCIATION

// FUNCTION FOR VALIDATING THE USER'S EMAIL INPUT
const validEmailCheck = value => {
  const checkEmail =
    /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; //regular expression for email validation
  return checkEmail.test(value);
};

//FUNCTION TAKES THE USERS INPUT OBJECT AND TRIMS EACH VALUE BEFORE IT WILL BE SUBMITTED (USED IN VALIDATION FUNC TO MAKE SURE THAT THE FIELDS ARENT EMPTY)
const validLoginObject = userInfoObj => {
  return Object.values(userInfoObj).every(value => value.trim());
};

// FUNCTION FOR DISPLAYING AN ERROR MESSAGE TO THE USER IF THE USERS FORM ISN'T VALIDATED
const outputError = (error, updateState) => {
  updateState(error);
  setTimeout(() => {
    updateState('');
  }, 2500);
};

const {width} = Dimensions.get('window');

const LoginForm = () => {
  // GETTING THE LOGIN AND FORGOT PASSWORD FUNCTIONS FROM THE AUTHCONTEXT PROVIDER IN ORDER TO LOGIN USING FIREBASE AUTHENTICATION OR RECEIVE AN EMAIL TO RESET IF PASSWORD IS FORGOTTEN
  const {login} = useContext(AuthContext);
  const {forgotPassword} = useContext(AuthContext);

  // USESTATE FOR THE USER INPUTS AND FOR THE ERROR MESSAGE
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });
  const {email, password} = userInfo;
  const [error, setError] = useState('');

  // FUNCTION HANDLES THE USER INPUTS AND ASSOCIATES THEM WITH THE VALUE OF THE RELATED VARIABLE
  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({...userInfo, [fieldName]: value});
  };

  // FUNCTION TO ENSURE THAT THE USER INPUTS A VALID EMAIL ADDRESS AND PASSWORD, OTHERWISE AN ERROR MESSAGE WILL BE SHOWN
  const validLoginForm = () => {
    if (!validLoginObject(userInfo))
      return outputError(
        'please insert your email address and password',
        setError,
      );

    if (!validEmailCheck(email))
      return outputError('Please insert a valid email address', setError);

    if (!password.trim || password.length < 8)
      return outputError('Please insert a valid password', setError);

    return true;
  };








  // (ERROR MSG DISPLAYED AT THE TOP OF THE FORM)
  return (
    <ContainerForLoginForm>
      {error ? (
        <Text style={{color: 'red', fontSize: 18, textAlign: 'center'}}>
          {error}
        </Text>
      ) : null}

      <LoginFormInput
        value={email}
        onChangeText={value => handleOnChangeText(value, 'email')}
        label="Email"
        placeholder="example@example.com"
        autoCapitalize="none"
        backgroundColor="#301934"
      />
      <LoginFormInput
        value={password}
        onChangeText={value => handleOnChangeText(value, 'password')}
        label="Password"
        placeholder="********"
        autoCapitalize="none"
        backgroundColor="#301934"
        secureTextEntry
      />
      <View
        style={{
          width: width,
          alignItems: 'center',
          alignSelf: 'center',
          height: 66,
        }}>
        <SubmitLogin
          //  onPress={() => login(userInfo.email, userInfo.password)}
          onPress={() => {
            if (validLoginForm()) {
              login(userInfo.email, userInfo.password);
            }
          }}
          title="Login"
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (!validEmailCheck(userInfo.email)) {
            return outputError('Please insert a valid email address', setError);
          } else {
            forgotPassword(userInfo.email);
          }
        }}>
        <Text style={styles.buttonText}>
          Forgot Your Password? Type your email in above and press here.
        </Text>
      </TouchableOpacity>
    </ContainerForLoginForm>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B1212',
    padding: 10,
  },
  buttonText: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontStyle: 'italic',
  },
});

export default LoginForm;
