/**
 * Crystal Style Checkbox Encapsulation
 * Only requires an empty div#id on the page to auto-render complete DOM
 * Exposes full operation interfaces + state monitoring
 */
class CrystalCheckbox {
  /**
   * Configuration
   * @param {Object} config - Configuration
   * @param {string} config.containerId - Unique container ID (required)
   * @param {string} config.label - Checkbox text (default: Option)
   * @param {boolean} config.defaultChecked - Default checked state (default: false)
   * @param {Function} config.onChange - Callback on state change (checked: boolean)=>{}
   */
  constructor(config) {
    // External configuration
    this.containerId = config.containerId;
    this.label = config.label || 'Option';
    this.defaultChecked = !!config.defaultChecked;
    this.defaultIndeterminate = !!config.defaultIndeterminate;
    this.onChange = config.onChange || function(){};

    // DOM Elements
    this.container = null;
    this.checkboxBox = null;
    this.checkboxLabel = null;
    // Internal state
    this.checked = this.defaultChecked;
    this.indeterminate = this.defaultIndeterminate;
  }

  /**
   * Initialize: auto-render DOM + bind events
   */
  init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error('CrystalCheckbox: Container not found ->', this.containerId);
      return;
    }

    // 🔥 Auto-generate complete checkbox DOM (100% restore original structure)
    const cls = [];
    if (this.checked) cls.push('checked');
    if (this.indeterminate) cls.push('indeterminate');
    this.container.innerHTML = `
      <div class="crystal-checkbox" id="${this.containerId}_core">
        <div class="checkbox-box ${cls.join(' ')}">
          <div class="checkbox-glint"></div>
          <div class="checkbox-bead">
            <div class="bead-inner">
              <div class="bead-highlight"></div>
              <div class="bead-secondary"></div>
            </div>
          </div>
        </div>
        <span class="checkbox-label">${this.label}</span>
      </div>
    `;

    // Get DOM elements
    const core = document.getElementById(`${this.containerId}_core`);
    this.checkboxBox = core.querySelector('.checkbox-box');
    this.checkboxLabel = core.querySelector('.checkbox-label');

    // Bind events + initialize UI
    this._bindEvent();
    this._updateUI();
  }

  /**
   * Private: bind click event
   */
  _bindEvent() {
    this.container.addEventListener('click', () => {
      this.toggle();
    });
  }

  /**
   * Private: update UI styles (core rendering logic)
   */
  _updateUI() {
    if (this.checked) {
      this.checkboxBox.classList.add('checked');
      this.checkboxBox.classList.remove('indeterminate');
      this.checkboxLabel.style.color = 'var(--frosted-cyan-text)';
    } else if (this.indeterminate) {
      this.checkboxBox.classList.remove('checked');
      this.checkboxBox.classList.add('indeterminate');
      this.checkboxLabel.style.color = 'var(--frosted-cyan-text)';
    } else {
      this.checkboxBox.classList.remove('checked', 'indeterminate');
      this.checkboxLabel.style.color = 'var(--frosted-text-secondary)';
    }
  }

  // ==============================================
  // 🔥 Exposed Public Interfaces
  // ==============================================
  /**
   * Get checked state
   * @returns {boolean}
   */
  getChecked() {
    return this.checked;
  }

  /**
   * Set checked state
   * @param {boolean} checked - true checked / false unchecked
   */
  setChecked(checked) {
    this.checked = !!checked;
    if (this.checked) this.indeterminate = false;
    this._updateUI();
    this.onChange(this.checked);
  }

  /**
   * Set indeterminate state
   * @param {boolean} indeterminate - true indeterminate / false normal
   */
  setIndeterminate(indeterminate) {
    this.indeterminate = !!indeterminate;
    if (this.indeterminate) this.checked = false;
    this._updateUI();
    this.onChange(this.checked);
  }

  /**
   * Get indeterminate state
   * @returns {boolean}
   */
  getIndeterminate() {
    return this.indeterminate;
  }

  /**
   * Toggle state (checked ↔ unchecked)
   */
  toggle() {
    this.checked = !this.checked;
    this.indeterminate = false;
    this._updateUI();
    this.onChange(this.checked);
  }

  /**
   * Reset to default state
   */
  reset() {
    this.checked = this.defaultChecked;
    this.indeterminate = this.defaultIndeterminate;
    this._updateUI();
    this.onChange(this.checked);
  }

  /**
   * Modify display text
   * @param {string} text - New text
   */
  setLabel(text) {
    this.label = text;
    this.checkboxLabel.textContent = text;
  }
}

// Global exposure for direct page usage
window.CrystalCheckbox = CrystalCheckbox;