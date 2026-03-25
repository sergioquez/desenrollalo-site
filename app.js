// Timer functionality
const timerDisplay = document.querySelector('.timer-display');
const startBtn = document.querySelector('.timer-controls .start');
const stopBtn = document.querySelector('.timer-controls .stop');
const resetBtn = document.querySelector('.timer-controls .reset');

let timerInterval;
let elapsedSeconds = 0;

function startTimer() {
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  stopTimer();
  elapsedSeconds = 0;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
  const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);