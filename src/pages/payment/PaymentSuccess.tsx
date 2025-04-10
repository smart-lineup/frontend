"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDarkMode } from "../../components/DarkModeContext"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

const PaymentSuccessPage: React.FC = () => {
  const { darkMode } = useDarkMode()
  const [countdown, setCountdown] = useState(15)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // 카운트다운이 끝나면 라인 관리 페이지로 리다이렉트
          window.location.href = "/line"
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

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

            <h1 className="text-2xl font-bold mb-2">결제가 완료되었습니다!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Smart Line Up Premium 요금제 가입을 환영합니다. 이제 모든 프리미엄 기능을 이용하실 수 있습니다.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <span className="font-medium">결제 확인 이메일이 발송되었습니다.</span>
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => (window.location.href = "/line")}
                className="block w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
              >
                라인 관리로 이동
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>

              <p className="text-sm text-gray-500 dark:text-gray-400">{countdown}초 후 자동으로 이동합니다...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccessPage

