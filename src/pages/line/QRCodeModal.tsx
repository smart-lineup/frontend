"use client"

import type React from "react"
import { QRCodeSVG } from "qrcode.react"
import { Clipboard } from "lucide-react"

interface QRCodeModalProps {
  shareUrl: string
  onClose: () => void
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ shareUrl, onClose }) => {
  return (
    <div className="mb-6 p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md flex flex-col items-center animate-fadeIn">
      <QRCodeSVG value={shareUrl} size={200} />
      <div className="mt-4 flex items-center gap-2 w-full max-w-md">
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="flex-1 p-2 border rounded-md text-sm bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 dark:border-gray-600 overflow-hidden text-ellipsis"
        />
        <button
          onClick={() => {
            navigator.clipboard.writeText(shareUrl)
            alert("URL이 클립보드에 복사되었습니다.")
          }}
          className="p-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 flex-shrink-0"
        >
          <Clipboard size={16} />
        </button>
      </div>
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 text-sm"
      >
        닫기
      </button>
    </div>
  )
}

export default QRCodeModal
