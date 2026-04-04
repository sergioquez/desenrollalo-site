// debug.js - Herramientas de debugging para Desenrollalo

// Estado global
const debugState = {
    logs: [],
    startTime: Date.now(),
    lastCheck: null
};

// Utilidades de logging
function log(section, message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
        timestamp,
        section,
        message,
        type
    };
    
    debugState.logs.push(logEntry);
    
    // Actualizar UI
    const logContainer = document.getElementById(`${section}Log`);
    if (logContainer) {
        const logElement = document.createElement('div');
        logElement.className = `log-entry ${type}`;
        logElement.innerHTML = `[${timestamp}] ${message}`;
        logContainer.appendChild(logElement);
        logContainer.scrollTop = logContainer.scrollHeight;
    }
    
    // También log a consola
    const consoleMethod = type === 'error' ? 'error' : 
                         type === 'warning' ? 'warn' : 'log';
    console[consoleMethod](`[${section}] ${message}`);
    
    // Actualizar última verificación
    const lastCheckElement = document.getElementById('lastCheck');
    if (lastCheckElement) {
        lastCheckElement.textContent = timestamp;
    }
}

// 1. Estado del Sitio
async function checkSiteStatus() {
    log('status', 'Iniciando verificación de estado del sitio...', 'info');
    
    try {
        // Verificar si estamos en GitHub Pages
        const isGitHubPages = window.location.hostname.includes('github.io');
        log('status', `Hostname: ${window.location.hostname}`, 'info');
        log('status', `GitHub Pages: ${isGitHubPages ? '✅ Sí' : '❌ No'}`, isGitHubPages ? 'success' : 'warning');
        
        // Verificar conexión a internet
        const online = navigator.onLine;
        log('status', `Conexión a internet: ${online ? '✅ Online' : '❌ Offline'}`, online ? 'success' : 'error');
        
        // Verificar HTTPS
        const isHTTPS = window.location.protocol === 'https:';
        log('status', `Protocolo: ${window.location.protocol} ${isHTTPS ? '✅ Seguro' : '⚠️ No seguro'}`, isHTTPS ? 'success' : 'warning');
        
        // Actualizar UI
        const statusDiv = document.getElementById('siteStatus');
        if (statusDiv) {
            statusDiv.innerHTML = `
                <p><span class="status-indicator ${online ? 'status-online' : 'status-offline'}"></span> ${online ? 'Online' : 'Offline'}</p>
                <p><span class="status-indicator ${isHTTPS ? 'status-online' : 'status-warning'}"></span> ${isHTTPS ? 'HTTPS Seguro' : 'HTTP No seguro'}</p>
                <p><span class="status-indicator ${isGitHubPages ? 'status-online' : 'status-warning'}"></span> ${isGitHubPages ? 'GitHub Pages' : 'Hosting diferente'}</p>
            `;
        }
        
        log('status', '✅ Verificación de estado completada', 'success');
    } catch (error) {
        log('status', `❌ Error verificando estado: ${error.message}`, 'error');
    }
}

