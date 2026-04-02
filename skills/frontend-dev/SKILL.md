---
name: frontend-dev
description: Frontend development for desenrollalo-site project. Specialized in JavaScript bug fixes, HTML/CSS improvements, localStorage implementation, and critical feature development. Use when working on: JavaScript error fixes, HTML structure updates, CSS improvements, localStorage integration, timer functionality, calculator logic, or alert system enhancements.
---

# Frontend Developer Skill

## Context

You're working on the **desenrollalo-site** project - a film development timer and calculator tool. The project has critical bugs that need immediate fixing before other work can proceed.

## Current Issues (P1 - Critical)

### 1. JavaScript Recursion Bug
**File**: `app.js`
**Problem**: Line 44 - `calculateDevelopmentTime` function calls itself causing infinite recursion
**Fix**: Rename the helper function or restructure the logic

### 2. Missing Progress Bar
**File**: `index.html`
**Problem**: JavaScript references `.progress-bar` element that doesn't exist
**Fix**: Add progress bar HTML structure

### 3. Missing Assets
**Problem**: `assets/alert.mp3` referenced but doesn't exist
**Fix**: Create assets directory with placeholder or real audio file

## Implementation Tasks

### Task 1: Fix JavaScript Recursion
```javascript
// BEFORE (buggy):
function calculateDevelopmentTime() {
  const filmType = filmTypeSelect.value;
  const developer = developerSelect.value;
  const rolls = parseInt(rollsInput.value, 10);

  const totalDevelopmentTime = calculateDevelopmentTime(filmType, developer, rolls); // RECURSION!
  // ...
}

// AFTER (fixed):
function calculateDevelopmentTime() {
  const filmType = filmTypeSelect.value;
  const developer = developerSelect.value;
  const rolls = parseInt(rollsInput.value, 10);

  const totalDevelopmentTime = calculateDevTime(filmType, developer, rolls); // Different name
  // ...
}

function calculateDevTime(filmType, developer, rolls) {
  const developmentTime = DEVELOPMENT_TIMES[filmType][developer];
  return developmentTime * rolls;
}
```

### Task 2: Add Progress Bar
Add to `index.html` in `.timer` section:
```html
<div class="progress-container">
  <div class="progress-bar"></div>
</div>
```

Add to `style.css`:
```css
.progress-container {
  width: 100%;
  height: 8px;
  background-color: #222;
  border-radius: 4px;
  margin: 1rem 0;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #ff3b3b;
  width: 0%;
  transition: width 0.3s ease;
}
```

### Task 3: Create Assets
```bash
mkdir -p assets
# Create placeholder alert sound or use real MP3
```

## localStorage Implementation

### Configuration Schema
```javascript
const USER_CONFIG = {
  theme: 'dark', // 'dark' or 'light'
  alertsEnabled: true,
  defaultFilmType: '35mm',
  defaultDeveloper: 'c41',
  defaultRolls: 1
};
```

### Save/Load Functions
```javascript
function saveConfig() {
  const config = {
    theme: currentTheme,
    alertsEnabled: alertsEnabled,
    filmType: filmTypeSelect.value,
    developer: developerSelect.value,
    rolls: rollsInput.value
  };
  localStorage.setItem('desenrollalo-config', JSON.stringify(config));
}

function loadConfig() {
  const saved = localStorage.getItem('desenrollalo-config');
  if (saved) {
    const config = JSON.parse(saved);
    // Apply config...
  }
}
```

## Development Workflow

1. **Test fixes locally** - Open `index.html` in browser, check console
2. **Validate functionality** - Timer works, calculator computes correctly
3. **Check persistence** - Config saves/loads properly
4. **Update documentation** - Comment changes in code

## Quality Standards

- **Zero console errors** - Fix all JavaScript errors
- **Semantic HTML** - Use proper elements and ARIA labels
- **Accessible** - Keyboard navigation, screen reader friendly
- **Performant** - No memory leaks, efficient DOM updates

## Integration Points

- Coordinate with UX/UI agent for CSS class names
- Provide feature flags for QA testing
- Follow deployment guidelines from DevOps

## Success Metrics

- ✅ Timer functions without errors
- ✅ Progress bar shows real progress  
- ✅ localStorage saves/loads config
- ✅ All P1 issues resolved
- ✅ Code passes basic validation