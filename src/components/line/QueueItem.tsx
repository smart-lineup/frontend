// 1. QueueItem.tsx - 개별 대기열 항목 컴포넌트
import React from 'react';
import { User, Clock } from 'lucide-react';
import { Queue, QueueStatus } from '../types';

interface QueueItemProps {
    queue: Queue;
    onStatusChange: (queueId: number, status: QueueStatus) => void;
    onRemove: (queueId: number) => void;
}

const QueueItem: React.FC<QueueItemProps> = ({ queue, onStatusChange, onRemove }) => {
    const formatPhoneNumber = (phone: string) => {
        return phone || '번호 없음';
    };

    const getAttendeeInfo = (infoJson: string) => {
        try {
            const info = JSON.parse(infoJson);
            return info.name || '이름 없음';
        } catch (e) {
            return '정보 없음';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusLabel = (status: QueueStatus) => {
        switch (status) {
            case QueueStatus.WAITING:
                return { text: '대기중', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
            case QueueStatus.ENTERED:
                return { text: '입장', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
            default:
                return { text: '알 수 없음', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' };
        }
    };

    const statusLabel = getStatusLabel(queue.status);

    return (
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-full p-2">
                        <User size={18} className="text-gray-700 dark:text-gray-300" />
                    </div>
                    <div className="flex flex-col dark:text-white">
                        <div className="font-medium">{getAttendeeInfo(queue.attendee.info)}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{formatPhoneNumber(queue.attendee.phone)}</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock size={16} />
                        {formatDate(queue.createdAt)}
                    </div>

                    <span className={`text-xs px-2 py-1 rounded-full ${statusLabel.color}`}>
                        {statusLabel.text}
                    </span>

                    <select
                        value={queue.status}
                        onChange={(e) => onStatusChange(queue.id, e.target.value as QueueStatus)}
                        className="text-sm border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 bg-white dark:bg-gray-700 dark:text-white"
                    >
                        <option value={QueueStatus.WAITING}>대기중</option>
                        <option value={QueueStatus.ENTERED}>입장</option>
                    </select>

                    <button
                        onClick={() => onRemove(queue.id)}
                        className="text-sm px-2 py-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                        삭제
                    </button>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 flex gap-4">
                <div>
                    이전: {queue.previous ? `#${queue.previous.id}` : '없음'}
                </div>
                <div>
                    다음: {queue.next ? `#${queue.next.id}` : '없음'}
                </div>
            </div>
        </div>
    );
};

export default QueueItem;