// 2. Archivos Críticos
async function checkCriticalFiles() {
    log('status', 'Verificando archivos críticos...', 'info');
    
    const criticalFiles = [
        { name: 'index.html', path: 'index.html', required: true },
        { name: 'style.css', path: 'style.css', required: true },
        { name: 'app.js', path: 'app.js', required: true },
        { name: 'debug.html', path: 'debug.html', required: false },
        { name: 'debug.js', path: 'debug.js', required: false },
        { name: 'assets/alert.mp3', path: 'assets/alert.mp3', required: false }
    ];
    
    const fileList = document.getElementById('fileList');
    if (fileList) {
        fileList.innerHTML = '';
        
        for (const file of criticalFiles) {
            try {
                const response = await fetch(file.path, { method: 'HEAD' });
                const exists = response.ok;
                
                const li = document.createElement('li');
                li.innerHTML = `
                    ${file.name}
                    <span class="file-status ${exists ? 'exists' : file.required ? 'missing' : 'exists'}">
                        ${exists ? '✅ Existe' : file.required ? '❌ Faltante' : '⚠️ Opcional'}
                    </span>
                `;
                fileList.appendChild(li);
                
                log('status', `${file.name}: ${exists ? '✅ Existe' : file.required ? '❌ FALTANTE' : '⚠️ Opcional'}`, 
                    exists ? 'success' : (file.required ? 'error' : 'warning'));
            } catch (error) {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${file.name}
                    <span class="file-status missing">
                        ❌ Error
                    </span>
                `;
                fileList.appendChild(li);
                
                log('status', `${file.name}: ❌ Error verificando`, 'error');
            }
        }
    }
    
    log('status', '✅ Verificación de archivos completada', 'success');
}

// 3. JavaScript - Probando app.js
function testAppJS() {
    log('js', 'Probando app.js...', 'info');
    
    try {
        // Verificar si app.js está cargado
        const scripts = Array.from(document.scripts);
        const appScript = scripts.find(s => s.src.includes('app.js'));
        
        if (appScript) {
            log('js', '✅ app.js está cargado en el documento', 'success');
        } else {
            log('js', '⚠️ app.js no encontrado en document.scripts', 'warning');
        }
        
        // Verificar si FilmDevelopmentApp existe
        if (typeof FilmDevelopmentApp === 'function') {
            log('js', '✅ FilmDevelopmentApp es una función', 'success');
            
            // Intentar instanciar
            try {
                const testApp = new FilmDevelopmentApp();
                log('js', '✅ FilmDevelopmentApp se puede instanciar', 'success');
                
                // Verificar métodos básicos
                if (typeof testApp.calculateDevelopmentTime === 'function') {
                    log('js', '✅ calculateDevelopmentTime() existe', 'success');
                }
                
                if (typeof testApp.startStepByStepGuide === 'function') {
                    log('js', '✅ startStepByStepGuide() existe', 'success');
                }
                
            } catch (error) {
                log('js', `❌ Error instanciando FilmDevelopmentApp: ${error.message}`, 'error');
            }
        } else {
            log('js', '❌ FilmDevelopmentApp NO está definido', 'error');
        }
        
    } catch (error) {
        log('js', `❌ Error probando app.js: ${error.message}`, 'error');
    }
}

// 3.2 Test del botón calcular
function testCalculateButton() {
    log('js', 'Probando funcionalidad del botón calcular...', 'info');
    
    try {
        // Crear elementos de prueba
        const testContainer = document.createElement('div');
        testContainer.style.cssText = 'position: fixed; top: 10px; right: 10px; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.2); z-index: 10000;';
        
        testContainer.innerHTML = `
            <h3 style="margin: 0 0 10px 0;">🧪 Test Botón Calcular</h3>
            <select id="testFilmType" style="padding: 8px; margin: 5px; border-radius: 5px;">
                <option value="35mm">35mm</option>
                <option value="120mm">120mm</option>
            </select>
            <select id="testDeveloper" style="padding: 8px; margin: 5px; border-radius: 5px;">
                <option value="c41">C-41</option>
                <option value="d76">D-76</option>
            </select>
            <button id="testCalculateBtn" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 5px; margin: 5px;">
                Probar Calcular
            </button>
            <button onclick="this.parentElement.remove()" style="padding: 5px 10px; background: #ef4444; color: white; border: none; border-radius: 5px; margin: 5px;">
                Cerrar
            </button>
            <div id="testResult" style="margin-top: 10px; padding: 10px; background: #f3f4f6; border-radius: 5px;"></div>
        `;
        
        document.body.appendChild(testContainer);
        
        // Configurar event listener
        document.getElementById('testCalculateBtn').addEventListener('click', function() {
            const filmType = document.getElementById('testFilmType').value;
            const developer = document.getElementById('testDeveloper').value;
            
            const resultDiv = document.getElementById('testResult');
            resultDiv.innerHTML = `
                <p>✅ Botón funciona correctamente</p>
                <p>Película: ${filmType}</p>
                <p>Revelador: ${developer}</p>
                <p>Timestamp: ${new Date().toLocaleTimeString()}</p>
            `;
            
            log('js', `✅ Botón calcular probado: ${filmType}, ${developer}`, 'success');
        });
        
        log('js', '✅ Test del botón calcular iniciado', 'success');
        
    } catch (error) {
        log('js', `❌ Error probando botón calcular: ${error.message}`, 'error');
    }
}

// 4. CSS
function testCSS() {
    log('css', 'Probando CSS...', 'info');
    
    try {
        // Verificar si style.css está cargado
        const links = Array.from(document.styleSheets);
        const styleCSS = links.find(link => link.href && link.href.includes('style.css'));
        
        if (styleCSS) {
            log('css', '✅ style.css está cargado', 'success');
            document.getElementById('cssLoaded').textContent = '✅ Cargado';
        } else {
            log('css', '❌ style.css NO está cargado', 'error');
            document.getElementById('cssLoaded').textContent = '❌ No cargado';
        }
        
        // Verificar variables CSS
        const rootStyles = getComputedStyle(document.documentElement);
        const cssVariables = [
            '--primary',
            '--bg-primary',
            '--text-primary',
            '--space-md',
            '--radius-md'
        ];
        
        let variablesFound = 0;
        cssVariables.forEach(variable => {
            try {
                const value = rootStyles.getPropertyValue(variable);
                if (value && value.trim() !== '') {
                    variablesFound++;
                    log('css', `✅ ${variable}: ${value}`, 'success');
                } else {
                    log('css', `⚠️ ${variable}: No definida`, 'warning');
                }
            } catch (error) {
                log('css', `❌ Error obteniendo ${variable}`, 'error');
            }
        });
        
        document.getElementById('cssVariables').textContent = `${variablesFound}/${cssVariables.length} definidas`;
        
        // Test de responsive
        const width = window.innerWidth;
        const height = window.innerHeight;
        log('css', `📱 Viewport: ${width}x${height}px`, 'info');
        
    } catch (error) {
        log('css', `❌ Error probando CSS: ${error.message}`, 'error');
    }
}

// 5. Performance
function testPerformance() {
    log('performance', 'Midiendo performance...', 'info');
    
    try {
        // Tiempo de carga
        const loadTime = Date.now() - debugState.startTime;
        debugState.performance = debugState.performance || {};
        debugState.performance.loadTime = loadTime;
        document.getElementById('loadTime').textContent = `${loadTime} ms`;
        log('performance', `⏱️ Tiempo de carga: ${loadTime}ms`, 'info');
        
        // Memoria (si está disponible)
        if (performance && performance.memory) {
            const memory = performance.memory;
            const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
            const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
            debugState.performance.memory = usedMB;
            document.getElementById('jsMemory').textContent = `${usedMB} MB / ${totalMB} MB`;
            log('performance', `💾 Memoria JS: ${usedMB}MB / ${totalMB}MB`, 'info');
        }
        
        log('performance', '✅ Medición de performance completada', 'success');
        
    } catch (error) {
        log('performance', `❌ Error midiendo performance: ${error.message}`, 'error');
    }
}

// 6. Herramientas
function clearConsole() {
    console.clear();
    log('tools', '🧹 Consola limpiada', 'success');
    
    // Limpiar logs en UI
    const logContainers = document.querySelectorAll('.log-container');
    logContainers.forEach(container => {
        container.innerHTML = '';
    });
}

function reloadPage() {
    log('tools', '🔄 Recargando página...', 'info');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

function testLocalStorage() {
    log('tools', 'Probando localStorage...', 'info');
    
    try {
        // Test básico
        const testKey = 'debug_test_' + Date.now();
        const testValue = 'test_value_' + Math.random();
        
        localStorage.setItem(testKey, testValue);
        const retrievedValue = localStorage.getItem(testKey);
        
        if (retrievedValue === testValue) {
            log('tools', '✅ localStorage funciona correctamente', 'success');
        } else {
            log('tools', '❌ localStorage NO funciona correctamente', 'error');
        }
        
    } catch (error) {
        log('tools', `❌ Error probando localStorage: ${error.message}`, 'error');
    }
}

function simulateError() {
    log('tools', 'Simulando error...', 'warning');
    
    try {
        // Forzar un error
        throw new Error('Este es un error simulado para testing');
    } catch (error) {
        log('tools', `✅ Error simulado capturado: ${error.message}`, 'success');
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    log('init', '🔧 Debug Tool inicializado', 'success');
    
    // Ejecutar verificaciones iniciales
    setTimeout(() => {
        checkSiteStatus();
        checkCriticalFiles();
        testCSS();
        testPerformance();
    }, 500);
});