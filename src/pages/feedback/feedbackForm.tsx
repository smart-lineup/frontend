"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "../../components/AuthContext"
import { useNavigate } from "react-router-dom"
import { CheckCircle } from "lucide-react"
import axios from "axios"
import config from "../../config"

export default function FeedbackForm() {
    const { isAuthenticated, isPremium } = useAuth()
    const navigate = useNavigate()
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isAuthenticated) {
            navigate("/login")
            return
        }

        if (!title.trim() || !content.trim()) {
            setError("제목과 내용을 모두 입력해주세요.")
            return
        }

        setIsSubmitting(true)
        setError("")

        try {
            await axios.post(
                `${config.backend}/user/feedback`,
                {
                    title,
                    content,
                    isPremium,
                },
                { withCredentials: true },
            )

            setIsSuccess(true)
            setTitle("")
            setContent("")

            // 3초 후 성공 메시지 숨기기
            setTimeout(() => {
                setIsSuccess(false)
            }, 3000)
        } catch (err) {
            console.error("피드백 제출 오류:", err)
            setError("피드백 제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">프리미엄 사용자 여부</label>
                </div>

                {isPremium ? (
                    <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                        프리미엄 사용자로 건의됩니다.
                    </div>
                ) : (
                    <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                        일반 사용자로 건의됩니다.
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    제목
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="건의사항의 제목을 입력해주세요"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    내용
                </label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="건의사항의 내용을 자세히 작성해주세요"
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                />
            </div>

            {error && <div className="text-red-500 text-sm py-2 px-3 bg-red-50 dark:bg-red-900/20 rounded-md">{error}</div>}

            {isSuccess && (
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm py-2 px-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    건의사항이 성공적으로 제출되었습니다. 소중한 의견 감사합니다!
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
                >
                    {isSubmitting ? (
                        <span className="flex items-center">
                            <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            제출 중...
                        </span>
                    ) : (
                        "건의하기"
                    )}
                </button>
            </div>
        </form>
    )
}
