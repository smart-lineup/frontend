import type React from "react"
import { Users, ArrowRight } from "lucide-react"

const EmptyState: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center h-[400px]">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <Users size={28} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">라인을 선택해주세요</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                왼쪽 사이드바에서 관리할 라인을 선택하거나 새 라인을 추가해보세요.
            </p>
            <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                <span>왼쪽의 라인 목록 확인</span>
                <ArrowRight size={16} className="ml-1" />
            </div>
        </div>
    )
}

export default EmptyState

