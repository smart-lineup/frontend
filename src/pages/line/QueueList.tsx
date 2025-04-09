"use client"

import type React from "react"
import type { Queue, QueueStatus } from "../../components/types"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import QueueItem from "./QueueItem"

interface QueueListProps {
  queues: Queue[]
  isDraggable: boolean
  onStatusChange: (queueId: number, status: QueueStatus) => void
  onRemove: (queueId: number) => void
  onEdit: (queue: Queue) => void
  onDragEnd: (event: DragEndEvent) => void
}

const QueueList: React.FC<QueueListProps> = ({ queues, isDraggable, onStatusChange, onRemove, onEdit, onDragEnd }) => {
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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">대기열 현황</h2>
        <span className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full">
          총 {queues.length}명
        </span>
      </div>

      {queues.length === 0 ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">현재 대기열이 비어 있습니다.</p>
          <p>위의 '대기자 추가' 버튼을 눌러 대기자를 추가해보세요.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={queues.map((q) => `queue-${q.id}`)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {queues.map((queue) => (
                <QueueItem
                  key={queue.id}
                  id={`queue-${queue.id}`}
                  queue={queue}
                  onStatusChange={onStatusChange}
                  onRemove={onRemove}
                  onEdit={() => onEdit(queue)}
                  isDraggable={isDraggable}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}

export default QueueList
