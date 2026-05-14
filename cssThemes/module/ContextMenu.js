/**
 * Libs.UI.ContextMenu — frosted-themed right-click / long-press context menu.
 *
 * Public API (only what is exposed):
 *   const handle = Libs.UI.ContextMenu.bind(target, items, options)
 *   handle.unbind()
 *   Libs.UI.ContextMenu.close()
 *
 * target:  CSS selector | Element | NodeList | Array<Element>
 * items:   Array | (ctx) => Array
 *          entry: { label, callback, icon?, disabled?, children? }
 *                 { type: 'separator' }   // or { divider: true }
 * options: { longPressMs?: 500, cancelLabel?: 'Cancel', forceCancel?: false }
 *
 * Behaviour:
 *   - Inherits theme via --frosted-* CSS vars (light + dark themes both work).
 *   - Long-press (~500ms) on touch devices emulates contextmenu.
 *   - contextmenu handler calls stopPropagation, so a child binding stops the
 *     parent from also firing — "same-type region won't trigger outer".
 *   - Auto-closes on: option click, click outside, Esc, mouse leaving the menu
 *     tree (small grace period for crossing into a submenu).
 *   - Cancel row auto-appended on touch devices (or when forceCancel: true).
 *   - HR rows via { type: 'separator' }.
 *   - Submenus open on hover/tap; multiple levels supported.
 *   - Menu position is clamped on-screen; submenu prefers right, flips left
 *     if it would overflow. Only one menu open at a time.
 */
