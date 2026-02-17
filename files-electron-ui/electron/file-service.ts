import fs from 'node:fs/promises'
import path from 'node:path'
import { ipcMain, app, shell } from 'electron'

export function setupFileService() {
    ipcMain.handle('fs:readdir', async (_event, directoryPath: string) => {
        try {
            const files = await fs.readdir(directoryPath, { withFileTypes: true })
            return files.map(file => ({
                name: file.name,
                isDirectory: file.isDirectory(),
                size: 0,
                path: path.join(directoryPath, file.name)
            }))
        } catch (error: any) {
            throw new Error(`Failed to read directory: ${error.message}`)
        }
    })

    ipcMain.handle('fs:stat', async (_event, filePath: string) => {
        try {
            const stats = await fs.stat(filePath)
            return {
                size: stats.size,
                atime: stats.atime,
                mtime: stats.mtime,
                ctime: stats.ctime,
                birthtime: stats.birthtime,
                isDirectory: stats.isDirectory()
            }
        } catch (error: any) {
            throw new Error(`Failed to stat file: ${error.message}`)
        }
    })

    ipcMain.handle('fs:icon', async (_event, filePath: string) => {
        try {
            const icon = await app.getFileIcon(filePath, { size: 'normal' })
            return icon.toDataURL()
        } catch (error: any) {
            return null
        }
    })

    ipcMain.handle('fs:trash', async (_event, filePath: string) => {
        try {
            await shell.trashItem(filePath)
            return true
        } catch (error: any) {
            throw new Error(`Failed to move to trash: ${error.message}`)
        }
    })
}
