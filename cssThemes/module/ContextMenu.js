/**
 * ContextMenu - Frosted-themed right-click / long-press context menu
 * with submenu, touch, keyboard, and theme support.
 *
 * Public API:
 *   bind(target, items, options) => { unbind() }
 *   close()
 */
class ContextMenuCore {
    constructor() {
        this._activeRoot = null;
        this._activeCtx = null;
        this._closeTimer = null;
        this._stylesInjected = false;

        this.IS_TOUCH =
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

        this.closeAll = this.closeAll.bind(this);
        this.onDocPointer = this.onDocPointer.bind(this);
        this.onDocContext = this.onDocContext.bind(this);
        this.onKey = this.onKey.bind(this);
    }

    injectStyles() {
        if (this._stylesInjected) return;
        this._stylesInjected = true;

        const css = `
.ctx-menu, .ctx-submenu {
    position: fixed;
    min-width: 180px;
    max-width: 280px;
    padding: 6px;
    margin: 0;
    box-sizing: border-box;
    background: linear-gradient(180deg,
        rgba(255, 255, 255, 0.08) 0%,
        var(--frosted-bg-subtle, rgba(235, 240, 246, 0.96)) 15%,
        var(--frosted-bg-subtle, rgba(235, 240, 246, 0.96)) 85%,
        rgba(0, 0, 0, 0.02) 100%);
    border: 1px solid var(--frosted-border-default, rgba(120, 140, 170, 0.25));
    border-radius: 10px;
    backdrop-filter: blur(14px) saturate(150%);
    -webkit-backdrop-filter: blur(14px) saturate(150%);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18), 0 2px 6px rgba(0, 0, 0, 0.08);
    z-index: 99999;
    font-size: 13px;
    color: var(--frosted-text-primary, #1e293b);
    user-select: none;
    animation: ctx-pop 0.12s ease-out;
}
@keyframes ctx-pop {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
}
.ctx-menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.12s, color 0.12s;
    white-space: nowrap;
}
.ctx-menu-item:hover,
.ctx-menu-item.ctx-active {
    background: var(--frosted-cyan-bg, rgba(56, 178, 230, 0.14));
    color: var(--frosted-cyan-text, var(--frosted-text-primary, #1e293b));
}
.ctx-menu-item.disabled {
    opacity: 0.42;
    cursor: not-allowed;
}
.ctx-menu-item .ctx-icon {
    display: inline-flex;
    width: 14px;
    height: 14px;
    color: var(--frosted-text-tertiary, #94a3b8);
    flex-shrink: 0;
}
.ctx-menu-item .ctx-label { flex:1; overflow:hidden; text-overflow:ellipsis; }
.ctx-menu-item .ctx-arrow { margin-left:4px; opacity:0.55; font-size:10px; }
.ctx-menu-item.ctx-cancel { justify-content:center; color:var(--frosted-text-secondary); font-weight:500; }
.ctx-menu-sep { height:1px; margin:4px 6px; background:var(--frosted-border-default); opacity:0.7; }
        `;

        const style = document.createElement('style');
        style.setAttribute('data-ctx-menu', '1');
        style.textContent = css;
        document.head.appendChild(style);
    }

