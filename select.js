/**
 * 通用查询工具（限制运算符仅查询数字/时间等可对比类型）
 * 核心特性：
 * 1. 运算符查询仅支持：数字（number）、时间（date）类型字段，其他类型自动禁用运算符
 * 2. 适配前端「输入框+运算符选择框」交互，参数极简
 * 3. 支持运算符：> < = >= <= != == === !==（仅作用于数字/时间）
 * 4. 非数字/时间字段自动降级为模糊匹配
 * @param {Object} params - 查询参数
 * @param {Array} params.dataList - 原始数据集（必传）
 * @param {string} params.searchValue - 输入框查询值（必传）
 * @param {Object} [params.operatorConfig] - 运算符配置（选择框）
 * @param {string} params.operatorConfig.field - 目标字段（如 price/createTime）
 * @param {string} params.operatorConfig.operator - 运算符（> < = 等）
 * @param {Object} [params.fieldTypeMap] - 字段类型映射（关键！指定字段类型）
 *                                         格式：{ 字段名: 'number'/'date'/'text' }
 * @param {boolean} [params.enableFuzzyMatch=true] - 非运算符场景启用模糊匹配
 * @returns {Array} 匹配结果
 */
function universalSearch(params) {
  const {
    dataList = [],
    searchValue = '',
    operatorConfig = null,
    fieldTypeMap = {}, // 字段类型映射（核心限制：只允许数字/时间用运算符）
    enableFuzzyMatch = true
  } = params;

  // 空数据直接返回
  if (dataList.length === 0) return [];
  // 统一处理查询值（去空格）
  const inputValue = searchValue.trim();
  // 无查询值返回全部
  if (inputValue === '') return [...dataList];

  // ========================
  // 核心逻辑1：校验运算符+字段类型 → 仅数字/时间字段允许运算符查询
  // ========================
  const isValidOperatorQuery = () => {
    if (!operatorConfig || !validateOperatorConfig(operatorConfig)) return false;
    const { field } = operatorConfig;
    // 获取字段类型（默认text）
    const fieldType = fieldTypeMap[field] || 'text';
    // 仅允许数字/时间类型使用运算符
    return ['number', 'date'].includes(fieldType);
  };

  // 运算符查询（仅数字/时间字段生效）
  if (isValidOperatorQuery()) {
    const { field, operator } = operatorConfig;
    const fieldType = fieldTypeMap[field];

    return dataList.filter(item => {
      // 字段不存在则过滤
      if (!item.hasOwnProperty(field)) return false;
      
      // 按字段类型转换值（数字/时间专用转换）
      const { fieldVal, queryVal } = convertValueByType(
        item[field], 
        inputValue, 
        fieldType
      );

      // 转换失败（如非数字字符串转数字）→ 过滤
      if (fieldVal === null || queryVal === null) return false;

      // 运算符对比
      return compareByOperator(fieldVal, queryVal, operator);
    });
  }

  // ========================
  // 核心逻辑2：非运算符场景 → 模糊匹配（文本字段/禁用运算符的数字/时间字段）
  // ========================
  if (enableFuzzyMatch) {
    const lowerQuery = inputValue.toLowerCase();
    return dataList.filter(item => {
      const allText = Object.values(item).join('').toLowerCase();
      return allText.includes(lowerQuery);
    });
  }

  return [...dataList];
}

// ------------------------
// 辅助函数1：校验运算符配置合法性
// ------------------------
function validateOperatorConfig(config) {
  const validOperators = ['>', '<', '=', '==', '===', '>=', '<=', '!=', '!=='];
  return (
    config &&
    typeof config === 'object' &&
    typeof config.field === 'string' &&
    validOperators.includes(config.operator)
  );
}

// ------------------------
// 辅助函数2：按字段类型转换值（核心：数字/时间专用转换）
// ------------------------
function convertValueByType(fieldVal, queryVal, fieldType) {
  let convertedFieldVal = null;
  let convertedQueryVal = null;

  switch (fieldType) {
    // 数字类型：严格转换，非数字返回null
    case 'number':
      convertedFieldVal = isNaN(Number(fieldVal)) ? null : Number(fieldVal);
      convertedQueryVal = isNaN(Number(queryVal)) ? null : Number(queryVal);
      break;

    // 时间类型：支持时间戳/ISO字符串/日期字符串，转换为时间戳对比
    case 'date':
      convertedFieldVal = new Date(fieldVal).getTime();
      convertedQueryVal = new Date(queryVal).getTime();
      // 无效日期返回null
      convertedFieldVal = isNaN(convertedFieldVal) ? null : convertedFieldVal;
      convertedQueryVal = isNaN(convertedQueryVal) ? null : convertedQueryVal;
      break;

    // 其他类型默认返回null（禁用运算符）
    default:
      break;
  }

  return { fieldVal: convertedFieldVal, queryVal: convertedQueryVal };
}

