class FrostedTransfer {
  constructor({
    containerId,
    data = [],
    titles = ["Source", "Target"],
    onChange,
  }) {
    this.container = document.getElementById(containerId);
    this.leftData = data.map((item, idx) => ({
      ...item,
      _key: idx,
      _selected: false,
    }));
    this.rightData = [];
    this.titles = titles;
    this.onChange = onChange || (() => {});
  }

  init() {
    this.render();
  }

  render() {
    const leftSelected = this.leftData.filter((i) => i._selected);
    const rightSelected = this.rightData.filter((i) => i._selected);
    const hasLeftSel = leftSelected.length > 0;
    const hasRightSel = rightSelected.length > 0;
    const hasLeft = this.leftData.length > 0;
    const hasRight = this.rightData.length > 0;
    this.container.innerHTML = `
            <div style="display:flex;align-items:center;gap:12px;">
              <div class="frosted-card ft-panel notransition">
                <div class="ft-header">
                  <span style="font-weight:600;color:var(--frosted-text-primary);font-size:14px;">${this.titles[0]}</span>
                  <span style="font-size:12px;color:var(--frosted-text-tertiary);">${leftSelected.length}/${this.leftData.length}</span>
                </div>
                <div class="ft-list">
                  ${this.leftData.length === 0 ? '<div class="ft-empty">No data</div>' : ""}
                  ${this.leftData
                    .map(
                      (item) => `
                    <div data-key="${item._key}" data-side="left" class="ft-item ${item._selected ? "selected" : ""}" style="display:flex;align-items:center;gap:8px;">
                      <div class="checkbox-box ${item._selected ? "checked" : ""}" style="flex-shrink:0;pointer-events:none;">
                        <div class="checkbox-glint"></div>
                        <div class="checkbox-bead">
                          <div class="bead-inner">
                            <div class="bead-highlight"></div>
                            <div class="bead-secondary"></div>
                          </div>
                        </div>
                      </div>
                      <span>${item.label}</span>
                    </div>
                  `,
                    )
                    .join("")}
                </div>
              </div>
              <div class="ft-btns">
                <button class="frosted-button frosted-button-cyan ft-btn" ${!hasLeftSel ? "disabled" : ""} title="Move selected right">&gt;</button>
                <button class="frosted-button frosted-button-cyan ft-btn" ${!hasLeft ? "disabled" : ""} title="Move all right">&gt;&gt;</button>
                <button class="frosted-button frosted-button-purple ft-btn" ${!hasRightSel ? "disabled" : ""} title="Move selected left">&lt;</button>
                <button class="frosted-button frosted-button-purple ft-btn" ${!hasRight ? "disabled" : ""} title="Move all left">&lt;&lt;</button>
              </div>
              <div class="frosted-card ft-panel notransition">
                <div class="ft-header">
                  <span style="font-weight:600;color:var(--frosted-text-primary);font-size:14px;">${this.titles[1]}</span>
                  <span style="font-size:12px;color:var(--frosted-text-tertiary);">${rightSelected.length}/${this.rightData.length}</span>
                </div>
                <div class="ft-list">
                  ${this.rightData.length === 0 ? '<div class="ft-empty">No data</div>' : ""}
                  ${this.rightData
                    .map(
                      (item) => `
                    <div data-key="${item._key}" data-side="right" class="ft-item ${item._selected ? "selected" : ""}" style="display:flex;align-items:center;gap:8px;">
                      <div class="checkbox-box ${item._selected ? "checked" : ""}" style="flex-shrink:0;pointer-events:none;">
                        <div class="checkbox-glint"></div>
                        <div class="checkbox-bead">
                          <div class="bead-inner">
                            <div class="bead-highlight"></div>
                            <div class="bead-secondary"></div>
                          </div>
                        </div>
                      </div>
                      <span>${item.label}</span>
                    </div>
                  `,
                    )
                    .join("")}
                </div>
              </div>
            </div>
          `;

    this.container.querySelectorAll("[data-side]").forEach((el) => {
      el.addEventListener("click", (e) => {
        const key = Number(e.currentTarget.dataset.key);
        const side = e.currentTarget.dataset.side;
        if (side === "left") {
          const item = this.leftData.find((i) => i._key === key);
          if (item) item._selected = !item._selected;
        } else {
          const item = this.rightData.find((i) => i._key === key);
          if (item) item._selected = !item._selected;
        }
        this.render();
      });
    });

    const btns = this.container.querySelectorAll("button");
    btns[0].addEventListener("click", () => this.moveSelected("right"));
    btns[1].addEventListener("click", () => this.moveAll("right"));
    btns[2].addEventListener("click", () => this.moveSelected("left"));
    btns[3].addEventListener("click", () => this.moveAll("left"));
  }

  moveSelected(direction) {
    if (direction === "right") {
      const toMove = this.leftData.filter((i) => i._selected);
      toMove.forEach((i) => {
        i._selected = false;
      });
      this.leftData = this.leftData.filter((i) => !toMove.includes(i));
      this.rightData.push(...toMove);
    } else {
      const toMove = this.rightData.filter((i) => i._selected);
      toMove.forEach((i) => {
        i._selected = false;
      });
      this.rightData = this.rightData.filter((i) => !toMove.includes(i));
      this.leftData.push(...toMove);
    }
    this.render();
    this.onChange({ left: this.getLeft(), right: this.getRight() });
  }

  moveAll(direction) {
    if (direction === "right") {
      this.leftData.forEach((i) => {
        i._selected = false;
      });
      this.rightData.push(...this.leftData);
      this.leftData = [];
    } else {
      this.rightData.forEach((i) => {
        i._selected = false;
      });
      this.leftData.push(...this.rightData);
      this.rightData = [];
    }
    this.render();
    this.onChange({ left: this.getLeft(), right: this.getRight() });
  }

  getLeft() {
    return this.leftData.map((i) => ({ label: i.label, value: i.value }));
  }
  getRight() {
    return this.rightData.map((i) => ({ label: i.label, value: i.value }));
  }

  setLeft(items) {
    this.leftData = items.map((item, idx) => ({
      ...item,
      _key: Date.now() + idx,
      _selected: false,
    }));
    this.render();
  }

  setRight(items) {
    this.rightData = items.map((item, idx) => ({
      ...item,
      _key: Date.now() + idx,
      _selected: false,
    }));
    this.render();
  }
}