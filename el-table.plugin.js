// ==============================================
// el-table.plugin.js
// 功能：可配置化原生表格插件
// 调用：createTable(selector, data, columns, options)
// 作者：自定义插件
// ==============================================

// ======================【1. 全局状态管理】======================
// 内部状态，不污染全局
let TableStore = {
  target: null,       // 表格DOM
  data: [],           // 表格数据
  columns: [],        // 表头
  options: {},        // 配置
  cellRange: { startRow:-1, startCol:-1, endRow:-1, endCol:-1 },
  selectedRows: new Set(),
  lastClickRow: -1,
  isSelecting: false,
  isPluginInit: false
}

// ======================【2. 入口方法：唯一对外暴露】======================
/**
 * 创建表格
 * @param {string} selector - 表格选择器 #myTable
 * @param {Array} data - 数据
 * @param {Array} columns - 表头
 * @param {Object} options - 功能配置
 */
window.createTable = function(selector, data, columns, options) {
  TableStore.target = document.querySelector(selector)
  TableStore.data = [...data]
  TableStore.columns = [...columns]
  TableStore.options = {
    cellSelection: false,
    rowSelection: false,
    headerDrag: false,
    contextMenu: false,
    sort: false,
    headerMenu: false,
    ...options
  }

  initDOMStructure()  // 初始化DOM结构
  renderTable()       // 渲染表格
  initAllPlugins()    // 初始化启用的插件
}

// ======================【3. DOM结构初始化】======================
function initDOMStructure() {
  const table = TableStore.target
  if (!table) return
  if (document.querySelector('.table-container')) return

  const container = document.createElement('div')
  container.className = 'table-container'
  const scroll = document.createElement('div')
  scroll.className = 'table-scroll'

  table.parentNode.insertBefore(container, table)
  scroll.appendChild(table)
  container.appendChild(scroll)
}

// ======================【4. 核心渲染】======================
function renderTable() {
  const table = TableStore.target
  table.innerHTML = ''

  const thead = document.createElement('thead')
  const tbody = document.createElement('tbody')
  thead.innerHTML = renderHeader()
  tbody.innerHTML = renderBody()

  table.appendChild(thead)
  table.appendChild(tbody)
}

function renderHeader() {
  const opt = TableStore.options
  return TableStore.columns.map((col, idx) => `
    <th data-idx="${idx}" ${col.fixed ? 'draggable="false"' : ''} class="${col.prop === 'index' ? 'index-col' : ''}">
      <div class="th-text">
        <span>${col.label}</span>
        ${!col.fixed ? `
          <div>
            ${opt.sort ? `<button class="sort-btn" onclick="window.__tableSort('${col.prop}',1)">↑</button>
            <button class="sort-btn" onclick="window.__tableSort('${col.prop}',2)">↓</button>` : ''}
            ${opt.headerMenu ? `<button class="menu-dot" onclick="window.__tableHeaderMenu(this)">⋮</button>
            <div class="header-dropdown">
              <div onclick="window.__tableMenuClick('${col.prop}',1)">冻结列</div>
              <div onclick="window.__tableMenuClick('${col.prop}',2)">隐藏列</div>
            </div>` : ''}
          </div>
        ` : ''}
      </div>
    </th>
  `).join('')
}

function renderBody() {
  return TableStore.data.map((row, rowIdx) => `
    <tr class="${TableStore.selectedRows.has(rowIdx) ? 'row-selected' : ''}">
      <td class="index-col" data-row="${rowIdx}">${rowIdx+1}</td>
      ${TableStore.columns.slice(1).map((col, colIdx) => `
        <td class="${isCellSelected(rowIdx, colIdx+1) ? 'cell-selected' : ''}">
          ${row[col.prop]}
        </td>
      `).join('')}
    </tr>
  `).join('')
}

function isCellSelected(r, c) {
  const s = TableStore.cellRange
  if (s.startRow === -1) return false
  const minR = Math.min(s.startRow, s.endRow)
  const maxR = Math.max(s.startRow, s.endRow)
  const minC = Math.min(s.startCol, s.endCol)
  const maxC = Math.max(s.startCol, s.endCol)
  return r >= minR && r <= maxR && c >= minC && c <= maxC
}

// ======================【5. 插件自动加载器】======================
function initAllPlugins() {
  if (TableStore.isPluginInit) return
  const opt = TableStore.options

  if (opt.cellSelection) initCellSelectionPlugin()
  if (opt.rowSelection) initRowSelectionPlugin()
  if (opt.headerDrag) initHeaderDragPlugin()
  if (opt.contextMenu) initContextMenuPlugin()

  TableStore.isPluginInit = true
}

