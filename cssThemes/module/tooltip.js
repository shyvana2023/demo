class FrostedTooltip {
  constructor() {
    this.el = null;
    this.hideTimer = null;
    this.currentTarget = null;
  }

  init() {
    this.el = document.createElement("div");
    this.el.className = "ft-tooltip";
    this.el.style.position = "absolute";
    document.body.appendChild(this.el);

    // Listen on mouseenter in capture phase: show tooltip when mouse enters the trigger button
    document.addEventListener("mouseenter", (e) => {
      const trigger = e.target.closest("[data-tooltip]");
      if (!trigger) return;
      this.show(trigger);
    }, true);

    // Listen on mouseleave in capture phase: hide with delay when mouse leaves the trigger button
    document.addEventListener("mouseleave", (e) => {
      const trigger = e.target.closest("[data-tooltip]");
      if (!trigger) return;
      this.scheduleHide();
    }, true);

    // When mouse enters tooltip: cancel hide timer, keep visible
    this.el.addEventListener("mouseenter", () => {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    });

    // When mouse leaves tooltip: hide with delay
    this.el.addEventListener("mouseleave", () => {
      this.scheduleHide();
    });
  }

  show(trigger) {
    clearTimeout(this.hideTimer);
    this.currentTarget = trigger;
    const content = trigger.getAttribute("data-tooltip");
    const title = trigger.getAttribute("data-tooltip-title");
    const dir = trigger.getAttribute("data-tooltip-dir") || "top";
    const type = trigger.getAttribute("data-tooltip-type") || "text";

    this.el.setAttribute("data-dir", dir);
    this.el.innerHTML = "";

    let inner;
    if (type === "popover") {
      inner = document.createElement("div");
      inner.className = "ft-tooltip-popover";
      inner.innerHTML = `
              <div class="ft-popover-title">${title || "Tip"}</div>
              <div class="ft-popover-body">${content}</div>
              <div class="ft-popover-footer">
                <button class="frosted-button text-sm" style="height:32px;padding:0 12px;" data-tooltip-close>close</button>
                <button class="frosted-button frosted-button-cyan text-sm" style="height:32px;padding:0 12px;" data-tooltip-close>confirm</button>
              </div>
            `;
      inner.querySelectorAll("[data-tooltip-close]").forEach((btn) => {
        btn.addEventListener("click", () => this.hide());
      });
    } else {
      inner = document.createElement("div");
      inner.className = "ft-tooltip-text";
      inner.textContent = content;
    }

    const arrow = document.createElement("div");
    arrow.className = "ft-tooltip-arrow";

    this.el.appendChild(inner);
    this.el.appendChild(arrow);
    this.el.classList.add("show");

    // force reflow
    void this.el.offsetWidth;
    this.position(trigger, dir);
  }

  position(target, dir) {
    const rect = target.getBoundingClientRect();
    const tipRect = this.el.getBoundingClientRect();
    let top, left;

    switch (dir) {
      case "top":
        top = rect.top - tipRect.height - 8;
        left = rect.left + (rect.width - tipRect.width) / 2;
        break;
      case "bottom":
        top = rect.bottom + 8;
        left = rect.left + (rect.width - tipRect.width) / 2;
        break;
      case "left":
        top = rect.top + (rect.height - tipRect.height) / 2;
        left = rect.left - tipRect.width - 8;
        break;
      case "right":
        top = rect.top + (rect.height - tipRect.height) / 2;
        left = rect.right + 8;
        break;
    }

    // boundary guard
    const pad = 8;
    if (left < pad) left = pad;
    if (left + tipRect.width > window.innerWidth - pad)
      left = window.innerWidth - tipRect.width - pad;
    if (top < pad) {
      if (dir === "top") {
        top = rect.bottom + 8;
      } else {
        top = pad;
      }
    }
    if (top + tipRect.height > window.innerHeight - pad) {
      if (dir === "bottom") {
        top = rect.top - tipRect.height - 8;
      } else {
        top = window.innerHeight - tipRect.height - pad;
      }
    }

    this.el.style.top = `${top + window.scrollY}px`;
    this.el.style.left = `${left + window.scrollX}px`;
  }

  scheduleHide() {
    clearTimeout(this.hideTimer);
    this.hideTimer = setTimeout(() => {
      this.el.classList.remove("show");
      this.currentTarget = null;
    }, 200);
  }
}

/*
FrostedFeedback.show({
  message: "Saved successfully",
  content: "Your data has been synced to the server",
  type: "success",
  duration: 3000
});
*/