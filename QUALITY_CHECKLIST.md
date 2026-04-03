# QUALITY_CHECKLIST.md - Checklist de Calidad para Desenrollalo

## 🎯 Propósito
Este checklist documenta las lecciones aprendidas durante el rediseño v2.0 y asegura que futuros cambios mantengan la calidad.

## 📋 Checklist de Desarrollo

### ✅ ANTES de cada commit

#### 1. Validación de Código
- [ ] `node -c redesign-v2.js` - Sin errores de sintaxis
- [ ] CSS válido - Todas las variables definidas
- [ ] HTML válido - Etiquetas cerradas correctamente
- [ ] No console.errors - Consola limpia

#### 2. Testing Local
- [ ] Abrir `redesign-v2.html` en navegador local
- [ ] Pantalla de loading desaparece después de 1.5s
- [ ] Todos los inputs funcionan (selects, botones)
- [ ] Cálculo de tiempos funciona
- [ ] Carrusel se inicia correctamente

#### 3. Responsive Design
- [ ] 320px (móvil pequeño) - Sin horizontal scroll
- [ ] 768px (tablet) - Layout adaptado
- [ ] 1024px (desktop) - Espaciado adecuado
- [ ] Touch targets ≥44px

#### 4. Accesibilidad
- [ ] Contraste WCAG AA (4.5:1 mínimo)
- [ ] ARIA labels en elementos interactivos
- [ ] Navegación por teclado funciona
- [ ] Zoom hasta 500% permitido

### ✅ DESPUÉS de cada push

#### 1. Verificación de Deploy
- [ ] Esperar 1-3 minutos para GitHub Pages
- [ ] Probar URL pública: https://sergioquez.github.io/desenrollalo-site/redesign-v2.html
- [ ] Todos los assets cargan (CSS, JS, imágenes)
- [ ] No errores 404

#### 2. Testing en Producción
- [ ] Ejecutar `test-inputs.html` en producción
- [ ] Ejecutar `simple-test.html` en producción
- [ ] Probar en dispositivo móvil real
- [ ] Verificar que theme toggle funciona

#### 3. Performance
- [ ] Loading time < 3 segundos en 3G
- [ ] First Contentful Paint < 1.5 segundos
- [ ] No recursos bloqueantes
- [ ] Bundle size razonable (< 100KB CSS+JS)

### ✅ PARA nuevos features

#### 1. Mobile-First
- [ ] Diseñado primero para 320px
- [ ] Touch-friendly (sin `preventDefault()` problemático)
- [ ] Inputs optimizados para teclados virtuales
- [ ] Sin dependencias de hover en móvil

#### 2. Progressive Enhancement
- [ ] Funcionalidad básica sin JavaScript
- [ ] Mejoras progresivas con JS
- [ ] Fallbacks para features no soportadas
- [ ] Graceful degradation

#### 3. Testing
- [ ] Test específico creado para la feature
- [ ] Test cubre casos edge
- [ ] Test ejecutable localmente
- [ ] Test documentado

## 🚨 Patrones de Problemas a EVITAR

### ❌ Anti-Patrones (NUNCA HACER)

#### 1. Bloqueo de Inputs
```javascript
// ❌ NUNCA HACER ESTO
document.addEventListener('touchstart', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        e.preventDefault(); // ¡BLOQUEA INPUTS!
    }
});
```

#### 2. CSS Incompleto
```css
/* ❌ NUNCA DEJAR CSS TRUNCADO */
/* Falta: variables, animaciones, responsive */
```

#### 3. JavaScript Corrupto
```javascript
// ❌ NUNCA MEZCLAR HTML EN JS
<li>NO tocar emulsión mientras está húmeda</li>
// ↑ Esto es HTML, no JavaScript válido
```

#### 4. Dependencia de Deploy para Testing
```bash
# ❌ NUNCA ESPERAR DEPLOY PARA PROBAR
git push && sleep 180 && curl # ← Demasiado lento
# ✅ PROBAR LOCALMENTE PRIMERO
open redesign-v2.html # ← Inmediato
```

