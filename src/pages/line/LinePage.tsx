"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useDarkMode } from "../../components/DarkModeContext"
import { type Line, type Queue, QueueStatus, type Attendee } from "../../components/types"
import config from "../../config"
import type { DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { read, utils, writeFileXLSX } from "xlsx"
import { useNavigate } from "react-router-dom"

import Navbar from "../../components/Navbar"
import {
  LineSidebar,
  LineHeader,
  QRCodeModal,
  AttendeeForm,
  ExcelUploadModal,
  QueueList,
  EmptyState,
  LimitModal,
  LineSettingsModal,
} from "../line"
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
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [editingAttendee, setEditingAttendee] = useState<{ queueId: number; attendee: Attendee } | null>(null)
  const [limitModal, setLimitModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  })
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [intervalId, setIntervalId] = useState<number | null>(null)

  // 설정 상태
  const [showSequenceNumbers, setShowSequenceNumbers] = useState(() => {
    const saved = localStorage.getItem("showSequenceNumbers")
    return saved !== null ? JSON.parse(saved) : true
  })

  const [hideEnteredAttendees, setHideEnteredAttendees] = useState(() => {
    const saved = localStorage.getItem("hideEnteredAttendees")
    return saved !== null ? JSON.parse(saved) : false
  })

  const [showQueuePositionToAttendee, setShowQueuePositionToAttendee] = useState(false)

  const { username, isAuthenticated, authLoading, isPremium } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      alert("로그인이 필요합니다.")
      navigate("/")
    }
  }, [authLoading, isAuthenticated, navigate])

  // 설정 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("showSequenceNumbers", JSON.stringify(showSequenceNumbers))
  }, [showSequenceNumbers])

  useEffect(() => {
    localStorage.setItem("hideEnteredAttendees", JSON.stringify(hideEnteredAttendees))
  }, [hideEnteredAttendees])

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

  // 라인 추가 제한 모달 표시 함수
  const handleAddLineClick = () => {
    if (!isPremium && lines.length >= 2) {
      setLimitModal({
        isOpen: true,
        title: "라인 개수 제한",
        message:
          "무료 계정은 최대 2개의 라인만 관리할 수 있습니다. 프리미엄으로 업그레이드하여 무제한으로 라인을 관리하세요.",
      })
      return true
    }
    return false
  }

  const handleAddLine = async (name: string) => {
    // 제한 체크는 LineSidebar에서 이미 수행됨
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
    // 이전 인터벌이 있다면 제거
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }

    setSelectedLine(line)
    fetchLineQueues(line.id)
    setShowAddAttendee(false)
    setShowQRCode(false)
    setIsDraggable(false)
    setEditingAttendee(null)

    // 서버에서 받아온 라인의 isQueuePositionVisibleToAttendee 값을 사용
    setShowQueuePositionToAttendee(line.isQueuePositionVisibleToAttendee)

    // Create share URL
    const shareUrl = `${window.location.origin}/attendee/${line.uuid}`
    setShareUrl(shareUrl)

    // 3초마다 대기열 갱신
    const newIntervalId = setInterval(() => {
      fetchLineQueues(line.id)
    }, 30000)
    setIntervalId(newIntervalId)
  }

  // 컴포넌트 언마운트 시 인터벌 제거
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [intervalId])

  // 설정 토글 핸들러
  const handleToggleShowSequenceNumbers = () => {
    setShowSequenceNumbers((prev: boolean) => !prev)
  }

  const handleToggleHideEnteredAttendees = () => {
    setHideEnteredAttendees((prev: boolean) => !prev)
  }

  const handleToggleShowQueuePositionToAttendee = () => {
    setShowQueuePositionToAttendee((prev: boolean) => !prev)
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

    // FREE 사용자이고 이미 20명 이상의 대기자가 있는 경우 제한
    if (!isPremium && queues.length >= 20) {
      setLimitModal({
        isOpen: true,
        title: "대기자 수 제한",
        message:
          "최대 20명까지만 참여할 수 있습니다. 현재 정원이 가득 찼어요. 프리미엄으로 업그레이드하여 무제한으로 대기자를 관리하세요.",
      })
      setShowAddAttendee(false)
      return
    }

    try {
      const infoObj = prepareInfoObject(infoFields)

      const response = await axios.post(
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

      if (response.data == "ok") {
        fetchLineQueues(selectedLine.id)
        setShowAddAttendee(false)
      } else {
        setError("이미 같은 번호의 대기자가 있습니다.")
      }
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

  const handleExcelUploadClick = () => {
    // FREE 사용자인 경우 제한 모달 표시
    if (!isPremium) {
      setLimitModal({
        isOpen: true,
        title: "엑셀 업로드 제한",
        message: "엑셀 업로드는 프리미엄 기능입니다. 프리미엄으로 업그레이드하여 이 기능을 사용하세요.",
      })
      return
    }

    // PREMIUM 사용자인 경우 파일 선택 다이얼로그 표시
    fileInputRef.current?.click()
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

    // FREE 사용자
    if (!isPremium) {
      setLimitModal({
        isOpen: true,
        title: "엑셀 업로드 제한",
        message: `엑셀 업로드는 프리미엄 기능입니다. 프리미엄으로 업그레이드하여 이 기능을 사용하세요.`,
      })
      setShowExcelUpload(false)
      return
    }

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
    // FREE 사용자인 경우 제한
    if (!isPremium) {
      setLimitModal({
        isOpen: true,
        title: "엑셀 다운로드 제한",
        message: "엑셀 다운로드는 프리미엄 기능입니다. 프리미엄으로 업그레이드하여 이 기능을 사용하세요.",
      })
      return
    }

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

  const handleUpgrade = () => {
    navigate("/pricing")
  }

  // 대기자 추가 버튼 클릭 핸들러
  const handleAddAttendeeClick = () => {
    // FREE 사용자이고 이미 20명 이상의 대기자가 있는 경우 제한
    if (!isPremium && queues.length >= 20) {
      setLimitModal({
        isOpen: true,
        title: "대기자 수 제한",
        message:
          "최대 20명까지만 참여할 수 있습니다. 현재 정원이 가득 찼어요. 프리미엄으로 업그레이드하여 무제한으로 대기자를 관리하세요.",
      })
      return
    }

    setShowAddAttendee(true)
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
              onAddLineClick={handleAddLineClick}
              isPremium={isPremium}
            />

            {/* Main Content */}
            <div className="flex-1">
              {selectedLine ? (
                <div className="space-y-4">
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
                      onAddAttendee={handleAddAttendeeClick}
                      onOpenSettings={() => setShowSettingsModal(true)}
                      fileInputRef={fileInputRef}
                      handleExcelUpload={handleExcelUpload}
                      isPremium={isPremium}
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

                    {/* Queue List */}
                    <QueueList
                      queues={queues}
                      isDraggable={isDraggable}
                      onStatusChange={handleStatusChange}
                      onRemove={removeQueue}
                      onEdit={startEditAttendee}
                      onDragEnd={handleDragEnd}
                      showSequenceNumbers={showSequenceNumbers}
                      hideEnteredAttendees={hideEnteredAttendees}
                    />
                  </div>
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        <LineSettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          showSequenceNumbers={showSequenceNumbers}
          hideEnteredAttendees={hideEnteredAttendees}
          showQueuePositionToAttendee={showQueuePositionToAttendee}
          onToggleShowSequenceNumbers={handleToggleShowSequenceNumbers}
          onToggleHideEnteredAttendees={handleToggleHideEnteredAttendees}
          onToggleShowQueuePositionToAttendee={handleToggleShowQueuePositionToAttendee}
          selectedLineId={selectedLine?.id} // 선택된 라인 ID 전달
        />

        {/* Limit Modal */}
        <LimitModal
          isOpen={limitModal.isOpen}
          onClose={() => setLimitModal({ ...limitModal, isOpen: false })}
          title={limitModal.title}
          message={limitModal.message}
          onUpgrade={handleUpgrade}
        />
      </div>
    </div>
  )
}

export default LinePage
