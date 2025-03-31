"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDarkMode } from "../../components/DarkModeContext"
import { Check, ArrowLeft, CreditCardIcon, CheckCircle, CreditCard } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { loadTossPayments } from "@tosspayments/tosspayments-sdk"
import config from "../../config"
import axios from "axios"
import { useAuth } from "../../components/AuthContext"

interface UuidResponse {
    data: {
        uuid: string
    }
}

const PaymentPage: React.FC = () => {
    const { darkMode } = useDarkMode()
    const navigate = useNavigate()
    const [isAnnual, setIsAnnual] = useState(true)
    const [paymentMethod, setPaymentMethod] = useState<"toss" | "direct">("toss")
    const [isProcessing, setIsProcessing] = useState(false)
    const [tossPayment, setTossPayment] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const { username, email } = useAuth()
    const [showCardModal, setShowCardModal] = useState(false)
    const [cardModalLoading, setCardModalLoading] = useState(false)
    const [cardLastNumber, setCardLastNumber] = useState<string>("")

    // 월간/연간 가격 계산
    const annualPrice = 7900
    const monthlyPrice = 9900
    const premiumPrice = isAnnual ? annualPrice * 12 : monthlyPrice
    const annualSaving = ((monthlyPrice * 12 - annualPrice * 12) / (monthlyPrice * 12)) * 100

    // 토스페이먼츠 초기화
    useEffect(() => {
        async function initTossPayments() {
            try {
                const response: UuidResponse = await axios.get(config.backend + "/user/uuid", { withCredentials: true })
                setIsLoading(true)
                const tossPayments = await loadTossPayments(config.TOSS_CLIENT_KEY)
                const payment = tossPayments.payment({ customerKey: response.data.uuid })
                setTossPayment(payment)
            } catch (error) {
                console.error("토스페이먼츠 초기화 오류:", error)
            } finally {
                setIsLoading(false)
            }
        }

        initTossPayments()
    }, [])

    // 토스페이먼츠 빌링 요청
    const requestBillingAuth = async () => {
        if (!tossPayment) return

        try {
            setIsProcessing(true)
            await axios.post(
                config.backend + "/payment/info",
                {
                    price: isAnnual ? annualPrice : monthlyPrice,
                    planType: isAnnual ? "ANNUAL" : "MONTHLY",
                },
                {
                    withCredentials: true,
                },
            )

            const response = await axios.get(config.backend + "/payment/before/info", {
                withCredentials: true,
            })

            if (response.data.isExist == true) {
                // 기존 confirm 대신 모달 표시
                setIsProcessing(false)
                setCardLastNumber(response.data.cardLastNumber)
                setShowCardModal(true)
                return
            }

            // 기존 카드가 없는 경우 바로 카드 등록 진행
            await tossPayment.requestBillingAuth({
                method: "CARD", // 자동결제(빌링)는 카드만 지원합니다
                successUrl: window.location.origin + "/payment/success",
                failUrl: window.location.origin + "/payment/fail",
                customerEmail: email,
                customerName: username,
            })
        } catch (error) {
            console.error("빌링 요청 오류:", error)
            setIsProcessing(false)
        }
    }

    // 기존 카드로 결제하는 함수 추가
    const proceedWithExistingCard = async () => {
        try {
            setCardLastNumber("")
            setCardModalLoading(true)
            setTimeout(() => {
                navigate("/payment/success?customerKey=existing&authKey=existing")
            }, 1000)
        } catch (error) {
            console.error("기존 카드 결제 오류:", error)
            setCardModalLoading(false)
            setShowCardModal(false)
        }
    }

    // 새 카드 등록 진행 함수 추가
    const proceedWithNewCard = async () => {
        try {
            setCardModalLoading(true)
            setShowCardModal(false)

            // 약간의 지연 후 토스페이먼츠 결제창 열기
            setTimeout(async () => {
                try {
                    await tossPayment.requestBillingAuth({
                        method: "CARD",
                        successUrl: window.location.origin + "/payment/success",
                        failUrl: window.location.origin + "/payment/fail",
                        customerEmail: email,
                        customerName: username,
                    })
                } catch (error) {
                    console.error("빌링 요청 오류:", error)
                    setCardModalLoading(false)
                }
            }, 500)
        } catch (error) {
            console.error("새 카드 등록 오류:", error)
            setCardModalLoading(false)
        }
    }

    return (
        <div className={darkMode ? "dark" : ""}>
            {/* 카드 선택 모달 */}
            {showCardModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl animate-fadeIn">
                        <div className="flex justify-center mb-4">
                            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
                                <CreditCard className="h-8 w-8 text-blue-500" />
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-2 text-center dark:text-white">결제 방법 선택</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-center mb-3">기존에 등록된 카드로 결제하시겠습니까?</p>

                        <div className="mx-auto mb-6 max-w-[280px]">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 shadow-md text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mt-6 -mr-6"></div>
                                <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -mb-4 -ml-4"></div>

                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-xs font-light opacity-80">등록된 카드</div>
                                    <div className="flex items-center">
                                        <CreditCardIcon className="h-5 w-5 mr-1" />
                                    </div>
                                </div>

                                <div className="mb-6 flex items-center">
                                    <div className="mr-2 w-8 h-5 bg-white/20 rounded"></div>
                                    <div className="mr-2 w-8 h-5 bg-white/20 rounded"></div>
                                    <div className="mr-2 w-8 h-5 bg-white/20 rounded"></div>
                                    <div className="font-mono text-lg">{cardLastNumber}</div>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-xs opacity-70">카드 결제자</div>
                                        <div className="font-medium">{username || "사용자"}</div>
                                    </div>
                                    <div className="opacity-80">
                                        <svg width="40" height="12" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M17.9 0H3.1C1.4 0 0 1.4 0 3.1V11.9C0 13.6 1.4 15 3.1 15H17.9C19.6 15 21 13.6 21 11.9V3.1C21 1.4 19.6 0 17.9 0Z"
                                                fill="white"
                                            />
                                            <path
                                                d="M17.9 0H3.1C1.4 0 0 1.4 0 3.1V11.9C0 13.6 1.4 15 3.1 15H17.9C19.6 15 21 13.6 21 11.9V3.1C21 1.4 19.6 0 17.9 0Z"
                                                fill="white"
                                            />
                                            <path d="M8.3 12.9H12.7V2.1H8.3V12.9Z" fill="#FF5F00" />
                                            <path
                                                d="M8.7 7.5C8.7 5.3 9.8 3.3 11.5 2.1C10.4 1.2 9 0.7 7.5 0.7C3.9 0.7 1 3.7 1 7.5C1 11.3 3.9 14.3 7.5 14.3C9 14.3 10.4 13.8 11.5 12.9C9.8 11.7 8.7 9.7 8.7 7.5Z"
                                                fill="#EB001B"
                                            />
                                            <path
                                                d="M20 7.5C20 11.3 17.1 14.3 13.5 14.3C12 14.3 10.6 13.8 9.5 12.9C11.2 11.7 12.3 9.7 12.3 7.5C12.3 5.3 11.2 3.3 9.5 2.1C10.6 1.2 12 0.7 13.5 0.7C17.1 0.7 20 3.7 20 7.5Z"
                                                fill="#F79E1B"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={proceedWithExistingCard}
                                disabled={cardModalLoading}
                                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                            >
                                {cardModalLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <CheckCircle className="mr-2 h-5 w-5" />
                                        기존 카드로 결제하기
                                    </>
                                )}
                            </button>

                            <button
                                onClick={proceedWithNewCard}
                                disabled={cardModalLoading}
                                className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                            >
                                {cardModalLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 dark:border-gray-300"></div>
                                ) : (
                                    <>
                                        <CreditCardIcon className="mr-2 h-5 w-5" />새 카드 등록하기
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setShowCardModal(false)}
                                disabled={cardModalLoading}
                                className="w-full py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium transition-colors duration-200"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                <div className="container mx-auto px-4 py-12">
                    <Link to="/pricing" className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-8">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        요금제로 돌아가기
                    </Link>

                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-5 gap-8">
                            {/* 결제 폼 */}
                            <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                <h1 className="text-2xl font-bold mb-6">결제 정보</h1>

                                {/* 결제 주기 선택 */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2">결제 주기</label>
                                    <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setIsAnnual(false)}
                                            className={`flex-1 py-2 px-4 text-sm font-medium ${!isAnnual
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                                }`}
                                        >
                                            월간 결제
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsAnnual(true)}
                                            className={`flex-1 py-2 px-4 text-sm font-medium ${isAnnual
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                                }`}
                                        >
                                            연간 결제 ({Math.round(annualSaving)}% 할인)
                                        </button>
                                    </div>
                                </div>

                                {/* 결제 방식 선택 */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2">결제 방식</label>
                                    <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod("toss")}
                                            className={`flex-1 py-2 px-4 text-sm font-medium ${paymentMethod === "toss"
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                                }`}
                                        >
                                            토스페이먼츠
                                        </button>
                                    </div>
                                </div>

                                <div className="w-full">
                                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">정기결제 안내</h3>
                                        <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
                                            토스페이먼츠를 통해 안전하게 결제가 진행됩니다. '카드 등록하기' 버튼을 클릭하면 카드 등록 페이지로
                                            이동합니다.
                                        </p>
                                        <p className="text-sm text-blue-700 dark:text-blue-400">
                                            {isAnnual ? "연간 구독" : "월간 구독"}은 매 {isAnnual ? "년" : "월"} 자동으로 결제되며, 언제든지
                                            구독을 취소할 수 있습니다.
                                        </p>
                                    </div>

                                    <button
                                        onClick={requestBillingAuth}
                                        disabled={isLoading || isProcessing}
                                        className={`w-full py-3 px-4 ${isLoading || isProcessing ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                                            } text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                준비 중...
                                            </>
                                        ) : isProcessing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                처리 중...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCardIcon className="mr-2 h-5 w-5" />
                                                결제하기 (₩{premiumPrice.toLocaleString()}/{isAnnual ? "년" : "월"})
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* 주문 요약 */}
                            <div className="md:col-span-2">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 sticky top-6">
                                    <h2 className="text-lg font-bold mb-4">주문 요약</h2>

                                    <div className="border-t border-gray-200 dark:border-gray-700 py-4">
                                        <div className="flex justify-between mb-2">
                                            <span>Premium 요금제</span>
                                            <span>{isAnnual ? "연간" : "월간"}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg mb-4">
                                            <span>총 결제 금액</span>
                                            <span>₩{premiumPrice.toLocaleString()}</span>
                                        </div>
                                        {isAnnual && (
                                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-sm text-green-800 dark:text-green-300 mb-4">
                                                연간 결제로 {Math.round(annualSaving)}% 할인 받았습니다!
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3 mt-4">
                                        <h3 className="font-medium">Premium 요금제 포함 사항:</h3>
                                        <ul className="space-y-2">
                                            <li className="flex items-start">
                                                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                                <span>무제한 라인 관리</span>
                                            </li>
                                            <li className="flex items-start">
                                                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                                <span>라인당 무제한 대기자</span>
                                            </li>
                                            <li className="flex items-start">
                                                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                                <span>무제한 데이터 보관</span>
                                            </li>
                                            <li className="flex items-start">
                                                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                                <span>고급 통계 및 분석</span>
                                            </li>
                                            <li className="flex items-start">
                                                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                                <span>우선 지원</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentPage

