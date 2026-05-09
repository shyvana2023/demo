/**
 * 水晶风格复选框封装
 * 页面仅需一个空 div#id 自动渲染完整DOM
 * 暴露全量操作接口 + 状态监听
 */
class CrystalCheckbox {
  /**
   * 配置参数
   * @param {Object} config - 配置
   * @param {string} config.containerId - 容器唯一ID（必填）
   * @param {string} config.label - 复选框文字（默认：Option）
   * @param {boolean} config.defaultChecked - 默认是否选中（默认 false）
   * @param {Function} config.onChange - 状态变化回调 (checked: boolean)=>{}
   */
  constructor(config) {
    // 外部配置
    this.containerId = config.containerId;
    this.label = config.label || 'Option';
    this.defaultChecked = !!config.defaultChecked;
    this.defaultIndeterminate = !!config.defaultIndeterminate;
    this.onChange = config.onChange || function(){};

    // DOM 元素
    this.container = null;
    this.checkboxBox = null;
    this.checkboxLabel = null;
    // 内部状态
    this.checked = this.defaultChecked;
    this.indeterminate = this.defaultIndeterminate;
  }

  /**
   * 初始化：自动渲染DOM + 绑定事件
   */
  init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error('CrystalCheckbox：未找到容器 ->', this.containerId);
      return;
    }

    // 🔥 自动渲染完整复选框DOM（100%还原你的原始结构）
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

    // 获取DOM
    const core = document.getElementById(`${this.containerId}_core`);
    this.checkboxBox = core.querySelector('.checkbox-box');
    this.checkboxLabel = core.querySelector('.checkbox-label');

    // 绑定事件 + 初始化UI
    this._bindEvent();
    this._updateUI();
  }

  /**
   * 私有：绑定点击事件
   */
  _bindEvent() {
    this.container.addEventListener('click', () => {
      this.toggle();
    });
  }

  /**
   * 私有：更新UI样式（核心渲染逻辑）
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
  // 🔥 对外暴露【全量操作接口】
  // ==============================================
  /**
   * 获取选中状态
   * @returns {boolean}
   */
  getChecked() {
    return this.checked;
  }

  /**
   * 设置选中状态
   * @param {boolean} checked - true 选中 / false 取消
   */
  setChecked(checked) {
    this.checked = !!checked;
    if (this.checked) this.indeterminate = false;
    this._updateUI();
    this.onChange(this.checked);
  }

  /**
   * 设置半选状态
   * @param {boolean} indeterminate - true 半选 / false 取消
   */
  setIndeterminate(indeterminate) {
    this.indeterminate = !!indeterminate;
    if (this.indeterminate) this.checked = false;
    this._updateUI();
    this.onChange(this.checked);
  }

  /**
   * 获取半选状态
   * @returns {boolean}
   */
  getIndeterminate() {
    return this.indeterminate;
  }

  /**
   * 切换状态（选中 ↔ 取消）
   */
  toggle() {
    this.checked = !this.checked;
    this.indeterminate = false;
    this._updateUI();
    this.onChange(this.checked);
  }

  /**
   * 重置为默认状态
   */
  reset() {
    this.checked = this.defaultChecked;
    this.indeterminate = this.defaultIndeterminate;
    this._updateUI();
    this.onChange(this.checked);
  }

  /**
   * 修改显示文字
   * @param {string} text - 新文字
   */
  setLabel(text) {
    this.label = text;
    this.checkboxLabel.textContent = text;
  }
}

// 全局暴露，页面直接调用
window.CrystalCheckbox = CrystalCheckbox;