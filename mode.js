// mode.js

import Clutter from 'gi://Clutter';
import { nudgeFocused, resizeFocused } from './tiling.js';

export class ResizeMode {
  constructor() {
    this._enabled = false;
    this._handlerId = 0;
    this._stepMove = 20;
    this._stepResize = 40;
  }

  enable() {
    if (this._enabled) return;
    this._enabled = true;

    this._handlerId = global.stage.connect('captured-event', (_actor, event) => {
      if (!this._enabled) return Clutter.EVENT_PROPAGATE;

      if (event.type() !== Clutter.EventType.KEY_PRESS)
        return Clutter.EVENT_PROPAGATE;

      const sym = event.get_key_symbol();
      const state = event.get_state?.() ?? 0;
      const shift = (state & Clutter.ModifierType.SHIFT_MASK) !== 0;

      // Exit
      if (sym === Clutter.KEY_Escape) {
        this.disable();
        return Clutter.EVENT_STOP;
      }

      const move = shift ? this._stepMove : 0;
      const resize = shift ? 0 : this._stepResize;

      switch (sym) {
        case Clutter.KEY_Left:
          shift ? nudgeFocused(-move, 0) : resizeFocused(-resize, 0);
          return Clutter.EVENT_STOP;
        case Clutter.KEY_Right:
          shift ? nudgeFocused(move, 0) : resizeFocused(resize, 0);
          return Clutter.EVENT_STOP;
        case Clutter.KEY_Up:
          shift ? nudgeFocused(0, -move) : resizeFocused(0, -resize);
          return Clutter.EVENT_STOP;
        case Clutter.KEY_Down:
          shift ? nudgeFocused(0, move) : resizeFocused(0, resize);
          return Clutter.EVENT_STOP;
        default:
          return Clutter.EVENT_PROPAGATE;
      }
    });
  }

  disable() {
    if (!this._enabled) return;
    this._enabled = false;
    if (this._handlerId) {
      global.stage.disconnect(this._handlerId);
      this._handlerId = 0;
    }
  }

  toggle() {
    this._enabled ? this.disable() : this.enable();
  }
}

