import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GameGrid from '../components/GameGrid';

const rows = 8;
const cols = 8;
const { width } = Dimensions.get('window');
const padding = 20;
const squareSize = Math.floor((width - 2 * padding) / cols);

// WordsAPI settings
const apiHost = 'wordsapiv1.p.rapidapi.com';
const apiKey = '1b6b6bd3d5msh642b43e789dc8d6p1f843djsnc76a27bcad8f';  

const generateEmptyGrid = () => Array.from({ length: rows }, () => Array(cols).fill(''));

const getRandomLetter = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters[Math.floor(Math.random() * letters.length)];
};

// Scrabble-like scoring system for each letter
const letterPoints = {
  A: 1, E: 1, I: 1, O: 1, N: 1, R: 1, T: 1, L: 1, S: 1, U: 1,
  D: 2, G: 2,
  B: 3, C: 3, M: 3, P: 3,
  F: 4, H: 4, V: 4, W: 4, Y: 4,
  K: 5,
  J: 8, X: 8,
  Q: 10, Z: 10
};

const calculateWordScore = (word) => {
  return word.split('').reduce((total, letter) => {
    return total + (letterPoints[letter] || 0);
  }, 0);
};

// Function to check if a word is valid using the WordsAPI
const checkWordFromAPI = async (word) => {
  try {
    const response = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': apiHost,
        'x-rapidapi-key': apiKey,
      },
    });
    const data = await response.json();
    return data.success !== false;
  } catch (error) {
    console.error('Error checking word:', error);
    return false;  // Return false if there's an error
  }
};

