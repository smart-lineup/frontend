"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useDarkMode } from "../../components/DarkModeContext"
import type { Queue } from "../../components/types"
import { QueueStatus } from "../../components/types"
import config from "../../config"

interface AttendeeViewProps {
    uuid: string
    phone: string
}

const AttendeeView: React.FC<AttendeeViewProps> = ({ uuid, phone }) => {
    const { darkMode } = useDarkMode()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [lineName, setLineName] = useState("")
    const [position, setPosition] = useState<number | null>(null)
    const [totalWaiting, setTotalWaiting] = useState(0)
    const [attendeeStatus, setAttendeeStatus] = useState<QueueStatus | null>(null)
    const [showPosition, setShowPosition] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)

            try {
                // 라인 정보 가져오기
                const lineResponse = await axios.get(`${config.backend}/line/${uuid}`)
                setLineName(lineResponse.data.name)

                // 라인 설정 가져오기
                const settingsResponse = await axios.get(`${config.backend}/line/${uuid}/settings`)
                setShowPosition(settingsResponse.data.showQueuePositionToAttendee || false)

                // 대기열 정보 가져오기
                const queueResponse = await axios.get(`${config.backend}/queue/list?line_uuid=${uuid}`)
                const queues: Queue[] = queueResponse.data

                // 대기 중인 사람들만 필터링
                const waitingQueues = queues.filter((q) => q.status === QueueStatus.WAITING)
                setTotalWaiting(waitingQueues.length)

                // 현재 사용자의 위치 찾기
                const attendeeQueue = queues.find((q) => q.attendee.phone === phone)

                if (attendeeQueue) {
                    setAttendeeStatus(attendeeQueue.status)

                    if (attendeeQueue.status === QueueStatus.WAITING) {
                        // 대기 중인 사람들 중에서 현재 사용자의 위치 찾기
                        const index = waitingQueues.findIndex((q) => q.attendee.phone === phone)
                        setPosition(index !== -1 ? index + 1 : null)
                    } else {
                        setPosition(null) // 이미 입장한 경우
                    }
                } else {
                    setError("대기열에서 정보를 찾을 수 없습니다.")
                }
            } catch (e) {
                console.error("Error fetching attendee data:", e)
                setError("정보를 불러오는데 실패했습니다.")
            } finally {
                setLoading(false)
            }
        }

        // 초기 데이터 로드
        fetchData()

        // 30초마다 데이터 갱신
        const intervalId = setInterval(fetchData, 30000)

        return () => clearInterval(intervalId)
    }, [uuid, phone])

    return (
        <div className={darkMode ? "dark" : ""}>
            <div className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-12 text-center dark:bg-gray-900">
                <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                    <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{lineName}</h1>

                    {loading ? (
                        <div className="my-8 flex flex-col items-center">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-300">정보를 불러오는 중...</p>
                        </div>
                    ) : error ? (
                        <div className="my-8 rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900 dark:text-red-200">
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {attendeeStatus === QueueStatus.WAITING ? (
                                <>
                                    <div className="rounded-lg bg-yellow-100 p-4 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                        <p className="text-lg font-medium">현재 대기 중입니다</p>
                                    </div>

                                    {showPosition && position !== null && (
                                        <div className="space-y-2">
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">{position}</span>
                                                <span className="text-lg text-gray-600 dark:text-gray-300">번째 순서입니다</span>
                                            </div>

                                            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                현재 총 {totalWaiting}명이 대기 중입니다
                                            </div>
                                        </div>
                                    )}

                                    <div className="rounded-lg bg-blue-50 p-4 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                                        <p>입장 순서가 되면 알려드리겠습니다.</p>
                                        <p className="mt-2 text-sm">이 페이지를 계속 열어두세요.</p>
                                    </div>
                                </>
                            ) : attendeeStatus === QueueStatus.ENTERED ? (
                                <div className="rounded-lg bg-green-100 p-6 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    <p className="text-xl font-bold">입장해주세요!</p>
                                    <p className="mt-2">지금 입장하실 차례입니다.</p>
                                </div>
                            ) : null}
                        </div>
                    )}

                    <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                        <p>30초마다 자동으로 새로고침됩니다</p>
                        <p className="mt-1">마지막 업데이트: {new Date().toLocaleTimeString()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AttendeeView
