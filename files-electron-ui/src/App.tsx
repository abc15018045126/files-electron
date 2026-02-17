import { useState, useEffect } from 'react'
import './App.css'
import { Sidebar } from './components/Sidebar'
import { FileList } from './components/FileList'
import { Breadcrumbs } from './components/Breadcrumbs'

interface FileItem {
  name: string
  isDirectory: boolean
  size: number
  path: string
}

function App() {
  const [currentPath, setCurrentPath] = useState('C:\\')
  const [files, setFiles] = useState<FileItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const loadFiles = async (path: string) => {
    try {
      const ipc = (window as any).ipcRenderer
      if (!ipc || typeof ipc.readdir !== 'function') {
        throw new Error('IPC bridge not initialized or readdir missing')
      }
      const entries = await ipc.readdir(path)
      setFiles(entries)
      setError(null)
    } catch (err: any) {
      console.error('File load error:', err)
      setError(err.message)
    }
  }

  useEffect(() => {
    loadFiles(currentPath)
  }, [currentPath])

  const navigateTo = (path: string) => {
    setCurrentPath(path)
  }

  const handleDelete = async (path: string) => {
    if (confirm('Move to Trash?')) {
      try {
        const ipc = (window as any).ipcRenderer
        if (!ipc || typeof ipc.moveToTrash !== 'function') {
          throw new Error('IPC bridge missing trash functionality')
        }
        await ipc.moveToTrash(path)
        loadFiles(currentPath)
      } catch (err: any) {
        alert(err.message)
      }
    }
  }

  const goBack = () => {
    const parts = currentPath.split(/[\\/]/).filter(p => p)
    if (parts.length > 1) {
      parts.pop()
      setCurrentPath(parts.join('\\') + '\\')
    } else if (parts.length === 1) {
      setCurrentPath('C:\\')
    }
  }

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-screen bg-white/80 backdrop-blur-xl text-gray-900 overflow-hidden rounded-xl border border-white/20 shadow-2xl">
      {/* Search and Navigation Bar - Draggable Area */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200/50 pt-10" style={{ WebkitAppRegion: 'drag' } as any}>
        <div style={{ WebkitAppRegion: 'no-drag' } as any}>
          <Breadcrumbs
            currentPath={currentPath}
            onNavigate={navigateTo}
            onBack={goBack}
          />
        </div>

        <div className="relative w-64" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-1.5 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* File Container */}
        <div className="flex-1 overflow-y-auto bg-white">
          {error && (
            <div className="m-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <FileList
            files={filteredFiles}
            onNavigate={navigateTo}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-8 border-t border-gray-200 bg-gray-50 flex items-center px-4 text-[10px] text-gray-500 font-medium">
        {filteredFiles.length} items
      </div>
    </div>
  )
}

export default App
