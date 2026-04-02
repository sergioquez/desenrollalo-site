        </div>
        <button class="restart-process">🔄 Nuevo Revelado</button>
        <button class="view-history">📊 Ver Historial</button>
      </div>
    `;
    
    document.querySelector('.restart-process').addEventListener('click', () => {
      this.resetPlanner();
    });
  }

  skipToTimer() {
    // Skip to the main timer with all steps listed
    const timerContainer = document.querySelector('.timer');
    if (timerContainer) {
      // Hide planner
      document.querySelector('.planner-container').style.display = 'none';
      
      // Show timer with all steps
      this.showTimerWithSteps();
    }
  }

  showTimerWithSteps() {
    // This would integrate with the existing timer
    // For now, just alert
    alert('Función de timer con pasos detallados será implementada en la siguiente iteración');
  }

  resetPlanner() {
    this.currentStep = 0;
    this.isPaused = false;
    clearInterval(this.timerInterval);
    
    // Reset UI
    document.querySelector('.planner-steps').style.display = 'block';
    document.querySelector('.planner-controls').style.display = 'block';
    document.querySelector('.active-process').style.display = 'none';
    
    // Reset step visualization
    document.querySelectorAll('.planner-step').forEach(el => {
      el.classList.remove('active', 'completed');
    });
    
    // Activate first step
    document.querySelector('.planner-step[data-index="0"]')?.classList.add('active');
  }

  getTotalTime() {
    const totalSeconds = this.steps.reduce((sum, step) => sum + step.duration, 0);
    return Math.floor(totalSeconds / 60);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

// Initialize planner when calculator is used
function initProcessPlanner(filmType, developer, rolls) {
  // Check if chemicals used is stored
  const chemicalsUsed = localStorage.getItem(`chemicals_used_${developer}`) || 0;
  
  return new FilmDevelopmentPlanner(filmType, developer, rolls, chemicalsUsed);
}

// Export for global use
if (typeof window !== 'undefined') {
  window.initProcessPlanner = initProcessPlanner;
  window.FilmDevelopmentPlanner = FilmDevelopmentPlanner;
}