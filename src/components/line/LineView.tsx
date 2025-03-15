import React from 'react';
import { ArrowLeft } from 'lucide-react';
import QueueList from './QueueList';
import { Line, QueueStatus } from '../types';

interface LineViewProps {
    line: Line;
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
    showAddAttendee,
    onBack,
    onStatusChange,
    onRemoveQueue,
    onShowAddForm,
    onAddAttendee,
    onCancelAdd
}) => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <button
                    className="md:hidden mr-3 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={onBack}
                >
                    <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
                <h1 className="text-xl md:text-2xl font-bold dark:text-white">{line.name}</h1>
            </div>

            <QueueList
                queues={line.queues}
                showAddForm={showAddAttendee}
                onStatusChange={onStatusChange}
                onRemoveQueue={onRemoveQueue}
                onShowAddForm={onShowAddForm}
                onAddAttendee={onAddAttendee}
                onCancelAdd={onCancelAdd}
            />
        </div>
    );
};

export default LineView;