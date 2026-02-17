/// <reference types="vite/client" />

interface Window {
    ipcRenderer: {
        on: (channel: string, listener: (event: any, ...args: any[]) => void) => void
        off: (channel: string, listener: (event: any, ...args: any[]) => void) => void
        send: (channel: string, ...args: any[]) => void
        invoke: (channel: string, ...args: any[]) => Promise<any>
        readdir: (path: string) => Promise<{ name: string, isDirectory: boolean, size: number, path: string }[]>
        stat: (path: string) => Promise<any>
        getIcon: (path: string) => Promise<string | null>
        moveToTrash: (path: string) => Promise<boolean>
        showContextMenu: (path: string) => Promise<void>
    }
}
