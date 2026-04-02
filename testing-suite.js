        <div class="recommendations">
          <h3>📋 Recommendations:</h3>
          ${this.getRecommendationsHTML()}
        </div>
        
        <div class="report-footer">
          <button class="run-tests-again" onclick="window.testingSuite.runTests()">
            🔄 Run Tests Again
          </button>
          <button class="export-report" onclick="window.testingSuite.exportReport()">
            📥 Export Report
          </button>
        </div>
      </div>
    `;
  }

  getRecommendationsHTML() {
    const recommendations = [];
    
    // Analyze results for recommendations
    const failedTests = this.results.filter(r => !r.passed);
    
    if (failedTests.length > 0) {
      recommendations.push('🔧 Fix failed tests before production deploy');
    }
    
    // Check JS performance
    const jsTest = this.results.find(r => r.test === 'JavaScript Performance');
    if (jsTest && jsTest.message.includes('Total JS:')) {
      const match = jsTest.message.match(/Total JS: (\d+)KB/);
      if (match && parseInt(match[1]) > 80) {
        recommendations.push('⚡ Consider code splitting for large JS files');
      }
    }
    
    // Check CSS performance
    const cssTest = this.results.find(r => r.test === 'CSS Optimization');
    if (cssTest && cssTest.message.includes('Total CSS:')) {
      const match = cssTest.message.match(/Total CSS: (\d+)KB/);
      if (match && parseInt(match[1]) > 40) {
        recommendations.push('🎨 Optimize CSS with PurgeCSS or similar tool');
      }
    }
    
    // Check accessibility
    const ariaTest = this.results.find(r => r.test === 'Accessibility - ARIA Labels');
    if (ariaTest && ariaTest.message.includes('Only')) {
      recommendations.push('♿ Improve ARIA labels for better accessibility');
    }
    
    // Default recommendations
    if (recommendations.length === 0) {
      recommendations.push('✅ System ready for production deployment');
      recommendations.push('📱 Consider adding PWA capabilities');
      recommendations.push('🌐 Add multilingual support (English/Spanish)');
    }
    
    return `
      <ul>
        ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
    `;
  }

  exportReport() {
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      results: this.results,
      summary: {
        total: this.results.length,
        passed: this.results.filter(r => r.passed).length,
        failed: this.results.filter(r => !r.passed).length
      }
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `testing-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// CSS for the report
const reportCSS = `
.testing-report-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.testing-report-container h2 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 1.8rem;
}

.report-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-card {
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  color: white;
}

.summary-card.passed {
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
}

.summary-card.failed {
  background: linear-gradient(135deg, #F44336, #C62828);
}

.summary-card.total {
  background: linear-gradient(135deg, #2196F3, #1565C0);
}

.summary-card.percentage {
  background: linear-gradient(135deg, #9C27B0, #6A1B9A);
}

.summary-count {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.summary-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.test-results {
  margin-bottom: 2rem;
}

.test-results h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.test-result {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.test-result.passed {
  background-color: rgba(76, 175, 80, 0.1);
  border-left-color: #4CAF50;
}

.test-result.failed {
  background-color: rgba(244, 67, 54, 0.1);
  border-left-color: #F44336;
}

.test-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.test-status {
  font-size: 1.2rem;
}

.test-name {
  font-weight: 600;
  color: #333;
}

.test-message {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  padding-left: 2rem;
}

.recommendations {
  background-color: rgba(33, 150, 243, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  border-left: 4px solid #2196F3;
}

.recommendations h3 {
  color: #2196F3;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.recommendations ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recommendations li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  color: #333;
}

.recommendations li:before {
  content: '→';
  position: absolute;
  left: 0;
  color: #2196F3;
  font-weight: bold;
}

.report-footer {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.report-footer button {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.report-footer button:hover {
  background-color: #1976D2;
  transform: translateY(-2px);
}

.report-footer .export-report {
  background-color: #4CAF50;
}

.report-footer .export-report:hover {
  background-color: #388E3C;
}

@media (max-width: 768px) {
  .testing-report-container {
    padding: 1rem;
    margin: 1rem;
  }
  
  .report-summary {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .report-footer {
    flex-direction: column;
  }
  
  .report-footer button {
    width: 100%;
  }
}
`;

// Add CSS to page
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = reportCSS;
  document.head.appendChild(style);
}

// Export for global use
if (typeof window !== 'undefined') {
  window.TestingSuite = TestingSuite;
  window.testingSuite = new TestingSuite();
}