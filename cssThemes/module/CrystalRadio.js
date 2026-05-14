/**
 * Crystal Style Radio Group Encapsulation
 * Only requires an empty div#id on the page to auto-render complete DOM
 * Supports mutual exclusion + full operation interfaces + state monitoring
 */
class CrystalRadioGroup {
  /**
   * Configuration
   * @param {Object} config - Configuration
   * @param {Array} config.containerIds - Array of radio container IDs (required)
   * @param {Array} config.labels - Array of corresponding display texts (optional)
   * @param {string} config.defaultSelected - Default selected container ID (optional)
   * @param {Function} config.onChange - Callback on selection change (selectedId: string)=>{}
   */
  constructor(config) {
    // External configuration
    this.containerIds = config.containerIds || [];
    this.labels = config.labels || this.containerIds.map(() => 'Option');
    this.defaultSelected = config.defaultSelected || '';
    this.onChange = config.onChange || function () {};

    // Instance storage
    this.radioInstances = [];
    this.currentSelected = this.defaultSelected;
  }

  /**
   * Initialize: render all DOM + bind events
   */
  init() {
    if (!this.containerIds.length) {
      console.error('CrystalRadioGroup: No radio container IDs provided');
      return;
    }

    // Iterate and render all radios
    this.containerIds.forEach((id, index) => {
      this._renderSingleRadio(id, this.labels[index]);
    });

    // Bind group events
    this._bindGroupEvents();
    // Initialize default selection
    this.setSelected(this.defaultSelected);
  }

  /**
   * Private: render single radio DOM
   */
  _renderSingleRadio(containerId, label) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Auto-render raw DOM structure
    container.innerHTML = `
      <div class="crystal-radio" id="${containerId}_core">
        <div class="radio-box">
          <div class="radio-glint"></div>
          <div class="radio-bead">
            <div class="bead-inner">
              <div class="bead-highlight"></div>
              <div class="bead-secondary"></div>
            </div>
          </div>
        </div>
        <span class="radio-label">${label}</span>
      </div>
    `;

    // Store DOM elements
    this.radioInstances.push({
      id: containerId,
      container,
      box: container.querySelector('.radio-box'),
      labelEl: container.querySelector('.radio-label')
    });
  }

  /**
   * Private: bind radio group mutual exclusion events
   */
  _bindGroupEvents() {
    this.radioInstances.forEach(item => {
      item.container.addEventListener('click', () => {
        this.setSelected(item.id);
      });
    });
  }

  /**
   * Private: update UI styles for the entire group
   */
  _updateAllUI() {
    this.radioInstances.forEach(item => {
      const isSelected = item.id === this.currentSelected;
      if (isSelected) {
        item.box.classList.add('checked');
        item.labelEl.style.color = 'var(--frosted-cyan-text)';
      } else {
        item.box.classList.remove('checked');
        item.labelEl.style.color = 'var(--frosted-text-secondary)';
      }
    });
  }

  // ==============================================
  // 🔥 Exposed Public Interfaces
  // ==============================================
  /**
   * Get currently selected ID
   * @returns {string}
   */
  getSelected() {
    return this.currentSelected;
  }

  /**
   * Set selected item
   * @param {string} selectedId - Container ID to select
   */
  setSelected(selectedId) {
    if (!this.radioInstances.some(item => item.id === selectedId)) return;
    this.currentSelected = selectedId;
    this._updateAllUI();
    this.onChange(this.currentSelected);
  }

  /**
   * Reset to initial default state
   */
  reset() {
    this.setSelected(this.defaultSelected);
  }

  /**
   * Modify display text for a specific radio
   * @param {string} id - Container ID
   * @param {string} text - New text
   */
  setLabel(id, text) {
    const item = this.radioInstances.find(i => i.id === id);
    if (item) item.labelEl.textContent = text;
  }
}

// Global exposure
window.CrystalRadioGroup = CrystalRadioGroup;