/**
 * Frosted Toggle Component Encapsulation
 * Only requires an empty div#id on the page to auto-generate complete DOM
 * Exposes: getState / setState / onChange callback
 */
class FrostedToggle {
  /**
   * Configuration
   * @param {Object} config
   * @param {string} config.containerId - Unique container ID (required)
   * @param {boolean} config.defaultState - Default state false=OFF / true=ON
   * @param {Function} config.onChange - State change callback (isOn)=>{}
   */
  constructor(config) {
    this.containerId = config.containerId;
    this.defaultState = config.defaultState || false;
    this.onChange = config.onChange || function () {};

    // DOM Elements
    this.container = null;
    this.toggleEl = null;
    this.labelEl = null;
    this.isOn = this.defaultState;
  }

  // Initialize: auto-generate DOM + bind events
  init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error('FrostedToggle: Container not found ' + this.containerId);
      return;
    }

    // 🔥 Auto-generate complete toggle DOM (100% restore original structure, no style failure)
    this.container.innerHTML = `
      <div style="display:flex;align-items:center;">
        <div id="${this.containerId}_switch" class="frosted-toggle" role="switch" aria-checked="false" tabindex="0" style="cursor:pointer;">
            <div class="frosted-toggle-knob"></div>
        </div>
        <div class="flex items-center gap-3" style="margin-left: 10px;">
            <span id="${this.containerId}_label" style="color:var(--frosted-text-secondary)">OFF</span>
        </div>
      </div>
    `;

    // Get isolated DOM
    this.toggleEl = document.getElementById(`${this.containerId}_switch`);
    this.labelEl = document.getElementById(`${this.containerId}_label`);

    // Bind events + initialize state
    this._bindEvents();
    this.update();
  }

  // Bind interaction events (click + keyboard)
  _bindEvents() {
    // Click to toggle
    this.toggleEl.addEventListener('click', () => {
      this.toggle();
    });

    // Enter / Space to toggle (accessibility support)
    this.toggleEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  // Toggle state
  toggle() {
    this.isOn = !this.isOn;
    this.update();
    this.onChange(this.isOn); // trigger callback
  }

  // Update UI state
  update() {
    if (this.isOn) {
      this.toggleEl.classList.add('frosted-toggle-active');
      this.toggleEl.setAttribute('aria-checked', 'true');
      this.labelEl.textContent = 'ON';
    } else {
      this.toggleEl.classList.remove('frosted-toggle-active');
      this.toggleEl.setAttribute('aria-checked', 'false');
      this.labelEl.textContent = 'OFF';
    }
  }

  // ==============================================
  // 🔥 Exposed Public Methods
  // ==============================================
  // Get current state
  getState() {
    return this.isOn;
  }

  // Set state
  setState(state) {
    this.isOn = !!state;
    this.update();
    this.onChange(this.isOn);
  }
}

// Global exposure
window.FrostedToggle = FrostedToggle;