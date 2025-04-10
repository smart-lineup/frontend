"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, CheckCircle, Users, Clock, BarChart3, Shield, ChevronRight } from "lucide-react"
import Navbar from "../components/Navbar"
import { useDarkMode } from "../components/DarkModeContext"
import linePageImage from "../assets/images/line-page.png"

export default function HomePage() {
    const { darkMode } = useDarkMode()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        navigate(`/signup?email=${encodeURIComponent(email)}`)
    }

    const handleGetStarted = () => {
        navigate("/signup")
    }

    return (
        <div className={darkMode ? "dark" : ""}>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <Navbar />

                {/* Hero Section */}
                <section className="relative overflow-hidden py-20 md:py-32">
                    {/* Background elements */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950 z-0"></div>
                    <div className="absolute top-20 right-10 w-64 h-64 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-40 left-20 w-72 h-72 bg-sky-300 dark:bg-sky-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-20 right-40 w-72 h-72 bg-cyan-300 dark:bg-cyan-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

                    {/* Content */}
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                            <div
                                className={`lg:w-1/2 transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
                            >
                                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 dark:from-blue-400 dark:via-sky-400 dark:to-cyan-400">
                                        대기열 관리의 혁신
                                    </span>
                                </h1>
                                <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8">
                                    Smart Line Up으로 고객 경험을 향상시키고 비즈니스 효율성을 극대화하세요. 실시간 대기열 관리의 새로운
                                    기준을 경험하세요.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={handleGetStarted}
                                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white rounded-xl font-medium text-lg transition-all duration-200 flex items-center justify-center shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20"
                                    >
                                        지금 시작하기
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </button>
                                    <a
                                        href="#features"
                                        className="px-8 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium text-lg transition-colors duration-200 flex items-center justify-center"
                                    >
                                        더 알아보기
                                        <ChevronRight className="ml-1 h-5 w-5" />
                                    </a>
                                </div>
                            </div>
                            <div
                                className={`lg:w-1/2 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
                            >
                                <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-sky-600 rounded-2xl blur-lg opacity-30"></div>
                                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                                        <img
                                            src={linePageImage}
                                            alt="Smart Line Up 대시보드"
                                            className="w-full h-auto"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div className="p-6">
                                <p className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-600 dark:from-blue-400 dark:to-sky-400">
                                    1+
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">비즈니스 사용자</p>
                            </div>
                            <div className="p-6">
                                <p className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-600 dark:from-blue-400 dark:to-sky-400">
                                    1+
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">월간 대기열</p>
                            </div>
                            <div className="p-6">
                                <p className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-600 dark:from-blue-400 dark:to-sky-400">
                                    10%
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">대기 시간 감소</p>
                            </div>
                            <div className="p-6">
                                <p className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-600 dark:from-blue-400 dark:to-sky-400">
                                    99%
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">고객 만족도</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-600 dark:from-blue-400 dark:to-sky-400">
                                    강력한 기능
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                                Smart Line Up은 비즈니스 요구에 맞는 다양한 기능을 제공합니다.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 transition-transform duration-300 hover:-translate-y-2">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20">
                                    <Users className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">실시간 대기열 관리</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    고객 대기열을 실시간으로 관리하고 상태를 추적하세요. 대기 시간을 최소화하고 고객 만족도를 높이세요.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 transition-transform duration-300 hover:-translate-y-2">
                                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-sky-500/20 dark:shadow-sky-900/20">
                                    <Clock className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">자동화된 알림</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    고객에게 자동으로 대기 상태 알림을 보내세요. 고객은 언제든지 자신의 순서를 확인할 수 있습니다.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 transition-transform duration-300 hover:-translate-y-2">
                                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20 dark:shadow-cyan-900/20">
                                    <BarChart3 className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">고급 분석</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    대기열 데이터를 분석하여 비즈니스 인사이트를 얻으세요. 피크 시간을 파악하고 서비스를 최적화하세요.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 transition-transform duration-300 hover:-translate-y-2">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">데이터 보안</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    고객 데이터는 안전하게 보호됩니다. 엄격한 보안 조치로 개인정보를 안전하게 관리합니다.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 transition-transform duration-300 hover:-translate-y-2">
                                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-sky-500/20 dark:shadow-sky-900/20">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3">모바일 최적화</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    모든 디바이스에서 완벽하게 작동합니다. 고객은 모바일에서도 쉽게 대기열에 참여할 수 있습니다.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 transition-transform duration-300 hover:-translate-y-2">
                                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20 dark:shadow-cyan-900/20">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3">커스터마이징</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    비즈니스 요구에 맞게 대기열을 커스터마이징하세요. 다양한 설정 옵션을 제공합니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Use Cases Section */}
                <section className="py-20 bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-600 dark:from-blue-400 dark:to-sky-400">
                                    다양한 비즈니스에 적합
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                                Smart Line Up은 다양한 산업 분야에서 활용할 수 있습니다.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-sky-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                                <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
                                    <img
                                        src="/placeholder.svg?height=200&width=400"
                                        alt="레스토랑"
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2">레스토랑</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            고객 대기열을 효율적으로 관리하고 테이블 회전율을 높이세요.
                                        </p>
                                        <a
                                            href="#"
                                            className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center"
                                        >
                                            자세히 보기
                                            <ChevronRight className="ml-1 h-4 w-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-sky-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                                <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
                                    <img src="/placeholder.svg?height=200&width=400" alt="병원" className="w-full h-48 object-cover" />
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2">병원 및 클리닉</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            환자 대기 시간을 줄이고 의료 서비스 효율성을 높이세요.
                                        </p>
                                        <a
                                            href="#"
                                            className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center"
                                        >
                                            자세히 보기
                                            <ChevronRight className="ml-1 h-4 w-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-sky-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                                <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
                                    <img src="/placeholder.svg?height=200&width=400" alt="소매점" className="w-full h-48 object-cover" />
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2">소매점</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            고객 흐름을 최적화하고 쇼핑 경험을 향상시키세요.
                                        </p>
                                        <a
                                            href="#"
                                            className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center"
                                        >
                                            자세히 보기
                                            <ChevronRight className="ml-1 h-4 w-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="py-20 bg-gray-50 dark:bg-gray-800">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-600 dark:from-blue-400 dark:to-sky-400">
                                    심플한 요금제
                                </span>
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                                비즈니스 규모에 맞는 요금제를 선택하세요.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold mb-2">Free</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">소규모 비즈니스를 위한 기본 기능</p>
                                    <div className="flex items-baseline mb-6">
                                        <span className="text-5xl font-bold">₩0</span>
                                        <span className="text-gray-500 dark:text-gray-400 ml-2">/ 무료</span>
                                    </div>
                                    <button
                                        onClick={handleGetStarted}
                                        className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-medium transition-colors duration-200"
                                    >
                                        무료로 시작하기
                                    </button>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 p-8">
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                            <span>최대 2개의 라인 관리</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                            <span>라인당 최대 20명의 대기자</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                            <span>기본 QR코드 생성</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                            <span>7일간의 데이터 보관</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-sky-600 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                                    인기
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold mb-2">Premium</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">성장하는 비즈니스를 위한 고급 기능</p>
                                    <div className="flex items-baseline mb-6">
                                        <span className="text-5xl font-bold">₩9,900</span>
                                        <span className="text-gray-500 dark:text-gray-400 ml-2">/ 월</span>
                                    </div>
                                    <button
                                        onClick={() => navigate("/pricing")}
                                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20"
                                    >
                                        지금 시작하기
                                    </button>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 p-8">
                                    <ul className="space-y-4">
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                            <span className="font-medium">무제한 라인 관리</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                            <span>라인당 무제한 대기자</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                            <span>고급 QR코드 커스터마이징</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                            <span>무제한 데이터 보관</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                            <span>고급 엑셀 내보내기/가져오기</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                            <span>우선 지원 (24시간 이내 응답)</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-sky-700 dark:from-blue-800 dark:to-sky-900 z-0"></div>
                    <div className="absolute top-20 right-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute bottom-20 left-10 w-64 h-64 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

                    <div className="container mx-auto px-4  relative z-10">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">지금 바로 시작하세요</h2>
                            <p className="text-xl text-blue-100 mb-8">
                                Smart Line Up으로 대기열 관리를 더 효율적으로 만들어보세요. 질문이 있으시면 언제든지 문의해 주세요.
                            </p>
                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-8">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="이메일 주소를 입력하세요"
                                    className="flex-1 px-4 py-3 rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-white hover:bg-gray-100 text-blue-600 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center shadow-lg"
                                >
                                    무료로 시작하기
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </button>
                            </form>
                            <p className="text-blue-200 text-sm">가입 즉시 무료로 이용할 수 있으며, 언제든지 해지할 수 있습니다.</p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-white dark:bg-gray-900 py-12 border-t border-gray-200 dark:border-gray-800">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div>
                                <h3 className="text-lg font-bold mb-4">Smart Line Up</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    효율적인 대기열 관리 솔루션으로 비즈니스 성장을 돕습니다.
                                </p>
                                <div className="flex space-x-4">
                                    <a href="#" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                                        </svg>
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-4">제품</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                        >
                                            기능
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                        >
                                            요금제
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                        >
                                            FAQ
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-4">회사</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                        >
                                            소개
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                        >
                                            블로그
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                        >
                                            채용
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-4">지원</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                        >
                                            고객센터
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                        >
                                            문의하기
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                        >
                                            개인정보처리방침
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
                            <p>&copy; 2023 Smart Line Up. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
