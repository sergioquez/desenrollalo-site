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

// Variables will be initialized in DOMContentLoaded
let filmTypeSelect, developerSelect, rollsInput, calculateBtn, resultDiv, progressBar;
let timerDisplay, startBtn, stopBtn, resetBtn;
let enableAlertsBtn, disableAlertsBtn, alertSound;

function calculateAndStartTimer() {
  // Get current values from DOM elements
  const filmType = document.getElementById('film-type').value;
  const developer = document.getElementById('developer').value;
  const rolls = parseInt(document.getElementById('rolls').value, 10);
  
  if (isNaN(rolls) || rolls < 1) {
    alert('Por favor ingresa un número válido de rollos (mínimo 1)');
    return;
  }

  const totalDevelopmentTime = calculateDevelopmentTime(filmType, developer, rolls);
  const minutes = Math.floor(totalDevelopmentTime / 60);
  const seconds = totalDevelopmentTime % 60;

  const resultDiv = document.querySelector('.calculator .result');
  if (resultDiv) {
    resultDiv.textContent = `Tiempo total de revelado: ${minutes}min ${seconds}s`;
  }
  
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
  const timerDisplay = document.querySelector('.timer-display');
  if (timerDisplay) {
    const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
    const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
  }
}

function updateProgressBar(currentTime, totalTime) {
  const progressBar = document.querySelector('.timer .progress-bar');
  if (progressBar) {
    const progress = (currentTime / totalTime) * 100;
    progressBar.style.width = `${progress}%`;
  }
}

function calculateDevelopmentTime(filmType, developer, rolls) {
  const developmentTime = DEVELOPMENT_TIMES[filmType][developer];
  return developmentTime * rolls;
}

function playAlertSound() {
  if (alertsEnabled) {
    const alertSound = document.getElementById('alert-sound');
    if (alertSound) {
      alertSound.play().catch(e => console.log('Audio play failed:', e));
    }
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

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Re-select elements to ensure they exist
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
  
  // Add event listeners
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      calculateAndStartTimer();
    });
  }
  
  if (stopBtn) {
    stopBtn.addEventListener('click', stopTimer);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', resetTimer);
  }
  
  if (enableAlertsBtn) {
    enableAlertsBtn.addEventListener('click', () => {
      alertsEnabled = true;
      playAlertSound();
    });
  }
  
  if (disableAlertsBtn) {
    disableAlertsBtn.addEventListener('click', () => {
      alertsEnabled = false;
    });
  }
  
  // Also add event listener for calculate button
  if (calculateBtn) {
    calculateBtn.addEventListener('click', () => {
      calculateAndStartTimer();
    });
  }
  
  // Theme toggle functionality
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');
  
  if (themeToggle && themeIcon) {
    function toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      themeIcon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
      
      // Add visual feedback
      themeToggle.classList.add('active');
      setTimeout(() => {
        themeToggle.classList.remove('active');
      }, 300);
      
      // Save to localStorage
      localStorage.setItem('theme', newTheme);
      
      // Show brief confirmation
      const originalTitle = themeToggle.getAttribute('title');
      themeToggle.setAttribute('title', `Tema cambiado a ${newTheme === 'dark' ? 'oscuro' : 'claro'}`);
      setTimeout(() => {
        themeToggle.setAttribute('title', originalTitle);
      }, 2000);
    }
    
    themeToggle.addEventListener('click', toggleTheme);
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
  }
  
  console.log('Timer initialized successfully');
});