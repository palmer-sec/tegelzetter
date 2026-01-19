// tiling.js (GNOME Shell extension module)

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import Meta from 'gi://Meta';

function getFocusedNormalWindow() {
  const win = global.display.get_focus_window();
  if (!win) return null;

  // Optional filtering:
  if (win.get_window_type && win.get_window_type() !== Meta.WindowType.NORMAL)
    return null;

  // If a dialog is focused, you may prefer its parent:
  const parent = win.get_transient_for?.();
  if (parent) return parent;

  return win;
}

function unmaximizeIfNeeded(win) {
  // Meta.MaximizeFlags.BOTH is commonly used; in JS, 3 is BOTH (H|V).
  // Use the enum if available.
  try {
    if (win.get_maximized && win.get_maximized()) {
      win.unmaximize(Meta.MaximizeFlags.BOTH);
    }
  } catch (_) {
    // Safe fallback if enum differs
    try { win.unmaximize(3); } catch (_) {}
  }
}

// Returns {x,y,width,height} of the usable area of the monitor containing win
function getWorkAreaForWindow(win) {
  const monitor = win.get_monitor();
  return Main.layoutManager.getWorkAreaForMonitor(monitor);
}

// Map your 12 layouts to grid positions
export function computeTileRect(workArea, key) {
  const WA = workArea;
  const quarter = Math.floor(WA.width / 4);
  const halfH = Math.floor(WA.height / 2);

  const col = (c) => WA.x + c * quarter;
  const topY = WA.y;
  const botY = WA.y + halfH;

  const k = key.toUpperCase();

  // Top row QWER => cols 0..3, height=half
  if ('QWER'.includes(k)) {
    const c = { Q: 0, W: 1, E: 2, R: 3 }[k];
    return { x: col(c), y: topY, width: quarter, height: halfH };
  }

  // Bottom row ASDF => cols 0..3, y=half, height=half
  if ('ASDF'.includes(k)) {
    const c = { A: 0, S: 1, D: 2, F: 3 }[k];
    return { x: col(c), y: botY, width: quarter, height: WA.height - halfH };
  }

  // Full height HJKL => cols 0..3, height=full
  if ('HJKL'.includes(k)) {
    const c = { H: 0, J: 1, K: 2, L: 3 }[k];
    return { x: col(c), y: WA.y, width: quarter, height: WA.height };
  }

  return null;
}

export function tileFocused(key) {
  const win = getFocusedNormalWindow();
  if (!win) return false;

  unmaximizeIfNeeded(win);

  const WA = getWorkAreaForWindow(win);
  const rect = computeTileRect(WA, key);
  if (!rect) return false;

  // Mutter API: move_resize_frame(user_op, x, y, w, h)
  // This operates on the outer frame (what you want for tiling). :contentReference[oaicite:3]{index=3}
  win.move_resize_frame(true, rect.x, rect.y, rect.width, rect.height);
  return true;
}

export function nudgeFocused(dx, dy) {
  const win = getFocusedNormalWindow();
  if (!win) return false;

  const r = win.get_frame_rect();
  win.move_resize_frame(true, r.x + dx, r.y + dy, r.width, r.height);
  return true;
}

export function resizeFocused(dw, dh) {
  const win = getFocusedNormalWindow();
  if (!win) return false;

  const r = win.get_frame_rect();
  win.move_resize_frame(true, r.x, r.y, Math.max(50, r.width + dw), Math.max(50, r.height + dh));
  return true;
}

