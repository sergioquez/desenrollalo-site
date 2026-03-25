// Timer functionality
const timerDisplay = document.querySelector('.timer-display');
const startBtn = document.querySelector('.timer-controls .start');
const stopBtn = document.querySelector('.timer-controls .stop');
const resetBtn = document.querySelector('.timer-controls .reset');

let timerInterval;
let elapsedSeconds = 0;

const DEVELOPMENT_TIMES = {
  '35mm': {
    'c41': 15,
    'd76': 10
  },
  '120mm': {
    'c41': 20,
    'd76': 12
  }
};

function calculateDevelopmentTime(filmType, developer, rolls) {
  const developmentTime = DEVELOPMENT_TIMES[filmType][developer];
  return developmentTime * rolls;
}

function startTimer(totalDevelopmentTime) {
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    updateTimerDisplay();
    if (elapsedSeconds >= totalDevelopmentTime) {
      stopTimer();
      playAlertSound();
    }
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

// Calculator functionality
const filmTypeSelect = document.getElementById('film-type');
const developerSelect = document.getElementById('developer');
const rollsInput = document.getElementById('rolls');
const calculateBtn = document.querySelector('.calculator button.calculate');
const resultDiv = document.querySelector('.calculator .result');

function calculateDevelopmentTime() {
  const filmType = filmTypeSelect.value;
  const developer = developerSelect.value;
  const rolls = parseInt(rollsInput.value, 10);

  let developmentTime;
  if (filmType === '35mm') {
    developmentTime = developer === 'c41' ? 15 : 10;
  } else {
    developmentTime = developer === 'c41' ? 20 : 12;
  }

  const totalTime = developmentTime * rolls;
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;

  resultDiv.textContent = `Tiempo total de revelado: ${minutes}min ${seconds}s`;
}

calculateBtn.addEventListener('click', calculateDevelopmentTime);

// Alerts functionality
const enableAlertsBtn = document.querySelector('.alerts .enable-alerts');
const disableAlertsBtn = document.querySelector('.alerts .disable-alerts');
const alertSound = document.getElementById('alert-sound');

let alertsEnabled = false;

function playAlertSound() {
  if (alertsEnabled) {
    alertSound.play();
  }
}

enableAlertsBtn.addEventListener('click', () => {
  alertsEnabled = true;
  playAlertSound();
});

disableAlertsBtn.addEventListener('click', () => {
  alertsEnabled = false;
});