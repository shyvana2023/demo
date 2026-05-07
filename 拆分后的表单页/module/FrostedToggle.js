/**
 * 磨砂开关组件封装
 * 页面仅需一个空 div#id 自动生成完整DOM
 * 暴露：getState / setState / onChange 回调
 */
class FrostedToggle {
  /**
   * 配置参数
   * @param {Object} config
   * @param {string} config.containerId - 容器唯一ID（必填）
   * @param {boolean} config.defaultState - 默认状态 false=OFF / true=ON
   * @param {Function} config.onChange - 状态切换回调 (isOn)=>{}
   */
  constructor(config) {
    this.containerId = config.containerId;
    this.defaultState = config.defaultState || false;
    this.onChange = config.onChange || function () {};

    // DOM元素
    this.container = null;
    this.toggleEl = null;
    this.labelEl = null;
    this.isOn = this.defaultState;
  }

  // 初始化：自动生成DOM + 绑定事件
  init() {
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      console.error('FrostedToggle：未找到容器 ' + this.containerId);
      return;
    }

    // 🔥 自动生成完整开关DOM（100%还原原有结构，样式零失效）
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

    // 获取隔离DOM
    this.toggleEl = document.getElementById(`${this.containerId}_switch`);
    this.labelEl = document.getElementById(`${this.containerId}_label`);

    // 绑定事件 + 初始化状态
    this._bindEvents();
    this.update();
  }

  // 绑定交互事件（点击 + 键盘）
  _bindEvents() {
    // 点击切换
    this.toggleEl.addEventListener('click', () => {
      this.toggle();
    });

    // 回车 / 空格 切换（无障碍支持）
    this.toggleEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  // 切换状态
  toggle() {
    this.isOn = !this.isOn;
    this.update();
    this.onChange(this.isOn); // 触发回调
  }

  // 更新UI状态
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
  // 🔥 对外暴露接口
  // ==============================================
  // 获取当前状态
  getState() {
    return this.isOn;
  }

  // 设置状态
  setState(state) {
    this.isOn = !!state;
    this.update();
    this.onChange(this.isOn);
  }
}

// 全局暴露
window.FrostedToggle = FrostedToggle;