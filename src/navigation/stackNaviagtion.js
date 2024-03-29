import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/login.screen';
import RegisterScreen from '../screens/register.screen';
import TodoScreen from '../screens/todo.screen';

const Stack = createStackNavigator();

function StackNavigation() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Todos" component={TodoScreen} />
    </Stack.Navigator>
  );
}

export default StackNavigation;
