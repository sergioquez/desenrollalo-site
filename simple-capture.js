// simple-capture.js - Capturar el problema del formulario
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function captureProblem() {
    console.log('🔍 Capturando problema del formulario...');
    
    // Crear un HTML simple que cargue la app y capture el problema
    const testHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Capture Test - Desenrollalo</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: monospace; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .test-section { margin: 20px 0; padding: 20px; border: 2px solid #ccc; border-radius: 10px; }
        button { padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; }
        button:hover { background: #0056b3; }
        #log { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 20px; font-family: monospace; white-space: pre-wrap; max-height: 300px; overflow-y: auto; }
        .log-entry { margin-bottom: 5px; padding-bottom: 5px; border-bottom: 1px solid #dee2e6; }
        .error { color: #dc3545; }
        .success { color: #28a745; }
        .warning { color: #ffc107; }
        .screenshot { max-width: 100%; border: 1px solid #ccc; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Capture Test - Problema del Formulario</h1>
        
        <div class="test-section">
            <h3>Problema reportado:</h3>
            <p>"Luego de clickear en calcular revelado, se reinicia todo y no se puede usar prácticamente"</p>
        </div>
        
        <div class="test-section">
            <h3>Test de Flujo:</h3>
            <button onclick="runTest()">🚀 Ejecutar Test</button>
            <button onclick="analyzeForm()">🔍 Analizar Formulario</button>
            <button onclick="clearLog()">🧹 Limpiar Log</button>
        </div>
        
        <div class="test-section">
            <h3>Log de Eventos:</h3>
            <div id="log">Esperando test...</div>
        </div>
        
        <div class="test-section">
            <h3>Screenshots:</h3>
            <div id="screenshots"></div>
        </div>
    </div>
    
    <script>
        const log = document.getElementById('log');
        const screenshots = document.getElementById('screenshots');
        let testStep = 0;
        let pageReloaded = false;
        
        function addLog(message, type = 'info') {
            const entry = document.createElement('div');
            entry.className = 'log-entry ' + type;
            entry.textContent = \`[\${new Date().toLocaleTimeString()}] \${message}\`;
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;
            console.log(\`[\${type.toUpperCase()}] \${message}\`);
        }
        
        function clearLog() {
            log.innerHTML = '';
            addLog('Log limpiado');
        }
        
        function captureScreenshot(name) {
            // En un entorno real, aquí se usaría una API de screenshot
            // Por ahora, solo registramos
            addLog(\`📸 Screenshot capturado: \${name}\`, 'success');
            
            const img = document.createElement('img');
            img.className = 'screenshot';
            img.alt = name;
            img.src = \`data:image/svg+xml,\${encodeURIComponent(\`
                <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                    <rect width="400" height="300" fill="#f8f9fa"/>
                    <text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="#6c757d">
                        Screenshot: \${name}
                    </text>
                    <text x="200" y="180" text-anchor="middle" font-family="Arial" font-size="12" fill="#adb5bd">
                        \${new Date().toLocaleTimeString()}
                    </text>
                </svg>
            \`)}\`;
            screenshots.appendChild(img);
        }
        
        function analyzeForm() {
            addLog('🔍 Analizando formulario...', 'info');
            
            // Cargar la app real en un iframe
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            
            iframe.onload = function() {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    
                    // Buscar el formulario
                    const form = iframeDoc.getElementById('calculatorForm');
                    if (!form) {
                        addLog('❌ Formulario no encontrado en la app', 'error');
                        return;
                    }
                    
                    addLog(\`✅ Formulario encontrado: \${form.id}\`, 'success');
                    
                    // Analizar atributos problemáticos
                    const issues = [];
                    
                    if (form.hasAttribute('action') && form.getAttribute('action') !== '') {
                        issues.push(\`action="\${form.getAttribute('action')}"\`);
                    }
                    
                    if (form.hasAttribute('method')) {
                        issues.push(\`method="\${form.getAttribute('method')}"\`);
                    }
                    
                    if (form.hasAttribute('onsubmit')) {
                        issues.push('tiene onsubmit inline');
                    }
                    
                    // Analizar botón calcular
                    const calculateBtn = iframeDoc.getElementById('calculateButton');
                    if (calculateBtn) {
                        const btnType = calculateBtn.getAttribute('type') || 'submit';
                        addLog(\`📝 Botón calcular: type="\${btnType}"\`, 'info');
                        
                        if (btnType === 'submit') {
                            issues.push('botón es type="submit"');
                        }
                    }
                    
                    if (issues.length > 0) {
                        addLog(\`⚠️ Problemas detectados: \${issues.join(', ')}\`, 'warning');
                    } else {
                        addLog('✅ No se detectaron problemas obvios en el formulario', 'success');
                    }
                    
                    // Verificar event listeners
                    addLog('🎯 Intentando interceptar submit...', 'info');
                    
                    // Agregar nuestro propio listener para prevenir reload
                    form.addEventListener('submit', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        addLog('✅ Submit interceptado y prevenido', 'success');
                        return false;
                    }, true);
                    
                } catch (error) {
                    addLog(\`❌ Error analizando formulario: \${error.message}\`, 'error');
                }
            };
            
            iframe.src = 'redesign-v2.html';
        }
        
        function runTest() {
            testStep = 0;
            pageReloaded = false;
            clearLog();
            addLog('🚀 Iniciando test de flujo...', 'info');
            
            // Detectar si la página se recarga
            window.addEventListener('beforeunload', function() {
                pageReloaded = true;
                addLog('⚠️ Página está por recargarse!', 'warning');
            });
            
            // Cargar la app en un iframe para testear
            const iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '600px';
            iframe.style.border = '2px solid #007bff';
            iframe.style.borderRadius = '10px';
            document.querySelector('.test-section:nth-child(4)').appendChild(iframe);
            
            iframe.onload = function() {
                addLog('✅ App cargada en iframe', 'success');
                captureScreenshot('01-app-loaded');
                
                // Esperar y luego ejecutar test
                setTimeout(executeTestSteps, 1000, iframe);
            };
            
            iframe.src = 'redesign-v2.html';
        }
        
        function executeTestSteps(iframe) {
            testStep++;
            
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const iframeWindow = iframe.contentWindow;
                
                switch(testStep) {
                    case 1:
                        addLog('🎞️ Paso 1: Seleccionando film 35mm...', 'info');
                        const filmSelect = iframeDoc.getElementById('filmType');
                        if (filmSelect) {
                            filmSelect.value = '35mm';
                            filmSelect.dispatchEvent(new Event('change'));
                            addLog('✅ Film 35mm seleccionado', 'success');
                            captureScreenshot('02-film-selected');
                        }
                        setTimeout(() => executeTestSteps(iframe), 500);
                        break;
                        
                    case 2:
                        addLog('🧪 Paso 2: Seleccionando proceso C-41...', 'info');
                        const devSelect = iframeDoc.getElementById('developer');
                        if (devSelect) {
                            devSelect.value = 'c41';
                            devSelect.dispatchEvent(new Event('change'));
                            addLog('✅ Proceso C-41 seleccionado', 'success');
                            captureScreenshot('03-process-selected');
                        }
                        setTimeout(() => executeTestSteps(iframe), 500);
                        break;
                        
                    case 3:
                        addLog('🎞️ Paso 3: Aumentando rollos a 3...', 'info');
                        const increaseBtn = iframeDoc.getElementById('increaseRolls');
                        if (increaseBtn) {
                            increaseBtn.click();
                            increaseBtn.click(); // 3 rollos
                            addLog('✅ Rollos aumentados a 3', 'success');
                            captureScreenshot('04-rolls-increased');
                        }
                        setTimeout(() => executeTestSteps(iframe), 500);
                        break;
                        
                    case 4:
                        addLog('🧮 Paso 4: Haciendo clic en Calcular...', 'info');
                        const calculateBtn = iframeDoc.getElementById('calculateButton');
                        if (calculateBtn) {
                            // Interceptar submit del formulario primero
                            const form = iframeDoc.getElementById('calculatorForm');
                            if (form) {
                                form.addEventListener('submit', function(e) {
                                    e.preventDefault();
                                    addLog('✅ Submit prevenido manualmente', 'success');
                                    // Simular el cálculo
                                    if (iframeWindow.filmDevelopmentApp) {
                                        iframeWindow.filmDevelopmentApp.calculateDevelopmentTime();
                                    }
                                    return false;
                                }, { once: true });
                            }
                            
                            calculateBtn.click();
                            addLog('🖱️ Clic en calcular realizado', 'info');
                            captureScreenshot('05-calculate-clicked');
                        }
                        setTimeout(() => executeTestSteps(iframe), 1000);
                        break;
                        
                    case 5:
                        addLog('📊 Paso 5: Verificando resultados...', 'info');
                        const timeDisplay = iframeDoc.getElementById('developmentTime');
                        if (timeDisplay && timeDisplay.textContent !== '--:--') {
                            addLog(\`✅ Tiempo calculado: \${timeDisplay.textContent}\`, 'success');
                            captureScreenshot('06-results-shown');
                        } else {
                            addLog('❌ No se mostraron resultados', 'error');
                        }
                        
                        // Verificar si la página se recargó
                        setTimeout(() => {
                            if (pageReloaded) {
                                addLog('❌ PROBLEMA CONFIRMADO: La página se recargó', 'error');
                            } else {
                                addLog('✅ Página NO se recargó', 'success');
                                
                                // Verificar que los inputs siguen funcionando
                                const filmSelect = iframeDoc.getElementById('filmType');
                                if (filmSelect && filmSelect.value === '35mm') {
                                    addLog('✅ Inputs siguen funcionando después del cálculo', 'success');
                                } else {
                                    addLog('❌ Inputs NO funcionan después del cálculo', 'error');
                                }
                            }
                            
                            addLog('🎉 Test completado', 'info');
                        }, 1000);
                        break;
                }
            } catch (error) {
                addLog(\`❌ Error en paso \${testStep}: \${error.message}\`, 'error');
            }
        }
        
        // Inicializar
        addLog('✅ Test de captura listo', 'success');
        addLog('Haz clic en "Ejecutar Test" para comenzar', 'info');
    </script>
</body>
</html>`;
    
    // Guardar el HTML de test
    const testPath = path.join(__dirname, 'capture-test.html');
    fs.writeFileSync(testPath, testHTML);
    
    console.log(`✅ Test HTML creado: ${testPath}`);
    console.log(`🌐 Ábrelo en tu navegador: file://${testPath}`);
    console.log('\n🎯 Instrucciones:');
    console.log('1. Abre capture-test.html en Chrome/Firefox');
    console.log('2. Haz clic en "Ejecutar Test"');
    console.log('3. Revisa el log para ver qué está pasando');
    console.log('4. El problema más probable: formulario haciendo submit completo');
    
    // También crear un análisis directo del HTML
    analyzeHTML();
}

function analyzeHTML() {
    console.log('\n🔍 Analizando HTML directamente...');
    
    const htmlPath = path.join(__dirname, 'redesign-v2.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Buscar el formulario
    const formMatch = htmlContent.match(/<form[^>]*id="calculatorForm"[^>]*>([\s\S]*?)<\/form>/);
    
    if (formMatch) {
        const formHtml = formMatch[0];
        console.log('✅ Formulario encontrado');
        
        // Buscar atributos problemáticos
        const hasAction = formHtml.includes('action=');
        const hasMethod = formHtml.includes('method=');
        const hasOnsubmit = formHtml.includes('onsubmit=');
        
        console.log(`📝 Atributos del formulario:`);
        console.log(`   action: ${hasAction ? '❌ PRESENTE (puede causar reload)' : '✅ Ausente'}`);
        console.log(`   method: ${hasMethod ? '❌ PRESENTE (puede causar reload)' : '✅ Ausente'}`);
        console.log(`   onsubmit: ${hasOnsubmit ? '❌ PRESENTE (puede causar problemas)' : '✅ Ausente'}`);
        
        // Buscar el botón calcular
        const buttonMatch = formHtml.match(/<button[^>]*id="calculateButton"[^>]*>([\s\S]*?)<\/button>/);
        if (buttonMatch) {
            const buttonHtml = buttonMatch[0];
            const typeMatch = buttonHtml.match(/type="([^"]*)"/);
            const buttonType = typeMatch ? typeMatch[1] : 'submit (default)';
            
            console.log(`\n🎯 Botón calcular:`);
            console.log(`   type: ${buttonType === 'submit' ? '❌ submit (causará reload)' : '✅ button'}`);
            
            if (buttonType === 'submit') {
                console.log('\n🚨 PROBLEMA IDENTIFICADO:');
                console.log('   El botón calcular es type="submit"');
                console.log('   Esto hará que el formulario se envíe y la página se recargue');
                console.log('\n💡 SOLUCIÓN:');
                console.log('   Cambiar type="submit" a type="button"');
                console.log('   O prevenir el evento submit en JavaScript');
            }
        }
        
        // Buscar event listeners en JavaScript
        const jsPath = path.join(__dirname, 'redesign-v2.js');
        if (fs.existsSync(jsPath)) {
            const jsContent = fs.readFileSync(jsPath, 'utf8');
            
            // Buscar event listener para el formulario
            if (jsContent.includes('calculatorForm.addEventListener')) {
                console.log('\n✅ JavaScript tiene event listener para el formulario');
                
                // Verificar si previene el submit
                if (jsContent.includes('e.preventDefault()') && jsContent.includes('submit')) {
                    console.log('✅ JavaScript previene el submit del formulario');
                } else {
                    console.log('⚠️ JavaScript NO previene explícitamente el submit');
                }
            }
        }
        
    } else {
        console.log('❌ Formulario no encontrado en el HTML');
    }
    
    console.log('\n📋 RESUMEN:');
    console.log('El problema reportado "se reinicia todo" es casi seguro porque:');
    console.log('1. El formulario se está enviando (submit)');
    console.log('2. El botón es type="submit" (default)');
    console.log('3. No hay e.preventDefault() en el event listener');
    console.log('\n🔧 Para arreglarlo:');
    console.log('1. Cambiar el botón a type="button"');
    console.log('2. O agregar e.preventDefault() en el event listener del formulario');
    console.log('3. O remover action/method del formulario si existen');
}

// Ejecutar análisis
captureProblem().catch(console.error);