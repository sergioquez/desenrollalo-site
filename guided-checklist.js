// guided-checklist.js - Interactive checklist for film development

class DevelopmentChecklist {
  constructor(processType) {
    this.processType = processType; // 'c41' or 'd76'
    this.steps = this.getProcessSteps();
    this.currentStep = 0;
    this.timers = {};
    this.init();
  }

  getProcessSteps() {
    const filmType = document.getElementById('film-type')?.value || '35mm';
    const is35mm = filmType === '35mm';
    
    // C-41 times are standard regardless of film type
    const c41Steps = [
      { id: 'prep', name: 'Preparación', duration: 0, description: 'Pre-temperar TODOS los químicos a 102°F ± 0.5°F, preparar equipo' },
      { id: 'prewash', name: 'Pre-wash', duration: 120, description: 'Agua destilada 102°F, agitación constante primeros 30s' },
      { id: 'developer', name: 'Developer', duration: 195, description: 'Developer C-41, agitación: 30s constante, luego 5 inversiones cada 30s' },
      { id: 'blix', name: 'Blix', duration: 390, description: 'Bleach + Fix, misma agitación que developer. ¡No extender tiempo!' },
      { id: 'wash', name: 'Wash', duration: 195, description: 'Agua 102°F, llenar/vaciar tanque 5-6 veces completamente' },
      { id: 'stabilizer', name: 'Stabilizer', duration: 90, description: 'Agitación suave 2-3 inversiones, NO enjuagar después' },
      { id: 'dry', name: 'Secado', duration: 0, description: 'Colgar en área limpia sin polvo, 2-4 horas' }
    ];
    
    // D-76 times vary by film type (35mm vs 120mm have same times, but format matters)
    // Common films development times at 68°F with D-76 stock
    const d76Times = {
      'Tri-X 400': 450, // 7.5 min
      'HP5+ 400': 480,  // 8 min
      'T-Max 100': 390, // 6.5 min
      'FP4+ 125': 420   // 7 min
    };
    
    // Use average time if specific film not detected
    const devTime = 450; // 7.5 min default
    
    const d76Steps = [
      { id: 'prep', name: 'Preparación', duration: 0, description: 'Preparar químicos a 68°F (20°C), equipo limpio y seco' },
      { id: 'developer', name: 'Developer', duration: devTime, description: `D-76 stock, agitación: 1min constante (10-15 inversiones), luego 5 inversiones cada 30s` },
      { id: 'stop', name: 'Stop Bath', duration: 60, description: 'Ácido acético 1-2% o agua con vinagre, agitación constante' },
      { id: 'fixer', name: 'Fixer', duration: 300, description: 'Rapid fixer, agitación: 5 inversiones cada minuto. Test: leader debe volverse transparente' },
      { id: 'wash', name: 'Wash', duration: 1200, description: '20 min agua corriente (10 cambios de agua) o usar método Ilford' },
      { id: 'photoflo', name: 'Photo-Flo', duration: 60, description: 'Opcional: 1-2 gotas en 500ml agua, reduce manchas' },
      { id: 'dry', name: 'Secado', duration: 0, description: 'Colgar con pinzas limpias, área sin polvo, 2-6 horas' }
    ];
    
    const steps = {
      'c41': c41Steps,
      'd76': d76Steps
    };
    
    return steps[this.processType] || steps.d76;
  }

  init() {
    this.renderChecklist();
    this.setupEventListeners();
  }

  renderChecklist() {
    const container = document.createElement('div');
    container.className = 'interactive-checklist';
    container.innerHTML = `
      <div class="checklist-header">
        <h3>Checklist Interactivo - ${this.processType === 'c41' ? 'C-41 (Color)' : 'D-76 (B&W)'}</h3>
        <div class="checklist-progress">
          <div class="progress-bar"></div>
          <span class="progress-text">0/${this.steps.length} pasos</span>
        </div>
      </div>
      <div class="checklist-steps"></div>
      <div class="checklist-controls">
        <button class="prev-step" disabled>← Anterior</button>
        <button class="next-step">Siguiente →</button>
        <button class="start-timer">Iniciar Timer</button>
        <button class="reset-checklist">Reiniciar</button>
      </div>
      <div class="current-timer">
        <div class="timer-display">--:--</div>
        <div class="timer-description"></div>
      </div>
    `;

    // Find or create checklist container
    let checklistContainer = document.querySelector('.checklist-container');
    if (!checklistContainer) {
      checklistContainer = document.createElement('div');
      checklistContainer.className = 'checklist-container';
      const guideContainer = document.querySelector('.development-guide-container');
      if (guideContainer) {
        guideContainer.appendChild(checklistContainer);
      }
    }

    checklistContainer.innerHTML = '';
    checklistContainer.appendChild(container);
    
    this.renderSteps();
    this.updateProgress();
  }