// ======================【插件A：单元格圈选】======================
// 文件名推荐：table.selection.js
function initCellSelectionPlugin() {
  const table = TableStore.target
  table.addEventListener('mousedown', e => {
    const td = e.target.closest('td')
    if (!td || td.classList.contains('index-col')) return
    TableStore.isSelecting = true
    TableStore.selectedRows.clear()
    const r = [...td.parentElement.parentElement.children].indexOf(td.parentElement)
    const c = [...td.parentElement.children].indexOf(td)
    TableStore.cellRange = { startRow:r, startCol:c, endRow:r, endCol:c }
    renderTable()
  })

  table.addEventListener('mousemove', e => {
    if (!TableStore.isSelecting) return
    const td = e.target.closest('td')
    if (!td) return
    const r = [...td.parentElement.parentElement.children].indexOf(td.parentElement)
    const c = [...td.parentElement.children].indexOf(td)
    TableStore.cellRange.endRow = r
    TableStore.cellRange.endCol = c
    renderTable()
  })

  document.addEventListener('mouseup', () => {
    TableStore.isSelecting = false
  })
}

// ======================【插件B：行选择（Ctrl+Shift）】======================
// 文件名推荐：table.row.js
function initRowSelectionPlugin() {
  const table = TableStore.target
  table.addEventListener('click', e => {
    const td = e.target.closest('.index-col')
    if (!td) return
    const row = +td.dataset.row

    if (e.shiftKey && TableStore.lastClickRow >= 0) {
      const min = Math.min(TableStore.lastClickRow, row)
      const max = Math.max(TableStore.lastClickRow, row)
      for (let i = min; i <= max; i++) TableStore.selectedRows.add(i)
    } else if (e.ctrlKey) {
      TableStore.selectedRows.has(row) ? TableStore.selectedRows.delete(row) : TableStore.selectedRows.add(row)
    } else {
      TableStore.selectedRows.clear()
      TableStore.selectedRows.add(row)
    }

    TableStore.cellRange = { startRow:-1, startCol:-1, endRow:-1, endCol:-1 }
    TableStore.lastClickRow = row
    renderTable()
  })
}

// ======================【插件C：列拖动】======================
// 文件名推荐：table.drag.js
function initHeaderDragPlugin() {
  let dragged = null
  TableStore.target.addEventListener('dragstart', e => {
    if (e.target.classList.contains('index-col')) return
    dragged = e.target
  })
  TableStore.target.addEventListener('dragover', e => e.preventDefault())
  TableStore.target.addEventListener('drop', e => {
    if (!dragged || e.target.classList.contains('index-col')) return
    const from = +dragged.dataset.idx
    const to = +e.target.dataset.idx
    ;[TableStore.columns[from], TableStore.columns[to]] = [TableStore.columns[to], TableStore.columns[from]]
    dragged = null
    renderTable()
  })
}

// ======================【插件D：右键菜单】======================
// 文件名推荐：table.contextmenu.js
function initContextMenuPlugin() {
  if (document.querySelector('.context-menu')) return
  const menu = document.createElement('div')
  menu.className = 'context-menu'
  menu.innerHTML = '<div>复制选中数据</div>'
  document.body.appendChild(menu)

  TableStore.target.addEventListener('contextmenu', e => {
    e.preventDefault()
    const hasCell = TableStore.cellRange.startRow !== -1
    const hasRow = TableStore.selectedRows.size > 0
    if (!hasCell && !hasRow) return
    menu.style.left = e.pageX + 'px'
    menu.style.top = e.pageY + 'px'
    menu.style.display = 'block'
  })

  menu.addEventListener('click', () => {
    copyDataPlugin()
    menu.style.display = 'none'
  })
  document.addEventListener('click', () => menu.style.display = 'none')
}

// ======================【插件E：复制数据】======================
// 文件名推荐：table.copy.js
function copyDataPlugin() {
  let res
  if (TableStore.selectedRows.size > 0) {
    res = { type: 'rows', data: [...TableStore.selectedRows].map(i => TableStore.data[i]) }
  } else {
    const s = TableStore.cellRange
    const data = []
    for (let r = Math.min(s.startRow, s.endRow); r <= Math.max(s.startRow, s.endRow); r++) {
      const row = []
      for (let c = Math.min(s.startCol, s.endCol); c <= Math.max(s.startCol, s.endCol); c++) {
        row.push(TableStore.target.querySelectorAll('tbody tr')[r].cells[c].textContent)
      }
      data.push(row)
    }
    res = { type: 'cells', data }
  }
  navigator.clipboard.writeText(JSON.stringify(res, null, 2))
  alert('复制成功')
}

// ======================【插件F：排序 + 表头菜单】======================
// 文件名推荐：table.header.js
window.__tableSort = function(prop, order) {
  TableStore.data.sort((a, b) => order === 1 ? a[prop] > b[prop] ? 1 : -1 : a[prop] < b[prop] ? 1 : -1)
  renderTable()
}

window.__tableHeaderMenu = function(el) {
  const d = el.nextElementSibling
  document.querySelectorAll('.header-dropdown').forEach(i => i !== d && i.classList.remove('show'))
  d.classList.toggle('show')
}

window.__tableMenuClick = function(prop, type) {
  alert(['冻结', '隐藏'][type-1] + '：' + prop)
}