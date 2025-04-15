"use client"

import type React from "react"

import { useDarkMode } from "../../components/DarkModeContext"
import { Users } from "lucide-react"

const AttendeeFullPage: React.FC = () => {
    const { darkMode } = useDarkMode()

    return (
        <div className={darkMode ? "dark" : ""}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 flex items-center justify-center">
                <div className="max-w-md w-full mx-auto p-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-center mb-6">
                            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4">
                                <Users className="h-12 w-12 text-red-500" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold mb-4">대기열이 가득 찼습니다</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm sm:text-base leading-relaxed text-center space-y-2">
                            죄송합니다. 현재 대기열에 더 이상 참여할 수 없습니다.
                            <br className="hidden sm:block" />
                            나중에 다시 시도하거나 관리자에게 문의해주세요.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AttendeeFullPage
