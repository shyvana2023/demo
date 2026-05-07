/**
 * 自动补全功能封装
 * @param {Object} config - 配置参数（外部唯一传入的入口）
 * @param {Array} config.options - 自动补全数据源（暴露的核心数据）
 * @param {String} config.inputSelector - 输入框的选择器/id/class（暴露的DOM入口）
 * @param {String} config.panelSelector - 下拉面板的选择器/id/class（暴露的DOM入口）
 * @param {Function} config.onChange - 新增：选中值触发回调 (value)=>{}
 */
function initAutocomplete(config) {
  // 解构外部传入的配置，设置兜底默认值
  const {
    options = [],
    inputSelector = '.autocomplete-input-field',
    panelSelector = '.autocomplete-panel',
    onChange = () => {} // 新增：选中回调，默认空函数
  } = config || {};

  // 获取DOM元素
  const input = document.querySelector(inputSelector);
  const panel = document.querySelector(panelSelector);
  let activeIndex = -1;

  // 校验：防止DOM不存在导致报错
  if (!input || !panel) {
    console.error('自动补全初始化失败：未找到输入框/下拉面板');
    return;
  }

  // 核心输入逻辑（完全保留原功能）
  input.addEventListener('input', function () {
    const keyword = this.value.trim().toLowerCase();
    // 重置状态
    panel.innerHTML = '';
    activeIndex = -1;

    // 无输入时隐藏面板
    if (!keyword) {
      panel.classList.remove('show');
      return;
    }

    // 过滤匹配数据
    const matchList = options.filter(item =>
      item.toLowerCase().includes(keyword)
    );

    // 渲染下拉选项
    matchList.forEach(item => {
      const div = document.createElement('div');
      div.className = 'autocomplete-item';
      div.textContent = item;
      
      // 点击选中赋值 + 触发onChange
      div.onclick = () => {
        input.value = item;
        panel.classList.remove('show');
        onChange(item); // 🔥 选中时触发回调，返回选中的值
      };
      panel.appendChild(div);
    });

    // 显示面板
    panel.classList.add('show');
  });
}

// 全局暴露初始化方法（兼容所有浏览器，直接引入即可用）
window.initAutocomplete = initAutocomplete;