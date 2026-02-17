import { contextBridge as s, ipcRenderer as e } from "electron";
s.exposeInMainWorld("ipcRenderer", {
  on(...n) {
    const [o, t] = n;
    return e.on(o, (r, ...i) => t(r, ...i));
  },
  off(...n) {
    const [o, ...t] = n;
    return e.off(o, ...t);
  },
  send(...n) {
    const [o, ...t] = n;
    return e.send(o, ...t);
  },
  invoke(...n) {
    const [o, ...t] = n;
    return e.invoke(o, ...t);
  },
  readdir: (n) => e.invoke("fs:readdir", n),
  stat: (n) => e.invoke("fs:stat", n),
  getIcon: (n) => e.invoke("fs:icon", n),
  moveToTrash: (n) => e.invoke("fs:trash", n),
  showContextMenu: (n) => e.invoke("show-context-menu", n)
  // You can expose other apts you need here.
  // ...
});
