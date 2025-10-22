// DOM Element Selection
const guessInput = document.getElementById('guess');
const submitButton = document.getElementById('submit');
const resetButton = document.getElementById('reset');
const messages = document.getElementsByClassName('message'); // All messages are in this collection
const tooHighMessage = document.getElementById('too-high');
const tooLowMessage = document.getElementById('too-low');
const maxGuessesMessage = document.getElementById('max-guesses');
const numberOfGuessesMessage = document.getElementById('number-of-guesses');
const correctMessage = document.getElementById('correct');

// State Variables
let targetNumber;
let attempts = 0; // B7 FIX: This counter is reset in setup()
const maxNumberOfAttempts = 5;

// Returns a random number from min (inclusive) to max (exclusive)
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Function executed when the user clicks 'Submit Guess'
function checkGuess() {
  // Get and convert input value to an integer
  const guess = parseInt(guessInput.value, 10);
  attempts = attempts + 1;

  hideAllMessages(); // Clear old messages

  // --- WIN CONDITION ---
  if (guess === targetNumber) {
    numberOfGuessesMessage.style.display = '';
    // S3 FIX: Pluralization for 'guesses' is handled implicitly here, but the number is fixed.
    numberOfGuessesMessage.innerHTML = `You made ${attempts} guesses`;

    correctMessage.style.display = '';

    submitButton.disabled = true; // Disable controls
    guessInput.disabled = true; // Disable controls
  }

  // --- INCORRECT GUESS LOGIC ---
  if (guess !== targetNumber) {
    if (guess < targetNumber) {
      tooLowMessage.style.display = '';
    } else {
      // B6 FIX: If guess is not correct and not too low, it must be too high
      tooHighMessage.style.display = '';
    }
    
    // S3 FIX: Logic for pluralization (guess/guesses)
    const remainingAttempts = maxNumberOfAttempts - attempts;
    const guessWord = remainingAttempts === 1 ? 'guess' : 'guesses';

    numberOfGuessesMessage.style.display = '';
    numberOfGuessesMessage.innerHTML = `You guessed ${guess}. <br> ${remainingAttempts} ${guessWord} remaining`;
  }

  // B9/B10 FIX: Game over logic on loss
  // If max attempts reached AND the guess was incorrect
  if (attempts === maxNumberOfAttempts && guess !== targetNumber) {
    submitButton.disabled = true;
    guessInput.disabled = true;
    
    maxGuessesMessage.style.display = ''; // Show max guesses message
    numberOfGuessesMessage.innerHTML = `You guessed ${guess}. <br> 0 guesses remaining`; // Show 0 remaining
  }
  
  // Clear the input field for the next guess
  guessInput.value = '';

  // B8 FIX (Partial): Show reset button after the first guess
  resetButton.style.display = '';
}

// Hides all elements with the class 'message'
function hideAllMessages() {
  // B5 FIX: Changed <= to < to stop the loop at messages.length - 1 (avoids undefined index)
  for (let elementIndex = 0; elementIndex < messages.length; elementIndex++) {
    messages[elementIndex].style.display = 'none';
  }
}

// B2 FIX: Corrected typo from 'funtion' to 'function'
function setup() {
  // B7 FIX: Reset the number of attempts to 0 for a new game
  attempts = 0; 

  // Get new random target number (1-99 inclusive)
  targetNumber = getRandomNumber(1, 100);
  console.log(`target number: ${targetNumber}`);

  // B4 FIX: Corrected typo from 'disabeld' to 'disabled'
  submitButton.disabled = false; 
  guessInput.disabled = false;
  
  // B8 FIX (Complete): Hides all messages and the reset button at start
  hideAllMessages();
  resetButton.style.display = 'none';
}

// S1/S2 FIX: Added validation check and preventDefault directly into the event listener
submitButton.addEventListener('click', (e) => {
    e.preventDefault(); // Stop default form submission

    const guessValue = parseInt(guessInput.value, 10);
    
    // S1 & S2 FIX: Validation for < 1 or > 99
    if (guessValue < 1 || guessValue > 99) {
        // NOTE: Use a message box/alert if requirement is to inform the user
        console.log("Please enter a number between 1 and 99.");
        guessInput.value = '';
        return;
    }
    checkGuess();
});

resetButton.addEventListener('click', setup);

// Initial call to setup the game state on load
setup();
