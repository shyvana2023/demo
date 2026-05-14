/**
 * ==============================
 * 1. Independent Progress Bar Component (Display Only)
 * Supports: Custom min/max range + Custom unit + Custom width (px/%) + Dynamic config modification
 * ==============================
 */
class CrystalProgress {
  constructor(config) {
    this.containerId = config.containerId;
    // 🔥 New: Custom width, default 100%, supports px/%
    this.width = config.width || '100%';
    // Custom range, default 0-100
    this.min = Number(config.min) || 0;
    this.max = Number(config.max) || 100;
    // Custom unit, default %
    this.unit = config.unit !== undefined ? config.unit : '%';
    // Default value (range validation)
    this.defaultValue = this._clamp(Number(config.defaultValue) || 40);
    this.onChange = config.onChange || function () {};

    // DOM
    this.container = null;
    this.progressFill = null;
    this.progressLabel = null;
    this.value = this.defaultValue;
  }

  init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error("CrystalProgress: Container not found ->", this.containerId);
      return;
    }
    // Render DOM: dynamic width binding, supports px/%
    this.container.innerHTML = `
    <div style="display:flex;flex-direction: row;align-items: center;gap:8px;width:${this.width};">
      <div class="frosted-progress-track frosted-progress" style="width:100%;height: 8px; background: #eee; border-radius: 4px; overflow: hidden;">
        <div class="frosted-progress-fill" style="width:${this._getPercent()}%;background: #1890ff; transition: 0.2s;"></div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div style="min-width:40px;text-align:right;color: var(--frosted-text-primary);" class="frosted-progress-label">${this.value}${this.unit}</div>
      </div>
    </div>
    `;
    this.progressFill = this.container.querySelector(".frosted-progress-fill");
    this.progressLabel = this.container.querySelector(".frosted-progress-label");
    this.setValue(this.defaultValue);
  }

  // ==============================================
  // Private Utility Methods
  // ==============================================
  /** Clamp value within range */
  _clamp(v) {
    const val = Number(v) || 0;
    return Math.max(this.min, Math.min(this.max, val));
  }
  /** Calculate progress percentage width (adapts to custom range) */
  _getPercent() {
    if (this.max === this.min) return 0;
    return ((this.value - this.min) / (this.max - this.min)) * 100;
  }

  // ==============================================
  // Original APIs + New Extended APIs
  // ==============================================
  /** Set value */
  setValue(v) {
    this.value = this._clamp(v);
    this._updateUI();
    this.onChange(this.value);
  }
  /** Get current value */
  getValue() {
    return this.value;
  }
  /** Reset to default value */
  reset() {
    this.setValue(this.defaultValue);
  }
  /** Modify default value */
  setDefaultValue(v) {
    this.defaultValue = this._clamp(v);
  }
  /** Force UI refresh */
  forceUpdate() {
    this._updateUI();
  }
  /** Get fill DOM element */
  getFillEl() {
    return this.progressFill;
  }
  /** Get label DOM element */
  getLabelEl() {
    return this.progressLabel;
  }
  /** Get container DOM element */
  getContainerEl() {
    return this.container;
  }

  // Dynamically modify range/unit
  setMin(min) {
    this.min = Number(min) || 0;
    this.setValue(this.value);
  }
  setMax(max) {
    this.max = Number(max) || 100;
    this.setValue(this.value);
  }
  setUnit(unit) {
    this.unit = unit;
    this._updateUI();
  }
  getRange() {
    return { min: this.min, max: this.max };
  }
  getUnit() {
    return this.unit;
  }

  // 🔥 New: Dynamically modify width
  setWidth(width) {
    this.width = width || '100%';
    // Update DOM width
    const wrapper = this.container.querySelector('div:first-child');
    if (wrapper) wrapper.style.width = this.width;
  }
  getWidth() {
    return this.width;
  }

  // Private UI update
  _updateUI() {
    if (this.progressFill) this.progressFill.style.width = this._getPercent() + "%";
    if (this.progressLabel) this.progressLabel.textContent = this.value + this.unit;
  }
}

