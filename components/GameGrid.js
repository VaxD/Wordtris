import React from 'react';
import { View, StyleSheet } from 'react-native';
import LetterBlock from './LetterBlock';

const GameGrid = ({ grid, squareSize }) => {
  return (
    <View style={[styles.grid, { width: squareSize * grid[0].length, height: squareSize * grid.length }]}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((letter, colIndex) => (
            <LetterBlock key={colIndex} letter={letter} squareSize={squareSize} />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'column',
    backgroundColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
  },
});

export default GameGrid;
