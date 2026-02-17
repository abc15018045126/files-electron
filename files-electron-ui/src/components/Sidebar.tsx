interface SidebarProps {
    // Add props if needed
}

export function Sidebar({ }: SidebarProps) {
    return (
        <div className="w-64 border-r border-gray-200 bg-gray-50/50 p-4 space-y-4 h-full">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Favorites</div>
            <div className="space-y-1">
                <button className="flex items-center gap-3 w-full p-2 bg-blue-50 text-blue-700 rounded-md text-sm font-medium">
                    <span>🏠</span> Home
                </button>
                <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-md text-sm text-gray-700">
                    <span>⬇️</span> Downloads
                </button>
                <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-md text-sm text-gray-700">
                    <span>📷</span> Pictures
                </button>
            </div>
        </div>
    )
}
