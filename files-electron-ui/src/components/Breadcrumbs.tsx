interface BreadcrumbsProps {
    currentPath: string
    onNavigate: (path: string) => void
    onBack: () => void
}

export function Breadcrumbs({ currentPath, onBack }: BreadcrumbsProps) {
    return (
        <div className="flex items-center gap-4" style={{ WebkitAppRegion: 'no-drag' } as any}>
            <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
                <span className="text-xl">←</span>
            </button>

            <div className="flex items-center bg-gray-50/50 px-3 py-1.5 rounded-lg border border-gray-200/50">
                <span className="text-gray-400 mr-2">📍</span>
                <span className="text-xs font-semibold overflow-hidden text-ellipsis whitespace-nowrap text-gray-600 max-w-md">
                    {currentPath}
                </span>
            </div>
        </div>
    )
}
