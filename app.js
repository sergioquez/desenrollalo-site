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

let timerInterval;
let elapsedSeconds = 0;
let alertsEnabled = false;

const filmTypeSelect = document.getElementById('film-type');
const developerSelect = document.getElementById('developer');
const rollsInput = document.getElementById('rolls');
const calculateBtn = document.querySelector('.calculator button.calculate');
const resultDiv = document.querySelector('.calculator .result');
const progressBar = document.querySelector('.timer .progress-bar');

const timerDisplay = document.querySelector('.timer-display');
const startBtn = document.querySelector('.timer-controls .start');
const stopBtn = document.querySelector('.timer-controls .stop');
const resetBtn = document.querySelector('.timer-controls .reset');

const enableAlertsBtn = document.querySelector('.alerts .enable-alerts');
const disableAlertsBtn = document.querySelector('.alerts .disable-alerts');
const alertSound = document.getElementById('alert-sound');

function calculateDevelopmentTime() {
  const filmType = filmTypeSelect.value;
  const developer = developerSelect.value;
  const rolls = parseInt(rollsInput.value, 10);

  const totalDevelopmentTime = calculateDevelopmentTime(filmType, developer, rolls);
  const minutes = Math.floor(totalDevelopmentTime / 60);
  const seconds = totalDevelopmentTime % 60;

  resultDiv.textContent = `Tiempo total de revelado: ${minutes}min ${seconds}s`;
  startTimer(totalDevelopmentTime);
}

function startTimer(totalDevelopmentTime) {
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    updateTimerDisplay();
    updateProgressBar(elapsedSeconds, totalDevelopmentTime);
    if (elapsedSeconds >= totalDevelopmentTime) {
      stopTimer();
      playAlertSound();
      showDevelopmentCompleteNotification();
      addCalendarEvent(totalDevelopmentTime);
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
  updateProgressBar(0, 0);
}

function updateTimerDisplay() {
  const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
  const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function updateProgressBar(currentTime, totalTime) {
  const progress = (currentTime / totalTime) * 100;
  progressBar.style.width = `${progress}%`;
}

function calculateDevelopmentTime(filmType, developer, rolls) {
  const developmentTime = DEVELOPMENT_TIMES[filmType][developer];
  return developmentTime * rolls;
}

function playAlertSound() {
  if (alertsEnabled) {
    alertSound.play();
  }
}

function showDevelopmentCompleteNotification() {
  alert('¡Revelado terminado! Es hora de pasar a la siguiente etapa.');
}

function addCalendarEvent(totalDevelopmentTime) {
  const event = {
    title: 'Revelar película',
    start: new Date().toISOString(),
    end: new Date(new Date().getTime() + totalDevelopmentTime * 1000).toISOString()
  };

  if (navigator.calendar) {
    navigator.calendar.createEvent(event);
    alert('Se ha agregado un evento al calendario.');
  } else {
    alert('No se pudo agregar el evento al calendario.');
  }
}

startBtn.addEventListener('click', () => {
  calculateDevelopmentTime();
});

stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

enableAlertsBtn.addEventListener('click', () => {
  alertsEnabled = true;
  playAlertSound();
});

disableAlertsBtn.addEventListener('click', () => {
  alertsEnabled = false;
});