import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CheckInScreen from './CheckInScreen';


export default function App (props){
  //const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();



  const AppNavigator = ({navigation}) => (
    <Stack.Navigator>
      <Stack.Screen name="Dimension 1"
      component={CheckInScreen} 
      initialParams={
        {
          dimensionName: 'flexibility'
        }
      
      }/>
      
    </Stack.Navigator>
  );
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );

} 



  
  