// ------------------------
// 辅助函数3：运算符对比（仅数字/时间戳，已统一为数值）
// ------------------------
function compareByOperator(fieldVal, queryVal, operator) {
  switch (operator) {
    case '>': return fieldVal > queryVal;
    case '<': return fieldVal < queryVal;
    case '=':
    case '==': return fieldVal == queryVal;
    case '===': return fieldVal === queryVal;
    case '>=': return fieldVal >= queryVal;
    case '<=': return fieldVal <= queryVal;
    case '!=': return fieldVal != queryVal;
    case '!==': return fieldVal !== queryVal;
    default: return false;
  }
}

// ========================
// 前端交互示例（带字段类型限制）
// ========================
// 1. 模拟业务数据（包含数字/时间/文本字段）
/* const orderList = [
  { 
    id: 1, 
    orderNo: 'ORD20240501', // 文本
    amount: 199.9,          // 数字
    createTime: '2024-05-01 10:30:00', // 时间
    customerName: '张三'    // 文本
  },
  { 
    id: 2, 
    orderNo: 'ORD20240502', 
    amount: 2999, 
    createTime: 1714576800000, // 时间戳
    customerName: '李四' 
  },
  { 
    id: 3, 
    orderNo: 'ORD20240503', 
    amount: 599, 
    createTime: '2024-05-03', 
    customerName: '王五' 
  }
]; */

// 2. 字段类型映射（关键！指定哪些字段能走运算符）
const fieldTypeMap = {
  amount: 'number',       // 金额：数字类型（允许运算符）
  createTime: 'date',     // 创建时间：时间类型（允许运算符）
  orderNo: 'text',        // 订单号：文本（禁用运算符）
  customerName: 'text'    // 姓名：文本（禁用运算符）
};

// 3. 模拟前端查询逻辑（对接输入框+选择框）
/* function handleOrderSearch() {
  // 前端输入框/选择框取值
  const searchValue = document.getElementById('search-input').value;
  const selectedOperator = document.getElementById('operator-select').value;
  const targetField = document.getElementById('field-select').value;

  // 调用通用查询
  const result = universalSearch({
    dataList: orderList,
    searchValue: searchValue,
    operatorConfig: selectedOperator 
      ? { field: targetField, operator: selectedOperator } 
      : null,
    fieldTypeMap: fieldTypeMap, // 传入字段类型限制
    enableFuzzyMatch: true
  });

  // 渲染结果
  console.log('查询结果：', result);
  renderOrderResult(result);
} */

// 4. 渲染结果到页面
/* function renderOrderResult(data) {
  const container = document.getElementById('result-container');
  container.innerHTML = data.map(item => `
    <div class="order-item">
      <p>订单号：${item.orderNo}</p>
      <p>金额：${item.amount} 元</p>
      <p>创建时间：${new Date(item.createTime).toLocaleString()}</p>
      <p>客户姓名：${item.customerName}</p>
    </div>
  `).join('');
} */

// ========================
// 测试不同场景（验证类型限制）
// ========================
// 场景1：运算符查询数字字段（金额>200）→ 生效
/* const test1 = universalSearch({
  dataList: orderList,
  searchValue: "200",
  operatorConfig: { field: 'amount', operator: '>' },
  fieldTypeMap: fieldTypeMap
});
console.log('场景1（金额>200）：', test1.map(item => item.orderNo)); // ORD20240502、ORD20240503
 */
// 场景2：运算符查询时间字段（创建时间<2024-05-03）→ 生效
/* const test2 = universalSearch({
  dataList: orderList,
  searchValue: "2024-05-03",
  operatorConfig: { field: 'createTime', operator: '<' },
  fieldTypeMap: fieldTypeMap
});
console.log('场景2（创建时间<2024-05-03）：', test2.map(item => item.orderNo)); // ORD20240501、ORD20240502
 */
// 场景3：运算符查询文本字段（姓名=张三）→ 禁用运算符，降级模糊匹配
/* const test3 = universalSearch({
  dataList: orderList,
  searchValue: "张三",
  operatorConfig: { field: 'customerName', operator: '=' }, // 运算符无效
  fieldTypeMap: fieldTypeMap
});
console.log('场景3（文本字段运算符降级）：', test3.map(item => item.orderNo)); // ORD20240501（模糊匹配）
 */
// 场景4：非数字值查数字字段（金额>abc）→ 转换失败，无结果
/* const test4 = universalSearch({
  dataList: orderList,
  searchValue: "abc",
  operatorConfig: { field: 'amount', operator: '>' },
  fieldTypeMap: fieldTypeMap
});
console.log('场景4（非数字查数字字段）：', test4); // [] */