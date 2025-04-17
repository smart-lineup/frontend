"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Check, X, CreditCard, ArrowRight, ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useDarkMode } from "../../components/DarkModeContext"
import { useAuth } from "../../components/AuthContext"
import { usePlanTypeInfo } from "../../components/payment/PlanTypeInfo"


const PricingPage: React.FC = () => {
    const { darkMode } = useDarkMode()
    const [isAnnual, setIsAnnual] = useState(true)
    const navigate = useNavigate()
    const { premiumPrice, annualSaving } = usePlanTypeInfo(isAnnual)
    const { isAuthenticated, authLoading } = useAuth()

    const paymentUrl = `/payment?plan=${isAnnual ? "annual" : "monthly"}`

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            alert("로그인이 필요합니다.")
            navigate("/login")
        }
    }, [authLoading, isAuthenticated])

    return (
        <div className={darkMode ? "dark" : ""}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                <div className="container mx-auto px-4 py-16">
                    <Link to="/" className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-8">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        홈으로 돌아가기
                    </Link>

                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">심플한 요금제, 명확한 가치</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            비즈니스 규모에 맞는 요금제를 선택하세요. 언제든지 업그레이드하거나 다운그레이드할 수 있습니다.
                        </p>

                        {/* 결제 주기 토글 */}
                        <div className="mt-8 inline-flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                            <button
                                onClick={() => setIsAnnual(false)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!isAnnual
                                    ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                                    : "text-gray-600 dark:text-gray-400"
                                    }`}
                            >
                                월간 결제
                            </button>
                            <button
                                onClick={() => setIsAnnual(true)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${isAnnual
                                    ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                                    : "text-gray-600 dark:text-gray-400"
                                    }`}
                            >
                                연간 결제
                                <span className="ml-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs px-2 py-0.5 rounded-full">
                                    {Math.round(annualSaving)}% 할인
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Free 요금제 */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md">
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-1">Free</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">소규모 비즈니스를 위한 기본 기능</p>
                                <div className="flex items-baseline mb-6">
                                    <span className="text-4xl font-bold">₩0</span>
                                    <span className="text-gray-500 dark:text-gray-400 ml-2">/ 무료</span>
                                </div>

                                <Link
                                    to={isAuthenticated ? "/" : "/signup"}
                                    className="block w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-center rounded-lg font-medium transition-colors duration-200"
                                >
                                    무료로 시작하기
                                </Link>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>최대 2개의 라인 관리</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>라인당 최대 20명의 대기자</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>기본 QR코드 생성</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>무제한 데이터 보관</span>
                                    </li>
                                    <li className="flex items-start text-gray-500 dark:text-gray-400">
                                        <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>엑셀 내보내기/가져오기</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Premium 요금제 */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border-2 border-blue-500 dark:border-blue-400 relative transition-all duration-200 hover:shadow-lg">
                            <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
                                인기
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-1">Premium</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">성장하는 비즈니스를 위한 고급 기능</p>
                                <div className="flex items-baseline mb-6">
                                    <span className="text-4xl font-bold">₩{premiumPrice.toLocaleString()}</span>
                                    <span className="text-gray-500 dark:text-gray-400 ml-2">/ {isAnnual ? "년" : "월"}</span>
                                </div>

                                <Link
                                    to={paymentUrl}
                                    className="block w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white text-center rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                                >
                                    <CreditCard className="mr-2 h-5 w-5" />
                                    지금 시작하기
                                </Link>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span className="font-medium">무제한 라인 관리</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>라인당 무제한 대기자</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>기본 QR코드 생성</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>무제한 데이터 보관</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>엑셀 내보내기/가져오기</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span>우선 지원 (24시간 이내 응답)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 기능 비교 테이블 */}
                    <div className="mt-16 max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold mb-8 text-center">요금제 상세 비교</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-gray-800">
                                        <th className="text-left p-4 border-b border-gray-200 dark:border-gray-700">기능</th>
                                        <th className="p-4 border-b border-gray-200 dark:border-gray-700 text-center">Free</th>
                                        <th className="p-4 border-b border-gray-200 dark:border-gray-700 text-center bg-blue-50 dark:bg-blue-900/20">
                                            Premium
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="p-4 border-b border-gray-200 dark:border-gray-700">라인 수</td>
                                        <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-center">2개</td>
                                        <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-center bg-blue-50 dark:bg-blue-900/10">
                                            무제한
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 border-b border-gray-200 dark:border-gray-700">라인당 대기자 수</td>
                                        <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-center">최대 20명</td>
                                        <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-center bg-blue-50 dark:bg-blue-900/10">
                                            무제한
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 border-b border-gray-200 dark:border-gray-700">데이터 보관 기간</td>
                                        <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-center">무제한</td>
                                        <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-center bg-blue-50 dark:bg-blue-900/10">
                                            무제한
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 border-b border-gray-200 dark:border-gray-700">엑셀 내보내기</td>
                                        <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-center">
                                            <X className="h-5 w-5 text-gray-400 inline" />
                                        </td>
                                        <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-center bg-blue-50 dark:bg-blue-900/10">
                                            <Check className="h-5 w-5 text-green-500 inline" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 border-b border-gray-200 dark:border-gray-700">엑셀 가져오기</td>
                                        <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-center">
                                            <X className="h-5 w-5 text-gray-400 inline" />
                                        </td>
                                        <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-center bg-blue-50 dark:bg-blue-900/10">
                                            <Check className="h-5 w-5 text-green-500 inline" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 border-b border-gray-200 dark:border-gray-700">QR코드 생성</td>
                                        <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-center">지원</td>
                                        <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-center bg-blue-50 dark:bg-blue-900/10">
                                            지원
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 border-b border-gray-200 dark:border-gray-700">고객 지원</td>
                                        <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-center"></td>
                                        <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-center bg-blue-50 dark:bg-blue-900/10">
                                            우선 지원
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* FAQ 섹션 */}
                    <div className="mt-16 max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold mb-8 text-center">자주 묻는 질문</h2>
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                                <h3 className="font-bold text-lg mb-2">요금제는 언제든지 변경할 수 있나요?</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    네, 언제든지 요금제를 업그레이드하거나 다운그레이드할 수 있습니다. 업그레이드는 즉시 적용되며,
                                    다운그레이드는 현재 결제 주기가 끝난 후 적용됩니다.
                                </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                                <h3 className="font-bold text-lg mb-2">환불 정책은 어떻게 되나요?</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    구매 후 다음날까지 언제든지 전액 환불이 가능합니다. 예를 들어, 4월 4일에 결제하셨다면 4월 5일 23시
                                    59분까지 환불 요청이 가능합니다. 환불은 단순 변심의 경우에도 문제없이 처리해드립니다.
                                </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                                <h3 className="font-bold text-lg mb-2">
                                    Free 요금제에서 Premium으로 업그레이드하면 데이터가 유지되나요?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    네, 모든 데이터는 그대로 유지됩니다. 업그레이드 후에는 더 많은 기능과 용량을 사용할 수 있게 됩니다.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA 섹션 */}
                    <div className="mt-16 text-center">
                        <h2 className="text-2xl font-bold mb-4">지금 바로 시작하세요</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                            Smart Line Up으로 대기열 관리를 더 효율적으로 만들어보세요. 질문이 있으시면 언제든지 문의해 주세요.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to={isAuthenticated ? "/" : "/signup"}
                                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
                            >
                                무료로 시작하기
                            </Link>
                            <Link
                                to={paymentUrl}
                                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                            >
                                Premium 가입하기
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PricingPage

