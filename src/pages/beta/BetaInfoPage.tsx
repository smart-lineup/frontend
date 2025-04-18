"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { useDarkMode } from "../../components/DarkModeContext"
import { Beaker, ArrowLeft, CheckCircle } from "lucide-react"
import Navbar from "../../components/Navbar"

const BetaInfoPage: React.FC = () => {
    const { darkMode } = useDarkMode()

    return (
        <div className={darkMode ? "dark" : ""}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                <Navbar />

                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-3xl mx-auto">
                        <Link to="/" className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-8">
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            홈으로 돌아가기
                        </Link>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-center mb-6">
                                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
                                    <Beaker className="h-12 w-12 text-blue-500" />
                                </div>
                            </div>

                            <h1 className="text-2xl font-bold mb-6 text-center">베타테스트 진행 중</h1>

                            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <p className="text-blue-800 dark:text-blue-300">
                                    현재 Smart Line Up은 베타테스트 중입니다. <br />
                                    베타테스트 기간 동안에는 결제없이 이용할 수 있습니다.
                                </p>
                            </div>

                            <h2 className="text-xl font-semibold mb-4">베타테스트 혜택</h2>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>무제한 라인 관리</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>라인당 무제한 대기자</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>엑셀 내보내기/가져오기</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>무제한 데이터 보관</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>우선 지원 (24시간 이내 응답)</span>
                                </li>
                            </ul>

                            <h2 className="text-xl font-semibold mb-4">베타테스트 기간</h2>
                            <p className="mb-8 text-gray-600 dark:text-gray-400">
                                베타테스트는 2025년 5월 31일까지 진행될 예정입니다. <br />
                                베타테스트 종료 후에는 정식 서비스로 전환되며, 프리미엄 기능을 계속 이용하시려면 구독이 필요합니다.
                            </p>

                            <div className="text-center">
                                <Link
                                    to="/line"
                                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 inline-flex items-center"
                                >
                                    라인 관리 시작하기
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BetaInfoPage
