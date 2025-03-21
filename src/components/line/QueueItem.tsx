"use client"

import type React from "react"
import { User, Clock, Check, Clock3, Trash2, GripVertical } from "lucide-react"
import { type Queue, QueueStatus } from "../types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface QueueItemProps {
    id: string
    queue: Queue
    onStatusChange: (queueId: number, status: QueueStatus) => void
    onRemove: (queueId: number) => void
    isDraggable: boolean
}

const QueueItem: React.FC<QueueItemProps> = ({ id, queue, onStatusChange, onRemove, isDraggable }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
        disabled: !isDraggable,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
    }

    const formatPhoneNumber = (phone: string) => {
        return phone || "번호 없음"
    }

    const getAttendeeInfo = (name: string) => {
        try {
            return name || "이름 없음"
        } catch (e) {
            return "정보 없음"
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
    }

    const getWaitTime = (dateString: string) => {
        const created = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - created.getTime()
        const diffMins = Math.floor(diffMs / 60000)

        if (diffMins < 60) {
            return `${diffMins}분`
        } else {
            const hours = Math.floor(diffMins / 60)
            const mins = diffMins % 60
            return `${hours}시간 ${mins}분`
        }
    }

    const isWaiting = queue.status === QueueStatus.WAITING

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`p-4 border rounded-xl transition-all duration-200 ${isDragging ? "shadow-lg opacity-75" : ""} ${isWaiting
                ? "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20"
                : "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20"
                }`}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    {isDraggable && (
                        <div
                            {...attributes}
                            {...listeners}
                            className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 text-gray-500 dark:text-gray-400"
                        >
                            <GripVertical size={18} />
                        </div>
                    )}
                    <div
                        className={`flex-shrink-0 rounded-full p-2 ${isWaiting
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            }`}
                    >
                        <User size={18} />
                    </div>
                    <div>
                        <div className="font-medium text-gray-900 dark:text-white">{getAttendeeInfo(queue.attendee.name)}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{formatPhoneNumber(queue.attendee.phone)}</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Clock3 size={14} />
                        <span>{getWaitTime(queue.createdAt)} 대기</span>
                    </div>

                    <button
                        onClick={() => onStatusChange(queue.id, isWaiting ? QueueStatus.ENTERED : QueueStatus.WAITING)}
                        className={`text-sm px-3 py-1.5 rounded-lg flex items-center gap-1 ${isWaiting
                            ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/50"
                            }`}
                    >
                        {isWaiting ? <Check size={14} /> : <Clock size={14} />}
                        {isWaiting ? "입장" : "대기"}
                    </button>

                    <button
                        onClick={() => {
                            if (window.confirm("정말로 이 대기자를 삭제하시겠습니까?")) {
                                onRemove(queue.id)
                            }
                        }}
                        className="text-sm px-2 py-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex gap-4">
                <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatDate(queue.createdAt)} 등록
                </div>
                {queue.previous && <div>이전: #{queue.previous.id}</div>}
                {queue.next && <div>다음: #{queue.next.id}</div>}
            </div>
        </div>
    )
}

export default QueueItem

