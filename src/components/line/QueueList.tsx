import React from 'react';
import { Plus } from 'lucide-react';
import QueueItem from './QueueItem';
import AddAttendeeForm from './AddAttendeeForm';
import { Queue, QueueStatus } from '../types';

interface QueueListProps {
    queues: Queue[];
    showAddForm: boolean;
    onStatusChange: (queueId: number, status: QueueStatus) => void;
    onRemoveQueue: (queueId: number) => void;
    onShowAddForm: () => void;
    onAddAttendee: (phone: string, info: string) => void;
    onCancelAdd: () => void;
}

const QueueList: React.FC<QueueListProps> = ({
    queues,
    showAddForm,
    onStatusChange,
    onRemoveQueue,
    onShowAddForm,
    onAddAttendee,
    onCancelAdd
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">대기열 관리</h2>

            {queues && queues.length > 0 ? (
                <div className="space-y-3 mb-6">
                    {queues.map((queue) => (
                        <QueueItem
                            key={queue.id}
                            queue={queue}
                            onStatusChange={onStatusChange}
                            onRemove={onRemoveQueue}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 dark:text-gray-400 mb-6">아직 대기열이 없습니다.</p>
            )}

            {showAddForm ? (
                <AddAttendeeForm
                    onAdd={onAddAttendee}
                    onCancel={onCancelAdd}
                />
            ) : (
                <button
                    onClick={onShowAddForm}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    <Plus size={16} className="mr-1" />
                    새 손님 추가
                </button>
            )}
        </div>
    );
};

export default QueueList;