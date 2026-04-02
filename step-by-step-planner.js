      ],
      buttons: [
        { text: '← Atrás', action: 'prev' },
        { text: 'Iniciar Timer (20:00)', action: 'startTimer' }
      ]
    });

    // Photo-Flo (optional)
    steps.push({
      id: 'd76_photoflo',
      title: '🧪 Photo-Flo (Opcional)',
      description: '30-60 segundos para reducir manchas',
      type: 'process',
      duration: 60,
      timerType: 'countdown',
      agitation: [
        { time: 0, action: '2-3 inversiones suaves' },
        { time: 30, action: '2-3 inversiones suaves' }
      ],
      actions: [
        '1-2 gotas en 500ml agua',
        'Inmersión suave',
        'NO enjuagar después',
        'Drenar completamente'
      ],
      chemicalChange: true,
      chemical: 'Photo-Flo',
      nextStepAction: 'Proceder a secado',
      buttons: [
        { text: '← Atrás', action: 'prev' },
        { text: 'Iniciar Timer (1:00)', action: 'startTimer' },
        { text: 'Saltar este paso', action: 'skip' }
      ]
    });

    // Drying
    steps.push({
      id: 'd76_drying',
      title: '🌬️ Secado B&W',
      description: 'Preparar película para secar',
      type: 'process',
      duration: 0,
      actions: [
        'Sacar película del carrete',
        'Colgar con pinzas limpias',
        'Área sin polvo',
        'Evitar tocar emulsión',
        '2-6 horas de secado'
      ],
      buttons: [
        { text: '← Atrás', action: 'prev' },
        { text: 'Finalizar Proceso →', action: 'next' }
      ]
    });

    return steps;
  }

  generateD76Agitation(totalSeconds) {
    const agitation = [];
    agitation.push({ time: 0, action: 'Agitación constante: 60 segundos' });
    
    for (let time = 90; time < totalSeconds; time += 30) {
      agitation.push({ time: time, action: '5 inversiones' });
    }
    
    agitation.push({ time: totalSeconds - 30, action: 'Preparar para drenar' });
    return agitation;
  }

  getChemicalInfo() {
    if (this.developerType === 'c41') {
      return `
        <div class="chemical-info">
          <p><strong>Developer C-41:</strong> ${this.chemicalCapacity.developer} rollos restantes</p>
          <p><strong>Blix:</strong> ${this.chemicalCapacity.blix} rollos restantes</p>
          <p><strong>Stabilizer:</strong> ${this.chemicalCapacity.stabilizer} rollos restantes</p>
        </div>
      `;
    } else {
      return `
        <div class="chemical-info">
          <p><strong>Developer D-76 (stock):</strong> ${this.chemicalCapacity.developerStock} rollos restantes</p>
          <p><strong>Developer D-76 (1:1):</strong> ${this.chemicalCapacity.developer1to1} rollos (uso único)</p>
          <p><strong>Fixer:</strong> ${this.chemicalCapacity.fixer} rollos restantes</p>
          <p><strong>Stop Bath:</strong> ${this.chemicalCapacity.stopBath} rollos restantes</p>
        </div>
      `;
    }
  }

  getTotalTime() {
    const totalSeconds = this.steps.reduce((sum, step) => sum + (step.duration || 0), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} minutos`;
  }

  init() {
    this.renderCarousel();
  }

  renderCarousel() {
    const container = document.createElement('div');
    container.className = 'step-carousel';
    container.innerHTML = this.getCarouselHTML();
    
    // Find or create carousel container
    let carouselContainer = document.querySelector('.step-carousel-container');
    if (!carouselContainer) {
      carouselContainer = document.createElement('div');
      carouselContainer.className = 'step-carousel-container';
      const guideContainer = document.querySelector('.guide-container');
      if (guideContainer) {
        guideContainer.appendChild(carouselContainer);
      }
    }
    
    carouselContainer.innerHTML = '';
    carouselContainer.appendChild(container);
    
    this.setupEventListeners();
    this.showStep(this.currentStepIndex);
  }

  getCarouselHTML() {
    const totalSteps = this.steps.length;
    const currentStep = this.currentStepIndex + 1;
    
    return `
      <div class="carousel-header">
        <h3>🚀 Planificador Paso a Paso</h3>
        <div class="step-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(currentStep / totalSteps) * 100}%"></div>
          </div>
          <div class="step-counter">Paso ${currentStep} de ${totalSteps}</div>
        </div>
      </div>
      
      <div class="carousel-body">
        <div class="step-content">
          <!-- Step content will be injected here -->
        </div>
        
        <div class="step-timer-container" style="display: none;">
          <div class="timer-display">--:--</div>
          <div class="timer-progress">
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
          </div>
          <div class="agitation-alerts"></div>
        </div>
      </div>
      
      <div class="carousel-footer">
        <div class="step-buttons">
          <!-- Buttons will be injected here -->
        </div>
      </div>
    `;
  }

  showStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= this.steps.length) return;
    
    this.currentStepIndex = stepIndex;
    const step = this.steps[stepIndex];
    
    // Update progress
    const totalSteps = this.steps.length;
    const currentStep = stepIndex + 1;
    document.querySelector('.progress-fill').style.width = `${(currentStep / totalSteps) * 100}%`;
    document.querySelector('.step-counter').textContent = `Paso ${currentStep} de ${totalSteps}`;
    
    // Update step content
    const stepContent = document.querySelector('.step-content');
    stepContent.innerHTML = this.getStepHTML(step);
    
    // Update buttons
    const stepButtons = document.querySelector('.step-buttons');
    stepButtons.innerHTML = this.getStepButtonsHTML(step);
    
    // Setup button listeners
    this.setupStepButtonListeners(step);
    
    // Show/hide timer
    const timerContainer = document.querySelector('.step-timer-container');
    if (step.duration > 0 && step.timerType === 'countdown') {
      timerContainer.style.display = 'block';
      this.timeLeft = step.duration;
      this.updateTimerDisplay();
    } else {
      timerContainer.style.display = 'none';
      this.stopTimer();
    }
    
    // Reset agitation index
    this.currentAgitationIndex = 0;
  }

  getStepHTML(step) {
    let html = `
      <div class="step-card ${step.type}">
        <div class="step-header">
          <h4>${step.title}</h4>
          ${step.duration > 0 ? `<div class="step-duration">${this.formatTime(step.duration)}</div>` : ''}
        </div>
        
        <div class="step-description">${step.description}</div>
    `;
    
    if (step.actions && step.actions.length > 0) {
      html += `
        <div class="step-actions">
          <h5>📝 Acciones:</h5>
          <ul>
            ${step.actions.map(action => `<li>${action}</li>`).join('')}
          </ul>
        </div>
      `;
    }
    
    if (step.agitation && step.agitation.length > 0) {
      html += `
        <div class="step-agitation">
          <h5>🔄 Agitación:</h5>
          <div class="agitation-list">
            ${step.agitation.map(ag => `
              <div class="agitation-item" data-time="${ag.time}">
                <span class="agitation-time">${this.formatTime(ag.time)}</span>
                <span class="agitation-action">${ag.action}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    if (step.chemicalInfo) {
      html += `
        <div class="step-chemical-info">
          ${step.chemicalInfo}
        </div>
      `;
    }
    
    if (step.chemicalChange) {
      html += `
        <div class="chemical-change-notice">
          <strong>🧪 Cambio de químico:</strong> ${step.chemical || 'Preparar siguiente químico'}
        </div>
      `;
    }
    
    if (step.nextStepAction) {
      html += `
        <div class="next-step-action">
          <strong>→ Siguiente:</strong> ${step.nextStepAction}
        </div>
      `;
    }
    
    if (step.stats) {
      html += `
        <div class="step-stats">
          <h5>📊 Estadísticas:</h5>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Rollos:</span>
              <span class="stat-value">${step.stats.rollos}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Tiempo total:</span>
              <span class="stat-value">${step.stats.tiempoTotal}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Químicos usados:</span>
              <span class="stat-value">${step.stats.químicosUsados}</span>
            </div>
          </div>
        </div>
      `;
    }
    
    html += `</div>`;
    return html;
  }

  getStepButtonsHTML(step) {
    let buttonsHTML = '';
    
    step.buttons.forEach(button => {
      const disabled = button.action === 'startTimer' && this.isTimerRunning ? 'disabled' : '';
      buttonsHTML += `
        <button class="step-button ${button.action}" ${disabled}>
          ${button.text}
        </button>
      `;
    });
    
    return buttonsHTML;
  }

  setupStepButtonListeners(step) {
    document.querySelectorAll('.step-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const action = e.target.classList[1]; // Get the action class
        
        switch (action) {
          case 'prev':
            this.prevStep();
            break;
          case 'next':
            this.nextStep();
            break;
          case 'startTimer':
            this.startTimer(step);
            break;
          case 'skip':
            this.nextStep();
            break;
          case 'restart':
            this.restartPlanner();
            break;
        }
      });
    });
  }

  prevStep() {
    if (this.currentStepIndex > 0) {
      this.stopTimer();
      this.showStep(this.currentStepIndex - 1);
    }
  }

  nextStep() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.stopTimer();
      this.showStep(this.currentStepIndex + 1);
    }
  }

  startTimer(step) {
    if (this.isTimerRunning) return;
    
    this.isTimerRunning = true;
    this.timeLeft = step.duration;
    this.currentAgitationIndex = 0;
    
    // Update button
    const startButton = document.querySelector('.step-button.startTimer');
    if (startButton) {
      startButton.disabled = true;
      startButton.textContent = '⏱️ Timer en curso...';
    }
    
    // Start timer interval
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();
      
      // Check for agitation points
      if (step.agitation) {
        const elapsed = step.duration - this.timeLeft;
        step.agitation.forEach((ag, index) => {
          if (ag.time === elapsed && index >= this.currentAgitationIndex) {
            this.showAgitationAlert(ag.action);
            this.currentAgitationIndex = index + 1;
          }
        });
      }
      
      // Timer complete
      if (this.timeLeft <= 0) {
        this.timerComplete(step);
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.isTimerRunning = false;
  }

  timerComplete(step) {
    this.stopTimer();
    
    // Show completion message
    this.showAlert('✅ Timer completado', 'success');
    
    // Update button
    const startButton = document.querySelector('.step-button.startTimer');
    if (startButton) {
      startButton.disabled = false;
      startButton.textContent = '✅ Completado';
    }
    
    // Auto-advance after 2 seconds if not a chemical change step
    if (!step.chemicalChange) {
      setTimeout(() => {
        this.nextStep();
      }, 2000);
    }
  }

  updateTimerDisplay() {
    const timerDisplay = document.querySelector('.timer-display');
    const progressFill = document.querySelector('.timer-progress .progress-fill');
    
    if (timerDisplay && progressFill) {
      timerDisplay.textContent = this.formatTime(this.timeLeft);
      
      const step = this.steps[this.currentStepIndex];
      const progress = ((step.duration - this.timeLeft) / step.duration) * 100;
      progressFill.style.width = `${progress}%`;
    }
  }

  showAgitationAlert(action) {
    const alertsContainer = document.querySelector('.agitation-alerts');
    if (!alertsContainer) return;
    
    const alert = document.createElement('div');
    alert.className = 'agitation-alert';
    alert.innerHTML = `
      <span class="alert-icon">🔄</span>
      <span class="alert-text">${action}</span>
    `;
    
    alertsContainer.appendChild(alert);
    
    // Remove after 5 seconds
    setTimeout(() => {
      alert.remove();
    }, 5000);
  }

  showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `global-alert ${type}`;
    alert.textContent = message;
    
    document.querySelector('.step-carousel').appendChild(alert);
    
    setTimeout(() => {
      alert.remove();
    }, 3000);
  }

  restartPlanner() {
    this.currentStepIndex = 0;
    this.stopTimer();
    this.showStep(0);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  setupEventListeners() {
    // Additional event listeners if needed
  }
}

// Initialize when calculator is used
function initStepByStepPlanner(filmType, developer, rolls) {
  const chemicalsUsed = localStorage.getItem(`chemicals_used_${developer}`) || 0;
  return new StepByStepPlanner(filmType, developer, rolls, chemicalsUsed);
}

// Export for global use
if (typeof window !== 'undefined') {
  window.initStepByStepPlanner = initStepByStepPlanner;
  window.StepByStepPlanner = StepByStepPlanner;
}