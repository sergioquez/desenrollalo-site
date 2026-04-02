---
name: ux-ui-designer
description: UX/UI design improvements for desenrollalo-site project. Specialized in responsive design, visual states, form validation, theme system, and user experience enhancements. Use when working on: mobile-first responsive design, button hover/active states, form validation feedback, dark/light theme toggle, accessibility improvements, or visual design updates.
---

# UX/UI Designer Skill

## Context

You're improving the **desenrollalo-site** - a film development timer tool. The current design works but needs polish, responsiveness, and better user experience.

## Design System

### Color Palette
- **Primary**: `#ff3b3b` (red accent)
- **Background**: `#0a0a0a` (dark), `#f5f5f5` (light)
- **Surface**: `#151515` (dark), `#ffffff` (light)
- **Text**: `#e0e0e0` (dark), `#333333` (light)
- **Muted**: `#666666` (dark), `#888888` (light)

### Typography
- **Font Family**: System fonts stack
- **Headings**: 300 weight, letter-spacing for elegance
- **Body**: 400 weight, good line-height for readability

### Spacing Scale
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 2.5rem (40px)

## Implementation Tasks

### Task 1: Responsive Design
**Breakpoints**:
- Mobile: 320px - 767px
- Tablet: 768px - 1023px  
- Desktop: 1024px+

**Mobile-first CSS**:
```css
/* Base styles (mobile) */
section {
  padding: 1.5rem;
  margin-bottom: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  section {
    padding: 2rem;
    margin-bottom: 1.5rem;
  }
  
  .calculator-form {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  main {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  section {
    width: calc(50% - 1rem);
  }
  
  .timer {
    width: 100%;
  }
}
```

### Task 2: Button States
```css
button {
  /* Base styles */
  background-color: #ff3b3b;
  color: #0a0a0a;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Hover */
button:hover {
  background-color: #e03030;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(255, 59, 59, 0.3);
}

/* Active */
button:active {
  background-color: #cc2929;
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(255, 59, 59, 0.2);
}

/* Disabled */
button:disabled {
  background-color: #666;
  color: #999;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Focus */
button:focus {
  outline: 2px solid #ff3b3b;
  outline-offset: 2px;
}
```

### Task 3: Form Validation
```css
/* Valid state */
.form-group input:valid,
.form-group select:valid {
  border-color: #4CAF50;
}

/* Invalid state */
.form-group input:invalid,
.form-group select:invalid {
  border-color: #f44336;
}

/* Error message */
.error-message {
  color: #f44336;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: none;
}

.form-group.invalid .error-message {
  display: block;
}
```

### Task 4: Theme System
**HTML Structure**:
```html
<button class="theme-toggle" aria-label="Toggle theme">
  <span class="theme-icon">🌙</span>
</button>
```

**CSS Variables**:
```css
:root {
  /* Light theme */
  --bg-primary: #f5f5f5;
  --bg-surface: #ffffff;
  --text-primary: #333333;
  --text-secondary: #666666;
  --accent: #ff3b3b;
  --border: #e0e0e0;
}

[data-theme="dark"] {
  /* Dark theme */
  --bg-primary: #0a0a0a;
  --bg-surface: #151515;
  --text-primary: #e0e0e0;
  --text-secondary: #888888;
  --accent: #ff3b3b;
  --border: #333333;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s, color 0.3s;
}

section {
  background-color: var(--bg-surface);
  border: 1px solid var(--border);
}
```

**JavaScript**:
```javascript
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  themeIcon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('theme', newTheme);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
```

## Accessibility Requirements

### ARIA Labels
```html
<button aria-label="Start timer">
<button aria-label="Stop timer">  
<button aria-label="Reset timer">
<select aria-label="Film type">
<select aria-label="Developer type">
```

### Keyboard Navigation
- All interactive elements focusable
- Tab order follows visual flow
- Skip to main content link
- Focus indicators visible

### Screen Reader Support
- Semantic HTML structure
- ARIA live regions for timer updates
- Proper heading hierarchy
- Descriptive link/button text

## Quality Standards

- **Lighthouse Score**: Accessibility > 90, Performance > 80
- **Responsive**: Works 320px - 1920px
- **No FOUC**: Theme loads without flash
- **Smooth transitions**: All state changes animated
- **Consistent spacing**: Follows spacing scale

## Integration Points

- Use CSS class names agreed with Frontend
- Provide design tokens for consistency
- Coordinate theme implementation with localStorage
- Ensure all interactive states work with JS

## Success Metrics

- ✅ Fully responsive on all devices
- ✅ All button states implemented
- ✅ Form validation with visual feedback
- ✅ Theme toggle works smoothly
- ✅ Accessibility score > 90
- ✅ No visual regressions