class FrostedFeedback {
  static containers = {};
  static _getContainer(position) {
    if (!this.containers[position]) {
      const el = document.createElement("div");
      el.className = "ft-feedback-container " + position;
      document.body.appendChild(el);
      this.containers[position] = el;
    }
    return this.containers[position];
  }

  // Supports: message (title) + content (detail text)
  static show({
    message,
    type = "info",
    position = "top",
    duration = 3000,
    content,
  }) {
    const container = this._getContainer(position);

    const item = document.createElement("div");
    item.className = "ft-feedback-item " + position + " " + type;

    const icons = { success: "✓", info: "ℹ", warning: "⚠", error: "✕" };
    const iconHtml = `<span style="font-size:16px;font-weight:700;flex-shrink:0;">${icons[type] || "ℹ"}</span>`;

    // Title + Content structure
    let contentHtml = "";
    if (content) {
      contentHtml = `
        <div style="display:flex;flex-direction:column;gap:4px;line-height:1.4;">
          <span style="font-weight:600;">${message}</span>
          <span style="font-size:12px;opacity:0.85;">${content}</span>
        </div>
      `;
    } else {
      contentHtml = `<span>${message}</span>`;
    }

    item.innerHTML = iconHtml + contentHtml;
    container.appendChild(item);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        item.classList.add("show");
      });
    });

    setTimeout(() => {
      item.classList.remove("show");
      item.addEventListener(
        "transitionend",
        () => {
          if (item.parentNode) item.parentNode.removeChild(item);
        },
        { once: true },
      );
      setTimeout(() => {
        if (item.parentNode) item.parentNode.removeChild(item);
      }, 500);
    }, duration);
  }

  static demo() {
    const states = ["success", "info", "warning", "error"];
    const msgs = [
      "Operation completed successfully",
      "Here is some useful information",
      "Please pay attention to this warning",
      "An error has occurred",
    ];
    const contents = [
      "Your data has been saved",
      "This is a detail description for your info",
      "This operation may affect your system status",
      "Please check your network and try again",
    ];
    states.forEach((type, i) => {
      setTimeout(() => {
        // Content parameter is now supported!
        FrostedFeedback.show({
          message: msgs[i],
          content: contents[i],
          type: type,
          position: "top",
          duration: 4000,
        });
      }, i * 800);
    });
  }
}