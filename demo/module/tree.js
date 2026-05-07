/**
 * 独立树形组件 - 纯JS封装
 * 调用：new TreeComponent(selector, data, options)
 * 取值：tree.getValue()
 */
class TreeComponent {
  constructor(selector, data, options = {}) {
    this.container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    this.originData = this.deepClone(data);
    this.displayData = this.deepClone(data);
    this.checkedMap = {};
    this.expandedIds = new Set();
    this.selectedId = null;
    this.draggingId = null;
    this.preSearchExpandedIds = null;
    this.searchKeyword = '';

    this.options = {
      isDropdown: false,
      showCheckbox: false,
      checkChildren: true,
      draggable: false,
      searchable: false,
      expandable: true,
      customEvent: false,
      singleSelect: false,
      onlyLeafValue: true,
      onNodeClick: null,
      onCheckChange: null,
      onDrop: null,
      ...options
    };

    this.render();
  }

  // 统一取值方法 ✅
  getValue() {
    return this.getCheckedNodes();
  }

  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  render() {
    const opt = this.options;
    const oldPanel = this.container.querySelector('.tree-panel');
    const wasShow = opt.isDropdown && oldPanel ? oldPanel.classList.contains('show') : false;

    this.container.innerHTML = '';

    if (opt.isDropdown) {
      const inputGroup = document.createElement('div');
      inputGroup.className = 'speed-input-group';

      const input = document.createElement('input');
      input.className = 'tree-input speed-input';
      input.placeholder = 'Please Select';
      input.readOnly = true;

      const line = document.createElement('div');
      line.className = 'tree-speed-line-input';

      inputGroup.appendChild(input);
      inputGroup.appendChild(line);
      this.container.appendChild(inputGroup);
    }

    const panel = document.createElement('div');
    panel.className = 'tree-panel';
    if (wasShow) panel.classList.add('show');
    if (!opt.isDropdown) panel.classList.add('show');

    if (opt.searchable) {
      const searchDiv = document.createElement('div');
      searchDiv.className = 'tree-search';

      const searchGroup = document.createElement('div');
      searchGroup.className = 'speed-input-group';

      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.placeholder = 'Search Node';
      searchInput.className = 'speed-input';
      if (this.searchKeyword) searchInput.value = this.searchKeyword;

      const line = document.createElement('div');
      line.className = 'tree-speed-line-input';

      searchGroup.appendChild(searchInput);
      searchGroup.appendChild(line);
      searchDiv.appendChild(searchGroup);
      panel.appendChild(searchDiv);
    }

    const list = document.createElement('div');
    list.className = 'tree-list';
    this.buildNodes(this.displayData, list);

    if (opt.draggable) {
      const dropRoot = document.createElement('div');
      dropRoot.className = 'drop-to-root';
      dropRoot.textContent = 'Drop To Root';
      list.appendChild(dropRoot);
    }

    panel.appendChild(list);
    this.container.appendChild(panel);

    this.bindEvents();
    this.updateInputValue();
  }

