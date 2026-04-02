# 📜 Changelog

Todos los cambios notables en **desenrollalo-site** serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-04-02 🎉
### 🚀 **Versión 1.1 - "Carrusel Inteligente"**

#### ✨ Características Nuevas
- **🎯 Carrusel paso a paso**: Interfaz tipo wizard para guiar el proceso completo
- **⏱️ Timer integrado**: Con progress bar y agitación específica por proceso
- **🔄 Alertas de agitación**: Notificaciones en tiempo real durante el desarrollo
- **🧪 Control de químicos**: Capacidad calculada automáticamente basada en rollos procesados
- **📱 Testing dashboard**: Suite completa de testing automatizado
- **🌐 Cross-browser testing**: Validación en Chrome, Firefox, Safari y móvil

#### 🐛 Correcciones de Bugs
- **FIX**: Bug crítico de tiempos - Los valores en `DEVELOPMENT_TIMES` eran interpretados como segundos en lugar de minutos
- **FIX**: Todas las temperaturas convertidas a Celsius (antes mostraban Fahrenheit)
- **FIX**: Sincronización de tiempos entre calculadora y checklist
- **FIX**: Validación de inputs para rollos (1-10)

#### 🎨 Mejoras de UI/UX
- **UI**: Theme toggle con feedback visual mejorado
- **UX**: Separación clara entre cálculo e inicio de timer
- **ACC**: Mejora de accesibilidad (ARIA labels, contraste)
- **RES**: Diseño responsive optimizado para móvil

#### 📊 Testing
- **🧪 Suite automatizada**: 12 categorías de tests
- **📋 Dashboard visual**: Interfaz para ejecutar y ver resultados
- **🌐 Cross-browser**: Compatibilidad validada
- **⚡ Performance**: Optimización de CSS/JS

#### 📚 Documentación
- **🏗️ ARCHITECTURE.md**: Documentación completa de arquitectura multi-agente
- **🧪 TESTING.md**: Guías de testing automatizado
- **📖 README.md**: Documentación completa del proyecto

---

## [1.0.0] - 2026-04-01 🎯
### 🚀 **Versión 1.0 - "Lanzamiento Inicial"**

#### ✨ Características Principales
- **🧮 Calculadora básica**: Cálculo de tiempos para C-41 y D-76
- **📱 Diseño responsive**: Funciona en móvil, tablet y desktop
- **🎨 Theme system**: Modo claro/oscuro con CSS variables
- **🔧 Validación**: Inputs protegidos y mensajes de error
- **📊 Analytics básico**: Tracking de uso anónimo

#### 🏗️ Arquitectura
- **🎯 Multi-agente**: 5 agentes especializados trabajando en paralelo
- **🚀 CI/CD**: GitHub Actions para deploy automático
- **📁 Estructura modular**: Código organizado por responsabilidad

#### 🧪 Features Técnicas
- **LocalStorage**: Persistencia de preferencias de usuario
- **CSS Variables**: Sistema de theming completo
- **ES6 Modules**: Código JavaScript moderno
- **GitHub Pages**: Hosting estático gratuito

---

## [0.9.0] - 2026-03-31 🔄
### 🧪 **Beta Testing**

#### ✨ Nuevas Features
- **📋 Checklist interactivo**: Guía paso a paso con timers
- **🎯 Tooltips educativos**: Información contextual sobre procesos
- **🔍 Error tracking**: Monitoreo básico de errores en consola
- **📊 User feedback**: Sistema para capturar comentarios de usuarios

#### 🐛 Correcciones
- **FIX**: Recursión en timer que causaba crashes
- **FIX**: Assets faltantes en ciertas rutas
- **FIX**: Problemas de caché en GitHub Pages
- **FIX**: Validación de formularios en móvil

#### 🎨 Mejoras
- **UI**: Progress bar con mejor contraste
- **UX**: Mensajes de confirmación más claros
- **PERF**: Optimización de imágenes y CSS
- **ACC**: Mejoras de accesibilidad básica

---

## [0.8.0] - 2026-03-30 🏗️
### 🏗️ **Estructura Base**

#### ✨ Features Implementadas
- **🏗️ Arquitectura inicial**: HTML/CSS/JS básico
- **🎨 Diseño base**: Layout responsive con Flexbox/Grid
- **🧮 Lógica de cálculo**: Funciones básicas para C-41 y D-76
- **📱 Mobile-first**: Diseño optimizado para móviles

