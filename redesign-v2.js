// redesign-v2.js - Lógica completa rediseñada para experiencia móvil-first

class FilmDevelopmentApp {
    constructor() {
        // Estado de la aplicación
        this.state = {
            filmType: null,
            developer: null,
            rolls: 1,
            chemicalsUsed: 0,
            currentStep: 0,
            isTimerRunning: false,
            timerInterval: null,
            timeLeft: 0,
            totalSteps: 0,
            steps: []
        };

        // Constantes de desarrollo
        this.DEVELOPMENT_TIMES = {
            '35mm': { 'c41': 15, 'd76': 10 },    // minutos
            '120mm': { 'c41': 20, 'd76': 12 }    // minutos
        };

        // Capacidad de químicos (rollos por litro)
        this.CHEMICAL_CAPACITY = {
            'c41': {
                developer: 12,
                blix: 12,
                stabilizer: 50
            },
            'd76': {
                developerStock: 10,
                developer1to1: 4,  // uso único
                fixer: 30,
                stopBath: 50
            }
        };

        // Inicializar
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.updateChemicalSystem();
        this.updateRollsDisplay();
    }

    cacheElements() {
        // Formulario
        this.filmTypeSelect = document.getElementById('filmType');
        this.developerSelect = document.getElementById('developer');
        this.rollsInput = document.getElementById('rolls');
        this.rollsDisplay = document.getElementById('rollsDisplay');
        this.rollsText = document.getElementById('rollsText');
        this.additionalTime = document.getElementById('additionalTime');
        this.decreaseRollsBtn = document.getElementById('decreaseRolls');
        this.increaseRollsBtn = document.getElementById('increaseRolls');
        this.calculateButton = document.getElementById('calculateButton');
        this.calculatorForm = document.getElementById('calculatorForm');

        // Sistema de químicos
        this.chemicalsSystem = document.getElementById('chemicalsSystem');
        this.chemicalsGrid = document.getElementById('chemicalsGrid');
        this.chemicalsUsedInput = document.getElementById('chemicalsUsed');
        this.updateChemicalsBtn = document.getElementById('updateChemicals');

        // Resultados
        this.resultsSection = document.getElementById('resultsSection');
        this.developmentTime = document.getElementById('developmentTime');
        this.timeUnit = document.getElementById('timeUnit');
        this.processName = document.getElementById('processName');
        this.filmTypeResult = document.getElementById('filmTypeResult');
        this.rollsResult = document.getElementById('rollsResult');
        this.temperatureResult = document.getElementById('temperatureResult');
        this.startGuideButton = document.getElementById('startGuideButton');

        // Carrusel
        this.carouselSection = document.getElementById('carouselSection');
        this.progressFill = document.getElementById('progressFill');
        this.currentStepSpan = document.getElementById('currentStep');
        this.totalStepsSpan = document.getElementById('totalSteps');
        this.stepTitle = document.getElementById('stepTitle');
        this.stepDescription = document.getElementById('stepDescription');
        this.stepContent = document.getElementById('stepContent');
        this.stepTimer = document.getElementById('stepTimer');
        this.timerDisplay = document.getElementById('timerDisplay');
        this.timerLabel = document.getElementById('timerLabel');
        this.timerProgress = document.getElementById('timerProgress');
        this.agitationAlerts = document.getElementById('agitationAlerts');
        this.prevButton = document.getElementById('prevButton');
        this.nextButton = document.getElementById('nextButton');
        this.startTimerButton = document.getElementById('startTimerButton');
    }

