// analytics.js - Basic analytics for Desenrollalo

class DesenrollaloAnalytics {
  constructor() {
    this.events = [];
    this.startTime = Date.now();
    this.init();
  }

  init() {
    // Track page load
    this.track('page_load', {
      load_time: Date.now() - this.startTime,
      user_agent: navigator.userAgent,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      theme: localStorage.getItem('theme') || 'dark'
    });

    // Track theme changes
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        this.track('theme_toggle', { new_theme: currentTheme });
      });
    }

    // Track tooltip interactions
    document.querySelectorAll('[title]').forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.track('tooltip_view', {
          element: element.tagName,
          title: element.getAttribute('title')
        });
      });
    });

    // Track timer interactions
    ['start-btn', 'stop-btn', 'reset-btn'].forEach(btnId => {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.addEventListener('click', () => {
          this.track('timer_action', { action: btnId.replace('-btn', '') });
        });
      }
    });

    // Track calculator usage
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
      calculateBtn.addEventListener('click', () => {
        const filmType = document.getElementById('film-type').value;
        const developer = document.getElementById('developer').value;
        const rolls = document.getElementById('rolls').value;
        
        this.track('calculation', {
          film_type: filmType,
          developer: developer,
          rolls: parseInt(rolls) || 0
        });
      });
    }

    // Track errors
    window.addEventListener('error', (event) => {
      this.track('error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Track beforeunload (session duration)
    window.addEventListener('beforeunload', () => {
      const sessionDuration = Date.now() - this.startTime;
      this.track('session_end', { duration_ms: sessionDuration });
      
      // Send all events before leaving (simulated)
      this.sendEvents();
    });

    console.log('Desenrollalo Analytics initialized');
  }

  track(eventName, data = {}) {
    const event = {
      name: eventName,
      timestamp: new Date().toISOString(),
      data: data
    };
    
    this.events.push(event);
    console.log('Analytics event:', event);
    
    // Send events in batches (simulated - in production would send to server)
    if (this.events.length >= 10) {
      this.sendEvents();
    }
  }

  sendEvents() {
    if (this.events.length === 0) return;
    
    // In production: send to analytics server
    // For now, just log to console
    console.log('Sending analytics batch:', this.events.length, 'events');
    
    // Simulate sending
    const eventsToSend = [...this.events];
    this.events = [];
    
    // Store locally for debugging
    if (typeof localStorage !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('desenrollalo_analytics') || '[]');
      stored.push(...eventsToSend);
      localStorage.setItem('desenrollalo_analytics', JSON.stringify(stored.slice(-100))); // Keep last 100 events
    }
  }

  getStats() {
    return {
      total_events: this.events.length,
      session_duration: Date.now() - this.startTime,
      theme: localStorage.getItem('theme') || 'dark',
      user_agent: navigator.userAgent
    };
  }
}

// Initialize analytics when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.desAnalytics = new DesenrollaloAnalytics();
  });
} else {
  window.desAnalytics = new DesenrollaloAnalytics();
}

// Export for debugging
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DesenrollaloAnalytics;
}