  renderSteps() {
    const stepsContainer = document.querySelector('.checklist-steps');
    stepsContainer.innerHTML = this.steps.map((step, index) => `
      <div class="checklist-step ${index === 0 ? 'active' : ''} ${step.duration > 0 ? 'has-timer' : ''}" data-index="${index}">
        <div class="step-header">
          <div class="step-checkbox">
            <input type="checkbox" id="step-${step.id}" ${index === 0 ? 'checked' : ''}>
            <label for="step-${step.id}"></label>
          </div>
          <div class="step-info">
            <h4>${step.name}</h4>
            ${step.duration > 0 ? `<span class="step-duration">${this.formatTime(step.duration)}</span>` : ''}
          </div>
          ${step.duration > 0 ? '<button class="step-timer-btn">⏱️</button>' : ''}
        </div>
        <div class="step-description">${step.description}</div>
        ${step.duration > 0 ? `
          <div class="step-timer">
            <div class="timer-progress">
              <div class="timer-fill" style="width: 0%"></div>
            </div>
            <div class="timer-display-small">${this.formatTime(step.duration)}</div>
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  setupEventListeners() {
    // Step checkboxes
    document.querySelectorAll('.checklist-step input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const stepIndex = parseInt(e.target.closest('.checklist-step').dataset.index);
        this.completeStep(stepIndex, e.target.checked);
      });
    });

    // Timer buttons
    document.querySelectorAll('.step-timer-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const stepIndex = parseInt(e.target.closest('.checklist-step').dataset.index);
        this.startStepTimer(stepIndex);
      });
    });

    // Navigation buttons
    document.querySelector('.prev-step').addEventListener('click', () => this.prevStep());
    document.querySelector('.next-step').addEventListener('click', () => this.nextStep());
    document.querySelector('.start-timer').addEventListener('click', () => this.startAllTimers());
    document.querySelector('.reset-checklist').addEventListener('click', () => this.resetChecklist());
  }

  completeStep(index, completed) {
    const step = document.querySelector(`.checklist-step[data-index="${index}"]`);
    if (completed) {
      step.classList.add('completed');
      step.classList.remove('active');
      
      // Activate next step if available
      if (index < this.steps.length - 1) {
        const nextStep = document.querySelector(`.checklist-step[data-index="${index + 1}"]`);
        nextStep.classList.add('active');
        nextStep.querySelector('input[type="checkbox"]').checked = true;
      }
    } else {
      step.classList.remove('completed');
    }
    
    this.updateProgress();
    this.updateNavigation();
  }

  startStepTimer(stepIndex) {
    const step = this.steps[stepIndex];
    if (!step || step.duration === 0) return;

    // Stop any existing timer for this step
    if (this.timers[stepIndex]) {
      clearInterval(this.timers[stepIndex].interval);
    }

    let timeLeft = step.duration;
    const stepElement = document.querySelector(`.checklist-step[data-index="${stepIndex}"]`);
    const timerDisplay = stepElement.querySelector('.timer-display-small');
    const timerFill = stepElement.querySelector('.timer-fill');
    const mainTimerDisplay = document.querySelector('.current-timer .timer-display');
    const mainTimerDesc = document.querySelector('.current-timer .timer-description');

    // Update main timer display
    mainTimerDisplay.textContent = this.formatTime(timeLeft);
    mainTimerDesc.textContent = `En progreso: ${step.name}`;

    this.timers[stepIndex] = {
      interval: setInterval(() => {
        timeLeft--;
        
        // Update displays
        timerDisplay.textContent = this.formatTime(timeLeft);
        mainTimerDisplay.textContent = this.formatTime(timeLeft);
        
        // Update progress bar
        const progress = ((step.duration - timeLeft) / step.duration) * 100;
        timerFill.style.width = `${progress}%`;
        
        // Timer complete
        if (timeLeft <= 0) {
          clearInterval(this.timers[stepIndex].interval);
          stepElement.classList.add('timer-complete');
          mainTimerDisplay.textContent = '¡Completado!';
          mainTimerDesc.textContent = `${step.name} finalizado`;
          
          // Auto-complete step
          this.completeStep(stepIndex, true);
        }
      }, 1000),
      startTime: Date.now()
    };
  }

  startAllTimers() {
    // Start timer for current active step
    const activeStep = document.querySelector('.checklist-step.active');
    if (activeStep) {
      const stepIndex = parseInt(activeStep.dataset.index);
      this.startStepTimer(stepIndex);
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateActiveStep();
    }
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.updateActiveStep();
    }
  }

  updateActiveStep() {
    document.querySelectorAll('.checklist-step').forEach((step, index) => {
      step.classList.toggle('active', index === this.currentStep);
    });
    this.updateNavigation();
  }

  updateNavigation() {
    const prevBtn = document.querySelector('.prev-step');
    const nextBtn = document.querySelector('.next-step');
    
    prevBtn.disabled = this.currentStep === 0;
    nextBtn.disabled = this.currentStep === this.steps.length - 1;
  }

  updateProgress() {
    const completedSteps = document.querySelectorAll('.checklist-step.completed').length;
    const totalSteps = this.steps.length;
    const progress = (completedSteps / totalSteps) * 100;
    
    const progressBar = document.querySelector('.checklist-progress .progress-bar');
    const progressText = document.querySelector('.checklist-progress .progress-text');
    
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${completedSteps}/${totalSteps} pasos`;
  }

  resetChecklist() {
    this.currentStep = 0;
    
    // Clear all timers
    Object.values(this.timers).forEach(timer => {
      if (timer.interval) clearInterval(timer.interval);
    });
    this.timers = {};
    
    // Reset UI
    this.renderChecklist();
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

// Initialize checklist when guide is shown
function initDevelopmentChecklist(processType) {
  return new DevelopmentChecklist(processType);
}

// Export for global use
if (typeof window !== 'undefined') {
  window.initDevelopmentChecklist = initDevelopmentChecklist;
}