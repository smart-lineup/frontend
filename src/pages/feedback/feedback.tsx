"use client"

import FeedbackForm from "./feedbackForm"
import { useDarkMode } from "../../components/DarkModeContext"
import Navbar from "../../components/Navbar"

export default function FeedbackPage() {
    const { darkMode } = useDarkMode()

    return (
        <div className={darkMode ? "dark" : ""}>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
                <Navbar />
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-600 dark:from-blue-400 dark:to-sky-400">
                            건의하기
                        </h1>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                서비스 개선을 위한 의견이나 건의사항을 자유롭게 작성해주세요. 여러분의 소중한 의견이 더 나은 서비스를
                                만드는 데 큰 도움이 됩니다.
                            </p>
                            <FeedbackForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
