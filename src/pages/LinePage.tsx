"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { QRCodeSVG } from "qrcode.react"
import {
  Users,
  Plus,
  Share2,
  QrCode,
  Clipboard,
  ArrowLeft,
  MoveVertical,
  AlertCircle,
  FileDown,
  FileUp,
  HelpCircle,
} from "lucide-react"
import { useDarkMode } from "../components/DarkModeContext"
import { type Line, type Queue, QueueStatus, type Attendee } from "../components/types"
import config from "../config"
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
import { read, utils, writeFileXLSX } from "xlsx"
import { useNavigate } from "react-router-dom"
import * as Tooltip from "@radix-ui/react-Tooltip"

// Components
import Navbar from "../components/Navbar"
import QueueItem from "../components/line/QueueItem"
import EmptyState from "../components/line/EmptyState"
import { useAuth } from "../components/AuthContext"

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
  const [showExcelUpload, setShowExcelUpload] = useState(false)
  const [excelData, setExcelData] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editingAttendee, setEditingAttendee] = useState<{ queueId: number; attendee: Attendee } | null>(null)
  // const [showUploadTooltip, setShowUploadTooltip] = useState(false) // 제거

  // Form states
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("손님")
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [infoFields, setInfoFields] = useState<{ key: string; value: string }[]>([{ key: "메모", value: "" }])

  const { username, isAuthenticated, authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      alert("로그인이 필요합니다.")
      navigate("/")
    }
  }, [authLoading, isAuthenticated])
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
    setEditingAttendee(null)

    // Create share URL
    const shareUrl = `${window.location.origin}/attendee/${line.uuid}`
    setShareUrl(shareUrl)
  }

  const prepareInfoObject = () => {
    // Filter out empty fields and create an object
    const infoObj: Record<string, string> = {}
    infoFields.forEach((field) => {
      if (field.key.trim() && field.value.trim()) {
        infoObj[field.key.trim()] = field.value.trim()
      }
    })
    return infoObj
  }

  // 전화번호 유효성 검사 함수 추가 - handleInfoFieldChange 함수 위에 추가
  const validatePhone = (phoneNumber: string): boolean => {
    // 한국 휴대폰 번호 정규식 (010-XXXX-XXXX 또는 010XXXXXXXX 형식)
    const mobileRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/

    // 일반 전화번호까지 포함하려면 아래 정규식 사용
    // const phoneRegex = /^(0[2-9][0-9]{1,2})-?([0-9]{3,4})-?([0-9]{4})$|^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/

    return mobileRegex.test(phoneNumber)
  }

  // 전화번호 입력 핸들러 수정 - handleAddInfoField 함수 위에 추가
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPhone(value)

    // 값이 비어있으면 에러 메시지 초기화
    if (!value.trim()) {
      setPhoneError("전화번호를 입력해주세요")
      return
    }

    // 유효성 검사
    if (!validatePhone(value)) {
      setPhoneError("유효한 휴대폰 번호 형식이 아닙니다 (예: 010-1234-5678)")
    } else {
      setPhoneError(null)
    }
  }

  const handleAddInfoField = () => {
    setInfoFields([...infoFields, { key: "", value: "" }])
  }

  const handleRemoveInfoField = (index: number) => {
    setInfoFields(infoFields.filter((_, i) => i !== index))
  }

  const handleInfoFieldChange = (index: number, field: "key" | "value", value: string) => {
    const newFields = [...infoFields]
    newFields[index][field] = value
    setInfoFields(newFields)
  }

  // handleAddAttendee 함수 수정
  const handleAddAttendee = async () => {
    if (!phone.trim()) {
      setPhoneError("전화번호를 입력해주세요")
      return
    }

    if (phoneError) {
      // 전화번호 오류가 있으면 제출하지 않음
      return
    }

    if (!selectedLine) return

    try {
      const infoObj = prepareInfoObject()

      await axios.post(
        `${config.backend}/queue/add`,
        {
          lineId: selectedLine.id,
          attendee: {
            phone: phone,
            name: name,
            info: JSON.stringify(infoObj),
          }
        },
        {
          withCredentials: true,
        },
      )

      fetchLineQueues(selectedLine.id)
      setShowAddAttendee(false)
      resetAttendeeForm()
    } catch (e) {
      console.error("Error adding attendee:", e)
      setError("대기자 추가에 실패했습니다.")
    }
  }

  // handleUpdateAttendee 함수 수정
  const handleUpdateAttendee = async () => {
    if (!phone.trim()) {
      setPhoneError("전화번호를 입력해주세요")
      return
    }

    if (phoneError) {
      // 전화번호 오류가 있으면 제출하지 않음
      return
    }

    if (!editingAttendee || !selectedLine) return

    try {
      const infoObj = prepareInfoObject()

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
      resetAttendeeForm()
    } catch (e) {
      console.error("Error updating attendee:", e)
      setError("대기자 정보 수정에 실패했습니다.")
    }
  }

  // resetAttendeeForm 함수 수정
  const resetAttendeeForm = () => {
    setPhone("")
    setName("손님")
    setPhoneError(null)
    setInfoFields([{ key: "메모", value: "" }])
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
        `${config.backend}/line/${selectedLine.id}/queue/batch-add`,
        {
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
              line_id: selectedLine.id,
              queue_ids: newQueues.map((q) => q.id),
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
    setName(queue.attendee.name)
    setPhone(queue.attendee.phone)

    // Parse and set info fields
    try {
      const parsedInfo = JSON.parse(queue.attendee.info)
      const infoFieldsArray: { key: string; value: string }[] = []

      for (const key in parsedInfo) {
        if (parsedInfo.hasOwnProperty(key)) {
          infoFieldsArray.push({ key: key, value: parsedInfo[key] })
        }
      }

      // Ensure there's at least one field
      if (infoFieldsArray.length === 0) {
        infoFieldsArray.push({ key: "메모", value: "" })
      }

      setInfoFields(infoFieldsArray)
    } catch (error) {
      console.error("Error parsing attendee info:", error)
      setInfoFields([{ key: "메모", value: "" }]) // Default
    }
  }

  // const toggleUploadTooltip = () => { setShowUploadTooltip(!showUploadTooltip) } // 제거

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
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 overflow-hidden">
                  <div className="flex flex-col mb-6 gap-3 md:gap-4">
                    <div className="flex items-center w-full">
                      <button
                        onClick={() => {
                          setSelectedLine(null)
                          setQueues([])
                        }}
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
                        onClick={toggleDraggable}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${isDraggable
                          ? "bg-purple-500 hover:bg-purple-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                          }`}
                      >
                        <MoveVertical size={16} />
                        <span className="whitespace-nowrap text-xs">{isDraggable ? "순서 저장" : "순서 변경"}</span>
                      </button>
                      <button
                        onClick={handleShare}
                        className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        <Share2 size={16} />
                        <span className="whitespace-nowrap text-xs">공유</span>
                      </button>
                      <button
                        onClick={toggleQRCode}
                        className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        <QrCode size={16} />
                        <span className="whitespace-nowrap text-xs">QR</span>
                      </button>
                      <button
                        onClick={handleExcelDownload}
                        className="flex items-center gap-1 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                      >
                        <FileDown size={16} />
                        <span className="whitespace-nowrap text-xs">엑셀 다운로드</span>
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
                          className="flex-1 p-2 border rounded-md text-sm bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 dark:border-gray-600 overflow-hidden text-ellipsis"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(shareUrl)
                            alert("URL이 클립보드에 복사되었습니다.")
                          }}
                          className="p-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 flex-shrink-0"
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

                  {showExcelUpload && (
                    <div className="mb-6 p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md animate-fadeIn">
                      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">엑셀 데이터 미리보기</h2>

                      {excelData.length > 0 ? (
                        <>
                          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center">
                            <AlertCircle size={18} className="text-blue-500 mr-2" />
                            <span className="text-sm text-blue-700 dark:text-blue-300">
                              총 {excelData.length}명의 대기자를 추가합니다.
                            </span>
                          </div>

                          <div className="max-h-60 overflow-y-auto mb-4 border dark:border-gray-600 rounded-lg">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-100 dark:bg-gray-800">
                                <tr>
                                  <th className="px-4 py-2 text-left">이름</th>
                                  <th className="px-4 py-2 text-left">전화번호</th>
                                </tr>
                              </thead>
                              <tbody>
                                {excelData.slice(0, 10).map((item, index) => (
                                  <tr key={index} className="border-t dark:border-gray-700">
                                    <td className="px-4 py-2 truncate max-w-[150px]">{item.name}</td>
                                    <td className="px-4 py-2 truncate max-w-[150px]">{item.phone}</td>
                                  </tr>
                                ))}
                                {excelData.length > 10 && (
                                  <tr className="border-t dark:border-gray-700">
                                    <td colSpan={2} className="px-4 py-2 text-center text-gray-500">
                                      외 {excelData.length - 10}명...
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>

                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setShowExcelUpload(false)
                                setExcelData([])
                              }}
                              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                              취소
                            </button>
                            <button
                              onClick={handleConfirmExcelUpload}
                              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
                              disabled={isUploading}
                            >
                              {isUploading ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  처리 중...
                                </>
                              ) : (
                                "업로드 확인"
                              )}
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                          <p>데이터를 불러오는 중입니다...</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Add/Edit Attendee Form */}
                  {showAddAttendee || editingAttendee ? (
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        {editingAttendee ? "대기자 정보 수정" : "대기열에 추가하기"}
                      </h2>
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
                        {/* 전화번호 입력 필드 수정 - 폼 내부의 전화번호 입력 부분을 찾아 아래 코드로 교체 */}
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
                            onChange={handlePhoneChange}
                            className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600 ${phoneError ? "border-red-500 dark:border-red-500" : ""
                              }`}
                            placeholder="010-1234-5678"
                            required
                          />
                          {phoneError && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{phoneError}</p>}
                        </div>

                        {/* Additional Info Fields */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">추가 정보</label>
                            <button
                              type="button"
                              onClick={handleAddInfoField}
                              className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              + 필드 추가
                            </button>
                          </div>

                          <div className="space-y-2 max-w-full">
                            {infoFields.map((field, index) => (
                              <div key={index} className="flex gap-2 items-start w-full">
                                <input
                                  type="text"
                                  value={field.key}
                                  onChange={(e) => handleInfoFieldChange(index, "key", e.target.value)}
                                  placeholder="필드명"
                                  className="w-1/3 p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600 text-sm"
                                />
                                <input
                                  type="text"
                                  value={field.value}
                                  onChange={(e) => handleInfoFieldChange(index, "value", e.target.value)}
                                  placeholder="값"
                                  className="w-2/3 p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600 text-sm"
                                />
                                {infoFields.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveInfoField(index)}
                                    className="p-2 text-red-500 hover:text-red-700 flex-shrink-0"
                                    aria-label="필드 삭제"
                                  >
                                    &times;
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 버튼 부분 수정 - 폼 하단의 버튼 부분을 찾아 아래 코드로 교체 */}
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setShowAddAttendee(false)
                              setEditingAttendee(null)
                              resetAttendeeForm()
                            }}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                          >
                            취소
                          </button>
                          <button
                            onClick={editingAttendee ? handleUpdateAttendee : handleAddAttendee}
                            className={`px-4 py-2 ${phoneError || !phone.trim()
                              ? "bg-blue-300 cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-600"
                              } text-white rounded-md`}
                            disabled={!!phoneError || !phone.trim()}
                          >
                            {editingAttendee ? "수정" : "추가"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
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
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 relative"
                              >
                                <FileUp size={18} />
                                <span>엑셀 업로드</span>
                                <HelpCircle size={16} className="ml-1 text-white/80" />
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
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleExcelUpload}
                          accept=".xlsx,.xls"
                          className="hidden"
                        />
                      </div>
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
                          {" "}
                          <div className="space-y-3">
                            {queues.map((queue) => (
                              <QueueItem
                                key={queue.id}
                                id={`queue-${queue.id}`}
                                queue={queue}
                                onStatusChange={handleStatusChange}
                                onRemove={removeQueue}
                                onEdit={() => startEditAttendee(queue)}
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

