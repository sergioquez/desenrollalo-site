# 🎞️ desenrollalo-site

**Calculadora y planificador de revelado fotográfico** - Guía paso a paso para procesos C-41 (color) y D-76 (blanco y negro).

![Version](https://img.shields.io/badge/version-1.1.0-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Deploy](https://img.shields.io/badge/deploy-GitHub%20Pages-brightgreen)

## 🚀 Demo en Vivo

👉 **https://sergioquez.github.io/desenrollalo-site/**

## ✨ Características

### 🧮 Calculadora Inteligente
- **Tiempos precisos**: Cálculo automático basado en película y proceso
- **Temperaturas en Celsius**: Todo el sistema usa unidades métricas
- **Rollos adicionales**: +30 segundos por cada rollo extra
- **Validación**: Rollos entre 1-10, inputs protegidos

### 🎯 Planificador Paso a Paso
- **Carrusel interactivo**: Guía desde preparación hasta secado
- **Timer integrado**: Con progress bar y agitación específica
- **Alertas de agitación**: Notificaciones en tiempo real
- **Control de químicos**: Capacidad calculada automáticamente

### 🎨 Interfaz Profesional
- **Diseño responsive**: Funciona en móvil, tablet y desktop
- **Theme toggle**: Modo claro/oscuro con CSS variables
- **Accesibilidad**: ARIA labels, contraste WCAG AA
- **Animaciones suaves**: Transiciones y feedback visual

### 🧪 Procesos Soportados
| Proceso | Temperatura | Tiempo 35mm | Tiempo 120mm |
|---------|-------------|-------------|--------------|
| **C-41 (Color)** | 39°C ± 0.3°C | 15 minutos | 20 minutos |
| **D-76 (B&W)** | 20°C ideal | 10 minutos | 12 minutos |

## 🛠️ Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Variables CSS, Flexbox, Grid, Animaciones
- **JavaScript (ES6+)** - Programación orientada a objetos
- **GitHub Pages** - Hosting estático
- **GitHub Actions** - CI/CD automático

## 📁 Estructura del Proyecto

```
desenrollalo-site/
├── index.html          # Página principal
├── style.css          # Estilos principales
├── app.js             # Lógica de la calculadora
├── step-by-step-planner.js    # Carrusel interactivo
├── step-by-step-planner.css   # Estilos del carrusel
├── guided-checklist.js        # Checklist con timers
├── testing-suite.js          # Suite de testing automatizado
├── day9-testing.html         # Dashboard de testing
├── test-carousel.html        # Página de testing del carrusel
├── README.md                 # Este archivo
├── ARCHITECTURE.md           # Arquitectura multi-agente
├── CHANGELOG.md              # Historial de cambios
├── RETROSPECTIVE.md          # Lecciones aprendidas
└── ROADMAP.md                # Planes futuros
```

## 🚀 Cómo Usar

### 1. Calculadora Básica
```javascript
// Seleccionar parámetros
1. Tipo de película: 35mm o 120mm
2. Proceso: C-41 (color) o D-76 (blanco y negro)
3. Número de rollos: 1-10

// Click en "Calcular tiempo"
// Ver tiempo de desarrollo y guía completa
```

### 2. Planificador Paso a Paso
```javascript
// Después de calcular:
1. Click en "Mostrar guía completa"
2. Carrusel aparecerá con todos los pasos
3. Navegar con botones "Atrás" / "Siguiente"
4. Iniciar timer en cada paso de proceso
5. Seguir alertas de agitación
```

### 3. Testing (Desarrolladores)
```javascript
// Abrir dashboard de testing:
https://sergioquez.github.io/desenrollalo-site/day9-testing.html

// Ejecutar tests:
1. Click en categorías individuales
2. O "Ejecutar TODOS los Tests"
3. Ver resultados en tiempo real
4. Exportar reporte JSON
```

## 🧪 Testing Automatizado

El proyecto incluye una suite completa de testing:

### Categorías de Tests
- **🧮 Cálculos**: Tiempos y temperaturas
- **🎨 UI**: Formularios, theme toggle, responsive
- **♿ Accesibilidad**: ARIA labels, contraste
- **⚡ Performance**: Optimización CSS/JS
- **🌐 Cross-browser**: Chrome, Firefox, Safari, móvil

### Para Ejecutar Tests
```bash
# Abrir en navegador:
open day9-testing.html

# O usar la suite programática:
import { TestingSuite } from './testing-suite.js';
const suite = new TestingSuite();
suite.runTests();
```

## 🏗️ Arquitectura Multi-Agente

Este proyecto fue desarrollado usando una arquitectura de **5 agentes especializados**:

### Agentes y Responsabilidades
1. **🎯 Main Agent** - Coordinación general
2. **🧪 Film Development Expert** - Exactitud técnica
3. **🔍 QA Tester** - Validación funcional
4. **🎨 UX/UI Designer** - Experiencia de usuario
5. **🚀 DevOps Agent** - Deploy y CI/CD
6. **🧪 Testing Agent** - Testing cross-browser

### Flujo de Desarrollo
```
Usuario → Main Agent → Agentes Especializados → Integración → Deploy → Testing
```

## 📈 Ciclo de Desarrollo (10 Días)

### Fase 1: Planificación (Días 1-2)
- Análisis de requerimientos
- Creación de skills especializados
- Arquitectura multi-agente

### Fase 2: Desarrollo Base (Días 3-4)
- Calculadora básica
- Responsive design
- CI/CD pipeline

### Fase 3: Testing & Integración (Días 5-6)
- User testing en staging
- Corrección de bugs
- Feedback de usuarios

### Fase 4: Features Avanzadas (Días 7-8)
- Carrusel paso a paso
- Timer con agitación
- Control de químicos

### Fase 5: Testing Exhaustivo (Día 9)
- Suite automatizada
- Cross-browser testing
- Optimización performance

### Fase 6: Deploy Final (Día 10)
- Documentación completa
- Retrospectiva
- Roadmap futuro

## 🐛 Reportar Bugs

Si encuentras un bug o tienes una sugerencia:

1. **Revisar issues existentes** en GitHub
2. **Crear nuevo issue** con:
   - Descripción del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Capturas de pantalla (si aplica)

## 🤝 Contribuir

Las contribuciones son bienvenidas:

1. **Fork** el repositorio
2. **Crear branch** para tu feature (`git checkout -b feature/amazing-feature`)
3. **Commit** tus cambios (`git commit -m 'Add amazing feature'`)
4. **Push** al branch (`git push origin feature/amazing-feature`)
5. **Abrir Pull Request**

### Guías de Estilo
- **JavaScript**: ES6+, clases, funciones nombradas
- **CSS**: Variables CSS, BEM para componentes complejos
- **HTML**: Semántico, ARIA labels donde sea necesario
- **Commits**: Conventional commits (feat, fix, docs, etc.)

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

## 👥 Autores

- **Sergio Quezada** - Desarrollo inicial - [@squezd](https://github.com/squezd)
- **Equipo OpenClaw** - Arquitectura multi-agente - [OpenClaw](https://openclaw.ai)

## 🙏 Agradecimientos

- **Comunidad fotográfica** por feedback valioso
- **OpenClaw** por la plataforma multi-agente
- **GitHub** por hosting y CI/CD
- **Todos los contribuidores** que han ayudado

## 📞 Contacto

Sergio Quezada - [@squezd](https://github.com/squezd)

Link del Proyecto: [https://github.com/sergioquez/desenrollalo-site](https://github.com/sergioquez/desenrollalo-site)

---

**¡Feliz revelado!** 🎞️✨