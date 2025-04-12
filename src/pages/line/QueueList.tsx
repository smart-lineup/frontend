"use client"

import type React from "react"
import { Queue, QueueStatus } from "../../components/types"
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
  showSequenceNumbers: boolean
  hideEnteredAttendees: boolean
}

const QueueList: React.FC<QueueListProps> = ({
  queues,
  isDraggable,
  onStatusChange,
  onRemove,
  onEdit,
  onDragEnd,
  showSequenceNumbers,
  hideEnteredAttendees,
}) => {
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

  // Filter queues based on settings
  const filteredQueues = hideEnteredAttendees ? queues.filter((queue) => queue.status === "WAITING") : queues

  // Count waiting and entered attendees
  const waitingCount = queues.filter((q) => q.status === "WAITING").length
  const enteredCount = queues.filter((q) => q.status === "ENTERED").length

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">대기열 현황</h2>
        <div className="flex gap-2">
          <span className="text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded-full">
            대기: {waitingCount}명
          </span>
          <span className="text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
            입장: {enteredCount}명
          </span>
        </div>
      </div>

      {filteredQueues.length === 0 ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">
            {hideEnteredAttendees && queues.length > 0 ? "모든 참석자가 입장했습니다." : "현재 대기열이 비어 있습니다."}
          </p>
          <p>위의 '대기자 추가' 버튼을 눌러 대기자를 추가해보세요.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={filteredQueues.map((q) => `queue-${q.id}`)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {filteredQueues.map((queue, index) => (
                <QueueItem
                  key={queue.id}
                  id={`queue-${queue.id}`}
                  queue={queue}
                  onStatusChange={onStatusChange}
                  onRemove={onRemove}
                  onEdit={() => onEdit(queue)}
                  isDraggable={isDraggable}
                  sequenceNumber={index + 1}
                  showSequenceNumber={showSequenceNumbers}
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
