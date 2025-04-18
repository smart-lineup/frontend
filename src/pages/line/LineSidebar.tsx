"use client"

import type React from "react"
import { useState } from "react"
import { Users, Plus } from "lucide-react"
import type { Line } from "../../components/types"

interface LineSidebarProps {
    lines: Line[]
    selectedLine: Line | null
    loading: boolean
    onSelectLine: (line: Line) => void
    onDeleteLine: (id: number) => void
    onAddLine: (name: string) => void
    onEditLine: (id: number, name: string) => void
    onAddLineClick: () => void
    isPremium: boolean
}

const LineSidebar: React.FC<LineSidebarProps> = ({
    lines,
    selectedLine,
    loading,
    onSelectLine,
    onDeleteLine,
    onAddLine,
    onEditLine,
    onAddLineClick,
    isPremium
}) => {
    const [showAddLine, setShowAddLine] = useState(false)
    const [newLineName, setNewLineName] = useState("")
    const [editingLine, setEditingLine] = useState<{ id: number; name: string } | null>(null)

    const handleAddLine = () => {
        if (!newLineName.trim()) return
        onAddLine(newLineName)
        setNewLineName("")
        setShowAddLine(false)
    }

    const handleEditLine = () => {
        if (!editingLine || !editingLine.name.trim()) return
        onEditLine(editingLine.id, editingLine.name)
        setEditingLine(null)
    }

    const handleAddLineButtonClick = () => {
        // FREE 사용자이고 이미 2개 이상의 라인이 있는 경우 제한 모달 표시
        if (!isPremium && lines.length >= 2) {
            onAddLineClick() // 제한 모달 표시 함수 호출
            return
        }

        // 그렇지 않으면 라인 추가 폼 표시
        setShowAddLine(true)
    }

    return (
        <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Users size={18} />
                        라인 목록
                    </h2>
                    <button
                        onClick={handleAddLineButtonClick} // 수정된 부분
                        className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {showAddLine && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <input
                            type="text"
                            value={newLineName}
                            onChange={(e) => setNewLineName(e.target.value)}
                            placeholder="라인 이름"
                            className="w-full p-2 mb-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleAddLine}
                                className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex-1"
                            >
                                추가
                            </button>
                            <button
                                onClick={() => setShowAddLine(false)}
                                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                )}

                {loading && lines.length === 0 ? (
                    <div className="py-8 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : lines.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>라인이 없습니다.</p>
                        <p className="text-sm mt-1">새 라인을 추가해보세요.</p>
                    </div>
                ) : (
                    <ul className="space-y-1">
                        {lines.map((line) => (
                            <li key={line.id}>
                                {editingLine && editingLine.id === line.id ? (
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                        <input
                                            type="text"
                                            value={editingLine.name}
                                            onChange={(e) => setEditingLine({ ...editingLine, name: e.target.value })}
                                            className="w-full p-2 mb-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            autoFocus
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleEditLine}
                                                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm flex-1"
                                            >
                                                저장
                                            </button>
                                            <button
                                                onClick={() => setEditingLine(null)}
                                                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                                            >
                                                취소
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${selectedLine?.id === line.id
                                                ? "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200"
                                                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                                            }`}
                                        onClick={() => onSelectLine(line)}
                                    >
                                        <span className="font-medium truncate max-w-[60%]">{line.name}</span>
                                        <div className="flex gap-1 flex-shrink-0">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setEditingLine({ id: line.id, name: line.name })
                                                }}
                                                className="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (window.confirm(`"${line.name}" 라인을 삭제하시겠습니까?`)) {
                                                        onDeleteLine(line.id)
                                                    }
                                                }}
                                                className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default LineSidebar
