// extension.js (GNOME Shell 45+ style

import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

import { tileFocused } from './tiling.js';
import { TegelzetterService } from './dbus.js';
import { ResizeMode } from './mode.js';

export default class TegelzetterExtension extends Extension {
  enable() {
    this._settings = this.getSettings('org.gnome.shell.extensions.tegelzetter');

    this._dbus = new TegelzetterService();
    this._dbus.enable();

    this._mode = new ResizeMode();

    // Register tile bindings
    const bindings = [
      ['tile-q', 'Q'], ['tile-w', 'W'], ['tile-e', 'E'], ['tile-r', 'R'],
      ['tile-a', 'A'], ['tile-s', 'S'], ['tile-d', 'D'], ['tile-f', 'F'],
      ['tile-h', 'H'], ['tile-j', 'J'], ['tile-k', 'K'], ['tile-l', 'L'],
    ];

    this._addedBindings = [];

    for (const [name, key] of bindings) {
      Main.wm.addKeybinding(
        name,
        this._settings,
        Meta.KeyBindingFlags.NONE,
        Shell.ActionMode.NORMAL,
        () => tileFocused(key)
      );
      this._addedBindings.push(name);
    }

    // Toggle resize mode
    Main.wm.addKeybinding(
      'toggle-mode',
      this._settings,
      Meta.KeyBindingFlags.NONE,
      Shell.ActionMode.NORMAL,
      () => this._mode.toggle()
    );
    this._addedBindings.push('toggle-mode');
  }

  disable() {
    // Remove keybindings
    if (this._addedBindings) {
      for (const name of this._addedBindings)
        Main.wm.removeKeybinding(name);
      this._addedBindings = [];
    }

    // Turn off mode capture
    if (this._mode) {
      this._mode.disable();
      this._mode = null;
    }

    // Stop D-Bus service
    if (this._dbus) {
      this._dbus.disable();
      this._dbus = null;
    }

    this._settings = null;
  }
}

