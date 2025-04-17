"use client"

import type React from "react"
import { ArrowLeft, QrCode, Share2, Download, Upload, UserPlus, GripVertical, Settings } from "lucide-react"
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
    onAddAttendee: () => void
    onOpenSettings: () => void
    fileInputRef: React.RefObject<HTMLInputElement | null>
    handleExcelUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    isPremium: boolean
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
    onAddAttendee,
    onOpenSettings,
    fileInputRef,
    handleExcelUpload,
    isPremium,
}) => {
    return (
        <div className="mb-6">
            <div className="mb-4 flex items-center">
                <button
                    onClick={onBack}
                    className="mr-3 rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{selectedLine.name}</h1>
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    onClick={onAddAttendee}
                    className="flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                    <UserPlus size={16} className="mr-1" />
                    대기자 추가
                </button>

                <button
                    onClick={onToggleQRCode}
                    className="flex items-center rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                    <QrCode size={16} className="mr-1" />
                    QR 코드
                </button>

                <button
                    onClick={onShare}
                    className="flex items-center rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                    <Share2 size={16} className="mr-1" />
                    공유
                </button>

                <button
                    onClick={onToggleDraggable}
                    className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium ${isDraggable
                            ? "bg-yellow-200 text-yellow-800 hover:bg-yellow-300 dark:bg-yellow-700 dark:text-yellow-200 dark:hover:bg-yellow-600"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        }`}
                >
                    <GripVertical size={16} className="mr-1" />
                    {isDraggable ? "순서 변경 중" : "순서 변경"}
                </button>

                <button
                    onClick={onExcelDownload}
                    className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium ${!isPremium
                            ? "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        }`}
                >
                    <Download size={16} className="mr-1" />
                    엑셀 다운로드
                </button>

                <button
                    onClick={onExcelUpload}
                    className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium ${!isPremium
                            ? "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        }`}
                >
                    <Upload size={16} className="mr-1" />
                    엑셀 업로드
                </button>

                <button
                    onClick={onOpenSettings}
                    className="flex items-center rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                    <Settings size={16} className="mr-1" />
                    설정
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleExcelUpload}
                    accept=".xlsx, .xls"
                    className="hidden"
                    aria-hidden="true"
                />
            </div>
        </div>
    )
}

export default LineHeader