(function (global) {
    'use strict';

    let _activeRoot = null;     // root menu DOM element
    let _activeCtx = null;      // context passed to callbacks
    let _closeTimer = null;
    let _stylesInjected = false;

    const IS_TOUCH = ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

    // ---------- styles ----------

    function injectStyles() {
        if (_stylesInjected) return;
        _stylesInjected = true;
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
    -webkit-user-select: none;
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
.ctx-menu-item.disabled:hover {
    background: transparent;
    color: var(--frosted-text-primary, #1e293b);
}
.ctx-menu-item .ctx-icon {
    display: inline-flex;
    width: 14px;
    height: 14px;
    color: var(--frosted-text-tertiary, #94a3b8);
    flex-shrink: 0;
}
.ctx-menu-item .ctx-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}
.ctx-menu-item .ctx-arrow {
    margin-left: 4px;
    opacity: 0.55;
    font-size: 10px;
    line-height: 1;
}
.ctx-menu-item.ctx-cancel {
    justify-content: center;
    color: var(--frosted-text-secondary, #475569);
    font-weight: 500;
}
.ctx-menu-sep {
    height: 1px;
    margin: 4px 6px;
    background: var(--frosted-border-default, rgba(120, 140, 170, 0.3));
    opacity: 0.7;
}
        `;
        const style = document.createElement('style');
        style.setAttribute('data-ctx-menu', '1');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // ---------- DOM helpers ----------

    function escapeHtml(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    function resolveTargets(target) {
        if (!target) return [];
        if (typeof target === 'string') return Array.from(document.querySelectorAll(target));
        if (target.nodeType === 1) return [target];
        if (target.length != null) return Array.from(target);
        return [];
    }

    // ---------- build / open / close ----------

    function buildMenu(items, ctx, depth, options) {
        const menu = document.createElement('div');
        menu.className = depth === 0 ? 'ctx-menu' : 'ctx-submenu';

        const finalItems = items.slice();
        if (depth === 0 && (IS_TOUCH || (options && options.forceCancel))) {
            finalItems.push({ type: 'separator' });
            finalItems.push({
                label: (options && options.cancelLabel) || 'Cancel',
                __cancel: true,
                callback: closeAll
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
                ? `<span class="ctx-icon"><span class="icon ${escapeHtml(item.icon)}"></span></span>`
                : '';
            const arrowHtml = hasChildren ? '<span class="ctx-arrow">▸</span>' : '';
            row.innerHTML = `${iconHtml}<span class="ctx-label">${escapeHtml(item.label)}</span>${arrowHtml}`;

            row.addEventListener('mouseenter', () => {
                // close any sibling submenu opened earlier
                closeSiblingSubmenus(menu, row);
                if (hasChildren && !item.disabled) {
                    openSubmenu(row, item.children, ctx, depth, options);
                }
            });

            row.addEventListener('click', e => {
                e.stopPropagation();
                if (item.disabled) return;
                if (hasChildren) {
                    // On touch, tapping a parent opens its submenu instead of closing
                    if (!row._sub) openSubmenu(row, item.children, ctx, depth, options);
                    return;
                }
                if (typeof item.callback === 'function') {
                    try { item.callback(ctx); } catch (err) { console.error(err); }
                }
                closeAll();
            });

            menu.appendChild(row);
        });

        // Mouse leaving the menu schedules a close; entering cancels it
        menu.addEventListener('mouseleave', scheduleClose);
        menu.addEventListener('mouseenter', cancelScheduledClose);

        return menu;
    }

    function openSubmenu(parentRow, children, ctx, depth, options) {
        closeSiblingSubmenus(parentRow.parentElement, parentRow);
        parentRow.classList.add('ctx-active');

        const sub = buildMenu(children, ctx, depth + 1, options);
        document.body.appendChild(sub);
        positionSubmenu(sub, parentRow.getBoundingClientRect());
        parentRow._sub = sub;
        sub._parentRow = parentRow;
    }

    function closeSiblingSubmenus(menu, keepRow) {
        if (!menu) return;
        Array.from(menu.children).forEach(row => {
            if (row === keepRow) return;
            if (row._sub) {
                closeSiblingSubmenus(row._sub, null);
                row._sub.remove();
                row._sub = null;
                row.classList.remove('ctx-active');
            }
        });
    }

    function positionMenu(menu, x, y) {
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

    function positionSubmenu(sub, parentRect) {
        sub.style.left = '0px';
        sub.style.top = '0px';
        const r = sub.getBoundingClientRect();
        const vw = window.innerWidth, vh = window.innerHeight, pad = 8;
        let nx = parentRect.right - 4;
        let ny = parentRect.top - 4;
        // Prefer right; flip left if not enough room
        if (nx + r.width > vw - pad) nx = parentRect.left - r.width + 4;
        if (nx < pad) nx = pad;
        if (ny + r.height > vh - pad) ny = Math.max(pad, vh - r.height - pad);
        sub.style.left = nx + 'px';
        sub.style.top = ny + 'px';
    }

    function open(items, x, y, ctx, options) {
        closeAll();
        injectStyles();
        const list = typeof items === 'function' ? items(ctx) : items;
        if (!Array.isArray(list) || list.length === 0) return;

        const menu = buildMenu(list, ctx, 0, options || {});
        document.body.appendChild(menu);
        positionMenu(menu, x, y);

        _activeRoot = menu;
        _activeCtx = ctx;

        // bind globals on next tick so the opening event doesn't immediately close us
        setTimeout(() => {
            document.addEventListener('mousedown', onDocPointer, true);
            document.addEventListener('touchstart', onDocPointer, true);
            document.addEventListener('contextmenu', onDocContext, true);
            window.addEventListener('keydown', onKey, true);
            window.addEventListener('blur', closeAll);
            window.addEventListener('resize', closeAll);
            window.addEventListener('scroll', closeAll, true);
        }, 0);
    }

    function closeAll() {
        cancelScheduledClose();
        if (_activeRoot) {
            // walk and remove submenu chain
            closeSiblingSubmenus(_activeRoot, null);
            _activeRoot.remove();
            _activeRoot = null;
            _activeCtx = null;
        }
        document.removeEventListener('mousedown', onDocPointer, true);
        document.removeEventListener('touchstart', onDocPointer, true);
        document.removeEventListener('contextmenu', onDocContext, true);
        window.removeEventListener('keydown', onKey, true);
        window.removeEventListener('blur', closeAll);
        window.removeEventListener('resize', closeAll);
        window.removeEventListener('scroll', closeAll, true);
    }

    function scheduleClose() {
        cancelScheduledClose();
        _closeTimer = setTimeout(closeAll, 350);
    }
    function cancelScheduledClose() {
        if (_closeTimer) { clearTimeout(_closeTimer); _closeTimer = null; }
    }

    function isInsideMenu(el) {
        while (el) {
            if (el.classList && (el.classList.contains('ctx-menu') || el.classList.contains('ctx-submenu'))) {
                return true;
            }
            el = el.parentElement;
        }
        return false;
    }

    function onDocPointer(e) {
        if (!_activeRoot) return;
        if (!isInsideMenu(e.target)) closeAll();
    }
    function onDocContext(e) {
        // a new contextmenu somewhere else — let the new handler open its own menu;
        // we just close ours if the click landed outside the current tree.
        if (!isInsideMenu(e.target)) closeAll();
    }
    function onKey(e) {
        if (e.key === 'Escape') closeAll();
    }

    // ---------- bind / unbind ----------

    function bind(target, items, options) {
        options = options || {};
        const longPressMs = options.longPressMs || 500;
        const els = resolveTargets(target);
        const records = [];

        els.forEach(el => {
            const ctxHandler = function (e) {
                e.preventDefault();
                e.stopPropagation();           // <-- inner binding wins; outer parent menu suppressed
                const ctx = { event: e, target: el, originalTarget: e.target };
                open(items, e.clientX, e.clientY, ctx, options);
            };

            let lpTimer = null, sx = 0, sy = 0, fired = false;
            const touchStart = function (e) {
                if (!e.touches || e.touches.length !== 1) return;
                fired = false;
                sx = e.touches[0].clientX;
                sy = e.touches[0].clientY;
                lpTimer = setTimeout(() => {
                    lpTimer = null;
                    fired = true;
                    // suppress the synthetic click that may follow
                    const ctx = { event: e, target: el, originalTarget: e.target };
                    open(items, sx, sy, ctx, options);
                }, longPressMs);
            };
            const touchMove = function (e) {
                if (!lpTimer || !e.touches || e.touches.length !== 1) return;
                const t = e.touches[0];
                if (Math.abs(t.clientX - sx) > 8 || Math.abs(t.clientY - sy) > 8) {
                    clearTimeout(lpTimer);
                    lpTimer = null;
                }
            };
            const touchEnd = function (e) {
                if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; }
                if (fired) {
                    // prevent the following click from selecting things
                    e.preventDefault();
                    fired = false;
                }
            };
            // stop the touchstart from bubbling so an outer long-press handler doesn't also fire
            const touchStartCapture = function (e) {
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
            unbind() {
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

    // ---------- public ----------

    global.Libs = global.Libs || {};
    global.Libs.UI = global.Libs.UI || {};
    global.Libs.UI.ContextMenu = {
        bind: bind,
        close: closeAll
    };
})(window);
