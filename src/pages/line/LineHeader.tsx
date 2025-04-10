"use client"

import type React from "react"
import { ArrowLeft, MoveVertical, Share2, QrCode, FileDown, FileUp, Plus } from "lucide-react"
import type { Line } from "../../components/types"
import * as Tooltip from "@radix-ui/react-Tooltip"

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
    fileInputRef: React.RefObject<HTMLInputElement | null>
    handleExcelUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    role: string
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
    fileInputRef,
    handleExcelUpload,
    role,
}) => {
    const isPremium = role === "PREMIUM"

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
                    <span className="whitespace-nowrap text-xs">{isDraggable ? "순서 저장" : "순서 변경"}</span>
                </button>
                <button
                    onClick={onAddAttendee}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                    <Plus size={16} />
                    <span className="whitespace-nowrap text-xs">대기자 추가</span>
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

                {/* 엑셀 다운로드 버튼에 툴팁 추가 */}
                <Tooltip.Provider delayDuration={300}>
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                            <button
                                onClick={onExcelDownload}
                                className={`flex items-center gap-1 px-3 py-2 ${isPremium ? "bg-indigo-500 hover:bg-indigo-600" : "bg-indigo-300 cursor-not-allowed"
                                    } text-white rounded-lg transition-colors`}
                            >
                                <FileDown size={16} />
                                <span className="whitespace-nowrap text-xs">엑셀 다운로드</span>
                            </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content
                                className="z-50 max-w-xs p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg"
                                sideOffset={5}
                                side="top"
                                align="center"
                                alignOffset={0}
                                avoidCollisions
                            >
                                {isPremium ? (
                                    <div className="font-semibold">현재 대기열의 모든 정보를 엑셀 파일로 다운로드합니다.</div>
                                ) : (
                                    <div className="font-semibold">프리미엄 기능입니다. 업그레이드하여 사용하세요.</div>
                                )}
                                <Tooltip.Arrow className="fill-gray-800" width={10} height={5} />
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>
                </Tooltip.Provider>

                {/* 엑셀 업로드 버튼 */}
                <Tooltip.Provider delayDuration={300}>
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                            <button
                                onClick={onExcelUpload}
                                className={`flex items-center gap-1 px-3 py-2 ${isPremium ? "bg-green-500 hover:bg-green-600" : "bg-green-300 cursor-not-allowed"
                                    } text-white rounded-lg transition-colors`}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleExcelUpload}
                                    accept=".xlsx,.xls"
                                    className="hidden"
                                />
                                <FileUp size={16} />
                                <span className="whitespace-nowrap text-xs">엑셀 업로드</span>
                            </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content
                                className="z-50 max-w-xs p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg"
                                sideOffset={5}
                                side="top"
                                align="center"
                                alignOffset={0}
                                avoidCollisions
                            >
                                {isPremium ? (
                                    <>
                                        <div className="font-semibold mb-1">엑셀 파일 형식 안내:</div>
                                        <ul className="list-disc pl-4 space-y-1">
                                            <li>첫 번째 행은 열 제목이어야 합니다.</li>
                                            <li>첫번째 열:&nbsp;'이름', &nbsp;두번째 열:&nbsp;'전화번호'</li>
                                            <li>그 외 열은 추가 정보로 자동 저장됩니다.</li>
                                        </ul>
                                    </>
                                ) : (
                                    <div className="font-semibold">프리미엄 기능입니다. 업그레이드하여 사용하세요.</div>
                                )}
                                <Tooltip.Arrow className="fill-gray-800" width={10} height={5} />
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>
                </Tooltip.Provider>
            </div>
        </div>
    )
}

export default LineHeader
