"use client"

import type React from "react"
import { useLocation } from "react-router-dom"
import { CheckCircle } from "lucide-react"
import { useDarkMode } from "../../components/DarkModeContext"

const CancelPage: React.FC = () => {
    const { darkMode } = useDarkMode()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const lineName = queryParams.get("lineName") || "대기열"

    return (
        <div className={darkMode ? "dark" : ""}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 flex items-center justify-center">
                <div className="max-w-md w-full mx-auto p-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-center mb-6">
                            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                                <CheckCircle className="h-12 w-12 text-green-500" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold mb-2">취소가 완료되었습니다</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            성공적으로 취소되었습니다. 다음에 다시 이용해 주세요.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CancelPage
