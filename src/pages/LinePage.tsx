import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { QRCodeSVG } from "qrcode.react"
import { Users, Plus, Share2, QrCode, Clipboard, ArrowLeft, MoveVertical } from "lucide-react"
import { useDarkMode } from "../components/DarkModeContext"
import type { Line, Queue, QueueStatus } from "../components/types"
import config from "../config"

// Components
import Navbar from "../components/Navbar"
import QueueItem from "../components/line/QueueItem"
import EmptyState from "../components/line/EmptyState"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"


const LinePage: React.FC = () => {
    const { darkMode } = useDarkMode()
    const [lines, setLines] = useState<Line[]>([])
    const [selectedLine, setSelectedLine] = useState<Line | null>(null)
    const [queues, setQueues] = useState<Queue[]>([])
    const [showAddAttendee, setShowAddAttendee] = useState(false)
    const [showQRCode, setShowQRCode] = useState(false)
    const [shareUrl, setShareUrl] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [newLineName, setNewLineName] = useState("")
    const [showAddLine, setShowAddLine] = useState(false)
    const [editingLine, setEditingLine] = useState<{ id: number; name: string } | null>(null)
    const [isDraggable, setIsDraggable] = useState(false)

    // Form states
    const [phone, setPhone] = useState("")
    const [name, setName] = useState("손님")

    // Set up sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    // Fetch all lines on page load
    useEffect(() => {
        fetchAllLines()
    }, [])

    const fetchAllLines = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await axios.get(config.backend + "/line/list", {
                withCredentials: true,
            })
            setLines(response.data)
        } catch (e) {
            console.error("Error loading lines:", e)
            setError("라인 목록을 불러오는데 실패했습니다.")
        } finally {
            setLoading(false)
        }
    }

    // Fetch queues for a selected line
    const fetchLineQueues = async (lineId: number) => {
        setLoading(true)

        try {
            const response = await axios.get(`${config.backend}/queue/list?line_id=${lineId}`, {
                withCredentials: true,
            })
            setQueues(response.data)
        } catch (e) {
            console.error(`Error loading queues for line ${lineId}:`, e)
            setError("대기열을 불러오는데 실패했습니다.")
        } finally {
            setLoading(false)
        }
    }

    const handleAddLine = async () => {
        if (!newLineName.trim()) return

        try {
            await axios.post(
                config.backend + "/line/add",
                {
                    name: newLineName,
                },
                {
                    withCredentials: true,
                },
            )

            setNewLineName("")
            setShowAddLine(false)
            fetchAllLines()
        } catch (e) {
            console.error("Error adding line:", e)
            setError("라인 추가에 실패했습니다.")
        }
    }

    const handleDeleteLine = async (id: number) => {
        try {
            await axios.delete(`${config.backend}/line/${id}`, {
                withCredentials: true,
            })

            if (selectedLine?.id === id) {
                setSelectedLine(null)
                setQueues([])
            }

            fetchAllLines()
        } catch (e) {
            console.error(`Error deleting line ${id}:`, e)
            setError("라인 삭제에 실패했습니다.")
        }
    }

    const handleEditLine = async () => {
        if (!editingLine || !editingLine.name.trim()) return

        try {
            await axios.put(
                `${config.backend}/line/name`,
                {
                    id: editingLine.id,
                    name: editingLine.name,
                },
                {
                    withCredentials: true,
                },
            )

            setEditingLine(null)
            fetchAllLines()

            // Update selected line name if it's the one being edited
            if (selectedLine && selectedLine.id === editingLine.id) {
                setSelectedLine({ ...selectedLine, name: editingLine.name })
            }
        } catch (e) {
            console.error(`Error editing line ${editingLine.id}:`, e)
            setError("라인 수정에 실패했습니다.")
        }
    }

    const handleSelectLine = (line: Line) => {
        setSelectedLine(line)
        fetchLineQueues(line.id)
        setShowAddAttendee(false)
        setShowQRCode(false)
        setIsDraggable(false)

        // Create share URL
        const shareUrl = `${window.location.origin}/attendee/${line.uuid}`
        setShareUrl(shareUrl)
    }

    const handleAddAttendee = async () => {
        if (!phone.trim() || !selectedLine) return

        try {
            await axios.post(
                `${config.backend}/line/${selectedLine.id}/queue/add`,
                {
                    phone: phone,
                    name: name,
                },
                {
                    withCredentials: true,
                },
            )

            fetchLineQueues(selectedLine.id)
            setShowAddAttendee(false)
            setPhone("")
            setName("손님")
        } catch (e) {
            console.error("Error adding attendee:", e)
            setError("대기자 추가에 실패했습니다.")
        }
    }

    const handleStatusChange = async (queueId: number, newStatus: QueueStatus) => {
        if (!selectedLine) return

        try {
            await axios.put(
                `${config.backend}/queue/${queueId}/status`,
                {
                    status: newStatus,
                },
                {
                    withCredentials: true,
                },
            )

            fetchLineQueues(selectedLine.id)
        } catch (e) {
            console.error(`Error updating queue ${queueId} status:`, e)
            setError("상태 변경에 실패했습니다.")
        }
    }

    const removeQueue = async (queueId: number) => {
        if (!selectedLine) return

        try {
            await axios.delete(`${config.backend}/queue/${queueId}`, {
                withCredentials: true,
            })

            fetchLineQueues(selectedLine.id)
        } catch (e) {
            console.error(`Error removing queue ${queueId}:`, e)
            setError("대기자 삭제에 실패했습니다.")
        }
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: `${selectedLine?.name} 줄서기`,
                    url: shareUrl,
                })
                .catch((error) => console.error("Error sharing:", error))
        } else {
            // Copy URL to clipboard if Web Share API is not supported
            navigator.clipboard
                .writeText(shareUrl)
                .then(() => alert("URL이 클립보드에 복사되었습니다."))
                .catch((e) => console.error("클립보드 복사 실패:", e))
        }
    }

    const toggleQRCode = () => {
        setShowQRCode(!showQRCode)
    }

    const toggleDraggable = () => {
        setIsDraggable(!isDraggable)
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (!over || active.id === over.id) {
            return
        }

        // Find the indices of the dragged item and the drop target
        const activeIndex = queues.findIndex((q) => `queue-${q.id}` === active.id)
        const overIndex = queues.findIndex((q) => `queue-${q.id}` === over.id)

        if (activeIndex !== -1 && overIndex !== -1) {
            // Update the UI immediately for better UX
            const newQueues = arrayMove(queues, activeIndex, overIndex)
            setQueues(newQueues)

            // Update the backend
            if (selectedLine) {
                try {
                    // Assuming your API has an endpoint to update queue order
                    await axios.put(
                        `${config.backend}/queue/reorder`,
                        {
                            line_id: selectedLine.id,
                            queue_ids: newQueues.map((q) => q.id),
                        },
                        {
                            withCredentials: true,
                        },
                    )
                } catch (e) {
                    console.error("Error updating queue order:", e)
                    setError("대기열 순서 변경에 실패했습니다.")
                    // Revert to original order if the API call fails
                    fetchLineQueues(selectedLine.id)
                }
            }
        }
    }

    return (
        <div className={darkMode ? "dark" : ""}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                <Navbar />

                <div className="container mx-auto px-4 py-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg">
                            {error}
                            <button onClick={() => setError(null)} className="ml-2 text-red-600 dark:text-red-300 hover:underline">
                                닫기
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Sidebar */}
                        <div className="w-full md:w-64 flex-shrink-0">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Users size={18} />
                                        라인 목록
                                    </h2>
                                    <button
                                        onClick={() => setShowAddLine(true)}
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
                                                        onClick={() => handleSelectLine(line)}
                                                    >
                                                        <span className="font-medium truncate">{line.name}</span>
                                                        <div className="flex gap-1">
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
                                                                        handleDeleteLine(line.id)
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

                        {/* Main Content */}
                        <div className="flex-1">
                            {selectedLine ? (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => {
                                                    setSelectedLine(null)
                                                    setQueues([])
                                                }}
                                                className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                            >
                                                <ArrowLeft size={18} />
                                            </button>
                                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{selectedLine.name}</h1>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={toggleDraggable}
                                                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${isDraggable
                                                        ? "bg-purple-500 hover:bg-purple-600 text-white"
                                                        : "bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                                                    }`}
                                            >
                                                <MoveVertical size={16} />
                                                <span className="hidden sm:inline">{isDraggable ? "순서 저장" : "순서 변경"}</span>
                                            </button>
                                            <button
                                                onClick={handleShare}
                                                className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                            >
                                                <Share2 size={16} />
                                                <span className="hidden sm:inline">공유</span>
                                            </button>
                                            <button
                                                onClick={toggleQRCode}
                                                className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                            >
                                                <QrCode size={16} />
                                                <span className="hidden sm:inline">QR</span>
                                            </button>
                                        </div>
                                    </div>

                                    {showQRCode && (
                                        <div className="mb-6 p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md flex flex-col items-center animate-fadeIn">
                                            <QRCodeSVG value={shareUrl} size={200} />
                                            <div className="mt-4 flex items-center gap-2 w-full max-w-md">
                                                <input
                                                    type="text"
                                                    value={shareUrl}
                                                    readOnly
                                                    className="flex-1 p-2 border rounded-md text-sm bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 dark:border-gray-600"
                                                />
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(shareUrl)
                                                        alert("URL이 클립보드에 복사되었습니다.")
                                                    }}
                                                    className="p-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
                                                >
                                                    <Clipboard size={16} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => setShowQRCode(false)}
                                                className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 text-sm"
                                            >
                                                닫기
                                            </button>
                                        </div>
                                    )}

                                    {/* Add Attendee Form */}
                                    {showAddAttendee ? (
                                        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">대기열에 추가하기</h2>
                                            <div className="space-y-4">
                                                <div>
                                                    <label
                                                        htmlFor="name"
                                                        className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                                                    >
                                                        이름
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600"
                                                        placeholder="손님 이름"
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="phone"
                                                        className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                                                    >
                                                        전화번호
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="phone"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600"
                                                        placeholder="010-1234-5678"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setShowAddAttendee(false)}
                                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                                                    >
                                                        취소
                                                    </button>
                                                    <button
                                                        onClick={handleAddAttendee}
                                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                                        disabled={!phone.trim()}
                                                    >
                                                        추가
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-6">
                                            <button
                                                onClick={() => setShowAddAttendee(true)}
                                                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Plus size={18} />
                                                대기자 추가
                                            </button>
                                        </div>
                                    )}

                                    {/* Queue List */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">대기열 현황</h2>
                                            <span className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full">
                                                총 {queues.length}명
                                            </span>
                                        </div>

                                        {loading ? (
                                            <div className="py-12 flex justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                            </div>
                                        ) : queues.length === 0 ? (
                                            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                                                <p className="text-lg mb-2">현재 대기열이 비어 있습니다.</p>
                                                <p>위의 '대기자 추가' 버튼을 눌러 대기자를 추가해보세요.</p>
                                            </div>
                                        ) : (
                                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                                <SortableContext
                                                    items={queues.map((q) => `queue-${q.id}`)}
                                                    strategy={verticalListSortingStrategy}
                                                >
                                                    <div className="space-y-3">
                                                        {queues.map((queue) => (
                                                            <QueueItem
                                                                key={queue.id}
                                                                id={`queue-${queue.id}`}
                                                                queue={queue}
                                                                onStatusChange={handleStatusChange}
                                                                onRemove={removeQueue}
                                                                isDraggable={isDraggable}
                                                            />
                                                        ))}
                                                    </div>
                                                </SortableContext>
                                            </DndContext>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <EmptyState />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LinePage