/**
 * ==============================
 * 2. Minimal Independent Slider Component (Slider + Value on Right)
 * Supports: Custom min/max range + Custom unit + Custom width (px/%) + Full API exposure
 * ==============================
 */
class CrystalSlider {
  constructor(config) {
    this.containerId = config.containerId;
    // 🔥 New: Custom width, default 240px, supports px/%
    this.width = config.width || '240px';
    // Custom range, default 0-100
    this.min = Number(config.min) || 0;
    this.max = Number(config.max) || 100;
    // Custom unit, default %
    this.unit = config.unit !== undefined ? config.unit : '%';
    // Default value (range validation)
    this.defaultValue = this._clamp(Number(config.defaultValue) || 40);
    this.onChange = config.onChange || function () {};

    // Sync lock / state
    this.syncLock = false;
    this.value = this.defaultValue;

    // DOM
    this.container = null;
    this.sliderEl = null;
    this.valueLabelEl = null;
  }

  init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error("CrystalSlider: Container not found ->", this.containerId);
      return;
    }
    // Render DOM: dynamic width binding, supports px/%
    this.container.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;width:${this.width};">
        <input type="range" min="${this.min}" max="${this.max}" value="${this.defaultValue}" 
          style="flex:1;touch-action:none;">
        <span style="min-width:40px;color: var(--frosted-text-primary);text-align:right;">${this.value}${this.unit}</span>
      </div>
    `;
    this.sliderEl = this.container.querySelector('input[type="range"]');
    this.valueLabelEl = this.container.querySelector("span");
    this._bindEvents();
    this.setValue(this.defaultValue);
  }

  // Bind drag events
  _bindEvents() {
    this.sliderEl?.addEventListener("input", (e) => {
      if (this.syncLock) return;
      this.setValue(e.target.value);
    });
  }

  // ==============================================
  // Private Utility Methods
  // ==============================================
  _clamp(v) {
    const val = Number(v) || 0;
    return Math.max(this.min, Math.min(this.max, val));
  }

  // ==============================================
  // Original APIs + New Extended APIs
  // ==============================================
  setValue(v) {
    this.syncLock = true;
    this.value = this._clamp(v);
    this._updateUI();
    this.onChange(this.value);
    this.syncLock = false;
  }
  getValue() { return this.value; }
  reset() { this.setValue(this.defaultValue); }
  setDefaultValue(v) { this.defaultValue = this._clamp(v); }
  forceUpdate() { this._updateUI(); }
  getSliderEl() { return this.sliderEl; }
  getValueLabelEl() { return this.valueLabelEl; }
  getContainerEl() { return this.container; }
  getSyncLock() { return this.syncLock; }
  setSyncLock(lock) { this.syncLock = !!lock; }

  // Dynamically modify range/unit
  setMin(min) {
    this.min = Number(min) || 0;
    this.sliderEl.min = this.min;
    this.setValue(this.value);
  }
  setMax(max) {
    this.max = Number(max) || 100;
    this.sliderEl.max = this.max;
    this.setValue(this.value);
  }
  setUnit(unit) {
    this.unit = unit;
    this._updateUI();
  }
  getRange() { return { min: this.min, max: this.max }; }
  getUnit() { return this.unit; }

  // 🔥 New: Dynamically modify width
  setWidth(width) {
    this.width = width || '240px';
    // Update DOM width
    const wrapper = this.container.querySelector('div:first-child');
    if (wrapper) wrapper.style.width = this.width;
  }
  getWidth() {
    return this.width;
  }

  _updateUI() {
    if (this.sliderEl) this.sliderEl.value = this.value;
    if (this.valueLabelEl) this.valueLabelEl.textContent = this.value + this.unit;
  }
}

// Global exposure
window.CrystalProgress = CrystalProgress;
window.CrystalSlider = CrystalSlider;