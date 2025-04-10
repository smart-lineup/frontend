"use client"

import type React from "react"
import { AlertCircle } from "lucide-react"

interface LimitModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  confirmText?: string
  showUpgrade?: boolean
  onUpgrade?: () => void
}

const LimitModal: React.FC<LimitModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  confirmText = "확인",
  showUpgrade = true,
  onUpgrade,
}) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm sm:max-w-md shadow-xl animate-fadeIn">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-3">
            <AlertCircle className="h-8 w-8 text-amber-500" />
          </div>
        </div>

        <h3 className="text-xl font-bold mb-4 text-center dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6 ">{message}</p>

        <div className={`${showUpgrade ? "flex gap-3" : ""}`}>
          <button
            onClick={onClose}
            className={`${showUpgrade ? "flex-1" : "w-full"} py-3 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center`}
          >
            {confirmText}
          </button>
          {showUpgrade && (
            <button
              onClick={onUpgrade}
              className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center text-sm sm:text-base text-center break-keep"
            >
              프리미엄으로 업그레이드
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default LimitModal
