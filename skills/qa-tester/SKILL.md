---
name: qa-tester
description: Quality assurance and testing for desenrollalo-site project. Specialized in manual testing, E2E validation, cross-browser testing, bug reporting, and quality metrics. Use when: testing timer functionality, validating calculator accuracy, checking alert systems, testing responsive design, verifying localStorage persistence, or performing cross-browser compatibility tests.
---

# QA Tester Skill

## Context

You're testing the **desenrollalo-site** - a film development timer tool. Your role is to ensure all functionality works correctly, identify bugs, and validate quality standards before deployment.

## Testing Strategy

### Test Levels
1. **Unit Testing**: Individual functions (timer, calculator)
2. **Integration Testing**: Component interactions
3. **E2E Testing**: Complete user flows
4. **Cross-browser**: Chrome, Firefox, Safari, Edge
5. **Responsive**: Mobile, tablet, desktop

### Testing Environment
- **Local**: Open `index.html` directly
- **Development**: Local server if available
- **Production**: GitHub Pages deployment

## Test Cases

### TC-01: Timer Functionality
**Description**: Test timer start, stop, reset functionality
**Steps**:
1. Click "Iniciar" button
2. Verify timer starts counting
3. Click "Parar" button
4. Verify timer stops
5. Click "Reiniciar" button
6. Verify timer resets to 00:00

**Expected Results**:
- Timer displays minutes:seconds format
- Progress bar updates with time
- Buttons change state appropriately
- No console errors

### TC-02: Calculator Accuracy
**Description**: Test development time calculations
**Steps**:
1. Select "35mm" film type
2. Select "C-41" developer
3. Enter "2" rolls
4. Click "Calcular" button
5. Verify result shows correct time (30 minutes)

**Test Matrix**:
| Film | Developer | Rolls | Expected Time |
|------|-----------|-------|---------------|
| 35mm | C-41      | 1     | 15 min        |
| 35mm | D-76      | 1     | 10 min        |
| 120mm| C-41      | 1     | 20 min        |
| 120mm| D-76      | 1     | 12 min        |
| 35mm | C-41      | 3     | 45 min        |

### TC-03: Alert System
**Description**: Test audio alerts and notifications
**Steps**:
1. Click "Activar alertas" button
2. Start timer with short duration (10 seconds)
3. Wait for timer to complete
4. Verify alert sound plays
5. Verify notification appears

**Expected Results**:
- Alert sound plays when timer completes
- Notification shows "¡Revelado terminado!"
- Alerts can be disabled with "Desactivar alertas"

### TC-04: Responsive Design
**Description**: Test layout across screen sizes
**Steps**:
1. Open browser DevTools
2. Test viewports: 320px, 768px, 1024px, 1440px
3. Verify no horizontal scrolling
4. Check touch targets on mobile (min 44px)

**Breakpoints to Test**:
- 320px (Mobile small)
- 375px (Mobile medium)
- 768px (Tablet portrait)
- 1024px (Tablet landscape)
- 1440px (Desktop)

### TC-05: localStorage Persistence
**Description**: Test configuration saving
**Steps**:
1. Change theme to light mode
2. Select different film type and developer
3. Refresh page
4. Verify settings are restored

**Expected Results**:
- Theme persists after refresh
- Form selections persist
- Alert preference persists

### TC-06: Cross-browser Compatibility
**Description**: Test functionality across browsers
**Browsers to Test**:
- Chrome (latest)
- Firefox (latest)
- Safari (if available)
- Edge (latest)

**Checkpoints**:
- Timer functionality works
- Calculator computes correctly
- CSS renders properly
- JavaScript executes without errors

### TC-07: Accessibility
**Description**: Test keyboard navigation and screen reader
**Steps**:
1. Navigate using Tab key only
2. Verify focus indicators visible
3. Test with screen reader (if available)
4. Check Lighthouse accessibility score

**Expected Results**:
- All interactive elements focusable
- Logical tab order
- ARIA labels present
- Lighthouse accessibility > 90

## Bug Reporting Template

```markdown
## Bug Report

**Title**: [Brief description]

**Severity**: Critical/High/Medium/Low

**Environment**:
- Browser: [Chrome 123]
- OS: [Windows 11]
- Device: [Desktop]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Console Errors**:
[Any JavaScript errors]

**Screenshots**:
[If applicable]

**Additional Context**:
[Any other relevant information]
```

## Testing Tools

### Browser DevTools
- **Console**: Check for JavaScript errors
- **Network**: Monitor resource loading
- **Performance**: Measure load times
- **Lighthouse**: Automated audits

### Manual Testing
- **Keyboard navigation**: Tab, Enter, Space
- **Touch testing**: On mobile devices
- **Screen reader**: VoiceOver, NVDA, JAWS

### Automation (if available)
- **Playwright**: E2E testing
- **Jest**: Unit testing
- **Cypress**: Component testing

## Quality Gates

### Must Pass (Blocking)
- [ ] No JavaScript runtime errors
- [ ] Timer starts/stops/resets correctly
- [ ] Calculator computes accurate times
- [ ] Basic responsive layout works

### Should Pass (Important)
- [ ] localStorage persistence works
- [ ] Alert system functional
- [ ] Cross-browser compatibility
- [ ] Keyboard navigation works

### Nice to Have
- [ ] Lighthouse scores > 80
- [ ] All button states implemented
- [ ] Smooth animations/transitions
- [ ] Theme toggle works perfectly

## Regression Testing

After each fix or feature addition:
1. Re-run critical test cases (TC-01 to TC-03)
2. Verify no new bugs introduced
3. Check console for new errors
4. Validate responsive design still works

## Performance Testing

**Load Time**: < 3 seconds
**Time to Interactive**: < 5 seconds
**Bundle Size**: < 500KB total
**Memory Usage**: No leaks during timer use

## Success Metrics

- ✅ 0 critical bugs open
- ✅ All test cases passing
- ✅ Cross-browser compatibility verified
- ✅ Accessibility standards met
- ✅ Performance targets achieved
- ✅ User flows work end-to-end