import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainMenuScreen from './screens/MainMenuScreen';
import GameScreen from './screens/GameScreen';
import GameOverScreen from './screens/GameOverScreen'; // Import the GameOverScreen
import HighScoreScreen from './screens/HighScoreScreen'; // Import the HighScoreScreen
import HelpScreen from './screens/HelpScreen'; // Import the HelpScreen

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainMenu">
        <Stack.Screen 
          name="MainMenu" 
          component={MainMenuScreen} 
          options={{ title: 'Main Menu' }} 
        />
        <Stack.Screen 
          name="Game" 
          component={GameScreen} 
          options={{ title: 'Game' }} 
        />
        <Stack.Screen 
          name="GameOver" 
          component={GameOverScreen} 
          options={{ title: 'Game Over' }} 
        />
        <Stack.Screen 
          name="HighScore" 
          component={HighScoreScreen} 
          options={{ title: 'High Scores' }} 
        />
        <Stack.Screen 
          name="Help" 
          component={HelpScreen} 
          options={{ title: 'Help' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
