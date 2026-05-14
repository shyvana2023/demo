/**
 * Isolated Custom Dropdown (Fixed onChange duplicate trigger issue)
 * No global pollution | Does not affect other dropdowns | 100% style compatible
 */
class AutocompleteDropdown {
  /**
   * Configuration (Only external entry point)
   * @param {Object} config
   * @param {string} config.containerId - 【Required】Unique container ID (Isolation core)
   * @param {Array} config.options - 【Required】Dropdown data [{label: 'Display Name', value: 'Value'}, ...]
   * @param {string|number} config.defaultValue - 【Optional】Initial selected value
   * @param {Function} config.onChange - Callback triggered on selection (value, label)=>{}
   */
  constructor(config) {
    this.containerId = config.containerId;
    this.options = config.options || [];
    this.defaultValue = config.defaultValue || '';
    this.onChange = config.onChange || function(){};

    // Isolated DOM elements
    this.container = null;
    this.inputId = `${this.containerId}_input`;
    this.panelId = `${this.containerId}_panel`;
    this.inputEl = null;
    this.panelEl = null;
  }

  init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error('Dropdown initialization failed: Container not found ' + this.containerId);
      return;
    }

    // Generate isolated DOM structure
    this.container.innerHTML = `
      <div class="autocomplete-wrapper" style="position:relative;">
        <div class="autocomplete-input-wrapper" id="${this.containerId}_toggle" tabindex="0" style="cursor:pointer;">
          <input 
            id="${this.inputId}" 
            class="autocomplete-input-field" 
            placeholder="Please select an option" 
            readonly
          >
          <div class="autocomplete-input-line"></div>
        </div>
        <div 
          id="${this.panelId}" 
          class="autocomplete-panel" 
          aria-hidden="true" 
          style="min-width:220px;display:none;position:absolute;top:100%;left:0;z-index:999;background:linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, var(--frosted-bg-subtle) 15%, var(--frosted-bg-subtle) 85%, rgba(0, 0, 0, 0.02) 100%);border:1px solid var(--frosted-border-default);">
        </div>
      </div>
    `;

    this.inputEl = document.getElementById(this.inputId);
    this.panelEl = document.getElementById(this.panelId);
    const toggleEl = document.getElementById(`${this.containerId}_toggle`);

    this._renderItems();
    this._bindEvents(toggleEl);
    this.setValue(this.defaultValue);
  }

  /** Render dropdown options */
  _renderItems() {
    this.panelEl.innerHTML = '';
    this.options.forEach(item => {
      const div = document.createElement('div');
      div.className = 'autocomplete-item';
      div.dataset.value = item.value;
      div.textContent = item.label;
      div.style.padding = '6px 12px';
      div.style.cursor = 'pointer';
      div.onmouseover = () => div.style.background = 'var(--frosted-cyan-bg)';
      div.onmouseout = () => div.style.background = 'transparent';
      // 🔥 Fixed: Only call setValue, no duplicate callback trigger
      div.onclick = () => {
        this.setValue(item.value);
        this._hidePanel();
      };
      this.panelEl.appendChild(div);
    });
  }

  /** Bind events */
  _bindEvents(toggleEl) {
    toggleEl.addEventListener('click', (e) => {
      e.stopPropagation();
      this.panelEl.style.display = this.panelEl.style.display === 'none' ? 'block' : 'none';
    });

    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this._hidePanel();
      }
    });
  }

  /** Hide panel */
  _hidePanel() {
    this.panelEl.style.display = 'none';
  }

  // Value getter interface
  getValue() {
    return this.inputEl?.dataset.value || '';
  }

  // Value setter interface (Unified onChange trigger, only one entry)
  setValue(value) {
    if (!this.inputEl) return;
    const target = this.options.find(item => item.value === value);
    
    if (target) {
      this.inputEl.value = target.label;
      this.inputEl.dataset.value = target.value;
      this.onChange(target.value, target.label); // 🔥 Only trigger point
    } else {
      this.inputEl.value = '';
      this.inputEl.dataset.value = '';
      this.onChange('', '');
    }
  }
}

window.AutocompleteDropdown = AutocompleteDropdown;