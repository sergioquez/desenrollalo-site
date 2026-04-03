                    <li>NO tocar emulsión mientras está húmeda</li>
                    <li>Usar dedales limpios si es necesario manipular</li>
                </ul>
            </div>
            <div class="actions-list">
                <h4><span>🧹</span> Limpieza Post-Proceso</h4>
                <ul>
                    <li>Enjuagar tanque y carretes con agua tibia</li>
                    <li>Secar completamente antes de guardar</li>
                    <li>Limpiar derrames inmediatamente</li>
                    <li>Almacenar químicos en lugar fresco/oscuro</li>
                    <li>Registrar químicos utilizados</li>
                </ul>
            </div>
        `;
    }

    getCompletionContent() {
        const capacity = this.calculateChemicalCapacity();
        const remainingRolls = this.state.developer === 'c41' 
            ? Math.min(capacity.developer, capacity.blix, capacity.stabilizer)
            : Math.min(capacity.developerStock, capacity.fixer, capacity.stopBath);
        
        return `
            <div class="actions-list">
                <h4><span>🎉</span> ¡Felicidades!</h4>
                <ul>
                    <li>Has completado el proceso de revelado</li>
                    <li>Película lista para escanear/ampliar</li>
                    <li>Guarda negativos en sobres archivables</li>
                    <li>Etiqueta con fecha y detalles del proceso</li>
                </ul>
            </div>
            <div class="chemicals-system">
                <h4><span>⚗️</span> Estado Final de Químicos</h4>
                <div class="chemicals-grid">
                    ${this.getChemicalStatusHTML()}
                </div>
                <div style="margin-top: var(--space-md); padding: var(--space-sm); background: rgba(16, 185, 129, 0.1); border-radius: var(--radius-sm);">
                    <div style="font-size: var(--text-sm); color: var(--text-secondary);">
                        <strong>📝 Registrar uso:</strong> ${this.state.rolls} rollo${this.state.rolls > 1 ? 's' : ''} procesado${this.state.rolls > 1 ? 's' : ''}
                    </div>
                    <div style="font-size: var(--text-sm); color: var(--text-secondary); margin-top: var(--space-xs);">
                        <strong>🧪 Rollos restantes:</strong> ${remainingRolls} aprox.
                    </div>
                </div>
            </div>
            <div class="actions-list">
                <h4><span>📋</span> Próximos Pasos</h4>
                <ul>
                    <li>Esperar 24 horas antes de escanear (recomendado)</li>
                    <li>Revisar negativos con lupa para calidad</li>
                    <li>Anotar ajustes para próximos revelados</li>
                    <li>Compartir resultados con comunidad</li>
                </ul>
            </div>
        `;
    }

    getChemicalStatusHTML() {
        const capacity = this.calculateChemicalCapacity();
        
        if (this.state.developer === 'c41') {
            return `
                <div class="chemical-item">
                    <div class="chemical-name">Developer</div>
                    <div class="chemical-bar">
                        <div class="chemical-fill" style="width: ${(capacity.developer / 12) * 100}%"></div>
                    </div>
                    <div class="chemical-remaining">${capacity.developer}/${12}</div>
                </div>
                <div class="chemical-item">
                    <div class="chemical-name">Blix</div>
                    <div class="chemical-bar">
                        <div class="chemical-fill" style="width: ${(capacity.blix / 12) * 100}%"></div>
                    </div>
                    <div class="chemical-remaining">${capacity.blix}/${12}</div>
                </div>
                <div class="chemical-item">
                    <div class="chemical-name">Stabilizer</div>
                    <div class="chemical-bar">
                        <div class="chemical-fill" style="width: ${(capacity.stabilizer / 50) * 100}%"></div>
                    </div>
                    <div class="chemical-remaining">${capacity.stabilizer}/${50}</div>
                </div>
            `;
        } else {
            return `
                <div class="chemical-item">
                    <div class="chemical-name">Developer Stock</div>
                    <div class="chemical-bar">
                        <div class="chemical-fill" style="width: ${(capacity.developerStock / 10) * 100}%"></div>
                    </div>
                    <div class="chemical-remaining">${capacity.developerStock}/${10}</div>
                </div>
                <div class="chemical-item">
                    <div class="chemical-name">Fixer</div>
                    <div class="chemical-bar">
                        <div class="chemical-fill" style="width: ${(capacity.fixer / 30) * 100}%"></div>
                    </div>
                    <div class="chemical-remaining">${capacity.fixer}/${30}</div>
                </div>
                <div class="chemical-item">
                    <div class="chemical-name">Stop Bath</div>
                    <div class="chemical-bar">
                        <div class="chemical-fill" style="width: ${(capacity.stopBath / 50) * 100}%"></div>
                    </div>
                    <div class="chemical-remaining">${capacity.stopBath}/${50}</div>
                </div>
            `;
        }
    }

    getTotalProcessTime() {
        if (!this.state.developer) return 0;
        
        if (this.state.developer === 'c41') {
            // C-41: ~15 minutos desarrollo + ~15 minutos proceso
            return 30;
        } else {
            // D-76: 10-12 minutos desarrollo + ~45-60 minutos proceso
            return this.state.filmType === '35mm' ? 55 : 57;
        }
    }

    generateC41Agitation(totalSeconds) {
        const agitation = [];
        agitation.push({ time: 0, action: 'Agitación constante: 30 segundos' });
        
        // Agitación cada 30 segundos después del primer minuto
        for (let time = 30; time < totalSeconds; time += 30) {
            agitation.push({ time: time, action: '5 inversiones' });
        }
        
        agitation.push({ time: totalSeconds - 30, action: 'Preparar para drenar' });
        return agitation;
    }

    generateC41WashAgitation(totalSeconds) {
        return [
            { time: 0, action: 'Llenar tanque' },
            { time: 15, action: 'Vaciar completamente' },
            { time: 45, action: 'Llenar tanque' },
            { time: 60, action: 'Vaciar completamente' },
            { time: 90, action: 'Llenar tanque' },
            { time: 105, action: 'Vaciar completamente' },
            { time: 135, action: 'Llenar tanque' },
            { time: 150, action: 'Vaciar completamente' },
            { time: 180, action: 'Llenar tanque (último)' }
        ];
    }

    generateD76Agitation(totalSeconds) {
        const agitation = [];
        agitation.push({ time: 0, action: 'Agitación constante: 60 segundos' });
        
        // Después del primer minuto, agitación cada 30 segundos
        for (let time = 90; time < totalSeconds; time += 30) {
            agitation.push({ time: time, action: '5 inversiones' });
        }
        
        agitation.push({ time: totalSeconds - 30, action: 'Preparar para drenar' });
        return agitation;
    }

    generateD76WashAgitation() {
        return [
            { time: 0, action: 'Llenar, 5 inversiones, vaciar' },
            { time: 60, action: 'Llenar, 10 inversiones, vaciar' },
            { time: 180, action: 'Llenar, 20 inversiones, vaciar' },
            { time: 420, action: 'Llenar, 40 inversiones, vaciar' },
            { time: 780, action: 'Llenar, 40 inversiones, vaciar (último)' }
        ];
    }

    showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.state.steps.length) return;
        
        const step = this.state.steps[stepIndex];
        this.state.currentStep = stepIndex;
        
        // Actualizar UI
        this.stepTitle.textContent = step.title;
        this.stepDescription.textContent = step.description;
        this.stepContent.innerHTML = step.content;
        
        // Actualizar progress bar
        const progress = ((stepIndex + 1) / this.state.steps.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.currentStepSpan.textContent = `Paso ${stepIndex + 1}`;
        
        // Configurar timer si el paso tiene duración
        if (step.duration > 0) {
            this.state.timeLeft = step.duration;
            this.stepTimer.style.display = 'block';
            this.startTimerButton.style.display = 'block';
            this.updateTimerDisplay();
            
            // Configurar alertas de agitación
            if (step.agitation) {
                this.setupAgitationAlerts(step.agitation);
            }
        } else {
            this.stepTimer.style.display = 'none';
            this.startTimerButton.style.display = 'none';
            this.stopTimer();
        }
        
        // Actualizar estado de botones
        this.prevButton.disabled = stepIndex === 0;
        this.nextButton.disabled = stepIndex === this.state.steps.length - 1;
        
        // Cambiar texto del botón next en último paso
        if (stepIndex === this.state.steps.length - 1) {
            this.nextButton.innerHTML = '<span>Finalizar</span> <span>🏁</span>';
        } else {
            this.nextButton.innerHTML = '<span>Siguiente</span> <span>→</span>';
        }
    }

    setupAgitationAlerts(agitation) {
        this.agitationAlerts.innerHTML = '';
        agitation.forEach(ag => {
            const alert = document.createElement('div');
            alert.className = 'agitation-alert';
            alert.innerHTML = `
                <span class="alert-icon">🔄</span>
                <span class="alert-text">${ag.action}</span>
                <span class="alert-time">${this.formatTime(ag.time)}</span>
            `;
            this.agitationAlerts.appendChild(alert);
        });
    }

    startStepTimer() {
        if (this.state.isTimerRunning) return;
        
        const step = this.state.steps[this.state.currentStep];
        this.state.isTimerRunning = true;
        this.state.timeLeft = step.duration;
        
        // Deshabilitar botón de inicio
        this.startTimerButton.disabled = true;
        this.startTimerButton.innerHTML = '<span>⏱️</span> Timer en curso...';
        
        // Iniciar intervalo
        this.state.timerInterval = setInterval(() => {
            this.state.timeLeft--;
            this.updateTimerDisplay();
            
            // Verificar alertas de agitación
            if (step.agitation) {
                const elapsed = step.duration - this.state.timeLeft;
                step.agitation.forEach(ag => {
                    if (ag.time === elapsed) {
                        this.showAgitationAlert(ag.action);
                    }
                });
            }
            
            // Timer completado
            if (this.state.timeLeft <= 0) {
                this.timerComplete();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
            this.state.timerInterval = null;
        }
        this.state.isTimerRunning = false;
    }

    updateTimerDisplay() {
        this.timerDisplay.textContent = this.formatTime(this.state.timeLeft);
        
        const step = this.state.steps[this.state.currentStep];
        const progress = ((step.duration - this.state.timeLeft) / step.duration) * 100;
        this.timerProgress.style.width = `${progress}%`;
    }

    showAgitationAlert(action) {
        const alert = document.createElement('div');
        alert.className = 'agitation-alert';
        alert.innerHTML = `
            <span class="alert-icon">🔄</span>
            <span class="alert-text">${action}</span>
        `;
        
        this.agitationAlerts.appendChild(alert);
        
        // Scroll al final
        this.agitationAlerts.scrollTop = this.agitationAlerts.scrollHeight;
        
        // Remover después de 5 segundos
        setTimeout(() => {
            if (alert.parentNode === this.agitationAlerts) {
                alert.remove();
            }
        }, 5000);
    }

    timerComplete() {
        this.stopTimer();
        
        // Mostrar mensaje de completado
        this.showSuccess('✅ Timer completado');
        
        // Restaurar botón de timer
        this.startTimerButton.disabled = false;
        this.startTimerButton.innerHTML = '<span>⏱️</span> Timer Completado';
        
        // Auto-avanzar después de 2 segundos si no es paso crítico
        const step = this.state.steps[this.state.currentStep];
        if (!step.title.includes('CRÍTICO') && !step.title.includes('Developer')) {
            setTimeout(() => {
                this.nextStep();
            }, 2000);
        }
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <span class="success-icon">✅</span>
            <span>${message}</span>
        `;
        
        this.stepContent.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    prevStep() {
        if (this.state.currentStep > 0) {
            this.stopTimer();
            this.showStep(this.state.currentStep - 1);
        }
    }

    nextStep() {
        if (this.state.currentStep < this.state.steps.length - 1) {
            this.stopTimer();
            this.showStep(this.state.currentStep + 1);
        } else {
            // Último paso: reiniciar
            this.showSuccess('🎉 ¡Proceso completado exitosamente!');
            
            // Scroll al inicio después de 3 segundos
            setTimeout(() => {
                document.querySelector('.calculator-section').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }, 3000);
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.filmDevelopmentApp = new FilmDevelopmentApp();
    
    // Forzar redibujado en móviles para prevenir problemas de render
    if ('ontouchstart' in window) {
        document.body.style.webkitTransform = 'translateZ(0)';
        document.body.style.transform = 'translateZ(0)';
    }
    
    // Prevenir zoom en inputs en iOS
    document.addEventListener('touchstart', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
            e.preventDefault();
        }
    }, { passive: false });
    
    console.log('🎞️ Desenrollalo v2.0 cargado exitosamente');
});