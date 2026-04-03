const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runTest() {
    console.log('🚀 Iniciando test E2E de Desenrollalo...');
    
    const browser = await chromium.launch({ 
        headless: false, // Mostrar navegador para ver qué pasa
        slowMo: 500, // Más lento para ver mejor
    });
    
    const context = await browser.newContext({
        viewport: { width: 375, height: 667 }, // iPhone 6/7/8
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
    });
    
    const page = await context.newPage();
    
    try {
        // Crear directorio para screenshots
        const screenshotDir = path.join(__dirname, 'playwright-screenshots');
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }
        
        // 1. Navegar a la página local
        console.log('📱 Navegando a la página local...');
        const filePath = `file://${path.join(__dirname, 'redesign-v2.html')}`;
        await page.goto(filePath);
        await page.screenshot({ path: path.join(screenshotDir, '01-inicio.png') });
        
        // Esperar a que cargue la app
        await page.waitForTimeout(2000);
        
        // 2. Verificar que la pantalla de loading desapareció
        console.log('🔍 Verificando carga inicial...');
        const loadingVisible = await page.locator('#appLoading').isVisible();
        console.log(`   Pantalla de loading visible: ${loadingVisible}`);
        
        // 3. Seleccionar tipo de película
        console.log('🎞️ Seleccionando tipo de película...');
        await page.selectOption('#filmType', '35mm');
        await page.screenshot({ path: path.join(screenshotDir, '02-film-selected.png') });
        await page.waitForTimeout(500);
        
        // 4. Seleccionar proceso
        console.log('🧪 Seleccionando proceso...');
        await page.selectOption('#developer', 'c41');
        await page.screenshot({ path: path.join(screenshotDir, '03-developer-selected.png') });
        await page.waitForTimeout(500);
        
        // 5. Aumentar número de rollos
        console.log('🎞️ Aumentando rollos...');
        await page.click('#increaseRolls');
        await page.click('#increaseRolls'); // 3 rollos total
        await page.screenshot({ path: path.join(screenshotDir, '04-rolls-increased.png') });
        await page.waitForTimeout(500);
        
        // 6. Hacer clic en calcular
        console.log('🧮 Haciendo clic en "Calcular Tiempo de Revelado"...');
        await page.click('#calculateButton');
        await page.screenshot({ path: path.join(screenshotDir, '05-calculate-clicked.png') });
        await page.waitForTimeout(1000);
        
        // 7. Verificar resultados
        console.log('📊 Verificando resultados...');
        const timeDisplay = await page.locator('#developmentTime').textContent();
        console.log(`   Tiempo mostrado: ${timeDisplay}`);
        
        const processName = await page.locator('#processName').textContent();
        console.log(`   Proceso: ${processName}`);
        
        const filmTypeResult = await page.locator('#filmTypeResult').textContent();
        console.log(`   Película: ${filmTypeResult}`);
        
        const rollsResult = await page.locator('#rollsResult').textContent();
        console.log(`   Rollos: ${rollsResult}`);
        
        await page.screenshot({ path: path.join(screenshotDir, '06-results-shown.png') });
        
        // 8. Verificar si hay algún error en consola
        console.log('⚠️ Revisando errores en consola...');
        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
                console.log(`   CONSOLE ERROR: ${msg.text()}`);
            }
        });
        
        // 9. Hacer clic en "Iniciar Guía Paso a Paso"
        console.log('🎯 Intentando iniciar guía paso a paso...');
        const startGuideButton = page.locator('#startGuideButton');
        const isGuideButtonVisible = await startGuideButton.isVisible();
        console.log(`   Botón de guía visible: ${isGuideButtonVisible}`);
        
        if (isGuideButtonVisible) {
            await startGuideButton.click();
            await page.waitForTimeout(1000);
            await page.screenshot({ path: path.join(screenshotDir, '07-guide-started.png') });
            
            // 10. Verificar carrusel
            console.log('🔄 Verificando carrusel...');
            const carouselVisible = await page.locator('#carouselSection').isVisible();
            console.log(`   Carrusel visible: ${carouselVisible}`);
            
            if (carouselVisible) {
                const stepTitle = await page.locator('#stepTitle').textContent();
                console.log(`   Título del paso: ${stepTitle}`);
                
                // 11. Navegar por el carrusel
                console.log('⏭️ Probando navegación del carrusel...');
                await page.click('#nextButton');
                await page.waitForTimeout(500);
                await page.screenshot({ path: path.join(screenshotDir, '08-next-step.png') });
                
                const stepTitle2 = await page.locator('#stepTitle').textContent();
                console.log(`   Título después de next: ${stepTitle2}`);
                
                // 12. Volver atrás
                await page.click('#prevButton');
                await page.waitForTimeout(500);
                await page.screenshot({ path: path.join(screenshotDir, '09-prev-step.png') });
            }
        }
        
        // 13. Verificar estado final
        console.log('📋 Estado final de la aplicación...');
        
        // Verificar si los inputs todavía funcionan
        await page.selectOption('#filmType', '120mm');
        await page.waitForTimeout(300);
        const filmTypeValue = await page.locator('#filmType').inputValue();
        console.log(`   Film type después de cambio: ${filmTypeValue}`);
        
        await page.screenshot({ path: path.join(screenshotDir, '10-final-state.png') });
        
        // 14. Resumen del test
        console.log('\n📊 RESUMEN DEL TEST:');
        console.log('===================');
        console.log(`✅ Página cargada: ${!loadingVisible}`);
        console.log(`✅ Inputs funcionaron: ${filmTypeValue === '120mm'}`);
        console.log(`✅ Cálculo mostrado: ${timeDisplay !== '--:--'}`);
        console.log(`✅ Botón guía visible: ${isGuideButtonVisible}`);
        console.log(`✅ Errores en consola: ${consoleErrors.length}`);
        
        if (consoleErrors.length > 0) {
            console.log('\n❌ ERRORES ENCONTRADOS:');
            consoleErrors.forEach((error, i) => {
                console.log(`   ${i + 1}. ${error}`);
            });
        }
        
        // 15. Diagnosticar problema específico
        console.log('\n🔍 DIAGNÓSTICO DEL PROBLEMA REPORTADO:');
        console.log('====================================');
        
        // Verificar si hay algún event listener problemático
        const problematicCode = await page.evaluate(() => {
            const issues = [];
            
            // Verificar event listeners en el botón calcular
            const calculateBtn = document.getElementById('calculateButton');
            if (calculateBtn) {
                const listeners = getEventListeners(calculateBtn);
                if (listeners && listeners.click) {
                    issues.push(`Botón calcular tiene ${listeners.click.length} listeners click`);
                }
            }
            
            // Verificar si el formulario hace submit completo
            const form = document.getElementById('calculatorForm');
            if (form) {
                const formListeners = getEventListeners(form);
                if (formListeners && formListeners.submit) {
                    issues.push(`Formulario tiene listeners submit`);
                }
            }
            
            // Verificar estado de la aplicación
            if (window.filmDevelopmentApp) {
                issues.push(`Aplicación JS cargada: ${typeof window.filmDevelopmentApp}`);
                issues.push(`Estado actual: ${JSON.stringify(window.filmDevelopmentApp.state)}`);
            } else {
                issues.push('❌ Aplicación JS NO cargada');
            }
            
            // Verificar si hay redirección o reload
            const currentURL = window.location.href;
            issues.push(`URL actual: ${currentURL}`);
            
            return issues;
        }).catch(err => {
            return [`Error en diagnóstico: ${err.message}`];
        });
        
        console.log('   ' + problematicCode.join('\n   '));
        
        // 16. Crear reporte HTML
        createHTMLReport(screenshotDir, {
            loadingVisible,
            filmTypeValue,
            timeDisplay,
            isGuideButtonVisible,
            consoleErrors,
            problematicCode
        });
        
        console.log('\n🎉 Test completado. Revisa los screenshots en:', screenshotDir);
        console.log('📄 Reporte generado:', path.join(screenshotDir, 'report.html'));
        
    } catch (error) {
        console.error('❌ Error durante el test:', error);
        await page.screenshot({ path: path.join(screenshotDir, 'error.png') });
    } finally {
        await browser.close();
    }
}

