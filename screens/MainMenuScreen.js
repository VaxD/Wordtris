import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const MainMenuScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wordtris</Text>

      <View style={styles.buttonContainer}>
        <Button title="Play" onPress={() => navigation.navigate('Game')} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="High Score" onPress={() => navigation.navigate('HighScore')} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Help" onPress={() => navigation.navigate('Help')} />
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
  buttonContainer: {
    marginVertical: 10,
    width: 200,
  },
});

export default MainMenuScreen;
