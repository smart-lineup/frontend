"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDarkMode } from "../../components/DarkModeContext"
import {
    User,
    CreditCard,
    ArrowLeft,
    Save,
    Loader2,
    SettingsIcon,
    Calendar,
    CheckCircle,
    XCircle,
    RefreshCw,
    AlertTriangle,
} from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import config from "../../config"
import PaymentModal from "../payment/PaymentModal"
import CardShape from "../../components/payment/CardShape"
import { BillingStatus, SubscriptionInfo } from "../../components/types"
import { useAuth } from "../../components/AuthContext"
import { usePlanTypeInfo } from "../../components/payment/PlanTypeInfo"

interface UserProfile {
    username: string
    email: string
}

type SettingsTab = "profile" | "subscription"

const SettingsPage: React.FC = () => {
    const { darkMode } = useDarkMode()
    const navigate = useNavigate()
    const location = useLocation()
    const [activeTab, setActiveTab] = useState<SettingsTab>("profile")
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [newUsername, setNewUsername] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null)
    const [paymentHistory, setPaymentHistory] = useState<any[]>([])
    const [isProcessing, setIsProcessing] = useState(false)

    const { username, email, isAuthenticated, authLoading } = useAuth()
    const { data: planTypeInfo } = usePlanTypeInfo(true)

    useEffect(() => {
        setIsLoading(true)
        if (!authLoading && !isAuthenticated) {
            alert("로그인이 필요합니다.")
            navigate("/")
            setIsLoading(false)
        }

        if (!authLoading && isAuthenticated) {
            setProfile({ username: username ?? "", email: email ?? "" })
            setNewUsername(username ?? "")
            setIsLoading(false)
        }
    }, [authLoading, isAuthenticated])

    // 모달 상태
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "warning" as "success" | "error" | "warning" | "info",
        action: "" as "cancel" | "change" | "refund" | "",
    })

    // 알림 모달 상태
    const [alertModal, setAlertModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "info" as "success" | "error" | "warning" | "info",
    })

    // URL 쿼리 파라미터에서 탭 정보 가져오기
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search)
        const tab = searchParams.get("tab")
        if (tab === "subscription") {
            setActiveTab("subscription")
        } else {
            setActiveTab("profile")
        }
    }, [location])

    // 탭 변경 함수
    const handleTabChange = (tab: SettingsTab) => {
        setActiveTab(tab)
        navigate(`/settings?tab=${tab}`)
    }

    // 사용자 프로필 정보 가져오기
    useEffect(() => {
        const fetchUserProfile = async () => {
            setIsLoading(true)
            try {
                const subscriptionResponse = await axios.get(`${config.backend}/payment/info`, {
                    withCredentials: true,
                })
                setSubscriptionInfo(subscriptionResponse.data)

                const historyResponse = await axios.get(`${config.backend}/payment/history`, {
                    withCredentials: true,
                })
                setPaymentHistory(historyResponse.data || [])
            } catch (error) {
                console.error("구독 정보를 가져오는데 실패했습니다:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserProfile()
    }, [])

    // 사용자 이름 변경 처리
    const handleUpdateUsername = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!newUsername.trim()) {
            setAlertModal({
                isOpen: true,
                title: "알림",
                message: "사용자 이름을 입력해주세요.",
                type: "warning",
            })
            return
        }

        try {
            setIsSaving(true)
            await axios.put(
                `${config.backend}/user/profile`,
                {
                    name: newUsername,
                },
                {
                    withCredentials: true,
                },
            )

            setAlertModal({
                isOpen: true,
                title: "성공",
                message: "사용자 이름이 성공적으로 변경되었습니다.",
                type: "success",
            })

            // 프로필 정보 업데이트
            setProfile((prev) => (prev ? { ...prev, username: newUsername } : null))
        } catch (error) {
            console.error("사용자 이름 변경에 실패했습니다:", error)
            setAlertModal({
                isOpen: true,
                title: "오류",
                message: "사용자 이름 변경에 실패했습니다. 다시 시도해주세요.",
                type: "error",
            })
        } finally {
            setIsSaving(false)
        }
    }

    // 환불 가능 여부 확인
    const isRefundable = () => {
        if (!subscriptionInfo?.isRefundable) return false
        return true
    }

    // 환불 처리
    const handleRefund = async () => {
        try {
            setIsProcessing(true)
            await axios.post(
                `${config.backend}/payment/refund`,
                {},
                {
                    withCredentials: true,
                },
            )

            setAlertModal({
                isOpen: true,
                title: "환불 신청 완료",
                message: "환불이 성공적으로 신청되었습니다. 결제 수단에 따라 환불 처리에 3-5일이 소요될 수 있습니다.",
                type: "success",
            })

            // 구독 정보 업데이트 (환불 후에는 구독이 없는 상태로)
            setSubscriptionInfo((prev) => (prev ? { ...prev, isSubscribe: false } : null))
        } catch (error) {
            console.error("환불 처리에 실패했습니다:", error)
            setAlertModal({
                isOpen: true,
                title: "오류",
                message: "환불 처리에 실패했습니다. 고객센터로 문의해주세요.",
                type: "error",
            })
        } finally {
            setIsProcessing(false)
            setConfirmModal((prev) => ({ ...prev, isOpen: false }))
        }
    }

    // 구독 취소 처리
    const handleCancelSubscription = async () => {
        try {
            setIsProcessing(true)
            await axios.put(
                `${config.backend}/payment/cancel`,
                {},
                {
                    withCredentials: true,
                },
            )

            // 구독 정보 업데이트
            setSubscriptionInfo((prev) => (prev ? { ...prev, status: BillingStatus.CANCEL } : null))

            setAlertModal({
                isOpen: true,
                title: "성공",
                message: "구독이 성공적으로 취소되었습니다. 현재 결제 기간이 끝나면 자동 갱신되지 않습니다.",
                type: "success",
            })
        } catch (error) {
            console.error("구독 취소에 실패했습니다:", error)
            setAlertModal({
                isOpen: true,
                title: "오류",
                message: "구독 취소에 실패했습니다. 다시 시도해주세요.",
                type: "error",
            })
        } finally {
            setIsProcessing(false)
            setConfirmModal((prev) => ({ ...prev, isOpen: false }))
        }
    }

    // 구독 플랜 변경 처리
    const handleChangePlan = async () => {
        try {
            setIsProcessing(true)

            const newPlanType = subscriptionInfo?.planType === "ANNUAL" ? "MONTHLY" : "ANNUAL"

            await axios.put(
                `${config.backend}/payment/plan-type`,
                {
                    planType: newPlanType,
                },
                {
                    withCredentials: true,
                },
            )

            // 구독 정보 업데이트
            setSubscriptionInfo((prev) => (prev ? { ...prev, planType: newPlanType } : null))

            setAlertModal({
                isOpen: true,
                title: "성공",
                message: `구독 플랜이 ${newPlanType === "ANNUAL" ? "연간" : "월간"} 요금제로 변경되었습니다.`,
                type: "success",
            })
        } catch (error) {
            console.error("구독 플랜 변경에 실패했습니다:", error)
            setAlertModal({
                isOpen: true,
                title: "오류",
                message: "구독 플랜 변경에 실패했습니다. 다시 시도해주세요.",
                type: "error",
            })
        } finally {
            setIsProcessing(false)
            setConfirmModal((prev) => ({ ...prev, isOpen: false }))
        }
    }

    // 모달 확인 버튼 처리
    const handleConfirmAction = () => {
        if (confirmModal.action === "cancel") {
            handleCancelSubscription()
        } else if (confirmModal.action === "change") {
            handleChangePlan()
        } else if (confirmModal.action === "refund") {
            handleRefund()
        }
    }

    // 알림 모달 닫기
    const closeAlertModal = () => {
        setAlertModal((prev) => ({ ...prev, isOpen: false }))
    }

    // 확인 모달 닫기
    const closeConfirmModal = () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }))
    }

    // 프로필 정보 컨텐츠
    const renderProfileContent = () => {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-500" />
                    프로필 정보
                </h2>

                <form onSubmit={handleUpdateUsername} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            사용자 이름
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="사용자 이름"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">이메일</label>
                        <input
                            type="email"
                            value={profile?.email || ""}
                            readOnly
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white cursor-not-allowed"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">이메일은 변경할 수 없습니다.</p>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`px-4 py-2 ${isSaving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                                } text-white rounded-md flex items-center`}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    저장 중...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    변경사항 저장
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        )
    }

    // 구독 상태 표시
    const renderSubscriptionStatus = () => {
        if (!subscriptionInfo) return null

        if (!subscriptionInfo.isExist) {
            return (
                <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-center">
                    <p className="text-lg font-medium mb-4">등록된 결제 수단이 없습니다</p>
                    <Link
                        to="/payment"
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md inline-flex items-center"
                    >
                        <CreditCard className="h-4 w-4 mr-2" />
                        결제 수단 등록하기
                    </Link>
                </div>
            )
        }

        if (!subscriptionInfo.isSubscribe) {
            return (
                <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                        <XCircle className="h-6 w-6 text-gray-500 mr-2" />
                        <h3 className="text-lg font-medium">활성화된 구독이 없습니다</h3>
                    </div>

                    <div className="mb-4">
                        <CardShape
                            cardLastNumber={subscriptionInfo.cardLastNumber}
                            username={profile?.username ? profile.username : ""}
                        />
                    </div>

                    <div className="text-center">
                        <Link
                            to="/pricing"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md inline-flex items-center"
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            구독 시작하기
                        </Link>
                    </div>
                </div>
            )
        }

        const isActive = subscriptionInfo.status === BillingStatus.ACTIVE && subscriptionInfo.nextPaymentDate
        const planType = subscriptionInfo.planType === "ANNUAL" ? "연간" : "월간"
        const endDate = new Date(subscriptionInfo.endAt).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })

        return (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                    {isActive ? (
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                    ) : (
                        <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
                    )}
                    <h3 className="text-lg font-medium">
                        {planType} 구독 {isActive ? "(활성)" : "(취소됨)"}
                    </h3>
                </div>

                <div className="mb-6">
                    <CardShape
                        cardLastNumber={subscriptionInfo.cardLastNumber}
                        username={profile?.username ? profile.username : ""}
                    />
                </div>

                <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                            <span>현재 결제 기간 종료일</span>
                        </div>
                        <span className="font-medium">{endDate}</span>
                    </div>

                    {isActive && subscriptionInfo.nextPaymentDate && (
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                            <div className="flex items-center">
                                <RefreshCw className="h-5 w-5 text-gray-500 mr-2" />
                                <span>다음 결제 예정일</span>
                            </div>
                            <span className="font-medium">
                                {new Date(subscriptionInfo.nextPaymentDate).toLocaleDateString("ko-KR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <div className="flex items-center">
                            <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                            <span>결제 예정 금액</span>
                        </div>
                        <span className="font-medium">{planType === "연간" ? `₩${planTypeInfo?.annual.price.toLocaleString()}/연` : `₩${planTypeInfo?.monthly.price.toLocaleString()}/월`}</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {isActive && (
                        <>
                            {isRefundable() && (
                                <button
                                    onClick={() =>
                                        setConfirmModal({
                                            isOpen: true,
                                            title: "환불 신청",
                                            message: "정말로 환불을 신청하시겠습니까? 환불 처리 후에는 서비스 이용이 즉시 중단됩니다.",
                                            type: "warning",
                                            action: "refund",
                                        })
                                    }
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md flex items-center justify-center"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    환불 신청
                                </button>
                            )}

                            <button
                                onClick={() =>
                                    setConfirmModal({
                                        isOpen: true,
                                        title: "구독 취소",
                                        message: "정말로 구독을 취소하시겠습니까? 현재 결제 기간이 끝나면 더 이상 자동 갱신되지 않습니다.",
                                        type: "warning",
                                        action: "cancel",
                                    })
                                }
                                disabled={isProcessing}
                                className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md flex items-center justify-center"
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                구독 취소
                            </button>

                            <button
                                onClick={() =>
                                    setConfirmModal({
                                        isOpen: true,
                                        title: "구독 플랜 변경",
                                        message: `${planType === "연간" ? "월간" : "연간"} 요금제로 변경하시겠습니까? 다음 결제 시점부터 적용됩니다.`,
                                        type: "warning",
                                        action: "change",
                                    })
                                }
                                disabled={isProcessing}
                                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                {planType === "연간" ? "월간으로 변경" : "연간으로 변경"}
                            </button>
                        </>
                    )}

                    {!isActive && (
                        <Link
                            to="/pricing"
                            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center"
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            구독 다시 시작하기
                        </Link>
                    )}
                </div>
                {isActive && (
                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <p className="font-medium mb-1">환불 정책 안내</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>구매일 다음날 자정까지만 환불이 가능합니다.</li>
                            <li>환불 시 즉시 서비스 이용이 중단됩니다.</li>
                            <li>결제 수단에 따라 환불 처리에 3-5일이 소요될 수 있습니다.</li>
                            <li>환불 관련 문의는 고객센터(pkt0758@gmail.com)로 연락해주세요.</li>
                        </ul>
                    </div>
                )}
            </div>
        )
    }

    // 구독 정보 컨텐츠
    const renderSubscriptionContent = () => {
        return (
            <div className="space-y-8">
                {/* 구독 상태 섹션 */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-blue-500" />
                        구독 정보
                    </h2>
                    {renderSubscriptionStatus()}
                </div>

                {/* 결제 내역 섹션 */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">결제 내역</h2>

                    {paymentHistory.length > 0 ? (
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium">날짜</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">금액</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">상태</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium">결제 방법</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {paymentHistory.map((payment, index) => (
                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                                                <td className="px-4 py-3 text-sm">{new Date(payment.createdAt).toLocaleDateString("ko-KR")}</td>
                                                <td className="px-4 py-3 text-sm">₩{payment.amount.toLocaleString()}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs ${payment.status === "PAID"
                                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                                : payment.status === "REFUND"
                                                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                                            }`}
                                                    >
                                                        {payment.status === "PAID" ? "결제 완료" : payment.status === "REFUND" ? "환불" : "실패"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">{payment.method === "CARD" ? "카드" : payment.method}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg text-center">
                            <p className="text-gray-500 dark:text-gray-400">결제 내역이 없습니다.</p>
                        </div>
                    )}
                </div>

                {/* 결제 방법 섹션 */}
                {subscriptionInfo?.isExist && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">결제 방법</h2>
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg">
                            <div className="text-center">
                                <Link
                                    to="/payment"
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md inline-flex items-center"
                                >
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    결제 방법 변경
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className={darkMode ? "dark" : ""}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                <div className="container mx-auto px-4 py-12">
                    <Link to="/" className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-8">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        홈으로 돌아가기
                    </Link>

                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center mb-8">
                            <SettingsIcon className="h-6 w-6 mr-2 text-blue-500" />
                            <h1 className="text-2xl font-bold">계정 설정</h1>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            {/* 사이드바 */}
                            <div className="w-full md:w-64 flex-shrink-0">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sticky top-4">
                                    <h2 className="text-lg font-semibold mb-4 px-2">설정</h2>
                                    <nav className="space-y-1">
                                        <button
                                            onClick={() => handleTabChange("profile")}
                                            className={`w-full flex items-center px-2 py-2 rounded-md transition-colors ${activeTab === "profile"
                                                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            <User
                                                className={`h-5 w-5 mr-2 ${activeTab === "profile" ? "text-blue-500" : "text-gray-500 dark:text-gray-400"
                                                    }`}
                                            />
                                            <span>유저 정보</span>
                                        </button>

                                        <button
                                            onClick={() => handleTabChange("subscription")}
                                            className={`w-full flex items-center px-2 py-2 rounded-md transition-colors ${activeTab === "subscription"
                                                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            <CreditCard
                                                className={`h-5 w-5 mr-2 ${activeTab === "subscription" ? "text-blue-500" : "text-gray-500 dark:text-gray-400"
                                                    }`}
                                            />
                                            <span>구독 정보</span>
                                        </button>
                                    </nav>
                                </div>
                            </div>

                            {/* 메인 컨텐츠 */}
                            <div className="flex-1">
                                {isLoading ? (
                                    <div className="flex justify-center items-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                    </div>
                                ) : (
                                    <>
                                        {activeTab === "profile" && renderProfileContent()}
                                        {activeTab === "subscription" && renderSubscriptionContent()}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 알림 모달 */}
            <PaymentModal
                isOpen={alertModal.isOpen}
                onClose={closeAlertModal}
                title={alertModal.title}
                message={alertModal.message}
                type={alertModal.type}
                confirmText="확인"
                onConfirm={closeAlertModal}
            />

            {/* 확인 모달 */}
            <PaymentModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                confirmText={isProcessing ? "처리 중..." : "확인"}
                cancelText="취소"
                onConfirm={handleConfirmAction}
                showCancel={true}
            />
        </div>
    )
}

export default SettingsPage

