import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
    on(...args: Parameters<typeof ipcRenderer.on>) {
        const [channel, listener] = args
        return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
    },
    off(...args: Parameters<typeof ipcRenderer.off>) {
        const [channel, ...omit] = args
        return ipcRenderer.off(channel, ...omit)
    },
    send(...args: Parameters<typeof ipcRenderer.send>) {
        const [channel, ...omit] = args
        return ipcRenderer.send(channel, ...omit)
    },
    invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
        const [channel, ...omit] = args
        return ipcRenderer.invoke(channel, ...omit)
    },

    readdir: (directoryPath: string) => ipcRenderer.invoke('fs:readdir', directoryPath),
    stat: (filePath: string) => ipcRenderer.invoke('fs:stat', filePath),
    getIcon: (filePath: string) => ipcRenderer.invoke('fs:icon', filePath),
    moveToTrash: (filePath: string) => ipcRenderer.invoke('fs:trash', filePath),
    showContextMenu: (filePath: string) => ipcRenderer.invoke('show-context-menu', filePath),

    // You can expose other apts you need here.
    // ...
})
