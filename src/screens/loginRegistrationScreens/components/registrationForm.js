import ContainerForLoginForm from './containerForLoginForm';
import LoginFormInput from './loginFormInput';
import SubmitLogin from './submitLogin';
import React, {useState, useContext} from 'react';
import {View, Text, Dimensions} from 'react-native';
import {AuthContext} from '../../../navigation/authProvider';


// COMPONENT: THE REGISTRATION FORM FOR THE USER TO REGISTER TO USE THE APPLICATION

//FUNCTION TAKES THE USERS INPUT OBJECT AND TRIMS EACH VALUE BEFORE IT WILL BE SUBMITTED (USED IN VALIDATION FUNC TO MAKE SURE THAT THE FIELDS ARENT EMPTY)
const validRegObject = userInfoObj => {
  return Object.values(userInfoObj).every(value => value.trim());
};

// FUNCTION FOR DISPLAYING AN ERROR MESSAGE TO THE USER IF THE USERS FORM ISN'T VALIDATED
const outputError = (error, updateState) => {
  updateState(error);
  setTimeout(() => {
    updateState('');
  }, 2500);
};

// FUNCTION FOR VALIDATING THE USER'S EMAIL INPUT
const validEmailCheck = value => {
  const checkEmail =
    /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; //regular expression for email validation
  return checkEmail.test(value);
};

const {width} = Dimensions.get('window');

const RegistrationForm = () => {
  // USESTATE FOR THE USER INPUTS AND FOR THE ERROR MESSAGE
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const {fullName, email, password, confirmPassword} = userInfo;
  // FUNCTION HANDLES THE USER INPUTS AND ASSOCIATES THEM WITH THE VALUE OF THE RELATED VARIABLE
  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({...userInfo, [fieldName]: value});
  };
  // FUNCTION TO ENSURE THAT THE USER INPUTS A VALID EMAIL ADDRESS AND PASSWORD, OTHERWISE AN ERROR MESSAGE WILL BE SHOWN
  const validRegForm = () => {
    if (!validRegObject(userInfo))
      return outputError('You must enter your details in all fields', setError);

    if (!fullName.trim())
      return outputError('Please insert a valid name', setError);

    if (!validEmailCheck(email))
      return outputError('Please insert a valid email address', setError);

    if (!password.trim || password.length < 8)
      return outputError(
        'Please insert a valid password (of 8 characters at least)',
        setError,
      );

    if (password != confirmPassword)
      return outputError('Passwords do not match. Please try again.', setError);
    return true;
  };

  // GETTING THE REGISTER FUNCTION FROM THE AUTHCONTEXT PROVIDER IN ORDER TO REGISTER USING FIREBASE AUTHENTICATION
  const {register} = useContext(AuthContext);
  // (ERROR MSG DISPLAYED AT THE TOP OF THE FORM)
  return (
    <ContainerForLoginForm>
      {error ? (
        <Text style={{color: 'red', fontSize: 18, textAlign: 'center'}}>
          {error}
        </Text>
      ) : null}
      <LoginFormInput
        value={fullName}
        onChangeText={value => handleOnChangeText(value, 'fullName')}
        label="Full Name"
        placeholder="John Smith"
        backgroundColor="#301934"
      />
      <LoginFormInput
        value={email}
        onChangeText={value => handleOnChangeText(value, 'email')}
        autoCapitalize="none"
        label="Email"
        placeholder="example@example.com"
        backgroundColor="#301934"
      />
      <LoginFormInput
        value={password}
        onChangeText={value => handleOnChangeText(value, 'password')}
        autoCapitalize="none"
        secureTextEntry
        label="Password"
        placeholder="********"
        backgroundColor="#301934"
      />
      <LoginFormInput
        value={confirmPassword}
        onChangeText={value => handleOnChangeText(value, 'confirmPassword')}
        autoCapitalize="none"
        secureTextEntry
        label="Confirm Password"
        placeholder="********"
        backgroundColor="#301934"
      />

      <View
        style={{
          width: width,
          alignItems: 'center',
          alignSelf: 'center',
          height: 66,
        }}>
        <SubmitLogin
          //onPress={() => register(userInfo.email, userInfo.password)}
          onPress={() => {
            if (validRegForm()) {
              register(userInfo.fullName, userInfo.email, userInfo.password);
            }
          }}
          title="Sign Up"
        />
      </View>
    </ContainerForLoginForm>
  );
};

export default RegistrationForm;
