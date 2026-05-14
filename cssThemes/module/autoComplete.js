/**
 * Autocomplete Function Encapsulation
 * @param {Object} config - Configuration (only external entry parameter)
 * @param {Array} config.options - Autocomplete data source (core exposed data)
 * @param {String} config.inputSelector - Input selector/id/class (exposed DOM entry)
 * @param {String} config.panelSelector - Dropdown panel selector/id/class (exposed DOM entry)
 * @param {Function} config.onChange - New: callback on selection (value)=>{}
 */
function initAutocomplete(config) {
  // Destructure external config with fallback defaults
  const {
    options = [],
    inputSelector = '.autocomplete-input-field',
    panelSelector = '.autocomplete-panel',
    onChange = () => {} // New: selection callback, empty function by default
  } = config || {};

  // Get DOM elements
  const input = document.querySelector(inputSelector);
  const panel = document.querySelector(panelSelector);
  let activeIndex = -1;

  // Validation: prevent errors if DOM is missing
  if (!input || !panel) {
    console.error('Autocomplete initialization failed: Input or panel not found');
    return;
  }

  // Core input logic (fully preserved original functionality)
  input.addEventListener('input', function () {
    const keyword = this.value.trim().toLowerCase();
    // Reset state
    panel.innerHTML = '';
    activeIndex = -1;

    // Hide panel when no input
    if (!keyword) {
      panel.classList.remove('show');
      return;
    }

    // Filter matched data
    const matchList = options.filter(item =>
      item.toLowerCase().includes(keyword)
    );

    // Render dropdown items
    matchList.forEach(item => {
      const div = document.createElement('div');
      div.className = 'autocomplete-item';
      div.textContent = item;
      
      // Click to select + trigger onChange
      div.onclick = () => {
        input.value = item;
        panel.classList.remove('show');
        onChange(item); // 🔥 Trigger callback when selected, return selected value
      };
      panel.appendChild(div);
    });

    // Show panel
    panel.classList.add('show');
  });
}

// Expose init method globally (compatible with all browsers, ready to use)
window.initAutocomplete = initAutocomplete;