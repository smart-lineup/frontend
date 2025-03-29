"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk"
import config from "../../config"

const generateRandomString = () => window.btoa(Math.random().toString()).slice(0, 20)

interface TossPaymentsWidgetProps {
  amount: number
  isAnnual: boolean
}

const TossPaymentsWidget: React.FC<TossPaymentsWidgetProps> = ({ amount, isAnnual }) => {
  const [ready, setReady] = useState<boolean>(false)
  const [widgets, setWidgets] = useState<any>(null)
  const [paymentAmount, setPaymentAmount] = useState({
    currency: "KRW",
    value: amount,
  })

  useEffect(() => {
    setPaymentAmount({
      currency: "KRW",
      value: amount,
    })
  }, [amount])

  useEffect(() => {
    async function fetchPaymentWidgets() {
      const tossPayments = await loadTossPayments(config.TOSS_CLIENT_KEY)
      const widgets = tossPayments.widgets({ customerKey: ANONYMOUS })
      setWidgets(widgets)
    }

    fetchPaymentWidgets()
  }, [])

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return
      }

      // 위젯의 결제금액을 결제하려는 금액으로 초기화
      await widgets.setAmount(paymentAmount)

      await Promise.all([
        // 결제창 렌더링
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        }),
        // 약관 렌더링
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ])

      setReady(true)
    }

    renderPaymentWidgets()
  }, [widgets, paymentAmount])

  const handlePayment = async () => {
    try {
      await widgets?.requestPayment({
        orderId: generateRandomString(),
        orderName: `Smart Line Up Premium ${isAnnual ? "연간" : "월간"} 구독`,
        customerName: "고객",
        successUrl: window.location.origin + "/payment/success",
        failUrl: window.location.origin + "/payment/fail",
      })
    } catch (error) {
      console.error("결제 요청 중 오류가 발생했습니다:", error)
    }
  }

  return (
    <div className="w-full">
      <div className="w-full">
        <div id="payment-method" className="w-full mb-4" />
        <div id="agreement" className="w-full mb-6" />
        <div className="w-full">
          <button
            disabled={!ready}
            onClick={handlePayment}
            className={`w-full py-3 px-4 ${!ready ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              } text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center`}
          >
            {!ready ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                준비 중...
              </>
            ) : (
              <>₩{paymentAmount.value.toLocaleString()} 결제하기</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TossPaymentsWidget