### ✅ Patrones de Éxito (SIEMPRE HACER)

#### 1. Validación Temprana
```bash
# ✅ SIEMPRE VALIDAR ANTES DE COMMIT
node -c archivo.js        # Sintaxis JS
python -m py_compile *.py # Sintaxis Python
```

#### 2. Testing Estratificado
```html
<!-- ✅ SIEMPRE CREAR TESTS ESPECÍFICOS -->
<!-- test-inputs.html, test-responsive.html, etc. -->
```

#### 3. Mobile-First Real
```css
/* ✅ SIEMPRE EMPEZAR CON MÓVIL */
@media (min-width: 320px) { /* Estilos base */ }
@media (min-width: 768px) { /* Mejoras tablet */ }
@media (min-width: 1024px) { /* Mejoras desktop */ }
```

#### 4. Error Handling Resiliente
```javascript
// ✅ SIEMPRE MANEJAR ERRORES
try {
    // Código que puede fallar
} catch (error) {
    console.error('Error manejado:', error);
    // Fallback o mensaje al usuario
}
```

## 📊 Métricas de Calidad

### Objetivos Cuantificables
1. **0 console.errors** en producción
2. **100% inputs testeados** (test-inputs.html)
3. **< 3s load time** en 3G
4. **100% mobile compatibility** (iOS + Android)
5. **< 5min deploy-to-test** ciclo

### Monitoreo Continuo
- [ ] Consola limpia en cada carga de página
- [ ] Todos los tests pasan en CI/CD
- [ ] Performance dentro de objetivos
- [ ] No regresiones en responsive

## 🧠 Lecciones Aprendidas (Resumen)

### Problemas Críticos Resueltos:
1. **Inputs bloqueados** - `preventDefault()` en eventos táctiles
2. **CSS/JS corruptos** - Desarrollo paralelo sin validación
3. **Testing lento** - Dependencia de GitHub Pages
4. **Mobile no probado** - Asumir que funciona
5. **Error handling ausente** - Crash sin feedback

### Soluciones Implementadas:
1. **Tests específicos** - `test-inputs.html`, `simple-test.html`
2. **Validación temprana** - Sintaxis antes de commit
3. **Testing local** - `file://` protocolo rápido
4. **Mobile-first real** - Empezar en 320px
5. **Error boundaries** - Fallbacks y mensajes útiles

## 🔄 Proceso de Desarrollo Mejorado

### Flujo Ideal:
```
1. Escribir código
2. Validar sintaxis (node -c, etc.)
3. Probar localmente (file://)
4. Ejecutar tests específicos
5. Commit + push
6. Esperar deploy (1-3min)
7. Probar en producción
8. Documentar cambios
```

### Puntos de Control:
- **Pre-commit:** Sintaxis + tests locales
- **Pre-push:** Todos los tests pasan
- **Post-deploy:** Verificación producción
- **Post-release:** Monitoreo + feedback

## 📚 Referencias

### Archivos de Testing:
- `test-inputs.html` - Validación de controles
- `simple-test.html` - Test básico de integración
- `test-redesign.html` - Suite completa
- `debug.html` - Diagnóstico de problemas

### Documentación:
- `README.md` - Descripción del proyecto
- `ARCHITECTURE.md` - Arquitectura técnica
- `CHANGELOG.md` - Historial de cambios
- `QUALITY_CHECKLIST.md` - Este documento

### Enlaces:
- Producción: https://sergioquez.github.io/desenrollalo-site/
- GitHub: https://github.com/sergioquez/desenrollalo-site
- Issues: https://github.com/sergioquez/desenrollalo-site/issues

---
**Última actualización:** 2026-04-03  
**Versión:** 1.0  
**Estado:** Activo - Usar para todos los desarrollos futuros  
**Responsable:** Todo el equipo de desarrollo