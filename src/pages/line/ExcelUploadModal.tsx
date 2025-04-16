"use client"

import type React from "react"
import { AlertCircle } from "lucide-react"

interface ExcelUploadModalProps {
    excelData: any[]
    isUploading: boolean
    onConfirm: () => void
    onCancel: () => void
}

const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({ excelData, isUploading, onConfirm, onCancel }) => {
    return (
        <div className="mb-6 p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md animate-fadeIn">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">엑셀 데이터 미리보기</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                같은 번호의 대기자의 경우 추가되지 않습니다.
            </p>
            {excelData.length > 0 ? (
                <>
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center">
                        <AlertCircle size={18} className="text-blue-500 mr-2" />
                        <span className="text-sm text-blue-700 dark:text-blue-300">
                            총 {excelData.length}명의 대기자를 추가합니다.
                        </span>
                    </div>

                    <div className="max-h-60 overflow-y-auto mb-4 border dark:border-gray-600 rounded-lg">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 dark:bg-gray-800">
                                <tr>
                                    <th className="px-4 py-2 text-left">이름</th>
                                    <th className="px-4 py-2 text-left">전화번호</th>
                                </tr>
                            </thead>
                            <tbody>
                                {excelData.slice(0, 10).map((item, index) => (
                                    <tr key={index} className="border-t dark:border-gray-700">
                                        <td className="px-4 py-2 truncate max-w-[150px]">{item.name}</td>
                                        <td className="px-4 py-2 truncate max-w-[150px]">{item.phone}</td>
                                    </tr>
                                ))}
                                {excelData.length > 10 && (
                                    <tr className="border-t dark:border-gray-700">
                                        <td colSpan={2} className="px-4 py-2 text-center text-gray-500">
                                            외 {excelData.length - 10}명...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            취소
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    처리 중...
                                </>
                            ) : (
                                "업로드 확인"
                            )}
                        </button>
                    </div>
                </>
            ) : (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                    <p>데이터를 불러오는 중입니다...</p>
                </div>
            )}
        </div>
    )
}

export default ExcelUploadModal
