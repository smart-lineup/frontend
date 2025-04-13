"use client"

import type React from "react"

import { Link } from "react-router-dom"
import { useDarkMode } from "../../components/DarkModeContext"
import { Users, Home, ArrowLeft } from "lucide-react"

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
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            죄송합니다. 현재 대기열에 더 이상 참여할 수 없습니다. 나중에 다시 시도하거나 관리자에게 문의해주세요.
                        </p>

                        <div className="space-y-4">
                            <Link
                                to="/"
                                className="block w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                            >
                                <Home className="mr-2 h-5 w-5" />
                                홈으로 돌아가기
                            </Link>

                            <button
                                onClick={() => window.history.back()}
                                className="block w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                            >
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                이전 페이지로 돌아가기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AttendeeFullPage
