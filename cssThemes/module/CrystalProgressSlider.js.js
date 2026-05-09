/**
 * ==============================
 * 1. 独立进度条组件（纯展示）
 * 支持：自定义min/max范围 + 自定义单位 + 自定义宽度(px/%) + 动态修改配置
 * ==============================
 */
class CrystalProgress {
  constructor(config) {
    this.containerId = config.containerId;
    // 🔥 新增：自定义宽度 默认100% 支持px/%
    this.width = config.width || '100%';
    // 自定义范围 默认0-100
    this.min = Number(config.min) || 0;
    this.max = Number(config.max) || 100;
    // 自定义单位 默认%
    this.unit = config.unit !== undefined ? config.unit : '%';
    // 默认值（范围校验）
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
      console.error("CrystalProgress：未找到容器 ->", this.containerId);
      return;
    }
    // 渲染DOM：宽度动态绑定 支持px/%
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
  // 私有工具方法
  // ==============================================
  /** 数值限制在范围内 */
  _clamp(v) {
    const val = Number(v) || 0;
    return Math.max(this.min, Math.min(this.max, val));
  }
  /** 计算进度条百分比宽度（适配自定义范围） */
  _getPercent() {
    if (this.max === this.min) return 0;
    return ((this.value - this.min) / (this.max - this.min)) * 100;
  }

  // ==============================================
  // 原有接口 + 新增拓展接口
  // ==============================================
  /** 设置值 */
  setValue(v) {
    this.value = this._clamp(v);
    this._updateUI();
    this.onChange(this.value);
  }
  /** 获取当前值 */
  getValue() {
    return this.value;
  }
  /** 重置默认值 */
  reset() {
    this.setValue(this.defaultValue);
  }
  /** 修改默认值 */
  setDefaultValue(v) {
    this.defaultValue = this._clamp(v);
  }
  /** 强制刷新UI */
  forceUpdate() {
    this._updateUI();
  }
  /** 获取填充DOM */
  getFillEl() {
    return this.progressFill;
  }
  /** 获取标签DOM */
  getLabelEl() {
    return this.progressLabel;
  }
  /** 获取容器DOM */
  getContainerEl() {
    return this.container;
  }

  // 动态修改范围/单位
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

  // 🔥 新增：动态修改宽度
  setWidth(width) {
    this.width = width || '100%';
    // 更新DOM宽度
    const wrapper = this.container.querySelector('div:first-child');
    if (wrapper) wrapper.style.width = this.width;
  }
  getWidth() {
    return this.width;
  }

  // 私有更新UI
  _updateUI() {
    if (this.progressFill) this.progressFill.style.width = this._getPercent() + "%";
    if (this.progressLabel) this.progressLabel.textContent = this.value + this.unit;
  }
}

/**
 * ==============================
 * 2. 极简独立滑块组件（滑块+右侧值）
 * 支持：自定义min/max范围 + 自定义单位 + 自定义宽度(px/%) + 全接口暴露
 * ==============================
 */
class CrystalSlider {
  constructor(config) {
    this.containerId = config.containerId;
    // 🔥 新增：自定义宽度 默认240px 支持px/%
    this.width = config.width || '240px';
    // 自定义范围 默认0-100
    this.min = Number(config.min) || 0;
    this.max = Number(config.max) || 100;
    // 自定义单位 默认%
    this.unit = config.unit !== undefined ? config.unit : '%';
    // 默认值（范围校验）
    this.defaultValue = this._clamp(Number(config.defaultValue) || 40);
    this.onChange = config.onChange || function () {};

    // 同步锁/状态
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
      console.error("CrystalSlider：未找到容器 ->", this.containerId);
      return;
    }
    // 渲染DOM：宽度动态绑定 支持px/%
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

  // 绑定拖动事件
  _bindEvents() {
    this.sliderEl?.addEventListener("input", (e) => {
      if (this.syncLock) return;
      this.setValue(e.target.value);
    });
  }

  // ==============================================
  // 私有工具方法
  // ==============================================
  _clamp(v) {
    const val = Number(v) || 0;
    return Math.max(this.min, Math.min(this.max, val));
  }

  // ==============================================
  // 原有接口 + 新增拓展接口
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

  // 动态修改范围/单位
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

  // 🔥 新增：动态修改宽度
  setWidth(width) {
    this.width = width || '240px';
    // 更新DOM宽度
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

// 全局暴露
window.CrystalProgress = CrystalProgress;
window.CrystalSlider = CrystalSlider;