function createHTMLReport(screenshotDir, results) {
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📊 Reporte E2E - Desenrollalo</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; max-width: 1200px; margin: 0 auto; }
        h1 { color: #2563eb; margin-bottom: 20px; }
        .section { margin: 30px 0; padding: 20px; border: 2px solid #e5e7eb; border-radius: 10px; }
        .section-title { color: #1f2937; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
        .result-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .result-card { padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
        .result-card.success { background: #d1fae5; border-color: #10b981; }
        .result-card.error { background: #fee2e2; border-color: #ef4444; }
        .result-card.warning { background: #fef3c7; border-color: #f59e0b; }
        .screenshot-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 20px; }
        .screenshot { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
        .screenshot img { width: 100%; height: auto; display: block; }
        .screenshot-caption { padding: 10px; background: #f9fafb; font-size: 12px; color: #6b7280; }
        .error-list { background: #fee2e2; padding: 15px; border-radius: 8px; margin-top: 10px; }
        .error-item { padding: 5px 0; border-bottom: 1px solid #fca5a5; }
        .error-item:last-child { border-bottom: none; }
        .status { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 12px; margin-left: 10px; }
        .status.success { background: #10b981; color: white; }
        .status.error { background: #ef4444; color: white; }
        .status.warning { background: #f59e0b; color: white; }
    </style>
</head>
<body>
    <h1>📊 Reporte E2E - Desenrollalo Rediseño</h1>
    <p>Generado: ${new Date().toLocaleString()}</p>
    
    <div class="section">
        <h2 class="section-title">📋 Resumen de Resultados</h2>
        <div class="result-grid">
            <div class="result-card ${results.loadingVisible ? 'error' : 'success'}">
                <strong>Pantalla de Loading</strong>
                <span class="status ${results.loadingVisible ? 'error' : 'success'}">
                    ${results.loadingVisible ? '❌ Visible' : '✅ Ocultada'}
                </span>
                <p>Debe desaparecer después de 1.5s</p>
            </div>
            
            <div class="result-card ${results.filmTypeValue === '120mm' ? 'success' : 'error'}">
                <strong>Inputs Funcionando</strong>
                <span class="status ${results.filmTypeValue === '120mm' ? 'success' : 'error'}">
                    ${results.filmTypeValue === '120mm' ? '✅ Sí' : '❌ No'}
                </span>
                <p>Film type cambiado a: ${results.filmTypeValue || 'N/A'}</p>
            </div>
            
            <div class="result-card ${results.timeDisplay && results.timeDisplay !== '--:--' ? 'success' : 'error'}">
                <strong>Cálculo Mostrado</strong>
                <span class="status ${results.timeDisplay && results.timeDisplay !== '--:--' ? 'success' : 'error'}">
                    ${results.timeDisplay && results.timeDisplay !== '--:--' ? '✅ Sí' : '❌ No'}
                </span>
                <p>Tiempo: ${results.timeDisplay || 'No mostrado'}</p>
            </div>
            
            <div class="result-card ${results.isGuideButtonVisible ? 'success' : 'warning'}">
                <strong>Botón Guía Visible</strong>
                <span class="status ${results.isGuideButtonVisible ? 'success' : 'warning'}">
                    ${results.isGuideButtonVisible ? '✅ Sí' : '⚠️ No'}
                </span>
                <p>Después del cálculo</p>
            </div>
        </div>
    </div>
    
    <div class="section">
        <h2 class="section-title">⚠️ Errores en Consola</h2>
        ${results.consoleErrors.length > 0 ? `
            <div class="error-list">
                ${results.consoleErrors.map((error, i) => `
                    <div class="error-item">
                        <strong>Error ${i + 1}:</strong> ${error}
                    </div>
                `).join('')}
            </div>
        ` : '<p>✅ No se encontraron errores en consola</p>'}
    </div>
    
    <div class="section">
        <h2 class="section-title">🔍 Diagnóstico del Problema</h2>
        <div class="result-card warning">
            <strong>Información de Depuración:</strong>
            <ul style="margin-top: 10px; padding-left: 20px;">
                ${results.problematicCode ? results.problematicCode.map(item => `<li>${item}</li>`).join('') : '<li>No se pudo obtener diagnóstico</li>'}
            </ul>
        </div>
    </div>
    
    <div class="section">
        <h2 class="section-title">📸 Screenshots del Flujo</h2>
        <div class="screenshot-grid">
            ${['01-inicio.png', '02-film-selected.png', '03-developer-selected.png', 
               '04-rolls-increased.png', '05-calculate-clicked.png', '06-results-shown.png',
               '07-guide-started.png', '08-next-step.png', '09-prev-step.png', '10-final-state.png']
               .map(filename => `
                <div class="screenshot">
                    <img src="${filename}" alt="${filename}">
                    <div class="screenshot-caption">${filename.replace('.png', '').replace('-', ' ')}</div>
                </div>
               `).join('')}
        </div>
    </div>
    
    <div class="section">
        <h2 class="section-title">🎯 Recomendaciones</h2>
        <div class="result-grid">
            <div class="result-card">
                <strong>Problema Reportado:</strong>
                <p>"Luego de clickear en calcular revelado, se reinicia todo y no se puede usar prácticamente"</p>
            </div>
            <div class="result-card">
                <strong>Posibles Causas:</strong>
                <ul style="margin-top: 10px; padding-left: 20px;">
                    <li>Formulario haciendo submit completo (page reload)</li>
                    <li>JavaScript error que reinicia la aplicación</li>
                    <li>Event listeners conflictivos</li>
                    <li>Problema con localStorage o session</li>
                </ul>
            </div>
        </div>
    </div>
</body>
</html>`;
    
    fs.writeFileSync(path.join(screenshotDir, 'report.html'), html);
}