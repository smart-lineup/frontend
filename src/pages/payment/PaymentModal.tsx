"use client"

import type React from "react"
import type { ReactNode } from "react"
import { CheckCircle, AlertCircle, XCircle, Info } from "lucide-react"

type ModalType = "success" | "error" | "warning" | "info"

interface PaymentModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    message: string
    type?: ModalType
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
    showCancel?: boolean
}

const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    type = "info",
    confirmText = "확인",
    cancelText = "취소",
    onConfirm,
    showCancel = false,
}) => {
    if (!isOpen) return null

    const getIcon = (): ReactNode => {
        switch (type) {
            case "success":
                return <CheckCircle className="h-8 w-8 text-green-500" />
            case "error":
                return <XCircle className="h-8 w-8 text-red-500" />
            case "warning":
                return <AlertCircle className="h-8 w-8 text-yellow-500" />
            case "info":
            default:
                return <Info className="h-8 w-8 text-blue-500" />
        }
    }

    const getBgColor = (): string => {
        switch (type) {
            case "success":
                return "bg-green-100 dark:bg-green-900/30"
            case "error":
                return "bg-red-100 dark:bg-red-900/30"
            case "warning":
                return "bg-yellow-100 dark:bg-yellow-900/30"
            case "info":
            default:
                return "bg-blue-100 dark:bg-blue-900/30"
        }
    }

    const getButtonColor = (): string => {
        switch (type) {
            case "success":
                return "bg-green-500 hover:bg-green-600"
            case "error":
                return "bg-red-500 hover:bg-red-600"
            case "warning":
                return "bg-yellow-500 hover:bg-yellow-600"
            case "info":
            default:
                return "bg-blue-500 hover:bg-blue-600"
        }
    }

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm()
        }
        onClose()
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm sm:max-w-md md:max-w-lg shadow-xl animate-fadeIn">
                <div className="flex justify-center mb-4">
                    <div className={`rounded-full ${getBgColor()} p-3`}>{getIcon()}</div>
                </div>

                <h3 className="text-xl font-bold mb-4 text-center dark:text-white">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{message}</p>

                <div className={`${showCancel ? "flex gap-3" : ""}`}>
                    {showCancel && (
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        onClick={handleConfirm}
                        className={`${showCancel ? "flex-1" : "w-full"} py-3 px-4 ${getButtonColor()} text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PaymentModal

