/**
 * 隔离式自定义下拉框（修复onChange重复触发）
 * 无全局污染 | 不影响其他下拉 | 样式100%兼容
 */
class AutocompleteDropdown {
  /**
   * 配置参数（外部唯一入口）
   * @param {Object} config
   * @param {string} config.containerId - 【必填】容器唯一ID（隔离核心）
   * @param {Array} config.options - 【必填】下拉数据 [{label: '显示名', value: '值'}, ...]
   * @param {string|number} config.defaultValue - 【可选】初始选中值
   * @param {Function} config.onChange - 选中值触发回调 (value, label)=>{}
   */
  constructor(config) {
    this.containerId = config.containerId;
    this.options = config.options || [];
    this.defaultValue = config.defaultValue || '';
    this.onChange = config.onChange || function(){};

    // 隔离DOM元素
    this.container = null;
    this.inputId = `${this.containerId}_input`;
    this.panelId = `${this.containerId}_panel`;
    this.inputEl = null;
    this.panelEl = null;
  }

  init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error('下拉框初始化失败：未找到容器 ' + this.containerId);
      return;
    }

    // 生成隔离DOM结构
    this.container.innerHTML = `
      <div class="autocomplete-wrapper" style="position:relative;">
        <div class="autocomplete-input-wrapper" id="${this.containerId}_toggle" tabindex="0" style="cursor:pointer;">
          <input 
            id="${this.inputId}" 
            class="autocomplete-input-field" 
            placeholder="请选择一个选项" 
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

  /** 渲染下拉选项 */
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
      // 🔥 修复：只调用setValue，不重复触发回调
      div.onclick = () => {
        this.setValue(item.value);
        this._hidePanel();
      };
      this.panelEl.appendChild(div);
    });
  }

  /** 绑定事件 */
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

  /** 隐藏面板 */
  _hidePanel() {
    this.panelEl.style.display = 'none';
  }

  // 取值接口
  getValue() {
    return this.inputEl?.dataset.value || '';
  }

  // 赋值接口（统一触发onChange，唯一入口）
  setValue(value) {
    if (!this.inputEl) return;
    const target = this.options.find(item => item.value === value);
    
    if (target) {
      this.inputEl.value = target.label;
      this.inputEl.dataset.value = target.value;
      this.onChange(target.value, target.label); // 🔥 唯一触发点
    } else {
      this.inputEl.value = '';
      this.inputEl.dataset.value = '';
      this.onChange('', '');
    }
  }
}

window.AutocompleteDropdown = AutocompleteDropdown;