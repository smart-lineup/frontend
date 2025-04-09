"use client"

import type React from "react"
import { ArrowLeft, MoveVertical, Share2, QrCode, FileDown, FileUp } from "lucide-react"
import type { Line } from "../../components/types"

interface LineHeaderProps {
    selectedLine: Line
    isDraggable: boolean
    onBack: () => void
    onToggleDraggable: () => void
    onShare: () => void
    onToggleQRCode: () => void
    onExcelDownload: () => void
    onExcelUpload: () => void
}

const LineHeader: React.FC<LineHeaderProps> = ({
    selectedLine,
    isDraggable,
    onBack,
    onToggleDraggable,
    onShare,
    onToggleQRCode,
    onExcelDownload,
    onExcelUpload,
}) => {
    return (
        <div className="flex flex-col mb-6 gap-3 md:gap-4">
            <div className="flex items-center w-full">
                <button
                    onClick={onBack}
                    className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex-shrink-0"
                >
                    <ArrowLeft size={18} />
                </button>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate max-w-[calc(100%-60px)]">
                    {selectedLine.name}
                </h1>
            </div>

            <div className="flex flex-wrap gap-2 w-full justify-start md:justify-end">
                <button
                    onClick={onToggleDraggable}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${isDraggable
                            ? "bg-purple-500 hover:bg-purple-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                        }`}
                >
                    <MoveVertical size={16} />
                    <span className="whitespace-nowrap text-xs">{isDraggable ? "변경 완료" : "순서 변경"}</span>
                </button>
                <button
                    onClick={onShare}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                    <Share2 size={16} />
                    <span className="whitespace-nowrap text-xs">공유</span>
                </button>
                <button
                    onClick={onToggleQRCode}
                    className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                    <QrCode size={16} />
                    <span className="whitespace-nowrap text-xs">QR</span>
                </button>
                <button
                    onClick={onExcelDownload}
                    className="flex items-center gap-1 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                >
                    <FileDown size={16} />
                    <span className="whitespace-nowrap text-xs">엑셀 다운로드</span>
                </button>
                <button
                    onClick={onExcelUpload}
                    className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                    <FileUp size={16} />
                    <span className="whitespace-nowrap text-xs">엑셀 업로드</span>
                </button>
            </div>
        </div>
    )
}

export default LineHeader
