import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const HighScoreScreen = ({ navigation }) => {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const loadHighScore = async () => {
      try {
        const savedHighScore = await AsyncStorage.getItem('HIGH_SCORE'); // Use the same key as in GameScreen.js
        if (savedHighScore !== null) {
          setHighScore(parseInt(savedHighScore, 10));
        }
      } catch (error) {
        console.error('Error loading high score:', error);
      }
    };
    loadHighScore();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>High Score</Text>

      <Text style={styles.scoreText}>{highScore}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Back to Menu" onPress={() => navigation.navigate('MainMenu')} />
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
  scoreText: {
    fontSize: 24,
    marginVertical: 5,
  },
  buttonContainer: {
    marginTop: 20,
    width: 200,
  },
});

export default HighScoreScreen;
