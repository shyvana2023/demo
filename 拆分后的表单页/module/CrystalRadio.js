/**
 * 水晶风格单选框组封装
 * 页面仅需空 div#id 自动渲染完整DOM
 * 支持单选互斥 + 全量操作接口 + 状态监听
 */
class CrystalRadioGroup {
  /**
   * 配置参数
   * @param {Object} config - 配置
   * @param {Array} config.containerIds - 单选框容器ID数组（必填）
   * @param {Array} config.labels - 对应显示文字数组（可选）
   * @param {string} config.defaultSelected - 默认选中的容器ID（可选）
   * @param {Function} config.onChange - 选中变化回调 (selectedId: string)=>{}
   */
  constructor(config) {
    // 外部配置
    this.containerIds = config.containerIds || [];
    this.labels = config.labels || this.containerIds.map(() => 'Option');
    this.defaultSelected = config.defaultSelected || '';
    this.onChange = config.onChange || function () {};

    // 实例存储
    this.radioInstances = [];
    this.currentSelected = this.defaultSelected;
  }

  /**
   * 初始化：渲染所有DOM + 绑定事件
   */
  init() {
    if (!this.containerIds.length) {
      console.error('CrystalRadioGroup：未传入单选框容器ID');
      return;
    }

    // 遍历渲染所有单选框
    this.containerIds.forEach((id, index) => {
      this._renderSingleRadio(id, this.labels[index]);
    });

    // 绑定组事件
    this._bindGroupEvents();
    // 初始化默认选中
    this.setSelected(this.defaultSelected);
  }

  /**
   * 私有：渲染单个单选框DOM
   */
  _renderSingleRadio(containerId, label) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 自动渲染原始DOM结构
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

    // 存储DOM元素
    this.radioInstances.push({
      id: containerId,
      container,
      box: container.querySelector('.radio-box'),
      labelEl: container.querySelector('.radio-label')
    });
  }

  /**
   * 私有：绑定单选组互斥事件
   */
  _bindGroupEvents() {
    this.radioInstances.forEach(item => {
      item.container.addEventListener('click', () => {
        this.setSelected(item.id);
      });
    });
  }

  /**
   * 私有：更新全组UI样式
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
  // 🔥 对外暴露【全量操作接口】
  // ==============================================
  /**
   * 获取当前选中的ID
   * @returns {string}
   */
  getSelected() {
    return this.currentSelected;
  }

  /**
   * 设置选中项
   * @param {string} selectedId - 要选中的容器ID
   */
  setSelected(selectedId) {
    if (!this.radioInstances.some(item => item.id === selectedId)) return;
    this.currentSelected = selectedId;
    this._updateAllUI();
    this.onChange(this.currentSelected);
  }

  /**
   * 重置为初始默认状态
   */
  reset() {
    this.setSelected(this.defaultSelected);
  }

  /**
   * 修改指定单选框的显示文字
   * @param {string} id - 容器ID
   * @param {string} text - 新文字
   */
  setLabel(id, text) {
    const item = this.radioInstances.find(i => i.id === id);
    if (item) item.labelEl.textContent = text;
  }
}

// 全局暴露
window.CrystalRadioGroup = CrystalRadioGroup;