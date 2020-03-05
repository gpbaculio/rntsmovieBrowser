import React from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {Movie, Home} from './screens';

export type AppStackParamListType = {
  Home: undefined;
  Movie: {id: string; title: string};
};

const AppStack = createStackNavigator<AppStackParamListType>();

const App = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        initialRouteName="Home"
        headerMode="screen"
        screenOptions={{
          headerStyle: {backgroundColor: 'tomato'},
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
            alignSelf: 'center',
            flex: 1,
          },
        }}>
        <AppStack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'Home',
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
          }}
        />
        <AppStack.Screen
          name="Movie"
          component={Movie}
          options={({route}) => ({
            title: route.params.title,
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerRight: () => <View />,
          })}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
