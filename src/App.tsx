import { useState, useRef, useEffect } from 'react'
import './App.css'
import UploadText from './components/UploadText';
function App() {
  const defaultText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  const [focused, setFocused] = useState<boolean>(false);
  const [text, setText] = useState<string>(defaultText);
  const [WPM, setWPM] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [userInput, setUserInput] = useState('');
  const [timeInput, setTimeInput] = useState<number>(5);
  const [timer, setTimer] = useState<number>(5);
  const [isRunning, setRunning] = useState<boolean>(false);
  const [maxTime, setMaxTime] = useState<number>(5);
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isRunning) {
      if (timer > 0) {
        intervalRef.current = setInterval(() => {
          setTimer(prevTimer => prevTimer - 1);
        }, 1000);
        updateStats();
      } else {
        //do a final calculation on WPM and Accuracy, display these stats at bottom of screen
        calculateWPM();
        calculateAccuracy();
        
        clearInterval(intervalRef.current!);
        setRunning(false);
        setTimer(maxTime);
        setUserInput('');
        setAccuracy(0);
        setWPM(0);
      }
    }
    return () => clearInterval(intervalRef.current!);
  }, [isRunning, timer]);
  

  const calculateAccuracy = () => {
    //measure accuracy as the number of correct words divided by the total number
    //of words that have been passed so far
    const enteredWords = userInput.split(' ').filter((word) => word != ''); // split on spaces to find out how many words they've entered
    const correctWords = enteredWords.filter((word, index) => {
      return word === text.split(' ')[index];
    })
    const accuracy = (correctWords.length / enteredWords.length) * 100;
    //round accuracy to 2dp
    const rounded = accuracy.toFixed(2);
    setAccuracy(Number(rounded));
    
  }

  const calculateWPM = () => { 
    //define WPM as the amount of correct words entered multiplied by (60 / elapsed interval);
    //first find amount of correct words
    const enteredWords = userInput.split(' ').filter((word) => word != '');
    const correctWords = enteredWords.filter((word, index) => {
      return word === text.split(' ')[index];
    });
    //calculate elapsed time as the total time - the time remaining
    const elapsedTime = maxTime - timer;
    if (elapsedTime === 0) return;
    const wordsPerMinute = correctWords.length * (60 / elapsedTime);
    const rounded = wordsPerMinute.toFixed(2);
    console.log(rounded);
    setWPM(Number(rounded));  

  }

  const updateStats = () => {
    //calculate the number of words that are correct
    calculateWPM();
    calculateAccuracy();
  }


  const getHighlightedText = () => {
    return text.split('').map((char, index) => {
      let color;
      if (index < userInput.length){
        color = char === userInput[index] ? 'green' : 'red';
      }else{
        color = 'black';
      }
      return <span key={index} style={{color}}>{char}</span>
    })
  }
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!isRunning){
      setRunning(true);
    }
    //check to see if the previous value is a space and current value is also space
    //if so, ignore the space
    if (e.target.value[e.target.value.length - 1] === ' ' && e.target.value[e.target.value.length - 2] === ' '){
      return;
    }
    setUserInput(e.target.value);
  }
 
  
  const handleMaxTimeChange = () => {
    //if user changes the maximum time, force a reset of the current run
    setMaxTime(Number(timeInput));
    setRunning(false);
    setTimer(Number(timeInput));
    setUserInput('');
    setWPM(0);
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter'){
      handleMaxTimeChange();
    }
  }

  const focusInput = () => {
    if (inputRef.current){
      inputRef.current.focus();
    }
  }

  return (
    <>
      <div className = "title-section">
        <h1>Typing Speed Test</h1>
      </div>
      <div className = "timer">
        <h2>Time remaining: {timer} seconds</h2>
      </div>
      <div className="timer-input-container">
          <h3 className="timer-input">Change duration: </h3>
          <input 
            type="number"
            placeholder = {maxTime.toString()}
            value={timeInput}
            onKeyDown = {e => handleKeyPress(e)}
            onChange={(e) => setTimeInput(Number(e.target.value))}
            className="timer-input timer-change-input"
          />
        </div>
      <div className = 'upload-text-container'>
        <UploadText setText = {setText}/>
      </div>  
      <div className = "container" onClick = {focusInput}>
        <div className = "info-container">
          <div className = 'wpm'>Current WPM: {WPM}</div>
          <div className = 'accuracy'>Accuracy: {accuracy}%</div>
        </div>
        <div className = {`base-text ${focused? 'focused': 'unfocused'}`}>
          {getHighlightedText()}
        </div>
        <input 
          ref = {inputRef}
          type = "text"
          value = {userInput}
          onChange = {handleTextChange}
          onFocus = {() => setFocused(true)}
          onBlur = {() => setFocused(false)}
          className = "user-input"></input>
      </div>
    </>
  )
}

export default App
