"use client"

// QueueItem 컴포넌트를 원래 기능이 작동하도록 수정합니다.

import type React from "react"
import { User, Clock, Check, Clock3, Trash2, GripVertical, ChevronDown, ChevronUp, Edit } from "lucide-react"
import { type Queue, QueueStatus } from "../../components/types"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useState } from "react"

interface QueueItemProps {
  id: string
  queue: Queue
  onStatusChange: (queueId: number, status: QueueStatus) => void
  onRemove: (queueId: number) => void
  onEdit: () => void
  isDraggable: boolean
  sequenceNumber?: number
  showSequenceNumber?: boolean
}

const QueueItem: React.FC<QueueItemProps> = ({
  id,
  queue,
  onStatusChange,
  onRemove,
  onEdit,
  isDraggable,
  sequenceNumber,
  showSequenceNumber = false,
}) => {
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

  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  const parseAttendeeInfo = (infoJson: string): Record<string, any> => {
    try {
      const info = JSON.parse(infoJson)
      return typeof info === "object" && info !== null ? info : { note: infoJson }
    } catch (e) {
      return { note: infoJson }
    }
  }

  const formatInfoKey = (key: string): string => {
    // Convert camelCase or snake_case to readable format
    return key
      .replace(/([A-Z])/g, " $1") // Convert camelCase to spaces
      .replace(/_/g, " ") // Convert snake_case to spaces
      .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize first letter
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 border rounded-xl transition-all duration-200 ${isDragging ? "shadow-lg opacity-75" : ""} ${isWaiting
          ? "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20"
          : "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20"
        }`}
    >
      {/* Main content area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left side - User info */}
        <div className="flex items-center gap-3 min-w-0">
          {isDraggable && (
            <div
              {...attributes}
              {...listeners}
              className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 text-gray-500 dark:text-gray-400"
            >
              <GripVertical size={18} />
            </div>
          )}

          {showSequenceNumber && sequenceNumber !== undefined && isWaiting && (
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex items-center justify-center text-xs font-medium">
              {sequenceNumber}
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
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="font-medium text-gray-900 dark:text-white truncate">
              {getAttendeeInfo(queue.attendee.name)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {formatPhoneNumber(queue.attendee.phone)}
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0 justify-end flex-shrink-0">
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
            <Clock3 size={14} className="flex-shrink-0" />
            <span>{getWaitTime(queue.createdAt)} 대기</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onStatusChange(queue.id, isWaiting ? QueueStatus.ENTERED : QueueStatus.WAITING)}
              className={`text-sm px-3 py-1.5 rounded-lg flex items-center gap-1 whitespace-nowrap min-w-[70px] justify-center ${isWaiting
                  ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
                  : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/50"
                }`}
            >
              {isWaiting ? (
                <Check size={14} className="flex-shrink-0" />
              ) : (
                <Clock size={14} className="flex-shrink-0" />
              )}
              <span>{isWaiting ? "입장" : "대기"}</span>
            </button>

            <button
              onClick={onEdit}
              className="text-sm px-2 py-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              aria-label="수정"
            >
              <Edit size={14} />
            </button>

            <button
              onClick={() => {
                if (window.confirm("정말로 이 대기자를 삭제하시겠습니까?")) {
                  onRemove(queue.id)
                }
              }}
              className="text-sm px-2 py-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              aria-label="삭제"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer area */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex flex-wrap justify-between items-center cursor-pointer" onClick={toggleExpand}>
          <div className="flex flex-wrap gap-2 md:gap-4 overflow-hidden">
            <div className="flex items-center gap-1 whitespace-nowrap truncate">
              <Clock size={12} className="flex-shrink-0" />
              {formatDate(queue.createdAt)} 등록
            </div>
          </div>
          <div className="flex items-center mt-1 md:mt-0">
            <span className="mr-1">상세 정보</span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg animate-fadeIn">
            <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">참석자 정보</h4>
            <div className="space-y-2">
              {Object.entries(parseAttendeeInfo(queue.attendee.info)).map(([key, value]) => (
                <div key={key} className="flex flex-wrap">
                  <span className="w-24 font-medium text-gray-600 dark:text-gray-400">{formatInfoKey(key)}:</span>
                  <span className="text-gray-800 dark:text-gray-200 break-words overflow-hidden text-ellipsis">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QueueItem