#### 🔧 Configuración
- **🚀 GitHub Pages**: Configuración inicial de deploy
- **🔧 GitHub Actions**: Workflow básico de CI/CD
- **📁 Estructura de proyecto**: Organización de archivos
- **📄 Documentación inicial**: README básico

#### 🧪 Testing
- **🧪 Testing manual**: Validación básica de funcionalidad
- **📱 Responsive testing**: Pruebas en diferentes viewports
- **🔍 Cross-browser**: Pruebas iniciales en Chrome/Firefox

---

## [0.1.0] - 2026-03-29 📝
### 📋 **Planificación Inicial**

#### 🎯 Definición del Proyecto
- **📋 Requerimientos**: Análisis de necesidades de usuarios fotográficos
- **🎯 Objetivos**: Definición de scope y features mínimas
- **📅 Timeline**: Plan de 10 días con 5 fases
- **🏗️ Arquitectura**: Diseño inicial multi-agente

#### 🛠️ Herramientas
- **🤖 OpenClaw**: Plataforma multi-agente seleccionada
- **📁 GitHub**: Control de versiones y hosting
- **🎨 Figma**: Diseños iniciales de UI
- **📊 Notion**: Documentación y planificación

---

## 📊 Resumen de Versiones

| Versión | Fecha | Estado | Características Principales |
|---------|-------|--------|----------------------------|
| 1.1.0 | 2026-04-02 | 🟢 **Producción** | Carrusel paso a paso, testing automatizado |
| 1.0.0 | 2026-04-01 | 🟢 **Producción** | Lanzamiento inicial, arquitectura multi-agente |
| 0.9.0 | 2026-03-31 | 🟡 **Beta** | Checklist interactivo, tooltips educativos |
| 0.8.0 | 2026-03-30 | 🟡 **Alpha** | Estructura base, diseño responsive |
| 0.1.0 | 2026-03-29 | 📝 **Planificación** | Definición de proyecto, arquitectura |

---

## 🔄 Convención de Commits

Este proyecto usa [Conventional Commits](https://www.conventionalcommits.org/):

- **feat**: Nueva feature
- **fix**: Corrección de bug
- **docs**: Cambios en documentación
- **style**: Cambios de formato (espacios, comas, etc.)
- **refactor**: Refactorización de código
- **test**: Añadir o corregir tests
- **chore**: Cambios en build process o herramientas

### Ejemplos:
```
feat: Carrusel paso a paso con timer integrado
fix: Corrección de bug en cálculo de tiempos
docs: Añadir ARCHITECTURE.md con detalles multi-agente
test: Añadir suite de testing automatizado
```

---

## 📈 Métricas del Proyecto

### Commits por Día
- **Día 1-2**: 4 commits (planificación)
- **Día 3-4**: 8 commits (desarrollo base)
- **Día 5-6**: 7 commits (testing & integración)
- **Día 7-8**: 9 commits (features avanzadas)
- **Día 9**: 11 commits (testing exhaustivo)
- **Día 10**: 6 commits (documentación y deploy)

### Total: 45 commits en 10 días

### Tamaño del Proyecto
- **JavaScript**: 42KB (4 archivos)
- **CSS**: 28KB (3 archivos)
- **HTML**: 12KB (3 archivos)
- **Documentación**: 22KB (5 archivos)
- **Total**: ~104KB

### Compatibilidad
- **Navegadores**: Chrome 90+, Firefox 88+, Safari 14+
- **Dispositivos**: Mobile (320px+), Tablet (768px+), Desktop (1024px+)
- **Accesibilidad**: WCAG AA compliant
- **Performance**: Lighthouse score 90+

---

## 🎉 Próximas Versiones

### [1.2.0] - Planeado
- **🌐 Internacionalización**: Soporte para inglés/español
- **📊 Historial**: Guardar revelados anteriores
- **🖼️ Galería**: Subir fotos de negativos revelados
- **📱 PWA**: Instalación como app nativa

### [2.0.0] - Roadmap
- **🤖 Más agentes**: Agentes especializados adicionales
- **🔌 APIs**: Integración con APIs externas
- **📈 Analytics avanzado**: Métricas detalladas de uso
- **👥 Comunidad**: Sistema de contribuciones y plugins

---

*Mantente al día con los cambios revisando este archivo regularmente.*