  buildNodes(nodes, container) {
    const opt = this.options;

    for (const node of nodes) {
      const hasChild = node.children && node.children.length > 0;
      const isExpanded = this.expandedIds.has(node.id);
      const isDisabled = node.disabled === true;
      const isActive = this.selectedId === node.id;

      const nodeEl = document.createElement('div');
      nodeEl.className = 'tree-node';
      if (isDisabled) nodeEl.classList.add('disabled');
      if (isActive) nodeEl.classList.add('active');
      nodeEl.dataset.id = node.id;
      if (opt.draggable && !isDisabled) {
        nodeEl.draggable = true;
      }

      if (opt.showCheckbox && !opt.singleSelect) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.dataset.id = node.id;
        if (isDisabled) checkbox.disabled = true;
        this.syncCheckboxState(checkbox, node);
        nodeEl.appendChild(checkbox);
      }

      const toggle = document.createElement('span');
      toggle.className = 'toggle';
      if (hasChild) {
        toggle.textContent = isExpanded ? '−' : '+';
      }
      nodeEl.appendChild(toggle);

      const label = document.createElement('span');
      label.className = 'label';
      if (node.icon) {
        const iconSpan = document.createElement('span');
        iconSpan.className = 'icon';
        iconSpan.textContent = node.icon;
        label.appendChild(iconSpan);
      }
      const textSpan = document.createElement('span');
      textSpan.textContent = node.label;
      label.appendChild(textSpan);
      nodeEl.appendChild(label);

      container.appendChild(nodeEl);

      const childrenWrap = document.createElement('div');
      childrenWrap.className = 'tree-children';
      if (isExpanded) childrenWrap.classList.add('open');
      if (hasChild) {
        this.buildNodes(node.children, childrenWrap);
      }
      container.appendChild(childrenWrap);
    }
  }

  syncCheckboxState(checkbox, node) {
    if (node.disabled) {
      checkbox.checked = false;
      checkbox.indeterminate = false;
      return;
    }
    if (!node.children || node.children.length === 0) {
      checkbox.checked = !!this.checkedMap[node.id];
      checkbox.indeterminate = false;
    } else {
      const status = this.getChildCheckStatus(node.children);
      if (status.allChecked) {
        checkbox.checked = true;
        checkbox.indeterminate = false;
      } else if (status.noneChecked) {
        checkbox.checked = false;
        checkbox.indeterminate = false;
      } else {
        checkbox.checked = false;
        checkbox.indeterminate = true;
      }
    }
  }

  updateAllCheckboxVisual() {
    const checkboxes = this.container.querySelectorAll('.checkbox');
    checkboxes.forEach(cb => {
      const id = Number(cb.dataset.id);
      const node = this.findNodeById(this.originData, id);
      if (node) this.syncCheckboxState(cb, node);
    });
  }

  bindEvents() {
    const panel = this.container.querySelector('.tree-panel');
    const list = this.container.querySelector('.tree-list');
    const searchInput = this.container.querySelector('.tree-search .speed-input');
    const opt = this.options;

    if (opt.isDropdown) {
      const input = this.container.querySelector('.tree-input');
      input.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.tree-dropdown .tree-panel.show').forEach(p => {
          if (p !== panel) p.classList.remove('show');
        });
        panel.classList.toggle('show');
      });
    }

    list.addEventListener('click', (e) => {
      const isToggle = e.target.classList.contains('toggle');
      if (isToggle) {
        e.stopPropagation();
      }

      if (e.target.classList.contains('checkbox')) return;

      const nodeEl = e.target.closest('.tree-node');
      if (!nodeEl) return;

      const id = Number(nodeEl.dataset.id);
      const node = this.findNodeById(this.originData, id);
      if (!node || node.disabled) return;

      const hasChild = node.children && node.children.length > 0;

      if (opt.expandable && isToggle && hasChild) {
        if (this.expandedIds.has(id)) {
          this.expandedIds.delete(id);
        } else {
          this.expandedIds.add(id);
        }
        const childrenWrap = nodeEl.nextElementSibling;
        if (childrenWrap && childrenWrap.classList.contains('tree-children')) {
          childrenWrap.classList.toggle('open');
          const toggleEl = nodeEl.querySelector('.toggle');
          if (toggleEl) {
            toggleEl.textContent = childrenWrap.classList.contains('open') ? '−' : '+';
          }
        }
        return;
      }

      if (opt.singleSelect) {
        if (opt.onlyLeafValue && hasChild) return;
        this.selectedId = id;
        this.updateInputValue();
        list.querySelectorAll('.tree-node').forEach(el => el.classList.remove('active'));
        nodeEl.classList.add('active');
        if (opt.customEvent && opt.onNodeClick) opt.onNodeClick(node);
        if (opt.isDropdown) panel.classList.remove('show');
        return;
      }

      if (!opt.singleSelect && opt.showCheckbox) {
        const checkbox = nodeEl.querySelector('.checkbox');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          this.handleCheckboxChange(id, checkbox.checked);
        }
      }
    });

    if (opt.showCheckbox && !opt.singleSelect) {
      list.addEventListener('change', (e) => {
        if (!e.target.classList.contains('checkbox')) return;
        const id = Number(e.target.dataset.id);
        const checked = e.target.checked;
        const node = this.findNodeById(this.originData, id);
        if (node?.disabled) {
          e.target.checked = !checked;
          return;
        }
        this.handleCheckboxChange(id, checked);
      });
    }

    if (opt.searchable && searchInput) {
      searchInput.addEventListener('input', (e) => {
        const key = e.target.value.trim().toLowerCase();
        this.filterTree(key);
      });
    }

    if (opt.draggable) this.bindDrag(list);
  }

  handleCheckboxChange(id, checked) {
    this.checkedMap[id] = checked;

    if (this.options.checkChildren) {
      this.setChildCheckedRecursive(id, checked);
    }

    this.refreshAllParentStatus(id);
    this.updateAllCheckboxVisual();
    this.updateInputValue();

    if (this.options.customEvent && this.options.onCheckChange) {
      this.options.onCheckChange(this.getCheckedNodes());
    }
  }

  setChildCheckedRecursive(pid, checked) {
    const node = this.findNodeById(this.originData, pid);
    if (!node?.children) return;
    const loop = (nodes) => {
      for (const c of nodes) {
        if (c.disabled) continue;
        this.checkedMap[c.id] = checked;
        if (c.children) loop(c.children);
      }
    };
    loop(node.children);
  }

  refreshAllParentStatus(nodeId) {
    const parent = this.findParentById(this.originData, nodeId);
    if (!parent) return;
    this.updateNodeCheckStatus(parent.id);
    this.refreshAllParentStatus(parent.id);
  }

  updateNodeCheckStatus(nodeId) {
    const node = this.findNodeById(this.originData, nodeId);
    if (!node || !node.children?.length) return;
    const status = this.getChildCheckStatus(node.children);
    this.checkedMap[nodeId] = status.allChecked;
  }

  getChildCheckStatus(children) {
    let total = 0, checked = 0;
    const loop = (nodes) => {
      for (const n of nodes) {
        if (n.disabled) continue;
        total++;
        if (this.checkedMap[n.id]) checked++;
        if (n.children) loop(n.children);
      }
    };
    loop(children);
    return {
      allChecked: total > 0 && total === checked,
      noneChecked: checked === 0
    };
  }

  filterTree(keyword) {
    this.searchKeyword = keyword;

    if (!keyword) {
      this.displayData = this.deepClone(this.originData);
      if (this.preSearchExpandedIds !== null) {
        this.expandedIds = new Set(this.preSearchExpandedIds);
        this.preSearchExpandedIds = null;
      }
    } else {
      if (this.preSearchExpandedIds === null) {
        this.preSearchExpandedIds = new Set(this.expandedIds);
      }

      const expandIds = new Set();
      const filter = (nodes) => {
        const res = [];
        for (const n of nodes) {
          const childRes = n.children ? filter(n.children) : [];
          const match = n.label.toLowerCase().includes(keyword);
          if (match || childRes.length > 0) {
            res.push({ ...n, children: childRes });
            if (childRes.length > 0) {
              expandIds.add(n.id);
            }
          }
        }
        return res;
      };

      this.displayData = filter(this.originData);
      this.expandedIds = expandIds;
    }

    this.render();
  }

  updateInputValue() {
    const opt = this.options;
    const input = this.container.querySelector('.tree-input');
    if (!input) return;

    if (opt.singleSelect) {
      const node = this.findNodeById(this.originData, this.selectedId);
      input.value = node ? node.label : '';
    } else {
      const checkedNodes = this.getCheckedNodes();
      input.value = checkedNodes.map(n => n.label).join(', ');
    }
  }

  getLeafNodes(nodes) {
    let leaves = [];
    const traverse = (items) => {
      for (const item of items) {
        if (!item.children || item.children.length === 0) {
          leaves.push(item);
        } else {
          traverse(item.children);
        }
      }
    };
    traverse(nodes);
    return leaves;
  }

  getCheckedNodes() {
    if (this.options.onlyLeafValue) {
      const allLeafNodes = this.getLeafNodes(this.originData);
      return allLeafNodes.filter(node => this.checkedMap[node.id] && !node.disabled);
    }

    const arr = [];
    const find = (nodes) => {
      for (const n of nodes) {
        if (this.checkedMap[n.id] && !n.disabled) arr.push(n);
        if (n.children) find(n.children);
      }
    };
    find(this.originData);
    return arr;
  }

  getCheckedIds() {
    return this.getCheckedNodes().map(n => n.id);
  }

  findNodeById(nodes, id) {
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.children) {
        const r = this.findNodeById(n.children, id);
        if (r) return r;
      }
    }
    return null;
  }

  findParentById(nodes, childId, parent = null) {
    for (const node of nodes) {
      if (node.id === childId) return parent;
      if (node.children) {
        const found = this.findParentById(node.children, childId, node);
        if (found) return found;
      }
    }
    return null;
  }

  findNodeWithParent(nodes, id, parent = null) {
    for (const item of nodes) {
      if (item.id === id) return { node: item, parent };
      if (item.children) {
        const r = this.findNodeWithParent(item.children, id, item);
        if (r.node) return r;
      }
    }
    return { node: null, parent: null };
  }

  isDescendant(targetId, nodeId) {
    if (targetId === nodeId) return true;
    const node = this.findNodeById(this.originData, nodeId);
    if (!node || !node.children) return false;
    for (const child of node.children) {
      if (this.isDescendant(targetId, child.id)) return true;
    }
    return false;
  }

  moveToRoot(dragId) {
    const { node, parent } = this.findNodeWithParent(this.originData, dragId);
    if (!node) return;
    if (parent) parent.children = parent.children.filter(i => i.id !== dragId);
    else this.originData = this.originData.filter(i => i.id !== dragId);
    this.originData.push(node);
  }

  moveNodeTo(dragId, parentId) {
    const { node, parent } = this.findNodeWithParent(this.originData, dragId);
    if (!node) return;
    if (parent) parent.children = parent.children.filter(i => i.id !== dragId);
    else this.originData = this.originData.filter(i => i.id !== dragId);
    const newParent = this.findNodeById(this.originData, parentId);
    if (newParent) {
      if (!newParent.children) newParent.children = [];
      newParent.children.unshift(node);
    }
  }

  bindDrag(list) {
    let draggingNode = null;
    const placeholder = document.createElement('div');
    placeholder.className = 'drop-placeholder';
    const dropToRoot = list.querySelector('.drop-to-root');

    list.addEventListener('dragstart', (e) => {
      const el = e.target.closest('.tree-node');
      if (!el || el.classList.contains('disabled')) {
        e.preventDefault();
        return;
      }
      draggingNode = el;
      this.draggingId = Number(el.dataset.id);
      el.classList.add('dragging');
      if (dropToRoot) dropToRoot.classList.add('show');
    });

    list.addEventListener('dragend', () => {
      if (draggingNode) draggingNode.classList.remove('dragging');
      placeholder.remove();
      if (dropToRoot) dropToRoot.classList.remove('show', 'active');
      draggingNode = null;
      this.draggingId = null;
    });

    list.addEventListener('dragover', (e) => {
      e.preventDefault();

      if (dropToRoot && e.target.closest('.drop-to-root')) {
        dropToRoot.classList.add('active');
        return;
      }
      if (dropToRoot) dropToRoot.classList.remove('active');

      const targetEl = e.target.closest('.tree-node');
      if (!targetEl || targetEl === draggingNode) return;
      if (targetEl.classList.contains('disabled')) return;

      const dragId = Number(draggingNode.dataset.id);
      const targetId = Number(targetEl.dataset.id);
      if (this.isDescendant(targetId, dragId)) return;

      const childrenWrap = targetEl.nextElementSibling;
      if (childrenWrap) {
        childrenWrap.classList.add('open');
        childrenWrap.prepend(placeholder);
      }
    });

    list.addEventListener('drop', (e) => {
      e.preventDefault();
      if (!draggingNode) return;

      const dragId = Number(draggingNode.dataset.id);

      if (dropToRoot && e.target.closest('.drop-to-root')) {
        this.moveToRoot(dragId);
        this.displayData = this.deepClone(this.originData);
        this.render();
        if (this.options.customEvent && this.options.onDrop) {
          this.options.onDrop(this.originData);
        }
        return;
      }

      const targetEl = placeholder.closest('.tree-children')?.previousElementSibling;
      if (!targetEl) return;

      const parentId = Number(targetEl.dataset.id);
      if (this.isDescendant(parentId, dragId)) return;

      this.expandedIds.add(parentId);
      this.moveNodeTo(dragId, parentId);
      this.displayData = this.deepClone(this.originData);
      this.render();

      if (this.options.customEvent && this.options.onDrop) {
        this.options.onDrop(this.originData);
      }
    });
  }
}

// 全局关闭下拉面板（封装进JS）
document.addEventListener('click', (e) => {
  document.querySelectorAll('.tree-dropdown').forEach(dropdown => {
    if (!dropdown.contains(e.target)) {
      const panel = dropdown.querySelector('.tree-panel');
      if (panel) panel.classList.remove('show');
    }
  });
});

// 图标初始化
if (window.lucide) {
  lucide.createIcons();
}