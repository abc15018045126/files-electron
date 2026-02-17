import { ipcMain as i, app as a, shell as l, BrowserWindow as m, Menu as f } from "electron";
import o from "node:path";
import { fileURLToPath as u } from "node:url";
import d from "node:fs/promises";
function _() {
  i.handle("fs:readdir", async (n, t) => {
    try {
      return (await d.readdir(t, { withFileTypes: !0 })).map((s) => ({
        name: s.name,
        isDirectory: s.isDirectory(),
        size: 0,
        path: o.join(t, s.name)
      }));
    } catch (e) {
      throw new Error(`Failed to read directory: ${e.message}`);
    }
  }), i.handle("fs:stat", async (n, t) => {
    try {
      const e = await d.stat(t);
      return {
        size: e.size,
        atime: e.atime,
        mtime: e.mtime,
        ctime: e.ctime,
        birthtime: e.birthtime,
        isDirectory: e.isDirectory()
      };
    } catch (e) {
      throw new Error(`Failed to stat file: ${e.message}`);
    }
  }), i.handle("fs:icon", async (n, t) => {
    try {
      return (await a.getFileIcon(t, { size: "normal" })).toDataURL();
    } catch {
      return null;
    }
  }), i.handle("fs:trash", async (n, t) => {
    try {
      return await l.trashItem(t), !0;
    } catch (e) {
      throw new Error(`Failed to move to trash: ${e.message}`);
    }
  });
}
const p = o.dirname(u(import.meta.url));
process.env.APP_ROOT = o.join(p, "..");
const c = process.env.VITE_DEV_SERVER_URL, b = o.join(process.env.APP_ROOT, "dist-electron"), h = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = c ? o.join(process.env.APP_ROOT, "public") : h;
let r = null;
function w() {
  r = new m({
    icon: o.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    transparent: !0,
    backgroundColor: "#00000000",
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#ffffff00",
      symbolColor: "#333333",
      height: 35
    },
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      sandbox: !1,
      preload: o.join(p, "preload.js")
    }
  }), r.webContents.on("did-finish-load", () => {
    r?.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), c ? r.loadURL(c) : r.loadFile(o.join(h, "index.html"));
}
a.on("window-all-closed", () => {
  process.platform !== "darwin" && (a.quit(), r = null);
});
a.on("activate", () => {
  m.getAllWindows().length === 0 && w();
});
a.whenReady().then(() => {
  _(), i.handle("show-context-menu", (n, t) => {
    const e = [
      { label: "Open", click: () => l.openPath(t) },
      { type: "separator" },
      { label: "Copy Path", click: () => {
      } },
      { label: "Move to Trash", click: () => l.trashItem(t) }
    ];
    f.buildFromTemplate(e).popup({
      window: m.fromWebContents(n.sender) || void 0
    });
  }), w();
});
export {
  b as MAIN_DIST,
  h as RENDERER_DIST,
  c as VITE_DEV_SERVER_URL
};
