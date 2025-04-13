import { CheckCircle } from "lucide-react"

const AttendeeViewWithoutPosition: React.FC = () => {
    return (
        <div className="rounded-lg bg-green-100 p-6 text-green-800 dark:bg-green-900 dark:text-green-200">
            <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <p className="text-xl font-bold">신청이 완료되었습니다!</p>
            <p className="mt-2">대기열에 성공적으로 등록되었습니다.</p>
            <p className="mt-4 text-sm">입장 순서가 되면 안내해 드리겠습니다.</p>
        </div>
    )
}

export default AttendeeViewWithoutPosition
