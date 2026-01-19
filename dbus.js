// dbus.js

import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

import { tileFocused, nudgeFocused, resizeFocused } from './tiling.js';

const IFACE_XML = `
<node>
  <interface name="org.palmersec.Tegelzetter1">
    <method name="TileFocused">
      <arg type="s" name="key" direction="in"/>
      <arg type="b" name="ok" direction="out"/>
    </method>

    <method name="NudgeFocused">
      <arg type="i" name="dx" direction="in"/>
      <arg type="i" name="dy" direction="in"/>
      <arg type="b" name="ok" direction="out"/>
    </method>

    <method name="ResizeFocused">
      <arg type="i" name="dw" direction="in"/>
      <arg type="i" name="dh" direction="in"/>
      <arg type="b" name="ok" direction="out"/>
    </method>
  </interface>
</node>
`;

export class TegelzetterService {
  constructor() {
    this._impl = Gio.DBusExportedObject.wrapJSObject(IFACE_XML, this);
    this._nameId = 0;
  }

  enable() {
    const conn = Gio.DBus.session;

    // Own a well-named bus name for your service
    this._nameId = Gio.bus_own_name_on_connection(
      conn,
      'org.palmersec.Tegelzetter1',
      Gio.BusNameOwnerFlags.NONE,
      null,
      null
    );

    // Export object at a fixed path
    this._impl.export(conn, '/org/palmersec/Tegelzetter1');
  }

  disable() {
    try { this._impl.unexport(); } catch (_) {}
    if (this._nameId) {
      Gio.bus_unown_name(this._nameId);
      this._nameId = 0;
    }
  }

  // --- D-Bus methods (restricted surface area) ---

  TileFocused(key) {
    // Validate: only allow your 12 keys
    const k = String(key).toUpperCase();
    if (!'QWERASDFHJKL'.includes(k) || k.length !== 1)
      return [false];

    return [tileFocused(k)];
  }

  NudgeFocused(dx, dy) {
    // Clamp to avoid absurd inputs
    dx = Math.max(-2000, Math.min(2000, dx | 0));
    dy = Math.max(-2000, Math.min(2000, dy | 0));
    return [nudgeFocused(dx, dy)];
  }

  ResizeFocused(dw, dh) {
    dw = Math.max(-2000, Math.min(2000, dw | 0));
    dh = Math.max(-2000, Math.min(2000, dh | 0));
    return [resizeFocused(dw, dh)];
  }
}