    bindEvents() {
        // Eventos del formulario
        this.filmTypeSelect.addEventListener('change', (e) => {
            this.state.filmType = e.target.value;
            this.updateChemicalSystem();
        });

        this.developerSelect.addEventListener('change', (e) => {
            this.state.developer = e.target.value;
            this.updateChemicalSystem();
            this.showProcessInfo();
        });

        this.decreaseRollsBtn.addEventListener('click', () => {
            if (this.state.rolls > 1) {
                this.state.rolls--;
                this.updateRollsDisplay();
            }
        });

        this.increaseRollsBtn.addEventListener('click', () => {
            if (this.state.rolls < 10) {
                this.state.rolls++;
                this.updateRollsDisplay();
            }
        });

        this.calculatorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateDevelopmentTime();
        });

        // Sistema de químicos
        this.updateChemicalsBtn.addEventListener('click', () => {
            const used = parseInt(this.chemicalsUsedInput.value) || 0;
            this.state.chemicalsUsed = Math.max(0, Math.min(50, used));
            this.updateChemicalSystem();
        });

        // Guía paso a paso
        this.startGuideButton.addEventListener('click', () => {
            this.startStepByStepGuide();
        });

        // Controles del carrusel
        this.prevButton.addEventListener('click', () => {
            this.prevStep();
        });

        this.nextButton.addEventListener('click', () => {
            this.nextStep();
        });

        this.startTimerButton.addEventListener('click', () => {
            this.startStepTimer();
        });
    }

    updateRollsDisplay() {
        this.rollsDisplay.textContent = this.state.rolls;
        this.rollsInput.value = this.state.rolls;
        
        const rollText = this.state.rolls === 1 ? '1 rollo' : `${this.state.rolls} rollos`;
        this.rollsText.textContent = rollText;
        
        // Mostrar tiempo adicional si hay más de 1 rollo
        if (this.state.rolls > 1) {
            this.additionalTime.style.display = 'inline';
        } else {
            this.additionalTime.style.display = 'none';
        }
        
        // Actualizar estado de botones
        this.decreaseRollsBtn.disabled = this.state.rolls <= 1;
        this.increaseRollsBtn.disabled = this.state.rolls >= 10;
    }

    showProcessInfo() {
        const processInfo = document.getElementById('processInfo');
        const c41Info = document.getElementById('c41Info');
        const d76Info = document.getElementById('d76Info');
        
        if (this.state.developer === 'c41') {
            processInfo.style.display = 'grid';
            c41Info.style.display = 'block';
            d76Info.style.display = 'none';
        } else if (this.state.developer === 'd76') {
            processInfo.style.display = 'grid';
            c41Info.style.display = 'none';
            d76Info.style.display = 'block';
        } else {
            processInfo.style.display = 'none';
        }
    }

    updateChemicalSystem() {
        if (!this.state.developer) {
            this.chemicalsSystem.style.display = 'none';
            return;
        }
        
        this.chemicalsSystem.style.display = 'block';
        this.renderChemicalCapacity();
    }

    renderChemicalCapacity() {
        const capacity = this.calculateChemicalCapacity();
        let html = '';
        
        if (this.state.developer === 'c41') {
            html = `
                <div class="chemical-item">
                    <div class="chemical-name">Developer C-41</div>
                    <div class="chemical-bar">
                        <div class="chemical-fill" style="width: ${(capacity.developer / 12) * 100}%"></div>
                    </div>
                    <div class="chemical-remaining">${capacity.developer} rollos restantes</div>
                </div>
                <div class="chemical-item">
                    <div class="chemical-name">Blix</div>
                    <div class="chemical-bar">
                        <div class="chemical-fill" style="width: ${(capacity.blix / 12) * 100}%"></div>
                    </div>
                    <div class="chemical-remaining">${capacity.blix} rollos restantes</div>
                </div>
                <div class="chemical-item">
                    <div class="chemical-name">Stabilizer</div>
                    <div class="chemical-bar">
                        <div class="chemical-fill" style="width: ${(capacity.stabilizer / 50) * 100}%"></div>
                    </div>
                    <div class="chemical-remaining">${capacity.stabilizer} rollos restantes</div>
                </div>
            `;
        } else {
            html = `
                <div class="chemical-item">
                    <div class="chemical-name">Developer D-76 (stock)</div>
                    <div class="chemical-bar">
                        <div class="chemical-fill" style="width: ${(capacity.developerStock / 10) * 100}%"></div>
                    </div>
                    <div class="chemical-remaining">${capacity.developerStock} rollos restantes</div>
                </div>
                <div class="chemical-item">
                    <div class="chemical-name">Developer D-76 (1:1)</div>
                    <div class="chemical-bar">
                        <div class="chemical-fill" style="width: 100%"></div>
                    </div>
                    <div class="chemical-remaining">${capacity.developer1to1} rollos (uso único)</div>
                </div>
                <div class="chemical-item">
                    <div class="chemical-name">Fixer</div>
                    <div class="chemical-bar">
                        <div class="chemical-fill" style="width: ${(capacity.fixer / 30) * 100}%"></div>
                    </div>
                    <div class="chemical-remaining">${capacity.fixer} rollos restantes</div>
                </div>
                <div class="chemical-item">
                    <div class="chemical-name">Stop Bath</div>
                    <div class="chemical-bar">
                        <div class="chemical-fill" style="width: ${(capacity.stopBath / 50) * 100}%"></div>
                    </div>
                    <div class="chemical-remaining">${capacity.stopBath} rollos restantes</div>
                </div>
            `;
        }
        
        this.chemicalsGrid.innerHTML = html;
        this.chemicalsUsedInput.value = this.state.chemicalsUsed;
    }

    calculateChemicalCapacity() {
        if (this.state.developer === 'c41') {
            return {
                developer: Math.max(0, this.CHEMICAL_CAPACITY.c41.developer - this.state.chemicalsUsed),
                blix: Math.max(0, this.CHEMICAL_CAPACITY.c41.blix - this.state.chemicalsUsed),
                stabilizer: Math.max(0, this.CHEMICAL_CAPACITY.c41.stabilizer - this.state.chemicalsUsed)
            };
        } else {
            return {
                developerStock: Math.max(0, this.CHEMICAL_CAPACITY.d76.developerStock - this.state.chemicalsUsed),
                developer1to1: this.CHEMICAL_CAPACITY.d76.developer1to1,
                fixer: Math.max(0, this.CHEMICAL_CAPACITY.d76.fixer - this.state.chemicalsUsed),
                stopBath: Math.max(0, this.CHEMICAL_CAPACITY.d76.stopBath - this.state.chemicalsUsed)
            };
        }
    }

    calculateDevelopmentTime() {
        // Validar inputs
        if (!this.state.filmType || !this.state.developer) {
            this.showError('Por favor, selecciona el tipo de película y proceso');
            return;
        }

        // Calcular tiempo en segundos
        const developmentTimeMinutes = this.DEVELOPMENT_TIMES[this.state.filmType][this.state.developer];
        const developmentTimeSeconds = developmentTimeMinutes * 60;
        const additionalTime = (this.state.rolls - 1) * 30;
        const totalSeconds = developmentTimeSeconds + additionalTime;

        // Mostrar resultados
        this.showResults(developmentTimeMinutes, totalSeconds);
    }

    showResults(minutes, totalSeconds) {
        // Formatear tiempo
        const totalMinutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        const timeString = `${totalMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        
        // Actualizar UI
        this.developmentTime.textContent = timeString;
        this.timeUnit.textContent = totalMinutes === 1 ? 'minuto' : 'minutos';
        
        // Información del proceso
        this.processName.textContent = this.state.developer === 'c41' ? 'C-41 (Color)' : 'D-76 (B&W)';
        this.filmTypeResult.textContent = this.state.filmType === '35mm' ? '35mm' : '120mm';
        this.rollsResult.textContent = this.state.rolls === 1 ? '1 rollo' : `${this.state.rolls} rollos`;
        
        // Temperatura
        if (this.state.developer === 'c41') {
            this.temperatureResult.textContent = '39°C ± 0.3°C';
        } else {
            this.temperatureResult.textContent = '20°C ideal (18-24°C)';
        }
        
        // Mostrar sección de resultados
        this.resultsSection.classList.add('active');
        
        // Scroll suave a resultados
        setTimeout(() => {
            this.resultsSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);
    }

    showError(message) {
        // Crear elemento de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <span class="error-icon">⚠️</span>
            <span>${message}</span>
        `;
        
        // Insertar después del formulario
        this.calculatorForm.parentNode.insertBefore(errorDiv, this.calculatorForm.nextSibling);
        
        // Remover después de 5 segundos
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    startStepByStepGuide() {
        // Generar pasos basados en el proceso seleccionado
        this.state.steps = this.generateSteps();
        this.state.totalSteps = this.state.steps.length;
        this.state.currentStep = 0;
        
        // Actualizar UI del carrusel
        this.totalStepsSpan.textContent = `de ${this.state.totalSteps}`;
        
        // Mostrar carrusel
        this.carouselSection.classList.add('active');
        
        // Mostrar primer paso
        this.showStep(0);
        
        // Scroll suave al carrusel
        setTimeout(() => {
            this.carouselSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);
    }

    generateSteps() {
        const steps = [];
        const isC41 = this.state.developer === 'c41';
        
        // Paso 1: Bienvenida
        steps.push({
            title: '🎯 Bienvenido a la Guía',
            description: `Vamos a revelar ${this.state.rolls} rollo${this.state.rolls > 1 ? 's' : ''} de ${this.state.filmType} con proceso ${isC41 ? 'C-41 (Color)' : 'D-76 (B&W)'}`,
            type: 'info',
            duration: 0,
            content: this.getWelcomeContent()
        });
        
        // Paso 2: Preparación de químicos
        steps.push({
            title: '🧪 Preparar Químicos',
            description: isC41 ? 'Temperar a 39°C ± 0.3°C' : 'Temperar a 20°C (18-24°C aceptable)',
            type: 'preparation',
            duration: 0,
            content: this.getChemicalsPreparationContent()
        });
        
        // Paso 3: Preparación de equipo
        steps.push({
            title: '🔧 Preparar Equipo',
            description: 'Organizar todo el equipo necesario',
            type: 'preparation',
            duration: 0,
            content: this.getEquipmentPreparationContent()
        });
        
        // Pasos del proceso específico
        if (isC41) {
            steps.push(...this.generateC41Steps());
        } else {
            steps.push(...this.generateD76Steps());
        }
        
        // Paso final
        steps.push({
            title: '🎉 ¡Proceso Completado!',
            description: 'Revelado finalizado exitosamente',
            type: 'completion',
            duration: 0,
            content: this.getCompletionContent()
        });
        
        return steps;
    }

    getWelcomeContent() {
        return `
            <div class="actions-list">
                <h4><span>📋</span> Resumen del Proceso</h4>
                <ul>
                    <li>Película: ${this.state.filmType}</li>
                    <li>Proceso: ${this.state.developer === 'c41' ? 'C-41 (Color)' : 'D-76 (Blanco y Negro)'}</li>
                    <li>Rollos: ${this.state.rolls}</li>
                    <li>Tiempo total: ${this.getTotalProcessTime()} minutos aprox.</li>
                </ul>
            </div>
            <div class="chemicals-system">
                <h4><span>⚗️</span> Estado de Químicos</h4>
                <div class="chemicals-grid">
                    ${this.getChemicalStatusHTML()}
                </div>
            </div>
        `;
    }

    getChemicalsPreparationContent() {
        const isC41 = this.state.developer === 'c41';
        
        if (isC41) {
            return `
                <div class="actions-list">
                    <h4><span>🌡️</span> Temperatura Crítica</h4>
                    <ul>
                        <li><strong>Developer C-41:</strong> 39°C ± 0.3°C</li>
                        <li><strong>Blix:</strong> 39°C ± 0.3°C</li>
                        <li><strong>Stabilizer:</strong> 39°C ± 0.3°C</li>
                        <li><strong>Agua destilada:</strong> 39°C ± 0.3°C</li>
                    </ul>
                </div>
                <div class="actions-list">
                    <h4><span>⚠️</span> Importante</h4>
                    <ul>
                        <li>Usar termómetro digital calibrado</li>
                        <li>Temperar TODOS los químicos antes de empezar</li>
                        <li>Mantener temperatura constante durante proceso</li>
                        <li>Preparar baño maría si es necesario</li>
                    </ul>
                </div>
            `;
        } else {
            return `
                <div class="actions-list">
                    <h4><span>🌡️</span> Temperatura Flexible</h4>
                    <ul>
                        <li><strong>Developer D-76:</strong> 20°C ideal (18-24°C aceptable)</li>
                        <li><strong>Stop bath:</strong> 20°C</li>
                        <li><strong>Fixer:</strong> 20°C</li>
                        <li><strong>Photo-Flo (opcional):</strong> 20°C</li>
                    </ul>
                </div>
                <div class="actions-list">
                    <h4><span>📊</span> Compensación por Temperatura</h4>
                    <ul>
                        <li>18°C: +20% tiempo</li>
                        <li>22°C: -10% tiempo</li>
                        <li>24°C: -20% tiempo</li>
                        <li>Fuera de rango: no recomendado</li>
                    </ul>
                </div>
            `;
        }
    }

    getEquipmentPreparationContent() {
        return `
            <div class="actions-list">
                <h4><span>📋</span> Equipo Requerido</h4>
                <ul>
                    <li>Tanque de revelado para ${this.state.filmType}</li>
                    <li>Carretes ajustados correctamente</li>
                    <li>Termómetro digital (precisión ±0.1°C)</li>
                    <li>Timer con segundos</li>
                    <li>Guantes de nitrilo</li>
                    <li>Gafas de seguridad</li>
                    <li>4 jarras graduadas (500ml mínimo)</li>
                    <li>Embudo limpio</li>
                    <li>Papel absorbente para derrames</li>
                </ul>
            </div>
            <div class="actions-list">
                <h4><span>✅</span> Checklist de Seguridad</h4>
                <ul>
                    <li>Área bien ventilada</li>
                    <li>Sin alimentos/bebidas cerca</li>
                    <li>Ropa que cubra brazos/piernas</li>
                    <li>Conocer ubicación lavaojos</li>
                    <li>Tener agua corriente disponible</li>
                </ul>
            </div>
        `;
    }

    generateC41Steps() {
        const steps = [];
        const devTime = 195; // 3:15 en segundos
        const blixTime = 390; // 6:30
        const washTime = 195; // 3:15
        const stabilizerTime = 90; // 1:30
        
        // Pre-wash (opcional)
        steps.push({
            title: '🚿 Pre-wash (Opcional)',
            description: 'Agua 39°C para equalizar temperatura',
            type: 'process',
            duration: 120,
            agitation: [
                { time: 0, action: 'Agitación constante primeros 30s' },
                { time: 30, action: '5 inversiones cada 30s' },
                { time: 90, action: 'Preparar para drenar' }
            ],
            content: this.getC41StepContent('prewash', 120)
        });
        
        // Developer
        steps.push({
            title: '🧪 Developer C-41',
            description: '3 minutos 15 segundos - TIEMPO CRÍTICO',
            type: 'process',
            duration: devTime,
            agitation: this.generateC41Agitation(devTime),
            content: this.getC41StepContent('developer', devTime)
        });
        
        // Blix
        steps.push({
            title: '🧪 Blix (Bleach + Fix)',
            description: '6 minutos 30 segundos',
            type: 'process',
            duration: blixTime,
            agitation: this.generateC41Agitation(blixTime),
            content: this.getC41StepContent('blix', blixTime)
        });
        
        // Wash
        steps.push({
            title: '🚿 Lavado',
            description: '3 minutos 15 segundos',
            type: 'process',
            duration: washTime,
            agitation: this.generateC41WashAgitation(washTime),
            content: this.getC41StepContent('wash', washTime)
        });
        
        // Stabilizer
        steps.push({
            title: '🧪 Stabilizer',
            description: '1 minuto 30 segundos',
            type: 'process',
            duration: stabilizerTime,
            agitation: [
                { time: 0, action: '2-3 inversiones suaves' },
                { time: 30, action: '2-3 inversiones suaves' },
                { time: 60, action: '2-3 inversiones suaves' }
            ],
            content: this.getC41StepContent('stabilizer', stabilizerTime)
        });
        
        // Drying
        steps.push({
            title: '🌬️ Secado',
            description: 'Preparar película para secar',
            type: 'process',
            duration: 0,
            content: this.getDryingContent('c41')
        });
        
        return steps;
    }

    generateD76Steps() {
        const steps = [];
        const devTime = this.state.filmType === '35mm' ? 600 : 720; // 10 o 12 minutos
        const stopTime = 60;
        const fixTime = 300;
        const washTime = 1200;
        
        // Developer
        steps.push({
            title: '🧪 Developer D-76',
            description: \`\${Math.floor(devTime/60)} minutos desarrollo\`,
            type: 'process',
            duration: devTime,
            agitation: this.generateD76Agitation(devTime),
            content: this.getD76StepContent('developer', devTime)
        });
        
        // Stop Bath
        steps.push({
            title: '🧪 Stop Bath',
            description: '1 minuto para detener desarrollo',
            type: 'process',
            duration: stopTime,
            agitation: [
                { time: 0, action: 'Agitación constante 60 segundos' }
            ],
            content: this.getD76StepContent('stop', stopTime)
        });
        
        // Fixer
        steps.push({
            title: '🧪 Fixer',
            description: '5 minutos mínimo (hasta clear)',
            type: 'process',
            duration: fixTime,
            agitation: [
                { time: 0, action: '5 inversiones' },
                { time: 60, action: '5 inversiones' },
                { time: 120, action: '5 inversiones' },
                { time: 180, action: '5 inversiones' },
                { time: 240, action: '5 inversiones' }
            ],
            content: this.getD76StepContent('fixer', fixTime)
        });
        
        // Wash
        steps.push({
            title: '🚿 Lavado B&W',
            description: '20 minutos lavado completo',
            type: 'process',
            duration: washTime,
            agitation: this.generateD76WashAgitation(),
            content: this.getD76StepContent('wash', washTime)
        });
        
        // Photo-Flo (opcional)
        steps.push({
            title: '🧪 Photo-Flo (Opcional)',
            description: '1 minuto para reducir manchas',
            type: 'process',
            duration: 60,
            agitation: [
                { time: 0, action: '2-3 inversiones suaves' },
                { time: 30, action: '2-3 inversiones suaves' }
            ],
            content: this.getD76StepContent('photoflo', 60)
        });
        
        // Drying
        steps.push({
            title: '🌬️ Secado B&W',
            description: 'Preparar película para secar',
            type: 'process',
            duration: 0,
            content: this.getDryingContent('d76')
        });
        
        return steps;
    }

    getC41StepContent(step, duration) {
        const contents = {
            'prewash': \`
                <div class="actions-list">
                    <h4><span>💧</span> Instrucciones</h4>
                    <ul>
                        <li>Llenar tanque con agua destilada 39°C</li>
                        <li>Iniciar timer inmediatamente</li>
                        <li>Seguir agitación indicada</li>
                        <li>Drenar completamente al terminar</li>
                        <li><em>Nota: Este paso es opcional pero recomendado</em></li>
                    </ul>
                </div>
            \`,
            'developer': \`
                <div class="actions-list">
                    <h4><span>🚨</span> Instrucciones CRÍTICAS</h4>
                    <ul>
                        <li>Verter developer rápidamente (≤10 segundos)</li>
                        <li>Comenzar timer INMEDIATAMENTE</li>
                        <li>Seguir agitación EXACTA cada 30 segundos</li>
                        <li>NO extender tiempo bajo ninguna circunstancia</li>
                        <li>Preparar blix mientras corre el timer</li>
                    </ul>
                </div>
                <div class="chemicals-system">
                    <h4><span>⚗️</span> Developer C-41</h4>
                    <div class="chemicals-grid">
                        <div class="chemical-item">
                            <div class="chemical-name">Capacidad</div>
                            <div class="chemical-bar">
                                <div class="chemical-fill" style="width: \${(this.calculateChemicalCapacity().developer / 12) * 100}%"></div>
                            </div>
                            <div class="chemical-remaining">\${this.calculateChemicalCapacity().developer} rollos restantes</div>
                        </div>
                    </div>
                </div>
            \`,
            'blix': \`
                <div class="actions-list">
                    <h4><span>⚠️</span> Instrucciones Importantes</h4>
                    <ul>
                        <li>Verter blix inmediatamente después de developer</li>
                        <li>Mantener misma agitación que developer</li>
                        <li>¡NO extender tiempo! (puede dañar imagen)</li>
                        <li>Preparar agua de lavado mientras corre timer</li>
                    </ul>
                </div>
            \`,
            'wash': \`
                <div class="actions-list">
                    <h4><span>💦</span> Método de Lavado</h4>
                    <ul>
                        <li>Llenar tanque con agua 39°C</li>
                        <li>Vaciar completamente (15 segundos)</li>
                        <li>Repetir 5-6 veces (llenar/vaciar)</li>
                        <li>Mantener temperatura constante</li>
                        <li>Último llenado: dejar 30 segundos</li>
                    </ul>
                </div>
            \`,
            'stabilizer': \`
                <div class="actions-list">
                    <h4><span>🛡️</span> Instrucciones Finales</h4>
                    <ul>
                        <li>Verter stabilizer suavemente</li>
                        <li>Agitación MUY suave (2-3 inversiones)</li>
                        <li>NO enjuagar después del stabilizer</li>
                        <li>Stabilizer puede reutilizarse</li>
                        <li>Preparar área de secado</li>
                    </ul>
                </div>
            \`
        };
        
        return contents[step] || '';
    }

    getD76StepContent(step, duration) {
        const contents = {
            'developer': \`
                <div class="actions-list">
                    <h4><span>📊</span> Instrucciones Developer</h4>
                    <ul>
                        <li>Verter developer rápidamente</li>
                        <li>Comenzar timer inmediatamente</li>
                        <li>Agitación: 1 minuto constante, luego cada 30s</li>
                        <li>Tiempo: \${Math.floor(duration/60)} minutos exactos</li>
                        <li>Preparar stop bath mientras corre timer</li>
                    </ul>
                </div>
                <div class="chemicals-system">
                    <h4><span>⚗️</span> Developer D-76</h4>
                    <div class="chemicals-grid">
                        <div class="chemical-item">
                            <div class="chemical-name">Stock (reutilizable)</div>
                            <div class="chemical-bar">
                                <div class="chemical-fill" style="width: \${(this.calculateChemicalCapacity().developerStock / 10) * 100}%"></div>
                            </div>
                            <div class="chemical-remaining">\${this.calculateChemicalCapacity().developerStock} rollos restantes</div>
                        </div>
                        <div class="chemical-item">
                            <div class="chemical-name">1:1 (uso único)</div>
                            <div class="chemical-bar">
                                <div class="chemical-fill" style="width: 100%"></div>
                            </div>
                            <div class="chemical-remaining">\${this.calculateChemicalCapacity().developer1to1} rollos</div>
                        </div>
                    </div>
                </div>
            \`,
            'stop': \`
                <div class="actions-list">
                    <h4><span>🛑</span> Instrucciones Stop Bath</h4>
                    <ul>
                        <li>Verter inmediatamente después de developer</li>
                        <li>Agitación constante 60 segundos</li>
                        <li>Detiene completamente el desarrollo</li>
                        <li>Preparar fixer mientras corre timer</li>
                    </ul>
                </div>
            \`,
            'fixer': \`
                <div class="actions-list">
                    <h4><span>✅</span> Instrucciones Fixer</h4>
                    <ul>
                        <li>Verter fixer después de stop bath</li>
                        <li>Agitación: 5 inversiones cada minuto</li>
                        <li>Tiempo mínimo: 5 minutos</li>
                        <li>Test: leader debe volverse transparente</li>
                        <li>Si no está clear, extender 1-2 minutos más</li>
                    </ul>
                </div>
            \`,
            'wash': \`
                <div class="actions-list">
                    <h4><span>💦</span> Método Ilford (Recomendado)</h4>
                    <ul>
                        <li>1er lavado: 1 minuto, 5 inversiones</li>
                        <li>2do lavado: 2 minutos, 10 inversiones</li>
                        <li>3er lavado: 4 minutos, 20 inversiones</li>
                        <li>4to lavado: 8 minutos, 40 inversiones</li>
                        <li>5to lavado: 8 minutos, 40 inversiones</li>
                        <li><em>Total: 23 minutos, agua a 20°C</em></li>
                    </ul>
                </div>
            \`,
            'photoflo': \`
                <div class="actions-list">
                    <h4><span>✨</span> Instrucciones Photo-Flo</h4>
                    <ul>
                        <li>1-2 gotas en 500ml agua destilada</li>
                        <li>Inmersión suave 60 segundos</li>
                        <li>Agitación muy suave (2-3 inversiones)</li>
                        <li>NO enjuagar después</li>
                        <li><em>Opcional: reduce manchas de agua</em></li>
                    </ul>
                </div>
            \`
        };
        
        return contents[step] || '';
    }

    getDryingContent(process) {
        const isC41 = process === 'c41';
        
        return \`
            <div class="actions-list">
                <h4><span>🌬️</span> Instrucciones de Secado</h4>
                <ul>
                    <li>Sacar película del carrete con cuidado</li>
                    <li>Colgar con pinzas limpias (solo en bordes)</li>
                    <li>Área SIN polvo (baño cerrado funciona bien)</li>
                    <li>Sin corrientes de aire fuerte</li>
                    <li>\${isC41 ? '2-4 horas' : '2-6 horas'} de secado</li>
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
        \`;
    }

    getCompletionContent() {
        const capacity = this.calculateChemicalCapacity();
        const remainingRolls = this.state.developer === 'c41' 
            ? Math.min(capacity.developer, capacity.blix, capacity.stabilizer)
            : Math.min(capacity.developerStock, capacity.fixer, capacity.stopBath);
        
        return \`
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
                    \${this.getChemicalStatusHTML()}
                </div>
                <div style="margin-top: var(--space-md); padding: var(--space-sm); background: rgba(16, 185, 129, 0.1); border-radius: var(--radius-sm);">
                    <div style="font-size: var(--text-sm); color: var(--text-secondary);">
                        <strong>📝 Registrar uso:</strong> \${this.state.rolls} rollo\${this.state.rolls > 1 ? 's' : ''} procesado\${this.state.rolls > 1 ? 's' : ''}
                    </div>
                    <div style="font-size: var(--text-sm); color: var(--text-secondary); margin-top: var(--space-xs);">
                        <strong>🧪 Rollos restantes:</strong> \${remainingRolls} aprox.
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
        \`;
    }

    getChemicalStatusHTML() {
        const capacity = this.calculateChemicalCapacity();
        
        if (this.state.developer === 'c41') {
            return \`
                <div class="chemical-item">
                    <div class="chemical-name">Developer</div>
                    <div class="chemical-bar">
                        <div class="chemical-fill" style="width: \${(capacity.developer / 12) * 100}%"></div>
                    </div>
                    <div class="chemical-remaining">\${capacity.developer}/12</div>
                </div>
                <div class="chemical-item">
                    <div class="chemical-name">Blix</div>
                    <div class="chemical-bar">
                        <div class="chemical-fill" style="width: \${(capacity.blix / 12) * 100}%"></div>
                    </div>
                    <div class="chemical-remaining">\${capacity.blix}/12</div>
                </div>
                <div class="chemical-item">
                    <div class="chemical-name">Stabilizer</div>
                    <div class="chemical-bar">
                        <div class="chemical-fill" style="width: \${(capacity.stabilizer / 50) * 100}%"></div>
                    </div>
                    <div class="chemical-remaining">\${capacity.stabilizer}/50</div>
                </div>
            \`;
        } else {
            return \`
                <div class="chemical-item">
                    <div class="chemical-name">Developer Stock</div>
                    <div class="chemical-bar">
                        <div class="chemical-fill" style="width: \${(capacity.developerStock / 10) * 100}%"></div>
                    </div>
                    <div class="chemical-remaining">\${capacity.developerStock}/10</div>
                </div>
                <div class="chemical-item">
                    <div class="chemical-name">Fixer</div>
                    <div class="chemical-bar">
                        <div class="chemical-fill" style="width: \${(capacity.fixer / 30) * 100}%"></div>
                    </div>
                    <div class="chemical-remaining">\${capacity.fixer}/30</div>
                </div>
                <div class="chemical-item">
                    <div class="chemical-name">Stop Bath</div>
                    <div class="chemical-bar">
                        <div class="chemical-fill" style="width: \${(capacity.stopBath / 50) * 100}%"></div>
                    </div>
                    <div class="chemical-remaining">\${capacity.stopBath}/50</div>
                </div>
            \`;
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
        this.progressFill.style.width = \`\${progress}%\`;
        this.currentStepSpan.textContent = \`Paso \${stepIndex + 1}\`;
        
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
            alert.innerHTML = \`
                <span class="alert-icon">🔄</span>
                <span class="alert-text">\${ag.action}</span>
                <span class="alert-time">\${this.formatTime(ag.time)}</span>
            \`;
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
        this.timerProgress.style.width = \`\${progress}%\`;
    }

    showAgitationAlert(action) {
        const alert = document.createElement('div');
        alert.className = 'agitation-alert';
        alert.innerHTML = \`
            <span class="alert-icon">🔄</span>
            <span class="alert-text">\${action}</span>
        \`;
        
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
        successDiv.innerHTML = \`
            <span class="success-icon">✅</span>
            <span>\${message}</span>
        \`;
        
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
        return \`\${mins.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`;
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