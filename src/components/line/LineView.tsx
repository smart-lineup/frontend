import React, { useState } from 'react';
import { Line, Queue, QueueStatus } from '../types';

interface LineViewProps {
    line: Line;
    queues: Queue[];  // 변경: line.queues 대신 별도 props로 받음
    showAddAttendee: boolean;
    onBack: () => void;
    onStatusChange: (queueId: number, status: QueueStatus) => void;
    onRemoveQueue: (queueId: number) => void;
    onShowAddForm: () => void;
    onAddAttendee: (phone: string, info: string) => void;
    onCancelAdd: () => void;
}

const LineView: React.FC<LineViewProps> = ({
    line,
    queues,
    showAddAttendee,
    onBack,
    onStatusChange,
    onRemoveQueue,
    onShowAddForm,
    onAddAttendee,
    onCancelAdd
}) => {
    const [phone, setPhone] = useState('');
    const [info, setInfo] = useState(JSON.stringify({ name: '손님' }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddAttendee(phone, info);
        setPhone('');
        setInfo(JSON.stringify({ name: '손님' }));
    };

    const getStatusBadge = (status: QueueStatus) => {
        switch (status) {
            case QueueStatus.WAITING:
                return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">대기중</span>;
            case QueueStatus.ENTERED:
                return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">입장</span>;
            default:
                return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">알 수 없음</span>;
        }
    };

    const renderAttendeeInfo = (infoJson: string) => {
        try {
            const info = JSON.parse(infoJson);
            return Object.entries(info).map(([key, value]) => (
                <div key={key} className="text-sm">
                    <span className="font-medium">{key}: </span>
                    <span>{String(value)}</span>
                </div>
            ));
        } catch (e) {
            return <div className="text-sm text-red-500">Invalid JSON</div>;
        }
    };

    return (
        <div>
            <div className="flex items-center mb-6">
                <button
                    onClick={onBack}
                    className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold dark:text-white">{line.name}</h1>
            </div>

            {showAddAttendee ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                    <h2 className="text-lg font-semibold mb-4 dark:text-white">대기열에 추가하기</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-sm font-medium mb-1 dark:text-gray-300">전화번호</label>
                            <input
                                type="text"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="010-1234-5678"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="info" className="block text-sm font-medium mb-1 dark:text-gray-300">추가 정보 (JSON)</label>
                            <textarea
                                id="info"
                                value={info}
                                onChange={(e) => setInfo(e.target.value)}
                                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={onCancelAdd}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 dark:text-white"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                추가
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="mb-6">
                    <button
                        onClick={onShowAddForm}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        대기자 추가
                    </button>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-4 border-b dark:border-gray-700">
                    <h2 className="text-lg font-semibold dark:text-white">대기열 현황</h2>
                </div>
                {queues.length === 0 ? (
                    <div className="p-4 text-gray-500 dark:text-gray-400 text-center">
                        현재 대기열이 비어 있습니다.
                    </div>
                ) : (
                    <ul className="divide-y dark:divide-gray-700">
                        {queues.map((queue) => (
                            <li key={queue.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between">
                                <div className="flex-1 mb-2 sm:mb-0">
                                    <div className="flex items-center mb-1">
                                        {getStatusBadge(queue.status)}
                                        <span className="ml-2 font-medium dark:text-white">{queue.attendee.phone}</span>
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {renderAttendeeInfo(queue.attendee.info)}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        등록: {new Date(queue.createdAt).toLocaleString()}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    {queue.status === QueueStatus.WAITING ? (
                                        <button
                                            onClick={() => onStatusChange(queue.id, QueueStatus.ENTERED)}
                                            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                                        >
                                            입장
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onStatusChange(queue.id, QueueStatus.WAITING)}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm"
                                        >
                                            완료
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onRemoveQueue(queue.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default LineView;