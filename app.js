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

// Film development expert functions
function getDevelopmentInstructions(filmType, developer) {
  const instructions = {
    'c41': {
      title: 'Proceso C-41 (Color)',
      steps: [
        '1. Pre-temperar químicos a 102°F (39°C)',
        '2. Pre-wash (opcional): Agua 102°F, 1-2 min',
        '3. Developer: 3 min 15 seg, agitación constante',
        '4. Blix: 6 min 30 seg, misma agitación',
        '5. Wash: Agua 102°F, 3 min 15 seg',
        '6. Stabilizer: 1 min 30 seg, agitación suave',
        '7. Secar en área limpia sin polvo'
      ],
      chemicals: [
        'Developer C-41',
        'Blix (bleach + fix)',
        'Stabilizer',
        'Agua destilada'
      ],
      warnings: [
        '⚠️ Temperatura crítica: 102°F ± 0.5°F',
        '⚠️ Usar guantes y gafas de seguridad',
        '⚠️ Químicos corrosivos, manejar con cuidado'
      ],
      temperature: '102°F (39°C) ± 0.5°F',
      totalTime: '~15 minutos'
    },
    'd76': {
      title: 'Proceso D-76 (Blanco y Negro)',
      steps: [
        '1. Developer D-76: 6-12 min (depende de película)',
        '2. Stop bath: Ácido acético 1-2%, 30-60 seg',
        '3. Fixer: Rapid fixer, 5-10 min (hasta clear)',
        '4. Wash: 20-30 min agua corriente o método Ilford',
        '5. Photo-Flo (opcional): 30-60 seg para menos manchas',
        '6. Secar colgado con pinzas limpias'
      ],
      chemicals: [
        'Developer D-76 (stock o 1:1)',
        'Stop bath (ácido acético)',
        'Rapid fixer',
        'Photo-Flo (opcional)'
      ],
      warnings: [
        '✅ Temperatura flexible: 65-75°F (68°F ideal)',
        '⚠️ Usar guantes para protección',
        '✅ Puede ajustarse tiempo por temperatura'
      ],
      temperature: '68°F (20°C) ideal, 65-75°F aceptable',
      totalTime: '~45-60 minutos'
    }
  };
  
  return instructions[developer] || instructions.d76;
}

function showDevelopmentGuide() {
  const filmType = document.getElementById('film-type').value;
  const developer = document.getElementById('developer').value;
  const rolls = document.getElementById('rolls').value;
  
  const instructions = getDevelopmentInstructions(filmType, developer);
  const developmentTime = calculateDevelopmentTime(filmType, developer, parseInt(rolls) || 1);
  const minutes = Math.floor(developmentTime / 60);
  const seconds = developmentTime % 60;
  
  let guideHTML = `
    <div class="development-guide">
      <h3>${instructions.title}</h3>
      <div class="guide-meta">
        <p><strong>Tiempo total desarrollo:</strong> ${minutes}min ${seconds}s</p>
        <p><strong>Temperatura:</strong> ${instructions.temperature}</p>
        <p><strong>Tiempo proceso completo:</strong> ${instructions.totalTime}</p>
      </div>
      
      <div class="guide-section">
        <h4>📋 Pasos:</h4>
        <ul class="steps-list">
          ${instructions.steps.map(step => `<li>${step}</li>`).join('')}
        </ul>
      </div>
      
      <div class="guide-section">
        <h4>🧪 Químicos necesarios:</h4>
        <ul class="chemicals-list">
          ${instructions.chemicals.map(chem => `<li>${chem}</li>`).join('')}
        </ul>
      </div>
      
      <div class="guide-section warnings">
        <h4>⚠️ Advertencias de seguridad:</h4>
        <ul class="warnings-list">
          ${instructions.warnings.map(warn => `<li>${warn}</li>`).join('')}
        </ul>
      </div>
      
      <div class="guide-tips">
        <h4>💡 Consejos:</h4>
        <ul>
          <li>Pre-temperar todos los químicos antes de empezar</li>
          <li>Agitación consistente es clave para resultados uniformes</li>
          <li>Anotar tiempos y temperaturas para consistencia</li>
          <li>Limpieza inmediata del equipo prolonga su vida útil</li>
        </ul>
      </div>
    </div>
  `;
  
  // Create or update guide display
  let guideContainer = document.querySelector('.development-guide-container');
  if (!guideContainer) {
    guideContainer = document.createElement('div');
    guideContainer.className = 'development-guide-container';
    const calculatorSection = document.querySelector('.calculator');
    if (calculatorSection) {
      calculatorSection.appendChild(guideContainer);
    }
  }
  
  guideContainer.innerHTML = guideHTML;
  
  // Scroll to guide
  guideContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}