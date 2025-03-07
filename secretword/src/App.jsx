// CSS
import './App.css'

// React
import { useCallback, useEffect, useState } from 'react'

// Data
import{wordsList} from "./data/words"

// Components
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOver from './components/GameOver'

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
]

const guessesQty = 3

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState ("")
  const [pickedCategory, setPickedCategory] = useState ("")
  const [letters, setLetters] = useState ([])

  const [guessedLetters, setGuessedLetters] = useState ([])
  const [wrongLetters, setWrongLetters] = useState ([])
  const [guesses, setGuesses] = useState (guessesQty)
  const [score, setScore] = useState(0)  

const pickedWordAndCategory = useCallback(() => {
  // Pick a random category
  const categories = Object.keys(words) 
  const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

  

  // Pick a random word
  const word = words[category][Math.floor(Math.random() * words[category].length)]

 
  
  return {word, category}
}, [words])

// Starts the Secret Word game
  const startGame = useCallback(() => {
    // Clear all letters
    clearLetterStates()


    // Pick word and pick category
    const {word, category} = pickedWordAndCategory()

    // Create an array of letters
    let wordLetters = word.split("")

    wordLetters = wordLetters.map((l) => l.toLowerCase())

    
    // Fill states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)


    setGameStage(stages[1].name)
  }, [pickedWordAndCategory])

// Process the letter input
  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase()

    // Check if letter has already been utilized
    if(
      guessedLetters.includes(normalizedLetter) || 
      wrongLetters.includes(normalizedLetter)
    ) {
      return
    }

    // Push guessed letter or remove a guess
    if(
      letters.includes(normalizedLetter)){
        setGuessedLetters((actualGuessedLetters) =>[
          ...actualGuessedLetters,
          normalizedLetter
        ])
      } else {
          setWrongLetters((actualWrongLetters) =>[
          ...actualWrongLetters,
          normalizedLetter
        ])

        setGuesses((actualGuesses) => actualGuesses - 1)
      }
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }
  
  // Check if guesses ended
  useEffect(() => {
    if(guesses <= 0){
      // Reset all states
      clearLetterStates()

      setGameStage(stages[2].name)
    }
  }, [guesses])

  // Check  win condition
  useEffect(() => {

    const uniqueLetters = [...new Set(letters)]

    // Win condition
    if(guessedLetters.length === uniqueLetters.length && gameStage === "game") {
      // Add score
      setScore((actualScore) => actualScore += 100 )

      // Restart game with new word
      startGame()
    }
  }, [guessedLetters, letters, startGame, gameStage])

// Restarts the game
  const retryGame = () => {
    setScore(0)
    setGuesses(guessesQty)


    setGameStage(stages[0].name)
  }  

  return (
    <>
      <div className="App">   
        {gameStage === 'start' && <StartScreen startGame={startGame}/>}
        {gameStage === 'game' && 
        <Game 
          verifyLetter={verifyLetter} 
          pickedWord={pickedWord} 
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
         />
        }

        {gameStage === 'end' && <GameOver retryGame={retryGame} score={score}/>}
            
      </div>
    </>
  )
}

export default App
