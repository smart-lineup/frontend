"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { Plus } from "lucide-react"
import { useDarkMode } from "../../components/DarkModeContext"
import { type Line, type Queue, QueueStatus, type Attendee } from "../../components/types"
import config from "../../config"
import type { DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { read, utils, writeFileXLSX } from "xlsx"
import { useNavigate } from "react-router-dom"
import * as Tooltip from "@radix-ui/react-Tooltip"

import Navbar from "../../components/Navbar"
import { LineSidebar, LineHeader, QRCodeModal, AttendeeForm, ExcelUploadModal, QueueList, EmptyState } from "../line"
import { useAuth } from "../../components/AuthContext"

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
  const [isDraggable, setIsDraggable] = useState(false)
  const [showExcelUpload, setShowExcelUpload] = useState(false)
  const [excelData, setExcelData] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editingAttendee, setEditingAttendee] = useState<{ queueId: number; attendee: Attendee } | null>(null)

  const { username, isAuthenticated, authLoading, role } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      alert("로그인이 필요합니다.")
      navigate("/")
    }
  }, [authLoading, isAuthenticated, navigate])

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

  const handleAddLine = async (name: string) => {
    try {
      await axios.post(
        config.backend + "/line/add",
        {
          name: name,
        },
        {
          withCredentials: true,
        },
      )

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

  const handleEditLine = async (id: number, name: string) => {
    try {
      await axios.put(
        `${config.backend}/line/name`,
        {
          id: id,
          name: name,
        },
        {
          withCredentials: true,
        },
      )

      fetchAllLines()

      // Update selected line name if it's the one being edited
      if (selectedLine && selectedLine.id === id) {
        setSelectedLine({ ...selectedLine, name: name })
      }
    } catch (e) {
      console.error(`Error editing line ${id}:`, e)
      setError("라인 수정에 실패했습니다.")
    }
  }

  const handleSelectLine = (line: Line) => {
    setSelectedLine(line)
    fetchLineQueues(line.id)
    setShowAddAttendee(false)
    setShowQRCode(false)
    setIsDraggable(false)
    setEditingAttendee(null)

    // Create share URL
    const shareUrl = `${window.location.origin}/attendee/${line.uuid}`
    setShareUrl(shareUrl)
  }

  const prepareInfoObject = (infoFields: { key: string; value: string }[]) => {
    // Filter out empty fields and create an object
    const infoObj: Record<string, string> = {}
    infoFields.forEach((field) => {
      if (field.key.trim() && field.value.trim()) {
        infoObj[field.key.trim()] = field.value.trim()
      }
    })
    return infoObj
  }

  const handleAddAttendee = async (phone: string, name: string, infoFields: { key: string; value: string }[]) => {
    if (!selectedLine) return

    try {
      const infoObj = prepareInfoObject(infoFields)

      await axios.post(
        `${config.backend}/queue/add`,
        {
          lineId: selectedLine.id,
          attendee: {
            phone: phone,
            name: name,
            info: JSON.stringify(infoObj),
          },
        },
        {
          withCredentials: true,
        },
      )

      fetchLineQueues(selectedLine.id)
      setShowAddAttendee(false)
    } catch (e) {
      console.error("Error adding attendee:", e)
      setError("대기자 추가에 실패했습니다.")
    }
  }

  const handleUpdateAttendee = async (phone: string, name: string, infoFields: { key: string; value: string }[]) => {
    if (!editingAttendee || !selectedLine) return

    try {
      const infoObj = prepareInfoObject(infoFields)

      await axios.put(
        `${config.backend}/queue/${editingAttendee.queueId}/attendee`,
        {
          phone: phone,
          name: name,
          info: JSON.stringify(infoObj),
        },
        {
          withCredentials: true,
        },
      )

      fetchLineQueues(selectedLine.id)
      setEditingAttendee(null)
      setShowAddAttendee(false) // 폼을 닫습니다
    } catch (e) {
      console.error("Error updating attendee:", e)
      setError("대기자 정보 수정에 실패했습니다.")
    }
  }

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer)
        const workbook = read(data, { type: "array" })

        // Assume first sheet
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = utils.sheet_to_json(firstSheet)

        // Validate data format
        const validData = jsonData.map((row: any) => {
          // Extract any additional columns as info
          const { name, Name, phone, Phone, 이름: korName, 전화번호: korPhone, ...rest } = row
          const infoObj: Record<string, any> = {}

          // Add all other columns to info
          Object.entries(rest).forEach(([key, value]) => {
            if (value) infoObj[key] = value
          })

          return {
            name: name || Name || korName || "손님",
            phone: phone || Phone || korPhone || "",
            info: JSON.stringify(Object.keys(infoObj).length > 0 ? infoObj : {}),
          }
        })

        setExcelData(validData)
        setShowExcelUpload(true)
        setIsUploading(false)
      } catch (error) {
        console.error("Error parsing Excel file:", error)
        setError("엑셀 파일 파싱에 실패했습니다.")
        setIsUploading(false)
      }
    }

    reader.onerror = () => {
      setError("파일 읽기에 실패했습니다.")
      setIsUploading(false)
    }

    reader.readAsArrayBuffer(file)
  }

  const handleConfirmExcelUpload = async () => {
    if (!selectedLine || excelData.length === 0) return

    setIsUploading(true)
    try {
      // Batch upload attendees
      await axios.post(
        `${config.backend}/queue/batch-add`,
        {
          lineId: selectedLine.id,
          attendees: excelData,
        },
        {
          withCredentials: true,
        },
      )

      fetchLineQueues(selectedLine.id)
      setShowExcelUpload(false)
      setExcelData([])
      setIsUploading(false)
    } catch (e) {
      console.error("Error batch adding attendees:", e)
      setError("대기자 일괄 추가에 실패했습니다.")
      setIsUploading(false)
    }
  }

  const handleExcelDownload = () => {
    if (!queues.length || !selectedLine) {
      alert("다운로드할 대기열 데이터가 없습니다.")
      return
    }

    try {
      // 대기열 데이터를 엑셀 형식으로 변환
      const data = queues.map((queue) => {
        // 추가 정보 파싱
        let additionalInfo = {}
        try {
          additionalInfo = JSON.parse(queue.attendee.info)
        } catch (e) {
          // 파싱 실패 시 빈 객체 유지
        }

        // 기본 필드
        const baseData = {
          이름: queue.attendee.name,
          전화번호: queue.attendee.phone,
          상태: queue.status === QueueStatus.WAITING ? "대기중" : "입장",
          등록시간: new Date(queue.createdAt).toLocaleString(),
        }

        // 추가 정보가 있으면 병합
        return { ...baseData, ...additionalInfo }
      })

      // 워크시트 생성
      const ws = utils.json_to_sheet(data)

      // 워크북 생성
      const wb = utils.book_new()
      utils.book_append_sheet(wb, ws, "대기열")

      // 파일 이름 생성 (라인 이름 + 날짜)
      const fileName = `${selectedLine.name}_대기열_${new Date().toISOString().split("T")[0]}.xlsx`

      // 파일 다운로드
      writeFileXLSX(wb, fileName)
    } catch (e) {
      console.error("Excel download error:", e)
      setError("엑셀 다운로드에 실패했습니다.")
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

    // Extract the queue IDs from the element IDs
    const activeId = active.id.toString().replace("queue-", "")
    const overId = over.id.toString().replace("queue-", "")

    // Find the indices of the dragged item and the drop target
    const activeIndex = queues.findIndex((q) => q.id.toString() === activeId)
    const overIndex = queues.findIndex((q) => q.id.toString() === overId)

    if (activeIndex !== -1 && overIndex !== -1) {
      // Determine direction
      const direction = activeIndex > overIndex ? "up" : "down"

      // Update the UI immediately for better UX
      const newQueues = arrayMove(queues, activeIndex, overIndex)
      setQueues(newQueues)

      // Update the backend
      if (selectedLine) {
        try {
          // Send the reorder request with direction information
          await axios.put(
            `${config.backend}/queue/reorder`,
            {
              lineId: selectedLine.id,
              // queue_ids: newQueues.map((q) => q.id),
              movedQueueId: Number.parseInt(activeId),
              targetQueueId: Number.parseInt(overId),
              direction: direction,
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

  const startEditAttendee = (queue: Queue) => {
    setEditingAttendee({ queueId: queue.id, attendee: queue.attendee })
    setShowAddAttendee(true) // Show the form
  }

  const handleAttendeeFormSubmit = (phone: string, name: string, infoFields: { key: string; value: string }[]) => {
    if (editingAttendee) {
      handleUpdateAttendee(phone, name, infoFields)
    } else {
      handleAddAttendee(phone, name, infoFields)
    }
  }

  const handleAttendeeFormCancel = () => {
    setShowAddAttendee(false)
    setEditingAttendee(null)
  }

  const handleExcelUploadClick = () => {
    fileInputRef.current?.click()
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
            <LineSidebar
              lines={lines}
              selectedLine={selectedLine}
              loading={loading}
              error={error}
              onSelectLine={handleSelectLine}
              onDeleteLine={handleDeleteLine}
              onAddLine={handleAddLine}
              onEditLine={handleEditLine}
            />

            {/* Main Content */}
            <div className="flex-1">
              {selectedLine ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 overflow-hidden">
                  <LineHeader
                    selectedLine={selectedLine}
                    isDraggable={isDraggable}
                    onBack={() => {
                      setSelectedLine(null)
                      setQueues([])
                    }}
                    onToggleDraggable={toggleDraggable}
                    onShare={handleShare}
                    onToggleQRCode={toggleQRCode}
                    onExcelDownload={handleExcelDownload}
                    onExcelUpload={handleExcelUploadClick}
                  />

                  {showQRCode && <QRCodeModal shareUrl={shareUrl} onClose={toggleQRCode} />}

                  {showExcelUpload && (
                    <ExcelUploadModal
                      excelData={excelData}
                      isUploading={isUploading}
                      onConfirm={handleConfirmExcelUpload}
                      onCancel={() => {
                        setShowExcelUpload(false)
                        setExcelData([])
                      }}
                    />
                  )}

                  {/* Add/Edit Attendee Form */}
                  {showAddAttendee && (
                    <AttendeeForm
                      isEditing={!!editingAttendee}
                      editingAttendee={editingAttendee}
                      onSubmit={handleAttendeeFormSubmit}
                      onCancel={handleAttendeeFormCancel}
                    />
                  )}

                  {/* Add Attendee Button */}
                  {!showAddAttendee && !showExcelUpload && (
                    <div className="mb-6 flex flex-wrap gap-2">
                      <button
                        onClick={() => setShowAddAttendee(true)}
                        className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={18} />
                        대기자 추가
                      </button>
                      <div className="flex-1 relative sm:block hidden">
                        <Tooltip.Provider delayDuration={300}>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <button
                                onClick={handleExcelUploadClick}
                                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 relative"
                              >
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  onChange={handleExcelUpload}
                                  accept=".xlsx,.xls"
                                  className="hidden"
                                />
                                엑셀 업로드
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
                                <div className="font-semibold mb-1">엑셀 파일 형식 안내:</div>
                                <ul className="list-disc pl-4 space-y-1">
                                  <li>첫 번째 행은 열 제목이어야 합니다.</li>
                                  <li>첫번째 열:&nbsp;'이름', &nbsp;두번째 열:&nbsp;'전화번호'</li>
                                  <li>그 외 열은 추가 정보로 자동 저장됩니다.</li>
                                </ul>
                                <Tooltip.Arrow className="fill-gray-800" width={10} height={5} />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        </Tooltip.Provider>
                      </div>
                    </div>
                  )}

                  {/* Queue List */}
                  <QueueList
                    queues={queues}
                    isDraggable={isDraggable}
                    onStatusChange={handleStatusChange}
                    onRemove={removeQueue}
                    onEdit={startEditAttendee}
                    onDragEnd={handleDragEnd}
                  />
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
