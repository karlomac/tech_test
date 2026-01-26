const LETTER_VALUES = {
  A: 1, E: 1, I: 1, O: 1, U: 1, L: 1, N: 1, R: 1, S: 1, T: 1,
  D: 2, G: 2,
  B: 3, C: 3, M: 3, P: 3,
  F: 4, H: 4, V: 4, W: 4, Y: 4,
  K: 5,
  J: 8, X: 8,
  Q: 10, Z: 10
};

function calculateScore(word) {
  if (!word || typeof word !== 'string') {
    throw new Error('Invalid input: word must be a string');
  }
  
  const cleanWord = word.trim().toUpperCase();
  
  if (cleanWord.length === 0) {
    throw new Error('Invalid input: word cannot be empty');
  }
  
  if (!/^[A-Z]+$/.test(cleanWord)) {
    throw new Error('Invalid input: word must contain only letters');
  }
  
  const breakdown = cleanWord.split('').map(letter => ({
    letter,
    value: LETTER_VALUES[letter] || 0
  }));
  
  const score = breakdown.reduce((sum, item) => sum + item.value, 0);
  
  return { word: cleanWord, score, breakdown };
}

module.exports = { calculateScore };
