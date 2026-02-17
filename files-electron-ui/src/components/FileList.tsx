import { useState, useEffect } from 'react'

interface FileItem {
    name: string
    isDirectory: boolean
    size: number
    path: string
}

interface FileListProps {
    files: FileItem[]
    onNavigate: (path: string) => void
    onDelete: (path: string) => void
}

export function FileList({ files, onNavigate, onDelete }: FileListProps) {
    const [icons, setIcons] = useState<Record<string, string>>({})

    useEffect(() => {
        // Load icons for files
        const loadIcons = async () => {
            const newIcons: Record<string, string> = { ...icons }
            let changed = false

            for (const file of files) {
                if (!file.isDirectory && !newIcons[file.path]) {
                    try {
                        const ipc = (window as any).ipcRenderer
                        if (ipc && typeof ipc.getIcon === 'function') {
                            const icon = await ipc.getIcon(file.path)
                            if (icon) {
                                newIcons[file.path] = icon
                                changed = true
                            }
                        }
                    } catch (e) {
                        // Ignore icon load errors
                    }
                }
            }

            if (changed) {
                setIcons(newIcons)
            }
        }

        loadIcons()
    }, [files])

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 p-2">
            {files.map(file => (
                <div
                    key={file.path}
                    onClick={() => file.isDirectory && onNavigate(file.path)}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        const ipc = (window as any).ipcRenderer;
                        if (ipc && typeof ipc.showContextMenu === 'function') {
                            ipc.showContextMenu(file.path);
                        }
                    }}
                    className={`relative flex flex-col items-center p-3 rounded-xl border border-transparent hover:bg-blue-50 hover:border-blue-100 transition-all cursor-pointer group`}
                >
                    {/* Delete Button (Visible on Hover) */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(file.path);
                        }}
                        className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-red-500 hover:text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 text-[10px]"
                    >
                        🗑️
                    </button>

                    <div className="w-12 h-12 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        {file.isDirectory ? (
                            <span className="text-4xl text-yellow-500">📂</span>
                        ) : icons[file.path] ? (
                            <img src={icons[file.path]} className="w-10 h-10 object-contain" alt="" />
                        ) : (
                            <span className="text-4xl text-gray-400">📄</span>
                        )}
                    </div>
                    <div className="text-xs font-medium text-center break-words w-full line-clamp-2 px-1 text-gray-700">
                        {file.name}
                    </div>
                </div>
            ))}
        </div>
    )
}
