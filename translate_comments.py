import re

# Read file
with open('cssThemes/from2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Translation dictionary: exact comment text (inside delimiters) -> English
# We replace content inside <!-- -->, //, /* */

translations = {
    # HTML comments
    "======================\n                    纯字体 DOM 展示区域\n                    无任何控件、无表单、无交互元素\n                ======================":
    "======================\n                    Pure Font DOM Display Area\n                    No controls, no forms, no interactive elements\n                ======================?",

    "Native Modal: 原生 JS 实现的模态框（继承 frosted 样式）\n      - 放置位置：DOM 底部（此注释及内容即为模态框区域）\n      - 触发：点击 `#openModalBtn`\n      - 关闭：点击右上关闭按钮 / 点击遮罩 / 按 `Esc` / 点击 Cancel":
    "Native Modal: Modal implemented in vanilla JS (inherits frosted styles)\n      - Placement: DOM bottom (this comment and content constitute the modal area)\n      - Trigger: click `#openModalBtn`\n      - Close: top-right close button / click overlay / press `Esc` / click Cancel",

    "下拉框  <script src=\"./module/CustomDropdown.js\"></script>":
    "Dropdown  <script src=\"./module/CustomDropdown.js\"></script>",

    "业务组件 - 完整表单演示 / Complete Form Demo\n    包含姓名、手机、备注输入框，复选框、单选框及提交验证":
    "Business Component - Complete Form Demo / Complete Form Demo\n    Includes name, phone, remark inputs, checkbox, radio, and submit validation",

    "业务组件 - 穿梭框 / Transfer Component\n    左右面板数据穿梭选择，支持点击选中与批量移动":
    "Business Component - Transfer / Transfer Component\n    Left-right panel data shuttle selection, supports click-to-select and batch move",

    "业务组件 - 穿梭框初始化 / Transfer Component Init":
    "Business Component - Transfer Init / Transfer Component Init",

    "两组 2x2 圆点网格旋转加载效果 / Loading spinner with dot groups":
    "Two 2x2 dot grid rotation loading effect / Loading spinner with dot groups",

    "主标题层级 / Main Title Level":
    "Main Title Level / Main Title Level",

    "交互组件 - Feedback 消息反馈":
    "Interactive Component - Feedback Message",

    "交互组件 - 开关控件 + 标签徽章":
    "Interactive Component - Toggle + Badge",

    "交互组件 - 按钮变体（快速响应线条效果）":
    "Interactive Component - Button Variants (speed line effect)",

    "交互组件 - 按钮集合":
    "Interactive Component - Button Collection",

    "交互组件 - 模态框触发区域":
    "Interactive Component - Modal Trigger Area",

    "使用方式":
    "Usage",

    "动画组件 - 加载圆点旋转动画":
    "Animation Component - Loading Dot Rotation",

    "单选框  <script src=\"./module/CrystalRadio.js\"></script>":
    "Radio  <script src=\"./module/CrystalRadio.js\"></script>",

    "单选框组 / Radio Button Group":
    "Radio Button Group / Radio Button Group",

    "字重展示 / Font Weight Display":
    "Font Weight Display / Font Weight Display",

    "展示带底部速度线动画的按钮样式 / Button variants with speed line":
    "Button styles with bottom speed line animation / Button variants with speed line",

    "开关  <script src=\"./module/FrostedToggle.js\"></script>":
    "Toggle  <script src=\"./module/FrostedToggle.js\"></script>",

    "文本域  <script src=\"./module/textareaCounter.js\"></script>":
    "Textarea  <script src=\"./module/textareaCounter.js\"></script>",

    "日期时间选择器  <script src=\"./module/time-picker.js\"></script>":
    "DateTime Picker  <script src=\"./module/time-picker.js\"></script>",

    "时间组件 - 日期时间选择器集合":
    "Time Component - DateTime Picker Collection",

    "时间选择器实时演示区域":
    "Time Picker Live Demo Area",

    "标签/徽章组件":
    "Badge Component",

    "标签/徽章组件 / Badge & Tag Components":
    "Badge & Tag Components / Badge & Tag Components",

    "标签文字展示 / Label Text Display":
    "Label Text Display / Label Text Display",

    "标题体系展示 / Heading System Display":
    "Heading System Display / Heading System Display",

    "树形组件  <script src=\"./module/tree.js\"></script>":
    "Tree Component  <script src=\"./module/tree.js\"></script>",

    "树形组件 - 下拉树形 + 静态树形":
    "Tree Component - Dropdown Tree + Static Tree",

    "正文字体展示 / Body Font Display":
    "Body Font Display / Body Font Display",

    "点击下方按钮唤起原生 JS 模态框 / Click to open native modal":
    "Click button below to invoke native JS modal / Click to open native modal",

    "独立滑块容器":
    "Standalone Slider Container",

    "独立进度条容器":
    "Standalone Progress Bar Container",

    "磨砂开关组件":
    "Frosted Toggle Component",

    "穿梭框  <script src=\"./module/frostedTransfer.js\"></script>":
    "Transfer  <script src=\"./module/frostedTransfer.js\"></script>",

    "自动补全  <script src=\"./module/autoComplete.js\"></script>":
    "Auto Complete  <script src=\"./module/autoComplete.js\"></script>",

    "自动识别 \"English / 中文\" 双语文本，支持一键切换":
    "Auto-detect \"English / Chinese\" bilingual text, support one-click switch",

    "表单 - 单选框（示例：性别选择，必填）":
    "Form - Radio (Example: Gender selection, required)",

    "表单 - 备注输入":
    "Form - Remark Input",

    "表单 - 复选框（示例：同意条款，必填）":
    "Form - Checkbox (Example: Agree to terms, required)",

    "表单 - 姓名输入":
    "Form - Name Input",

    "表单 - 手机号输入":
    "Form - Phone Input",

    "表单 - 提交按钮":
    "Form - Submit Button",

    "表单组件 - 下拉选择框":
    "Form Component - Dropdown Select",

    "表单组件 - 多行文本域":
    "Form Component - Textarea",

    "表单组件 - 数字输入框":
    "Form Component - Number Input",

    "表单组件 - 普通文本输入框":
    "Form Component - Text Input",

    "表单组件 - 智能补全输入框":
    "Form Component - Auto Complete Input",

    "语言切换按钮 / Language Switch Button":
    "Language Switch Button / Language Switch Button",

    "进度条or滑块  <script src=\"./module/CrystalProgressSlider.js.js\"></script>":
    "Progress or Slider  <script src=\"./module/CrystalProgressSlider.js.js\"></script>",

    "进度组件 - 进度条 + 滑块控制器":
    "Progress Component - Progress Bar + Slider Controller",

    "选择组件 - 复选框 + 单选框 / Selection Components - Checkbox & Radio":
    "Selection Components - Checkbox & Radio / Selection Components - Checkbox & Radio",

    "错误提示容器":
    "Error Message Container",

    "页面主标题 / Page Main Title":
    "Page Main Title / Page Main Title",

    "复选框  <script src=\"./module/CrystalCheckbox.js\"></script>":
    "Checkbox  <script src=\"./module/CrystalCheckbox.js\"></script>",

    "复选框组 / Checkbox Group":
    "Checkbox Group / Checkbox Group",

    "========================\n       Segoe UI 核心字体规范（纯字体，无任何控件样式）\n    ======================":
    "========================\n       Segoe UI Core Font Spec (pure fonts, no control styles)\n    ======================",

    "==============================================\n    表单组件 - 普通文本输入框\n    ==============================================":
    "==============================================\n    Form Component - Text Input\n    ==============================================",

    "==============================================\n    表单组件 - 数字输入框\n    ==============================================":
    "==============================================\n    Form Component - Number Input\n    ==============================================",

    "==============================================\n    表单组件 - 多行文本域\n    ==============================================":
    "==============================================\n    Form Component - Textarea\n    ==============================================",

    "==============================================\n    表单组件 - 智能补全输入框\n    ==============================================":
    "==============================================\n    Form Component - Auto Complete Input\n    ==============================================",

    "==============================================\n    表单组件 - 下拉选择框\n    ==============================================":
    "==============================================\n    Form Component - Dropdown Select\n    ==============================================",

    "==============================================\n    Tooltip\n    ==============================================":
    "==============================================\n    Tooltip\n    ==============================================",

    "==============================================\n    交互组件 - 按钮集合\n    ==============================================":
    "==============================================\n    Interactive Component - Button Collection\n    ==============================================",

    "==============================================\n    交互组件 - 开关控件 + 标签徽章\n    ==============================================":
    "==============================================\n    Interactive Component - Toggle + Badge\n    ==============================================",

    "==============================================\n    选择组件 - 复选框 + 单选框 / Selection Components - Checkbox & Radio\n    ==============================================":
    "==============================================\n    Selection Components - Checkbox & Radio / Selection Components - Checkbox & Radio\n    ==============================================",

    "==============================================\n    进度组件 - 进度条 + 滑块控制器\n    ==============================================":
    "==============================================\n    Progress Component - Progress Bar + Slider Controller\n    ==============================================",

    "==============================================\n    业务组件 - 完整表单演示 / Complete Form Demo\n    包含姓名、手机、备注输入框，复选框、单选框及提交验证\n    ==============================================":
    "==============================================\n    Business Component - Complete Form Demo / Complete Form Demo\n    Includes name, phone, remark inputs, checkbox, radio, and submit validation\n    ==============================================",

    "==============================================\n    时间组件 - 日期时间选择器集合\n    ==============================================":
    "==============================================\n    Time Component - DateTime Picker Collection\n    ==============================================",

    "==============================================\n    树形组件 - 下拉树形 + 静态树形\n    ==============================================":
    "==============================================\n    Tree Component - Dropdown Tree + Static Tree\n    ==============================================",

    "==============================================\n    业务组件 - 穿梭框 / Transfer Component\n    左右面板数据穿梭选择，支持点击选中与批量移动\n    ==============================================":
    "==============================================\n    Business Component - Transfer / Transfer Component\n    Left-right panel data shuttle selection, supports click-to-select and batch move\n    ==============================================",

    "==============================================\n    交互组件 - Feedback 消息反馈\n    支持四种状态与三种位置的消息提示 / Message feedback with 4 states & 3 positions\n    ==============================================":
    "==============================================\n    Interactive Component - Feedback Messages\n    Message feedback with 4 states & 3 positions / Message feedback with 4 states & 3 positions\n    ==============================================",

    "==============================================\n    交互组件 - 模态框触发区域\n    点击下方按钮唤起原生 JS 模态框 / Click to open native modal\n    ==============================================":
    "==============================================\n    Interactive Component - Modal Trigger Area\n    Click button below to invoke native JS modal / Click to open native modal\n    ==============================================",

    "==============================================\n    交互组件 - 按钮变体（快速响应线条效果）\n    展示带底部速度线动画的按钮样式 / Button variants with speed line\n    ==============================================":
    "==============================================\n    Interactive Component - Button Variants (speed line effect)\n    Button styles with bottom speed line animation / Button variants with speed line\n    ==============================================",

    "==============================================\n    动画组件 - 加载圆点旋转动画\n    两组 2x2 圆点网格旋转加载效果 / Loading spinner with dot groups\n    ==============================================":
    "==============================================\n    Animation Component - Loading Dot Rotation\n    Two 2x2 dot grid rotation loading effect / Loading spinner with dot groups\n    ==============================================",

    "===========================================\n    国际化语言切换系统 / i18n Language Switch System\n    自动识别 \"English / 中文\" 双语文本，支持一键切换\n    ===========================================":
    "===========================================\n    i18n Language Switch System / i18n Language Switch System\n    Auto-detect \"English / Chinese\" bilingual text, support one-click switch\n    ===========================================",

    "===========================================\n    业务组件 - 穿梭框初始化 / Transfer Component Init\n    ===========================================":
    "===========================================\n    Business Component - Transfer Init / Transfer Component Init\n    ===========================================",

    # Multi-line JS comments
    "* 独立树形组件 - 纯JS封装\n* 调用：new TreeComponent(selector, data, options)\n* 取值：tree.getValue()":
    "* Standalone Tree Component - Pure JS Encapsulation\n* Usage: new TreeComponent(selector, data, options)\n* Get Value: tree.getValue()",

    "* 修改默认值":
    "* Modify Default Value",

    "* 强制刷新UI":
    "* Force Refresh UI",

    "* 数值限制在范围内":
    "* Clamp Value to Range",

    "* 渲染下拉选项":
    "* Render Dropdown Options",

    "* 绑定事件":
    "* Bind Events",

    "* 获取填充DOM":
    "* Get Fill DOM",

    "* 获取容器DOM":
    "* Get Container DOM",

    "* 获取当前值":
    "* Get Current Value",

    "* 获取标签DOM":
    "* Get Label DOM",

    "* 计算进度条百分比宽度（适配自定义范围）":
    "* Calculate Progress Bar Percentage Width (adapt to custom range)",

    "* 设置值":
    "* Set Value",

    "* 重置默认值":
    "* Reset Default Value",

    "* 隐藏面板":
    "* Hide Panel",

    "* 修改指定单选框的显示文字\n             * @param {string} id - 容器ID\n             * @param {string} text - 新文字":
    "* Modify the display text of a specific radio button\n             * @param {string} id - Container ID\n             * @param {string} text - New text",

    "* 修改显示文字\n             * @param {string} text - 新文字":
    "* Modify display text\n             * @param {string} text - New text",

    "* 切换状态（选中 ↔ 取消）":
    "* Toggle state (checked ↔ unchecked)",

    "* 初始化：渲染所有DOM + 绑定事件":
    "* Init: Render all DOM + Bind events",

    "* 初始化：自动渲染DOM + 绑定事件":
    "* Init: Auto-render DOM + Bind events",

    "* 水晶风格复选框封装\n             * 页面仅需一个空 div#id 自动渲染完整DOM\n             * 暴露全量操作接口 + 状态监听":
    "* Crystal-style Checkbox Encapsulation\n             * Page only needs an empty div#id to auto-render full DOM\n             * Exposes full operation interface + state listening",

    "* 私有：更新UI样式（核心渲染逻辑）":
    "* Private: Update UI style (core render logic)",

    "* 私有：更新全组UI样式":
    "* Private: Update group UI styles",

    "* 私有：渲染单个单选框DOM":
    "* Private: Render single radio button DOM",

    "* 私有：绑定单选组互斥事件":
    "* Private: Bind radio group mutual exclusion events",

    "* 私有：绑定点击事件":
    "* Private: Bind click events",

    "* 获取半选状态\n             * @returns {boolean}":
    "* Get indeterminate state\n             * @returns {boolean}",

    "* 获取当前选中的ID\n             * @returns {string}":
    "* Get currently selected ID\n             * @returns {string}",

    "* 获取选中状态\n             * @returns {boolean}":
    "* Get checked state\n             * @returns {boolean}",

    "* 设置半选状态\n             * @param {boolean} indeterminate - true 半选 / false 取消":
    "* Set indeterminate state\n             * @param {boolean} indeterminate - true indeterminate / false cancel",

    "* 设置选中状态\n             * @param {boolean} checked - true 选中 / false 取消":
    "* Set checked state\n             * @param {boolean} checked - true checked / false unchecked",

    "* 设置选中项\n             * @param {string} selectedId - 要选中的容器ID":
    "* Set selected item\n             * @param {string} selectedId - Container ID to select",

    "* 配置参数\n             * @param {Object} config\n             * @param {string} config.containerId - 容器唯一ID（必填）\n             * @param {boolean} config.defaultState - 默认状态 false=OFF / true=ON\n             * @param {Function} config.onChange - 状态切换回调 (isOn)=>{}":
    "* Config parameters\n             * @param {Object} config\n             * @param {string} config.containerId - Unique container ID (required)\n             * @param {boolean} config.defaultState - Default state false=OFF / true=ON\n             * @param {Function} config.onChange - State change callback (isOn)=>{}",

    "* 配置参数\n             * @param {Object} config - 配置\n             * @param {Array} config.containerIds - 单选框容器ID数组（必填）\n             * @param {Array} config.labels - 对应显示文字数组（可选）\n             * @param {string} config.defaultSelected - 默认选中的容器ID（可选）\n             * @param {Function} config.onChange - 选中变化回调 (selectedId: string)=>{}":
    "* Config parameters\n             * @param {Object} config - Config\n             * @param {Array} config.containerIds - Radio button container ID array (required)\n             * @param {Array} config.labels - Corresponding display text array (optional)\n             * @param {string} config.defaultSelected - Default selected container ID (optional)\n             * @param {Function} config.onChange - Selection change callback (selectedId: string)=>{}",

    "* 配置参数\n             * @param {Object} config - 配置\n             * @param {string} config.containerId - 容器唯一ID（必填）\n             * @param {string} config.label - 复选框文字（默认：Option）\n             * @param {boolean} config.defaultChecked - 默认是否选中（默认 false）\n             * @param {Function} config.onChange - 状态变化回调 (checked: boolean)=>{}":
    "* Config parameters\n             * @param {Object} config - Config\n             * @param {string} config.containerId - Unique container ID (required)\n             * @param {string} config.label - Checkbox text (default: Option)\n             * @param {boolean} config.defaultChecked - Default checked state (default false)\n             * @param {Function} config.onChange - State change callback (checked: boolean)=>{}",

    "* 配置参数（外部唯一入口）\n             * @param {Object} config\n             * @param {string} config.containerId - 【必填】容器唯一ID（隔离核心）\n             * @param {Array} config.options - 【必填】下拉数据 [{label: '显示名', value: '值'}, ...]\n             * @param {string|number} config.defaultValue - 【可选】初始选中值\n             * @param {Function} config.onChange - 选中值触发回调 (value, label)=>{}":
    "* Config parameters (external unique entry)\n             * @param {Object} config\n             * @param {string} config.containerId - [Required] Unique container ID (isolation core)\n             * @param {Array} config.options - [Required] Dropdown data [{label: 'Display Name', value: 'Value'}, ...]\n             * @param {string|number} config.defaultValue - [Optional] Initial selected value\n             * @param {Function} config.onChange - Selected value trigger callback (value, label)=>{}",

    "* 重置为初始默认状态":
    "* Reset to initial default state",

    "* 重置为默认状态":
    "* Reset to default state",

    "* ==============================\n         * 2. 极简独立滑块组件（滑块+右侧值）\n         * 支持：自定义min/max范围 + 自定义单位 + 自定义宽度(px/%) + 全接口暴露\n         * ==============================":
    "* ==============================\n         * 2. Minimal Standalone Slider Component (slider + right-side value)\n         * Supports: custom min/max range + custom unit + custom width(px/%) + full interface exposure\n         * ==============================",

    "* 水晶风格单选框组封装\n         * 页面仅需空 div#id 自动渲染完整DOM\n         * 支持单选互斥 + 全量操作接口 + 状态监听":
    "* Crystal-style Radio Group Encapsulation\n         * Page only needs empty div#id to auto-render full DOM\n         * Supports radio mutual exclusion + full operation interface + state listening",

    "* 磨砂开关组件封装\n         * 页面仅需一个空 div#id 自动生成完整DOM\n         * 暴露：getState / setState / onChange 回调":
    "* Frosted Toggle Component Encapsulation\n         * Page only needs an empty div#id to auto-generate full DOM\n         * Exposes: getState / setState / onChange callbacks",

    "* 自动补全功能封装\n         * @param {Object} config - 配置参数（外部唯一传入的入口）\n         * @param {Array} config.options - 自动补全数据源（暴露的核心数据）\n         * @param {String} config.inputSelector - 输入框的选择器/id/class（暴露的DOM入口）\n         * @param {String} config.panelSelector - 下拉面板的选择器/id/class（暴露的DOM入口）\n         * @param {Function} config.onChange - 新增：选中值触发回调 (value)=>{}":
    "* Auto-complete feature encapsulation\n         * @param {Object} config - Config parameters (external unique entry)\n         * @param {Array} config.options - Auto-complete data source (exposed core data)\n         * @param {String} config.inputSelector - Input selector/id/class (exposed DOM entry)\n         * @param {String} config.panelSelector - Dropdown panel selector/id/class (exposed DOM entry)\n         * @param {Function} config.onChange - New: selected value trigger callback (value)=>{}",

    "* 隔离式自定义下拉框（修复onChange重复触发）\n         * 无全局污染 | 不影响其他下拉 | 样式100%兼容":
    "* Isolated custom dropdown (fixed onChange duplicate trigger)\n         * No global pollution | Does not affect other dropdowns | 100% style compatible",

    " * ==============================\n         * 1. 独立进度条组件（纯展示）\n         * 支持：自定义min/max范围 + 自定义单位 + 自定义宽度(px/%) + 动态修改配置\n         * ==============================":
    " * ==============================\n         * 1. Standalone Progress Bar Component (display only)\n         * Supports: custom min/max range + custom unit + custom width(px/%) + dynamic config modification\n         * ==============================",

    "* 切换主题逻辑（独立，直接调用）":
    "* Theme toggle logic (standalone, direct call)",

    "* 切换语言 / Toggle language":
    "* Toggle language / Toggle language",

    "* 双语标签解析辅助函数（组件初始化前定义）\n        根据 localStorage 或默认英文解析 \"中文 / English\" 格式":
    "* Bilingual label parsing helper function (defined before component init)\n        Parses \"Chinese / English\" format based on localStorage or default English",

    "* 时间选择器实时演示更新函数 / Live demo updater for datetime picker":
    "* Time picker live demo update function / Live demo updater for datetime picker",

    "* 更新切换按钮文字 / Update switch button label":
    "* Update toggle button text / Update switch button label",

    "* 更新页面所有双语文本 / Update all bilingual texts on page":
    "* Update all bilingual texts on page / Update all bilingual texts on page",

    "* 树形组件数据配置 / Tree component data config":
    "* Tree component data config / Tree component data config",

    "* 模块1：获取表单元素（独立）":
    "* Module 1: Get form elements (standalone)",

    "* 模块2：输入时清除红色错误（独立）":
    "* Module 2: Clear red error on input (standalone)",

    "* 模块3：表单验证主函数（独立） / Form validation main function":
    "* Module 3: Form validation main function (standalone) / Form validation main function",

    "* 模块4：提交按钮点击事件（独立）":
    "* Module 4: Submit button click event (standalone)",

    "* 解析双语文本：提取 \"X / Y\" 或 \"X | Y\" 中的对应部分":
    "* Parse bilingual text: extract corresponding part from \"X / Y\" or \"X | Y\"",

    "* ==============================\n         * \n         * 模态框使用示例（可删除或修改）：\n         * nativeModalApi.createTrigger(cfg)\n              nativeModalApi.close()\n              nativeModalApi.createTrigger(cfg)\n              options 示例（提示框 / alert 模式）\n              nativeModalApi.open({\n              mode: 'alert', // 'alert'（提示）或 'custom'（自定义）\n              title: '确认操作', // 标题（alert 模式）\n              message: '确定要继续吗？', // 文本（alert 模式）\n              width: '420px', // 宽度（CSS 值）\n              height: '', // 高度（可选，CSS 值）\n              closeOnOverlay: true, // 点击遮罩是否关闭\n              onConfirm: () => { // 点击 Confirm 回调（在关闭前调用）\n              console.log('用户确认');\n              },\n              onCancel: () => { // 点击 Cancel 回调\n              console.log('用户取消');\n              }\n              });\n  \n              options 示例（自定义内容 / custom 模式）\n              nativeModalApi.open({\n              mode: 'custom',\n              customHtml: '<div><h3>自定义表单</h3><p>任意 HTML</p></div>', // 或传入 HTMLElement\n              width: '680px',\n              closeOnOverlay: false\n              });\n  \n              通过 createTrigger 创建可配置触发按钮（将按钮插入到指定容器或 body）\n              const btn = nativeModalApi.createTrigger({\n              containerSelector: '#modalTriggerContainer', // 插入位置（可选）\n              label: '打开模态', // 按钮文字\n              editable: true, // 双击可编辑文字\n              draggable: false, // 是否可拖动（absolute）\n              className: 'frosted-button frosted-button-cyan',\n              style: { marginTop: '12px' }, // 内联样式对象\n              openOptions: { // 点击时传递给 open 的 options\n              mode: 'alert',\n              title: '删除确认',\n              message: '确认删除该项？',\n              width: '480px',\n              onConfirm: () => { console.log('删除'); }\n              }\n              });\n  \n              程序化关闭（任何地方调用）\n              nativeModalApi.close();\n  \n              注意事项":
    "* ==============================\n         * \n         * Modal usage examples (can be deleted or modified):\n         * nativeModalApi.open(options)\n              nativeModalApi.close()\n              nativeModalApi.createTrigger(cfg)\n              options example (alert mode)\n              nativeModalApi.open({\n              mode: 'alert', // 'alert' or 'custom'\n              title: 'Confirm Operation', // Title (alert mode)\n              message: 'Are you sure you want to continue?', // Text (alert mode)\n              width: '420px', // Width (CSS value)\n              height: '', // Height (optional, CSS value)\n              closeOnOverlay: true, // Close when clicking overlay\n              onConfirm: () => { // Confirm callback (called before close)\n              console.log('User confirmed');\n              },\n              onCancel: () => { // Cancel callback\n              console.log('User cancelled');\n              }\n              });\n  \n              options example (custom mode)\n              nativeModalApi.open({\n              mode: 'custom',\n              customHtml: '<div><h3>Custom Form</h3><p>Any HTML</p></div>', // Or pass HTMLElement\n              width: '680px',\n              closeOnOverlay: false\n              });\n  \n              Create configurable trigger button via createTrigger (insert into specified container or body)\n              const btn = nativeModalApi.createTrigger({\n              containerSelector: '#modalTriggerContainer', // Insert position (optional)\n              label: 'Open Modal', // Button text\n              editable: true, // Double-click to edit text\n              draggable: false, // Whether draggable (absolute)\n              className: 'frosted-button frosted-button-cyan',\n              style: { marginTop: '12px' }, // Inline style object\n              openOptions: { // Options passed to open on click\n              mode: 'alert',\n              title: 'Delete Confirm',\n              message: 'Confirm delete this item?',\n              width: '480px',\n              onConfirm: () => { console.log('Deleted'); }\n              }\n              });\n  \n              Programmatic close (call from anywhere)\n              nativeModalApi.close();\n  \n              Notes",

    "* 动态模态框实现：支持两种模式：'alert'（提示框）与 'custom'（自定义内容）\n        // 提供 API：\n        //   nativeModalApi.createTrigger(cfg)\n        //   nativeModalApi.open(options)\n        //   nativeModalApi.close()":
    "* Dynamic modal implementation: supports two modes: 'alert' and 'custom'\n        // Provides API:\n        //   nativeModalApi.createTrigger(cfg)\n        //   nativeModalApi.open(options)\n        //   nativeModalApi.close()",

    "* 10、单选框":
    "* 10. Radio Buttons",

    "* 11、进入条与滑块：保持原有样式和交互，外部只需关注数据和事件，完全不受内部实现影响":
    "* 11. Progress Bar & Slider: Keep original style and interaction, external only needs to focus on data and events, completely unaffected by internal implementation",

    "* 12、Complete Form / 完整表单 用于演示":
    "* 12. Complete Form / Complete Form for demo",

    "* 13、时间控件：保持原有样式和交互，外部只需关注数据和事件，完全不受内部实现影响":
    "* 13. Time Controls: Keep original style and interaction, external only needs to focus on data and events, completely unaffected by internal implementation",

    "* 14、树形组件：保持原有样式和交互，外部只需关注数据和事件，完全不受内部实现影响":
    "* 14. Tree Component: Keep original style and interaction, external only needs to focus on data and events, completely unaffected by internal implementation",

    "* 15.Tooltip 逻辑完全独立，外部无需关心实现细节，直接调用初始化即可":
    "* 15. Tooltip logic is completely independent, external does not need to care about implementation details, just call init directly",

    "* 1、input 原生不需要额外包装":
    "* 1. Input native does not need extra wrapping",

    "* 2、数字框 基本格式判定":
    "* 2. Number input basic format validation",

    "* 3、文本域无需特殊处理，保持原生行为":
    "* 3. Textarea does not need special handling, keep native behavior",

    "* 4、 自动补全输入框的核心逻辑：模糊匹配、键盘导航、选项选择等，保持原生输入行为，增强交互体验":
    "* 4. Auto-complete input core logic: fuzzy matching, keyboard navigation, option selection, etc. Keep native input behavior, enhance interaction experience",

    "* 5、下拉框：纯 JS 实现，样式沿用自动补全输入框，保持原生输入行为，增强交互体验":
    "* 5. Dropdown: Pure JS implementation, style inherits auto-complete input, keep native input behavior, enhance interaction experience",

    "* 6、按钮组件：保持原有样式和交互，外部只需关注点击事件，完全不受内部实现影响":
    "* 6. Button Component: Keep original style and interaction, external only needs to focus on click events, completely unaffected by internal implementation",

    "* 7、开关":
    "* 7. Toggle",

    "* 8、tag标签：保持原有样式和交互，外部只需关注数据和事件，完全不受内部实现影响":
    "* 8. Tag/Badge: Keep original style and interaction, external only needs to focus on data and events, completely unaffected by internal implementation",

    "* 9、复选框":
    "* 9. Checkbox",

    "* ===== 同步水晶多选框视觉状态（支持半选） =====":
    "* ===== Sync Crystal Checkbox Visual State (supports indeterminate) =====",

    "* ===== 引入水晶多选框样式 =====":
    "* ===== Introduce Crystal Checkbox Style =====",

    "* ===== 批量更新水晶多选框视觉 =====":
    "* ===== Batch Update Crystal Checkbox Visual =====",

    "* ===== 点击水晶多选框本体 =====":
    "* ===== Click Crystal Checkbox Body =====",

    "* ===== 点击节点行切换水晶多选框 =====":
    "* ===== Click Node Row to Toggle Crystal Checkbox =====",

    "* FrostedFeedback.show({\n          message: \"保存成功\",\n          content: \"你的数据已同步至服务器\",\n          type: \"success\",\n          duration: 3000\n        });":
    "* FrostedFeedback.show({\n          message: \"Save successful\",\n          content: \"Your data has been synced to the server\",\n          type: \"success\",\n          duration: 3000\n        });",
}

# Single-line comment translations
single_translations = {
    "// 1. 你的数据": "// 1. Your data",
    "// 1. 处理 data-bilingual 元素（静态文本）": "// 1. Process data-bilingual elements (static text)",
    "// 1. 容器ID  2. 下拉数据  3. 初始值": "// 1. Container ID  2. Dropdown data  3. Initial value",
    "// 2. 初始化树形组件实例 / Initialize tree instances": "// 2. Initialize tree component instances / Initialize tree instances",
    "// 2. 处理 data-i18n-key 元素（字典翻译）": "// 2. Process data-i18n-key elements (dictionary translation)",
    "// 3. 处理 data-i18n-placeholder（字典翻译）": "// 3. Process data-i18n-placeholder (dictionary translation)",
    "// 3. 绑定取值按钮事件 / Bind get-value button": "// 3. Bind get-value button event / Bind get-value button",
    "// 4. 处理 data-bilingual-placeholder（双语文本 placeholder）": "// 4. Process data-bilingual-placeholder (bilingual text placeholder)",
    "// ======== 表单内单选组（form 专用） ========": "// ======== Form Internal Radio Group (form only) ========",
    "// ======== 表单内复选框（form 专用） ========": "// ======== Form Internal Checkbox (form only) ========",
    "// DOM 元素": "// DOM Elements",
    "// DOM元素": "// DOM Elements",
    "// cb1.reset();           // 重置默认": "// cb1.reset();           // Reset default",
    "// cb1.setChecked(true);   // 强制选中": "// cb1.setChecked(true);   // Force check",
    "// cb1.setLabel('新文字'); // 修改文字": "// cb1.setLabel('New text'); // Modify text",
    "// cb1.toggle();          // 切换状态": "// cb1.toggle();          // Toggle state",
    "// console.log(cb1.getChecked()); // 获取状态": "// console.log(cb1.getChecked()); // Get state",
    "// console.log(radioGroup.getSelected()); // 获取选中": "// console.log(radioGroup.getSelected()); // Get selected",
    "// customHtml 可以是字符串或 DOM 元素": "// customHtml can be string or DOM element",
    "// radioGroup.reset(); // 重置默认": "// radioGroup.reset(); // Reset default",
    "// radioGroup.setLabel('radio1', '新选项名'); // 修改文字": "// radioGroup.setLabel('radio1', 'New option name'); // Modify text",
    "// radioGroup.setSelected('radio1'); // 主动选中": "// radioGroup.setSelected('radio1'); // Active select",
    "// slider.setMax(15);   // 改最大值": "// slider.setMax(15);   // Change max value",
    "// slider.setMin(2);    // 改最小值": "// slider.setMin(2);    // Change min value",
    "// slider.setUnit('px'); // 改单位": "// slider.setUnit('px'); // Change unit",
    "// ✅ 智能取值：单值返回字符串，范围返回对象": "// ✅ Smart getValue: single value returns string, range returns object",
    "// 主题切换：toggle data-theme=\"dark\"": "// Theme toggle: toggle data-theme=\"dark\"",
    "// 优先匹配 \"中文 / English\" 或 \"English / 中文\" 格式": "// Priority match \"Chinese / English\" or \"English / Chinese\" format",
    "// 使用 input 事件更新计数并在粘贴或程序赋值后做二次截断保护": "// Use input event to update count and do secondary truncation after paste or program assignment",
    "// 例：发送请求、表单赋值、联动组件等": "// Example: send request, form assignment, linked components, etc.",
    "// 修改默认值": "// Modify default value",
    "// 全局关闭下拉面板（封装进JS）": "// Global close dropdown panel (encapsulated in JS)",
    "// 全局暴露": "// Global expose",
    "// 全局暴露初始化方法（兼容所有浏览器，直接引入即可用）": "// Global expose init method (compatible with all browsers, direct import ready)",
    "// 全局暴露，页面直接调用": "// Global expose, page calls directly",
    "// 内容容器，根据 mode 渲染": "// Content container, render based on mode",
    "// 内部状态": "// Internal state",
    "// 切换回调（状态改变触发）": "// Toggle callback (triggered on state change)",
    "// 切换状态": "// Toggle state",
    "// 创建 overlay + modal DOM（只一次）": "// Create overlay + modal DOM (only once)",
    "// 初始化": "// Init",
    "// 初始化单选框组": "// Init radio group",
    "// 初始化复选框1：未选中 + 监听变化": "// Init checkbox 1: unchecked + listen changes",
    "// 初始化复选框2：默认选中 + 自定义文字": "// Init checkbox 2: default checked + custom text",
    "// 初始化开关": "// Init toggle",
    "// 初始化所有选择器": "// Init all selectors",
    "// 初始化独立进度条": "// Init standalone progress bar",
    "// 初始化页面语言": "// Init page language",
    "// 初始化默认选中": "// Init default selection",
    "// 初始化：自动生成DOM + 绑定事件": "// Init: auto-generate DOM + bind events",
    "// 动态修改范围/单位": "// Dynamic modify range/unit",
    "// 动态模态框实现：支持两种模式：'alert'（提示框）与 'custom'（自定义内容）": "// Dynamic modal implementation: supports two modes: 'alert' and 'custom'",
    "// 匹配 \"X | Y\" 格式": "// Match \"X | Y\" format",
    "// 原有接口 + 新增拓展接口": "// Original interface + new extension interfaces",
    "// 取值": "// Get value",
    "// 取值接口": "// Get value interface",
    "// 同步锁/状态": "// Sync lock/status",
    "// 同步锁控制（调试）": "// Sync lock control (debug)",
    "// 回车 / 空格 切换（无障碍支持）": "// Enter / Space toggle (accessibility support)",
    "// 图标初始化": "// Icon init",
    "// 外部仅需配置 3 个核心参数：": "// External only needs to configure 3 core parameters:",
    "// 外部配置": "// External config",
    "// 如果两边都有中文或都没有，默认左英右中": "// If both sides have Chinese or neither, default left-English right-Chinese",
    "// 如果已有内容超出，截断": "// If existing content exceeds, truncate",
    "// 如果页面已有 #openModalBtn（历史遗留），绑定默认行为（但不创建 DOM）": "// If page already has #openModalBtn (legacy), bind default behavior (but don't create DOM)",
    "// 存储DOM元素": "// Store DOM elements",
    "// 实例存储": "// Instance storage",
    "// 延迟执行文本更新，确保组件已渲染": "// Delay text update execution, ensure components are rendered",
    "// 强制刷新UI": "// Force refresh UI",
    "// 强制最大长度，阻止继续输入（包含粘贴场景）": "// Force max length, prevent further input (including paste scenarios)",
    "// 捕获阶段监听 mouseenter：鼠标进入触发按钮时显示提示框": "// Capture phase listen mouseenter: show tooltip when mouse enters trigger button",
    "// 捕获阶段监听 mouseleave：鼠标离开触发按钮时延迟隐藏": "// Capture phase listen mouseleave: delay hide when mouse leaves trigger button",
    "// 提供 API：": "// Provides API:",
    "// 支持：message(标题) + content(详情内容)": "// Supports: message(title) + content(detail content)",
    "// 数字输入框：失去焦点自动保留两位小数": "// Number input: auto keep two decimal places on blur",
    "// 文本域逻辑（独立）": "// Textarea logic (standalone)",
    "// 无输入时隐藏面板": "// Hide panel when no input",
    "// 显示面板": "// Show panel",
    "// 暴露的接口调用": "// Exposed interface calls",
    "// 暴露的核心接口（直接调用）": "// Exposed core interfaces (direct call)",
    "// 更新DOM宽度": "// Update DOM width",
    "// 更新UI状态": "// Update UI state",
    "// 标题 + 内容 结构": "// Title + Content structure",
    "// 校验：防止DOM不存在导致报错": "// Validation: prevent errors when DOM does not exist",
    "// 核心输入逻辑（完全保留原功能）": "// Core input logic (fully preserve original functionality)",
    "// 清除错误提示": "// Clear error message",
    "// 渲染DOM：宽度动态绑定 支持px/%": "// Render DOM: width dynamic binding supports px/%",
    "// 渲染下拉选项": "// Render dropdown options",
    "// 滑块：宽度80% + 范围1-10 + 单位个 + 联动进度条": "// Slider: width 80% + range 1-10 + unit 'ge' + linked progress bar",
    "// 点击切换": "// Click toggle",
    "// 点击选中赋值 + 触发onChange": "// Click select assignment + trigger onChange",
    "// 现在支持传 content 了！": "// Now supports passing content!",
    "// 生成隔离DOM结构": "// Generate isolated DOM structure",
    "// 私有工具方法": "// Private utility methods",
    "// 私有更新UI": "// Private update UI",
    "// 移除可能存在的旧关闭按钮，避免重复": "// Remove possible old close button to avoid duplication",
    "// 简单启发：如果左侧含大量中文则左侧为中文，否则右侧为中文": "// Simple heuristic: if left side contains lots of Chinese then left is Chinese, else right is Chinese",
    "// 绑定事件 + 初始化UI": "// Bind events + init UI",
    "// 绑定事件 + 初始化状态": "// Bind events + init state",
    "// 绑定交互事件（点击 + 键盘）": "// Bind interaction events (click + keyboard)",
    "// 绑定切换按钮": "// Bind toggle button",
    "// 绑定拖动事件": "// Bind drag events",
    "// 绑定组事件": "// Bind group events",
    "// 统一取值方法 ✅": "// Unified getValue method ✅",
    "// 统一范围 → 返回 { start, end }": "// Unified range → returns { start, end }",
    "// 自动渲染原始DOM结构": "// Auto-render original DOM structure",
    "// 自动补全逻辑（完全独立）": "// Auto-complete logic (completely independent)",
    "// 自定义单位 默认%": "// Custom unit default %",
    "// 自定义范围 默认0-100": "// Custom range default 0-100",
    "// 获取DOM": "// Get DOM",
    "// 获取DOM元素": "// Get DOM elements",
    "// 获取当前状态": "// Get current state",
    "// 获取滑动条元素": "// Get slider element",
    "// 获取状态": "// Get state",
    "// 获取隔离DOM": "// Get isolated DOM",
    "// 解构外部传入的配置，设置兜底默认值": "// Destructure externally passed config, set fallback defaults",
    "// 设置状态": "// Set state",
    "// 调用暴露的接口演示": "// Call exposed interface demo",
    "// 赋值": "// Set value",
    "// 赋值接口（统一触发onChange，唯一入口）": "// Set value interface (uniformly trigger onChange, single entry)",
    "// 过滤匹配数据": "// Filter matching data",
    "// 这里写你的业务逻辑": "// Write your business logic here",
    "// 进度条：宽度500px + 范围1-10 + 单位个": "// Progress bar: width 500px + range 1-10 + unit 'ge'",
    "// 选中变化回调": "// Selection change callback",
    "// 遍历渲染所有单选框": "// Iterate and render all radio buttons",
    "// 重置": "// Reset",
    "// 重置状态": "// Reset state",
    "// 隔离DOM元素": "// Isolated DOM elements",
    "// 页面加载完成后初始化国际化": "// Init i18n after page load completes",
    "// 验证备注：滑动条变红": "// Validate remark: slider turns red",
    "// 验证姓名：滑动条变红": "// Validate name: slider turns red",
    "// 验证手机号：滑动条变红": "// Validate phone: slider turns red",
    "// 验证表单内单选框（必须选择一项）": "// Validate form internal radio (must select one)",
    "// 验证表单内复选框（必须同意条款）": "// Validate form internal checkbox (must agree to terms)",
    "// 默认值（范围校验）": "// Default value (range validation)",
    "// 默认状态": "// Default state",
    "// 鼠标移入提示框时：取消隐藏定时器，保持显示": "// When mouse enters tooltip: cancel hide timer, keep showing",
    "// 鼠标移出提示框时：延迟隐藏": "// When mouse leaves tooltip: delay hide",
    "// 🔥 修复：只调用setValue，不重复触发回调": "// 🔥 Fix: only call setValue, don't duplicate trigger callback",
    "// 🔥 全部暴露接口调用演示（调试专用）": "// 🔥 All exposed interface call demos (debug only)",
    "// 🔥 对外暴露【全量操作接口】": "// 🔥 Expose [Full Operation Interface]",
    "// 🔥 对外暴露接口": "// 🔥 Expose interface",
    "// 🔥 新增：动态修改宽度": "// 🔥 New: dynamic modify width",
    "// 🔥 新增：自定义宽度 默认100% 支持px/%": "// 🔥 New: custom width default 100% supports px/%",
    "// 🔥 新增：自定义宽度 默认240px 支持px/%": "// 🔥 New: custom width default 240px supports px/%",
    "// 🔥 自动渲染完整复选框DOM（100%还原你的原始结构）": "// 🔥 Auto-render full checkbox DOM (100% restore your original structure)",
    "// 🔥 自动生成完整开关DOM（100%还原原有结构，样式零失效）": "// 🔥 Auto-generate full toggle DOM (100% restore original structure, zero style loss)",
    "//// 实例化": "//// Instantiate",
}

# Apply translations
# For multi-line comments, we need to be careful about whitespace variations

def replace_in_comments(text, old, new):
    """Replace old text with new text inside comment blocks."""
    # HTML comments
    pattern = r'<!--\s*' + re.escape(old) + r'\s*-->'
    text = re.sub(pattern, '<!-- ' + new + ' -->', text)
    
    # Multi-line JS comments - match with possible whitespace prefix
    lines_old = old.split('\n')
    lines_new = new.split('\n')
    
    # Try exact match first
    text = text.replace('/* ' + old + ' */', '/* ' + new + ' */')
    text = text.replace('/*' + old + '*/', '/*' + new + '*/')
    
    return text

# Process multi-line translations (sorted by length descending to avoid partial matches)
for old_text, new_text in sorted(translations.items(), key=lambda x: len(x[0]), reverse=True):
    # Replace in HTML comments
    old_html = '<!--' + old_text + '-->'
    new_html = '<!--' + new_text + '-->'
    content = content.replace(old_html, new_html)
    
    # Also try with newlines preserved
    old_html2 = '<!--\n' + old_text + '\n-->'
    new_html2 = '<!--\n' + new_text + '\n-->'
    content = content.replace(old_html2, new_html2)
    
    # Multi-line JS comments - exact match
    old_js = '/*' + old_text + '*/'
    new_js = '/*' + new_text + '*/'
    content = content.replace(old_js, new_js)
    
    # With space after *
    old_js2 = '/* ' + old_text + ' */'
    new_js2 = '/* ' + new_text + ' */'
    content = content.replace(old_js2, new_js2)

# Process single-line translations
for old_text, new_text in sorted(single_translations.items(), key=lambda x: len(x[0]), reverse=True):
    content = content.replace(old_text, new_text)

# Write output
with open('cssThemes/from2.html', 'w', encoding='utf-8') as f:
    f.write(content)

# Verify no Chinese remains in comments
remaining_html = re.findall(r'<!--(.*?)-->', content, re.DOTALL)
remaining_single = re.findall(r'(^|\n)\s*(//.*)', content)
remaining_multi = re.findall(r'/\*(.*?)\*/', content, re.DOTALL)

count = 0
for c in remaining_html:
    if re.search(r'[\u4e00-\u9fa5]', c):
        count += 1
for _, c in remaining_single:
    if re.search(r'[\u4e00-\u9fa5]', c):
        count += 1
for c in remaining_multi:
    if re.search(r'[\u4e00-\u9fa5]', c):
        count += 1

print(f'Remaining Chinese comments: {count}')
