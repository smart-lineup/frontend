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
    const [position, setPosition] = useState<number>(0)
    const [totalWaiting, setTotalWaiting] = useState<number>(0)
    const [isQueuePositionVisibleToAttendee, setIsQueuePositionVisibleToAttendee] = useState<boolean>(false)

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
                if (!response.data.isQueuePositionVisibleToAttendee) {
                    setIsQueuePositionVisibleToAttendee(false)
                    setPosition(0)
                    setTotalWaiting(0)
                    return;
                }
                setIsQueuePositionVisibleToAttendee(true)
                setPosition(response.data.position)
                setTotalWaiting(response.data.totalWaiting)
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
    }, [])

    return (
        <div className={darkMode ? "dark" : ""}>
            <div className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-12 text-center dark:bg-gray-900">
                <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                    {loading ? (
                        <div className="my-8 flex flex-col items-center">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-300">정보를 불러오는 중...</p>
                        </div>
                    ) : error ? (
                        <div className="my-8 rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900 dark:text-red-200">
                            <p>{error}</p>
                        </div>
                    ) : !isQueuePositionVisibleToAttendee ? (
                        <AttendeeViewWithoutPosition />
                    ) : (
                        <div className="space-y-6">
                            {position !== 0 ? (
                                <>
                                    <div className="rounded-lg bg-yellow-100 p-4 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                        <p className="text-lg font-medium">현재 대기 중입니다</p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">{position}</span>
                                            <span className="text-lg text-gray-600 dark:text-gray-300">번째 순서입니다</span>
                                        </div>

                                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            현재 총 {totalWaiting}명이 대기 중입니다
                                        </div>
                                    </div>

                                    <div className="rounded-lg bg-blue-50 p-4 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                                        <p>입장 순서가 되면 알려드리겠습니다.</p>
                                        <p className="mt-2 text-sm">이 페이지를 계속 열어두세요.</p>
                                    </div>

                                    <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                                        <p>30초마다 자동으로 새로고침됩니다</p>
                                        <p className="mt-1">마지막 업데이트: {new Date().toLocaleTimeString()}</p>
                                    </div>
                                </>
                            ) : (
                                <div className="rounded-lg bg-green-100 p-6 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    <p className="text-xl font-bold">입장해주세요!</p>
                                    <p className="mt-2">지금 입장하실 차례입니다.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AttendeeView
