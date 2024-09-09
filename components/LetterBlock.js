import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LetterBlock = ({ letter, squareSize }) => {
  return (
    <View style={[styles.block, { width: squareSize, height: squareSize }]}>
      <Text style={[styles.letter, { fontSize: squareSize * 0.5 }]}>{letter}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    // margin: 2, // Remove or reduce the margin to avoid affecting the grid size
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  letter: {
    fontWeight: 'bold',
  },
});

export default LetterBlock;
