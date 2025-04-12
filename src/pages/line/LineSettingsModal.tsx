"use client"

import type React from "react"
import { X } from "lucide-react"
import { Switch } from "../../components/line/Switch"
import { Label } from "../../components/line/Label"
import axios from "axios"
import config from "../../config"

interface LineSettingsModalProps {
    isOpen: boolean
    onClose: () => void
    showSequenceNumbers: boolean
    hideEnteredAttendees: boolean
    showQueuePositionToAttendee: boolean
    onToggleShowSequenceNumbers: () => void
    onToggleHideEnteredAttendees: () => void
    onToggleShowQueuePositionToAttendee: () => void
    selectedLineId?: number
}

const LineSettingsModal: React.FC<LineSettingsModalProps> = ({
    isOpen,
    onClose,
    showSequenceNumbers,
    hideEnteredAttendees,
    showQueuePositionToAttendee,
    onToggleShowSequenceNumbers,
    onToggleHideEnteredAttendees,
    onToggleShowQueuePositionToAttendee,
    selectedLineId,
}) => {
    if (!isOpen) return null

    // updateQueuePositionVisibility 함수를 수정하여 서버에 요청 후 성공 시 콜백을 호출하도록 변경
    const updateQueuePositionVisibility = async (newValue: boolean) => {
        if (!selectedLineId) return

        try {
            await axios.put(
                `${config.backend}/line/${selectedLineId}/queuePositionVisible`,
                { isVisible: newValue },
                { withCredentials: true },
            )
            console.log("Queue position visibility updated successfully")
            // 성공적으로 업데이트되면 상태 변경
            onToggleShowQueuePositionToAttendee()
        } catch (error) {
            console.error("Failed to update queue position visibility:", error)
        }
    }

    // handleToggleQueuePosition 함수를 수정하여 상태 변경 전에 서버 요청을 보내도록 변경
    const handleToggleQueuePosition = () => {
        const newValue = !showQueuePositionToAttendee
        updateQueuePositionVisibility(newValue)
        // onToggleShowQueuePositionToAttendee() 호출은 updateQueuePositionVisibility 내부로 이동
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        >
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">대기열 설정</h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="show-sequence" className="text-gray-700 dark:text-gray-300">
                                순서 번호 표시
                            </Label>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                대기열에 있는 참석자의 순서 번호를 표시합니다.
                            </p>
                        </div>
                        <Switch id="show-sequence" checked={showSequenceNumbers} onCheckedChange={onToggleShowSequenceNumbers} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="hide-entered" className="text-gray-700 dark:text-gray-300">
                                입장한 참석자 숨기기
                            </Label>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">이미 입장한 참석자를 대기열에서 숨깁니다.</p>
                        </div>
                        <Switch id="hide-entered" checked={hideEnteredAttendees} onCheckedChange={onToggleHideEnteredAttendees} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="show-position" className="text-gray-700 dark:text-gray-300">
                                참석자에게 대기 순서 표시
                            </Label>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                QR 코드로 접속한 참석자에게 현재 대기 순서를 표시합니다.
                            </p>
                        </div>
                        <Switch
                            id="show-position"
                            checked={showQueuePositionToAttendee}
                            onCheckedChange={handleToggleQueuePosition}
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LineSettingsModal
