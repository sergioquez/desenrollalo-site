# AGENT_BRIEFS.md - Especificaciones para Sub-Agentes

## 📋 Agente 1: Frontend Developer

**Responsabilidades:**
- Correcciones críticas de JavaScript
- Implementación de nuevas funcionalidades
- Integración con localStorage
- Mantenimiento de código base

**Tareas específicas:**
1. **Fix recursión JS** - `calculateDevelopmentTime` llama a sí misma
2. **Add progress-bar** - Crear elemento HTML y actualizar en JS
3. **Create assets/** - Directorio con `alert.mp3` (placeholder o real)
4. **Implement localStorage** - Guardar configuraciones de usuario

**Archivos a modificar:**
- `app.js` - Correcciones y nuevas funciones
- `index.html` - Agregar progress-bar
- Crear `assets/alert.mp3` (puede ser placeholder)

**Criterios de éxito:**
- Cronómetro funciona sin errores en consola
- Progress-bar muestra progreso real
- Configuraciones persisten entre sesiones
- 0 warnings en console

---

## 🎨 Agente 2: UX/UI Designer

**Responsabilidades:**
- Mejoras de experiencia de usuario
- Diseño responsive
- Estados visuales y feedback
- Sistema de temas (dark/light)

**Tareas específicas:**
1. **Responsive design** - Mobile-first, tablet, desktop
2. **Button states** - Hover, active, disabled
3. **Form validation** - Visual feedback para errores
4. **Dark/light toggle** - Sistema de temas completo

**Archivos a modificar:**
- `style.css` - Mejoras responsive y estados
- `index.html` - Estructura para temas
- `app.js` - Lógica de toggle tema

**Criterios de éxito:**
- Pasa Lighthouse Accessibility > 90
- Funciona en viewports 320px - 1920px
- Estados visuales claros para todas las interacciones
- Tema cambia sin FOUC (flash of unstyled content)

---

## 🧪 Agente 3: QA Tester

**Responsabilidades:**
- Pruebas end-to-end manuales
- Validación de funcionalidades
- Testing cross-browser
- Reporte de bugs

**Tareas específicas:**
1. **Testing manual cronómetro** - Inicio, parada, reset, precisión
2. **Testing calculadora** - Cálculos correctos, validación inputs
3. **Testing alertas** - Sonido funciona, timing correcto
4. **Cross-browser testing** - Chrome, Firefox, Safari, Edge

**Herramientas:**
- Browser DevTools
- Lighthouse
- Responsive design mode
- Console error checking

**Criterios de éxito:**
- 0 bugs críticos reportados
- Todas las funcionalidades validadas
- Documentación de pruebas completa
- Lista de issues priorizada

---

## 🚀 Agente 4: DevOps Engineer

**Responsabilidades:**
- CI/CD pipeline
- Auto-deployment
- Health monitoring
- Performance optimization

**Tareas específicas:**
1. **Setup GitHub Actions** - Build y deploy automático
2. **Auto-deploy pipeline** - Push to main → deploy Pages
3. **Health monitoring** - Uptime checks, error tracking
4. **Performance checks** - Load time, bundle size

**Archivos a crear:**
- `.github/workflows/deploy.yml`
- `package.json` (si es necesario)
- `health-check.js` (opcional)

**Criterios de éxito:**
- Deploy automático en < 5 minutos
- 100% uptime (excepto durante deploy)
- Load time < 3s
- Error rate < 1%

---

## 🔄 Flujo de Trabajo

### Día 1-2: Desarrollo Inicial
- **Frontend**: Correcciones críticas
- **UX/UI**: Diseño base responsive
- **QA**: Preparación plan de pruebas
- **DevOps**: Setup pipeline básico

### Día 3-4: Integración
- **Frontend + UX/UI**: Integrar mejoras visuales
- **QA**: Testing inicial
- **DevOps**: Pipeline funcional

### Día 5-6: Testing & Feedback
- **QA**: Testing exhaustivo
- **Todos**: Revisión de bugs
- **Frontend**: Fixes basados en feedback

### Día 7-8: Deployment & Monitor
- **DevOps**: Deploy a producción
- **QA**: Smoke testing post-deploy
- **Todos**: Monitor 24h

---

## 📊 Métricas por Agente

**Frontend:**
- Lines of code changed
- Bugs fixed
- Features implemented
- Console errors resolved

**UX/UI:**
- Lighthouse scores
- Responsive breakpoints
- Interaction states
- Theme completeness

**QA:**
- Test cases executed
- Bugs found/fixed
- Browser compatibility
- User flow coverage

**DevOps:**
- Deployment time
- Uptime percentage
- Load time
- Error rate

---

## 🎯 Puntos de Integración

1. **Frontend → UX/UI**: CSS classes naming convention
2. **Frontend → QA**: Feature flags para testing
3. **UX/UI → QA**: Design system documentation
4. **DevOps → Todos**: Deployment notifications
5. **QA → Todos**: Bug report templates

---

## 📞 Comunicación

- **Daily standup**: 10 min sync por agente
- **Integration meetings**: Cuando features están listas
- **Bug triage**: Diario para priorizar fixes
- **Demo sessions**: Cada feature completada

---

**Estado**: Briefs creados - Listo para spawn de agentes