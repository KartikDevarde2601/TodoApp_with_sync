import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {TextInput} from 'react-native-gesture-handler';
import database from '../DB/db';
import {Q} from '@nozbe/watermelondb';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('please enter email'),
  password: Yup.string()
    .min(2, 'password must contain 2 characters')
    .max(50, 'password is too long')
    .required('please enter password'),
});

const handleLogin = async ({navigation, values}) => {
  const {email, password} = values;
  const users = await database.collections
    .get('users')
    .query(Q.where('email', email))
    .fetch();

  if (users.length > 0) {
    const user = users[0];
    const userObj = user._raw;
    if (userObj.password === password) {
      navigation.navigate('Todos', {userId: userObj.id});
    } else {
      alert('password is incorrect');
    }
  } else {
    alert('No user found with this email');
  }
};

const LoginScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={LoginSchema}
        onSubmit={values => handleLogin({navigation, values})}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                autoCapitalize="none"
              />
              <View style={styles.errorContainer}>
                {errors.email && touched.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password:</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry
              />
              <View style={styles.errorContainer}>
                {errors.password && touched.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
              </View>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
      <TouchableOpacity
        style={styles.Register}
        onPress={() => navigation.navigate('Register')}>
        <Text>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  loginButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  Register: {
    marginTop: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '80%',
  },
  errorText: {
    color: 'red',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'flex-start',
  },
});

export default LoginScreen;