const GameScreen = ({ navigation }) => {
  const [grid, setGrid] = useState(generateEmptyGrid());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);  // High score state
  const [position, setPosition] = useState({ row: 0, col: Math.floor(cols / 2) });
  const [falling, setFalling] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [foundWord, setFoundWord] = useState('');
  const [opacity] = useState(new Animated.Value(0));

  const [currentLetter, setCurrentLetter] = useState(getRandomLetter());
  const [nextLetter, setNextLetter] = useState(getRandomLetter());
  const letterLocked = useRef(false);
  const fallInterval = useRef(null);

  useEffect(() => {
    retrieveHighScore();
  }, []);

  const retrieveHighScore = async () => {
    try {
      const savedHighScore = await AsyncStorage.getItem('HIGH_SCORE');
      if (savedHighScore !== null) {
        setHighScore(parseInt(savedHighScore, 10));
      }
    } catch (error) {
      console.error('Failed to load high score:', error);
    }
  };

  const saveHighScore = async (newHighScore) => {
    try {
      await AsyncStorage.setItem('HIGH_SCORE', newHighScore.toString());
      setHighScore(newHighScore);
    } catch (error) {
      console.error('Failed to save high score:', error);
    }
  };

  const resetLetter = () => {
    letterLocked.current = false;
    setCurrentLetter(nextLetter);
    setNextLetter(getRandomLetter());
  };

  const checkForWords = async (newGrid) => {
    let wordsFound = [];
    let totalScore = 0;

    // Helper function to check words
    const addWordScore = async (word, startRow, startCol, direction) => {
      if (word.length > 1) {
        let isValid = true;

        // Check the word validity using WordsAPI
        if (word.length > 1) {
          isValid = await checkWordFromAPI(word);
        }

        if (isValid) {
          wordsFound.push(word);
          totalScore += calculateWordScore(word);
        }
      }
    };

    // Check for horizontal words
    for (let row = 0; row < rows; row++) {
      let word = '';
      let startCol = 0;
      for (let col = 0; col < cols; col++) {
        if (newGrid[row][col] !== '') {
          word += newGrid[row][col];
        } else {
          await addWordScore(word, row, startCol, 'horizontal');
          word = '';
          startCol = col + 1;
        }
      }
      await addWordScore(word, row, startCol, 'horizontal');
    }

    // Check for vertical words
    for (let col = 0; col < cols; col++) {
      let word = '';
      let startRow = 0;
      for (let row = 0; row < rows; row++) {
        if (newGrid[row][col] !== '') {
          word += newGrid[row][col];
        } else {
          await addWordScore(word, startRow, col, 'vertical');
          word = '';
          startRow = row + 1;
        }
      }
      await addWordScore(word, startRow, col, 'vertical');
    }

    return { wordsFound, totalScore };
  };

  const dropLetter = async () => {
    if (!letterLocked.current) {
      letterLocked.current = true;
    }

    if (position.row < rows - 1 && grid[position.row + 1][position.col] === '') {
      setPosition(prevPosition => ({ ...prevPosition, row: prevPosition.row + 1 }));
    } else {
      if (position.row === 0) {
        handleGameOver();
        return;
      }

      let newGrid = [...grid];
      newGrid[position.row][position.col] = currentLetter;

      const { wordsFound, totalScore } = await checkForWords(newGrid);
      if (wordsFound.length > 0) {
        setGrid(newGrid);
        setScore(score + totalScore);
        setFoundWord(wordsFound.join(', '));

        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(() => {
            Animated.timing(opacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }).start(() => setFoundWord(''));
          }, 3000);
        });
      } else {
        setGrid(newGrid);
      }

      resetLetter();
      setPosition({ row: 0, col: Math.floor(cols / 2) });
      setFalling(false);
    }
  };

  const handleGameOver = () => {
    setGameOver(true);
    if (score > highScore) {
      saveHighScore(score);
    }
    navigation.replace('GameOver', { score });
  };

  useEffect(() => {
    if (!gameOver) {
      if (fallInterval.current) {
        clearInterval(fallInterval.current);
      }

      fallInterval.current = setInterval(() => {
        if (falling) dropLetter();
        else setFalling(true);
      }, 500);

      return () => clearInterval(fallInterval.current);
    }
  }, [falling, position, gameOver]);

  const moveLeft = () => {
    if (!gameOver && position.col > 0) {
      setPosition({ ...position, col: position.col - 1 });
    }
  };

  const moveRight = () => {
    if (!gameOver && position.col < cols - 1) {
      setPosition({ ...position, col: position.col + 1 });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="Quit" onPress={() => navigation.navigate('MainMenu')} />
        <Text style={styles.score}>Score: {score || 0}</Text> 
        <Text style={styles.highScore}>High Score: {highScore || 0}</Text>
      </View>

      {foundWord ? (
        <Animated.View style={[styles.foundWordContainer, { opacity }]}>
          <Text style={styles.foundWord}>Word Found: {foundWord || ''}</Text>
        </Animated.View>
      ) : null}

      <View style={styles.nextBlock}>
        <Text style={styles.nextWordHeading}>Next Letter:</Text>
        <Text style={styles.nextWord}>{nextLetter || '?'}</Text> 
      </View>

      <View style={styles.gridContainer}>
        <GameGrid grid={grid} squareSize={squareSize} />
        {!gameOver && (
          <View
            style={[
              styles.fallingLetter,
              {
                top: position.row * squareSize,
                left: position.col * squareSize,
                width: squareSize,
                height: squareSize,
              },
            ]}
          >
            <Text style={[styles.letter, { fontSize: squareSize * 0.5 }]}>{currentLetter || '?'}</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Left" onPress={moveLeft} disabled={gameOver} />
        <Button title="Right" onPress={moveRight} disabled={gameOver} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: padding,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  highScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  foundWordContainer: {
    position: 'absolute',
    top: 60, 
    left: width / 2 - 150,
    width: 300,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  foundWord: {
    fontSize: 20,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  gridContainer: {
    position: 'relative',
    width: squareSize * cols,
    height: squareSize * rows,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  nextBlock: {
    alignItems: 'center',
    marginVertical: 10,
  },
  nextWordHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  nextWord: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  fallingLetter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'skyblue',
    zIndex: 1,
  },
  letter: {
    fontWeight: 'bold',
  },
});

export default GameScreen;
