import React, { Component } from "react";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Scrabble letter values for local preview
const LETTER_VALUES = {
  A: 1, E: 1, I: 1, O: 1, U: 1, L: 1, N: 1, R: 1, S: 1, T: 1,
  D: 2, G: 2,
  B: 3, C: 3, M: 3, P: 3,
  F: 4, H: 4, V: 4, W: 4, Y: 4,
  K: 5,
  J: 8, X: 8,
  Q: 10, Z: 10
};

class App extends Component {
  state = {
    currentWord: '',
    currentScore: 0,
    breakdown: [],
    history: [],
    error: null,
    isLoading: false
  };

  inputRef = React.createRef();

  calculateScoreLocally = (word) => {
    const cleanWord = word.toUpperCase();
    const breakdown = cleanWord.split('').map(letter => ({
      letter,
      value: LETTER_VALUES[letter] || 0
    }));
    
    const score = breakdown.reduce((sum, item) => sum + item.value, 0);
    
    return { score, breakdown };
  };

  validateWord = async (word) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
      );
      
      if (!response.ok) {
        return { isValid: false, definition: null };
      }
      
      const data = await response.json();
      
      if (data?.[0]?.meanings?.[0]) {
        const firstMeaning = data[0].meanings[0];
        const definition = firstMeaning.definitions?.[0]?.definition || null;
        const partOfSpeech = firstMeaning.partOfSpeech || '';
        
        return { isValid: true, definition, partOfSpeech };
      }
      
      return { isValid: false, definition: null };
    } catch (error) {
      return { isValid: false, definition: null };
    }
  };

  fetchScoreFromAPI = async (word) => {
    const response = await fetch(`${API_URL}/api/scrabble-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to calculate score');
    }
    
    return data;
  };

  addToHistory = (scoreData, validationResult) => {
    this.setState(prevState => ({
      history: [
        {
          word: scoreData.word,
          score: scoreData.score,
          timestamp: new Date().toLocaleTimeString(),
          id: Date.now(),
          isValid: validationResult.isValid,
          definition: validationResult.definition,
          partOfSpeech: validationResult.partOfSpeech
        },
        ...prevState.history
      ]
    }));
  };

  clearInput = () => {
    this.setState({
      currentWord: '',
      currentScore: 0,
      breakdown: []
    });
  };

  handleInputChange = (e) => {
    const word = e.target.value.toUpperCase();
    
    if (word && !/^[A-Z]*$/.test(word)) {
      return;
    }
    
    const { score, breakdown } = this.calculateScoreLocally(word);
    
    this.setState({
      currentWord: word,
      currentScore: score,
      breakdown,
      error: null
    });
  };

  handleSubmit = async () => {
    const { currentWord, isLoading } = this.state;
    
    if (!currentWord.trim()) {
      this.setState({ error: 'Please enter a word' });
      return;
    }
    
    // Prevent multiple simultaneous submissions
    if (isLoading) {
      return;
    }
    
    this.setState({ isLoading: true, error: null });
    
    try {
      const [scoreData, validationResult] = await Promise.all([
        this.fetchScoreFromAPI(currentWord),
        this.validateWord(currentWord)
      ]);
      
      this.addToHistory(scoreData, validationResult);
      this.clearInput();
      
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({
        error: error.message,
        isLoading: false
      });
    }
  };

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSubmit();
    } else if (e.key === 'Escape') {
      this.clearInput();
      this.setState({ error: null });
    }
  };

  handleExampleClick = (word) => {
    const { score, breakdown } = this.calculateScoreLocally(word);
    this.setState({
      currentWord: word,
      currentScore: score,
      breakdown,
      error: null
    });
  };


  getTotalScore = () => {
    return this.state.history.reduce((total, item) => {
      return item.isValid === true ? total + item.score : total;
    }, 0);
  };

  render() {
    const { currentWord, currentScore, breakdown, history, error, isLoading } = this.state;
    const totalScore = this.getTotalScore();
    
    return (
      <div className="app">
        <header className="app-header">
          <h1>Scrabble Score Calculator</h1>
        </header>
        
        <main className="app-main">
          <section className="input-section">
            <div className="tile-rack">
              {currentWord.split('').map((letter, index) => (
                <div key={index} className="tile">
                  <span className="letter">{letter}</span>
                  <span className="points">
                    {breakdown[index]?.value || 0}
                  </span>
                </div>
              ))}
              {currentWord.length === 0 && (
                <span className="placeholder-text">Type a word below...</span>
              )}
            </div>
            
            <input
              ref={this.inputRef}
              type="text"
              value={currentWord}
              onChange={this.handleInputChange}
              onKeyDown={this.handleKeyPress}
              placeholder="Type a word..."
              className="text-input"
              maxLength={15}
            />
            
            <div className="score-display">
              <span className="score-label">Score</span>
              <span className="score-value">{currentScore} pts</span>
            </div>
            
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠</span>
                <div className="error-content">
                  <div className="error-text">{error}</div>
                  <button 
                    className="error-retry" 
                    onClick={() => this.setState({ error: null })}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
            
            <button
              className="submit-button"
              onClick={this.handleSubmit}
              disabled={isLoading || !currentWord}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Validating...</span>
                </>
              ) : (
                <>
                  <span className="icon">✓</span>
                  <span>Submit Word</span>
                </>
              )}
            </button>
          </section>
          
          {history.length === 0 && !isLoading && (
            <section className="empty-state">
              <div className="empty-state-icon">
                <span role="img" aria-label="dice">🎲</span>
              </div>
              <h3 className="empty-state-title">No words scored yet</h3>
              <p className="empty-state-description">
                Start by typing a word above to see its Scrabble score!
              </p>
              <div className="example-words">
                <p className="example-label">Try these high-scoring words:</p>
                <div className="example-chips">
                  <button className="example-chip" onClick={() => this.handleExampleClick('QUARTZ')}>
                    QUARTZ <span className="example-score">24 pts</span>
                  </button>
                  <button className="example-chip" onClick={() => this.handleExampleClick('JAZZ')}>
                    JAZZ <span className="example-score">29 pts</span>
                  </button>
                  <button className="example-chip" onClick={() => this.handleExampleClick('FIZZY')}>
                    FIZZY <span className="example-score">29 pts</span>
                  </button>
                </div>
              </div>
            </section>
          )}
          
          {history.length > 0 && (
            <section className="history-section">
              <div className="history-header">
                <div className="history-header-left">
                  <h3>History</h3>
                  <span className="count">{history.length} {history.length === 1 ? 'word' : 'words'}</span>
                </div>
                <div className="total-score">
                  <span className="total-label">Total</span>
                  <span className="total-value">{totalScore} pts</span>
                </div>
              </div>
              
              <div className="history-list">
                {history.map(item => (
                  <div key={item.id} className={`history-item ${item.isValid ? 'valid-word' : 'invalid-word'}`}>
                    <div className="history-content">
                      <div className="history-row">
                        <div className="word-with-status">
                          <span className="word">{item.word}</span>
                          {item.isValid !== undefined && (
                            <span className={`validation-icon ${item.isValid ? 'valid' : 'invalid'}`}>
                              {item.isValid ? '✓' : '✗'}
                            </span>
                          )}
                        </div>
                        <span className="score">{item.score} pts</span>
                      </div>
                      {item.definition && (
                        <div className="definition">
                          <span className="part-of-speech">{item.partOfSpeech}</span>
                          <span className="definition-text">{item.definition}</span>
                        </div>
                      )}
                      {!item.isValid && item.isValid !== undefined && (
                        <div className="invalid-message">Not a valid dictionary word</div>
                      )}
                      <span className="timestamp">{item.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    );
  }
}

export default App;
