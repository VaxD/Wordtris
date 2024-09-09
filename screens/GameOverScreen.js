import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const GameOverScreen = ({ route, navigation }) => {
  const { score } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over</Text>
      <Text style={styles.score}>Your Score: {score}</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="Retry" onPress={() => navigation.replace('Game')} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Main Menu" onPress={() => navigation.navigate('MainMenu')} />
      </View>
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
  title: {
    fontSize: 32,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 24,
    marginBottom: 40,
  },
  buttonContainer: {
    marginVertical: 10, 
    width: 200,         
  },
});

export default GameOverScreen;
