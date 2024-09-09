import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';

const HelpScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>How to Play</Text>
        <Text style={styles.sectionTitle}>Game Overview:</Text>
        <Text style={styles.paragraph}>
          Wordtris is a game where letters fall from the top of the screen, and your goal is to create valid words by arranging the letters horizontally or vertically. The game ends when the grid is full or no more moves can be made.
        </Text>

        <Text style={styles.sectionTitle}>Scoring Mechanics:</Text>
        <Text style={styles.paragraph}>
          Each valid word you create will give you points based on the length of the word and the value of each letter, similar to Scrabble.
        </Text>

        <Text style={styles.paragraph}>
          Letters have different point values, as follows:
        </Text>

        <Text style={styles.paragraph}>
          • 1 point: A, E, I, O, N, R, T, L, S, U{'\n'}
          • 2 points: D, G{'\n'}
          • 3 points: B, C, M, P{'\n'}
          • 4 points: F, H, V, W, Y{'\n'}
          • 5 points: K{'\n'}
          • 8 points: J, X{'\n'}
          • 10 points: Q, Z
        </Text>

        <Text style={styles.paragraph}>
          The total score for a word is the sum of the points for each letter in the word. You also earn bonus points for longer words:
        </Text>
        <Text style={styles.paragraph}>
          • 5 bonus points for words longer than 3 letters.
        </Text>

        <Text style={styles.sectionTitle}>Game Controls:</Text>
        <Text style={styles.paragraph}>
          • Move the falling letter left or right using the buttons below the grid.{'\n'}
          • Position the falling letter to form words by aligning them horizontally or vertically with other letters.{'\n'}
          • Your score will update automatically each time a valid word is formed.
        </Text>

        <View style={styles.buttonContainer}>
          <Button title="Back to Menu" onPress={() => navigation.navigate('MainMenu')} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 18,
    marginVertical: 5,
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
});

export default HelpScreen;
