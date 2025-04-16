"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import config from "../../config"
import { useParams, useLocation } from "react-router-dom"
import { useDarkMode } from "../../components/DarkModeContext"
import AttendeeViewWithoutPosition from "./AttendeeViewWithoutPosition"

interface QueuePosition {
    isQueuePositionVisibleToAttendee: boolean
    position: number
    totalWaiting: number
}

const AttendeeView: React.FC = () => {
    const { darkMode } = useDarkMode()
    const { uuid } = useParams<{ uuid: string }>()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const phone = queryParams.get("phone") || ""

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [queueState, setQueueState] = useState<QueuePosition>({
        isQueuePositionVisibleToAttendee: false,
        position: 0,
        totalWaiting: 0,
    })

    const [showCancelModal, setShowCancelModal] = useState(false)
    const [isCancelling, setIsCancelling] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            if (!uuid || !phone) {
                setError("필요한 정보가 없습니다.")
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)

            try {
                const response = await axios.get<QueuePosition>(`${config.backend}/attendee/${uuid}?phone=${phone}`)
                setQueueState({
                    isQueuePositionVisibleToAttendee: response.data.isQueuePositionVisibleToAttendee,
                    position: response.data.position,
                    totalWaiting: response.data.totalWaiting,
                })
            } catch (e) {
                console.error("Error fetching attendee data:", e)
                setError("정보를 불러오는데 실패했습니다.")
                setQueueState({
                    isQueuePositionVisibleToAttendee: false,
                    position: 0,
                    totalWaiting: 0,
                })
            } finally {
                setLoading(false)
            }
        }

        // 초기 데이터 로드
        fetchData()

        // 30초마다 데이터 갱신
        const intervalId = setInterval(fetchData, 30000)

        return () => clearInterval(intervalId)
    }, [])

    const handleCancelQueue = async () => {
        if (!uuid || !phone) return

        try {
            setIsCancelling(true)
            await axios.delete(`${config.backend}/attendee/cancel`, {
                data: { uuid, phone },
            })

            // 취소 성공 후 Cancel 페이지로 리다이렉트
            window.location.href = `/cancel?lineName=${encodeURIComponent("대기열")}`
        } catch (e) {
            console.error("Error cancelling queue:", e)
            setError("대기열 취소에 실패했습니다. 다시 시도해주세요.")
        } finally {
            setIsCancelling(false)
            setShowCancelModal(false)
        }
    }

    const renderContent = () => {
        if (loading) {
            return (
                <div className="my-8 flex flex-col items-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">정보를 불러오는 중...</p>
                </div>
            )
        }

        if (error) {
            return (
                <div className="my-8 rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900 dark:text-red-200">
                    <p>{error}</p>
                </div>
            )
        }

        if (!queueState.isQueuePositionVisibleToAttendee) {
            return <AttendeeViewWithoutPosition />
        }

        if (queueState.position === 0) {
            return (
                <div className="rounded-lg bg-green-100 p-6 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <p className="text-xl font-bold">입장해주세요!</p>
                    <p className="mt-2">지금 입장하실 차례입니다.</p>
                </div>
            )
        }

        return (
            <div className="space-y-6">
                <div className="rounded-lg bg-yellow-100 p-4 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    <p className="text-lg font-medium">현재 대기 중입니다</p>
                </div>

                <div className="space-y-2">
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">{queueState.position}</span>
                        <span className="text-lg text-gray-600 dark:text-gray-300">번째 순서입니다</span>
                    </div>

                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        현재 총 {queueState.totalWaiting}명이 대기 중입니다
                    </div>
                </div>

                <div className="rounded-lg bg-blue-50 p-4 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                    <p>입장 순서가 되면 알려드리겠습니다.</p>
                    <p className="mt-2 text-sm">이 페이지를 계속 열어두세요.</p>
                </div>

                <button
                    onClick={() => setShowCancelModal(true)}
                    className="mt-1 w-full py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                >
                    대기열에서 취소하기
                </button>

                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <p>30초마다 자동으로 새로고침됩니다</p>
                    <p className="mt-1">마지막 업데이트: {new Date().toLocaleTimeString()}</p>
                </div>

                {showCancelModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-xl">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">대기열 취소</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                정말로 대기열에서 취소하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md"
                                >
                                    아니오
                                </button>
                                <button
                                    onClick={handleCancelQueue}
                                    disabled={isCancelling}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center"
                                >
                                    {isCancelling ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            처리 중...
                                        </>
                                    ) : (
                                        "예, 취소합니다"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className={darkMode ? "dark" : ""}>
            <div className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-12 text-center dark:bg-gray-900">
                <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">{renderContent()}</div>
            </div>
        </div>
    )
}

export default AttendeeView