    escapeHtml(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    resolveTargets(target) {
        if (!target) return [];
        if (typeof target === 'string') return Array.from(document.querySelectorAll(target));
        if (target.nodeType === 1) return [target];
        if (target.length != null) return Array.from(target);
        return [];
    }

    buildMenu(items, ctx, depth, options) {
        const menu = document.createElement('div');
        menu.className = depth === 0 ? 'ctx-menu' : 'ctx-submenu';
        const finalItems = items.slice();

        if (depth === 0 && (this.IS_TOUCH || (options && options.forceCancel))) {
            finalItems.push({ type: 'separator' });
            finalItems.push({
                label: (options && options.cancelLabel) || 'Cancel',
                __cancel: true,
                callback: () => this.closeAll()
            });
        }

        finalItems.forEach(item => {
            if (item.type === 'separator' || item.divider) {
                const sep = document.createElement('div');
                sep.className = 'ctx-menu-sep';
                menu.appendChild(sep);
                return;
            }

            const row = document.createElement('div');
            row.className = 'ctx-menu-item';
            if (item.disabled) row.classList.add('disabled');
            if (item.__cancel) row.classList.add('ctx-cancel');

            const hasChildren = Array.isArray(item.children) && item.children.length > 0;
            const iconHtml = item.icon
                ? `<span class="ctx-icon"><span class="icon ${this.escapeHtml(item.icon)}"></span></span>`
                : '';
            const arrowHtml = hasChildren ? '<span class="ctx-arrow">▸</span>' : '';
            row.innerHTML = `${iconHtml}<span class="ctx-label">${this.escapeHtml(item.label)}</span>${arrowHtml}`;

            row.addEventListener('mouseenter', () => {
                this.closeSiblingSubmenus(menu, row);
                if (hasChildren && !item.disabled)
                    this.openSubmenu(row, item.children, ctx, depth, options);
            });

            row.addEventListener('click', e => {
                e.stopPropagation();
                if (item.disabled) return;
                if (hasChildren) {
                    if (!row._sub) this.openSubmenu(row, item.children, ctx, depth, options);
                    return;
                }
                if (typeof item.callback === 'function') {
                    try { item.callback(ctx); } catch (err) { console.error(err); }
                }
                this.closeAll();
            });

            menu.appendChild(row);
        });

        menu.addEventListener('mouseleave', () => this.scheduleClose());
        menu.addEventListener('mouseenter', () => this.cancelScheduledClose());
        return menu;
    }

    openSubmenu(parentRow, children, ctx, depth, options) {
        this.closeSiblingSubmenus(parentRow.parentElement, parentRow);
        parentRow.classList.add('ctx-active');
        const sub = this.buildMenu(children, ctx, depth + 1, options);
        document.body.appendChild(sub);
        this.positionSubmenu(sub, parentRow.getBoundingClientRect());
        parentRow._sub = sub;
        sub._parentRow = parentRow;
    }

    closeSiblingSubmenus(menu, keepRow) {
        if (!menu) return;
        Array.from(menu.children).forEach(row => {
            if (row === keepRow || !row._sub) return;
            this.closeSiblingSubmenus(row._sub, null);
            row._sub.remove();
            row._sub = null;
            row.classList.remove('ctx-active');
        });
    }

    positionMenu(menu, x, y) {
        menu.style.left = '0px';
        menu.style.top = '0px';
        const r = menu.getBoundingClientRect();
        const vw = window.innerWidth, vh = window.innerHeight, pad = 8;
        let nx = x, ny = y;
        if (nx + r.width > vw - pad) nx = Math.max(pad, vw - r.width - pad);
        if (ny + r.height > vh - pad) ny = Math.max(pad, vh - r.height - pad);
        if (nx < pad) nx = pad;
        if (ny < pad) ny = pad;
        menu.style.left = nx + 'px';
        menu.style.top = ny + 'px';
    }

    positionSubmenu(sub, parentRect) {
        sub.style.left = '0px';
        sub.style.top = '0px';
        const r = sub.getBoundingClientRect();
        const vw = window.innerWidth, vh = window.innerHeight, pad = 8;
        let nx = parentRect.right - 4;
        let ny = parentRect.top - 4;
        if (nx + r.width > vw - pad) nx = parentRect.left - r.width + 4;
        if (nx < pad) nx = pad;
        if (ny + r.height > vh - pad) ny = Math.max(pad, vh - r.height - pad);
        sub.style.left = nx + 'px';
        sub.style.top = ny + 'px';
    }

    open(items, x, y, ctx, options) {
        this.closeAll();
        this.injectStyles();
        const list = typeof items === 'function' ? items(ctx) : items;
        if (!Array.isArray(list) || list.length === 0) return;

        const menu = this.buildMenu(list, ctx, 0, options || {});
        document.body.appendChild(menu);
        this.positionMenu(menu, x, y);
        this._activeRoot = menu;
        this._activeCtx = ctx;

        setTimeout(() => {
            document.addEventListener('mousedown', this.onDocPointer, true);
            document.addEventListener('touchstart', this.onDocPointer, true);
            document.addEventListener('contextmenu', this.onDocContext, true);
            window.addEventListener('keydown', this.onKey, true);
            window.addEventListener('blur', this.closeAll);
            window.addEventListener('resize', this.closeAll);
            window.addEventListener('scroll', this.closeAll, true);
        }, 0);
    }

    closeAll() {
        this.cancelScheduledClose();
        if (this._activeRoot) {
            this.closeSiblingSubmenus(this._activeRoot, null);
            this._activeRoot.remove();
            this._activeRoot = null;
            this._activeCtx = null;
        }

        document.removeEventListener('mousedown', this.onDocPointer, true);
        document.removeEventListener('touchstart', this.onDocPointer, true);
        document.removeEventListener('contextmenu', this.onDocContext, true);
        window.removeEventListener('keydown', this.onKey, true);
        window.removeEventListener('blur', this.closeAll);
        window.removeEventListener('resize', this.closeAll);
        window.removeEventListener('scroll', this.closeAll, true);
    }

    scheduleClose() {
        this.cancelScheduledClose();
        this._closeTimer = setTimeout(() => this.closeAll(), 350);
    }

    cancelScheduledClose() {
        if (this._closeTimer) {
            clearTimeout(this._closeTimer);
            this._closeTimer = null;
        }
    }

    isInsideMenu(el) {
        let curr = el;
        while (curr) {
            if (curr.classList?.contains('ctx-menu') || curr.classList?.contains('ctx-submenu'))
                return true;
            curr = curr.parentElement;
        }
        return false;
    }

    onDocPointer(e) {
        if (!this._activeRoot) return;
        if (!this.isInsideMenu(e.target)) this.closeAll();
    }

    onDocContext(e) {
        if (!this.isInsideMenu(e.target)) this.closeAll();
    }

    onKey(e) {
        if (e.key === 'Escape') this.closeAll();
    }

    bind(target, items, options) {
        options = options || {};
        const longPressMs = options.longPressMs || 500;
        const els = this.resolveTargets(target);
        const records = [];

        els.forEach(el => {
            const ctxHandler = e => {
                e.preventDefault();
                e.stopPropagation();
                const ctx = { event: e, target: el, originalTarget: e.target };
                this.open(items, e.clientX, e.clientY, ctx, options);
            };

            let lpTimer = null, sx = 0, sy = 0, fired = false;

            const touchStart = e => {
                if (!e.touches || e.touches.length !== 1) return;
                fired = false;
                sx = e.touches[0].clientX;
                sy = e.touches[0].clientY;
                lpTimer = setTimeout(() => {
                    lpTimer = null;
                    fired = true;
                    const ctx = { event: e, target: el, originalTarget: e.target };
                    this.open(items, sx, sy, ctx, options);
                }, longPressMs);
            };

            const touchMove = e => {
                if (!lpTimer || !e.touches || e.touches.length !== 1) return;
                const t = e.touches[0];
                if (Math.abs(t.clientX - sx) > 8 || Math.abs(t.clientY - sy) > 8) {
                    clearTimeout(lpTimer);
                    lpTimer = null;
                }
            };

            const touchEnd = e => {
                if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; }
                if (fired) { e.preventDefault(); fired = false; }
            };

            const touchStartCapture = e => {
                e.stopPropagation();
                touchStart(e);
            };

            el.addEventListener('contextmenu', ctxHandler);
            el.addEventListener('touchstart', touchStartCapture, { passive: true });
            el.addEventListener('touchmove', touchMove, { passive: true });
            el.addEventListener('touchend', touchEnd);
            el.addEventListener('touchcancel', touchEnd);

            records.push({ el, ctxHandler, touchStartCapture, touchMove, touchEnd });
        });

        return {
            unbind: () => {
                records.forEach(r => {
                    r.el.removeEventListener('contextmenu', r.ctxHandler);
                    r.el.removeEventListener('touchstart', r.touchStartCapture);
                    r.el.removeEventListener('touchmove', r.touchMove);
                    r.el.removeEventListener('touchend', r.touchEnd);
                    r.el.removeEventListener('touchcancel', r.touchEnd);
                });
                records.length = 0;
            }
        };
    }
}

const instance = new ContextMenuCore();

// ONLY EXPORT — NO GLOBAL ASSIGNMENT
export const ContextMenu = {
    bind: instance.bind.bind(instance),
    close: instance.closeAll.bind(instance)
};

export default ContextMenu;