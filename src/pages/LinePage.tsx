import React, { useState } from 'react';
import LineSidebar from '../components/line/LineSidebar';
import Navbar from '../components/Navbar';
import { useDarkMode } from '../components/DarkModeContext';
import LineView from '../components/line/LineView';
import EmptyState from '../components/line/EmptyState';
import { Line, Queue, QueueStatus } from '../components/types';

// Mock data
const mockLines: Line[] = [
    {
        id: 1,
        name: "제 1라인",
        queues: [
            {
                id: 101,
                attendee: { id: 1, phone: "010-1234-5678", info: JSON.stringify({ name: "김철수" }), createdAt: new Date().toISOString() },
                status: QueueStatus.WAITING,
                previous: null,
                next: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 102,
                attendee: { id: 2, phone: "010-8765-4321", info: JSON.stringify({ name: "이영희" }), createdAt: new Date().toISOString() },
                status: QueueStatus.ENTERED,
                previous: null,
                next: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ]
    },
    {
        id: 2,
        name: "제 2라인",
        queues: []
    }
];

const LinePage: React.FC = () => {
    const { darkMode } = useDarkMode();
    const [lines, setLines] = useState<Line[]>(mockLines);
    const [selectedLine, setSelectedLine] = useState<Line | null>(null);
    const [nextLineId, setNextLineId] = useState(3);
    const [nextQueueId, setNextQueueId] = useState(301);
    const [showAddAttendee, setShowAddAttendee] = useState(false);

    const handleAddLine = (name: string) => {
        const newLine = {
            id: nextLineId,
            name,
            queues: []
        };
        setLines([...lines, newLine]);
        setNextLineId(nextLineId + 1);
    };

    const handleDeleteLine = (id: number) => {
        setLines(lines.filter(line => line.id !== id));
        if (selectedLine?.id === id) {
            setSelectedLine(null);
        }
    };

    const handleSelectLine = (line: Line) => {
        setSelectedLine(line);
        setShowAddAttendee(false);
    };

    const handleAddAttendee = (phone: string, info: string) => {
        if (phone.trim() && selectedLine) {
            const now = new Date().toISOString();
            const newAttendee = {
                id: nextQueueId,
                phone: phone,
                info: info || JSON.stringify({ name: "손님" }),
                createdAt: now
            };

            const newQueue: Queue = {
                id: nextQueueId,
                attendee: newAttendee,
                status: QueueStatus.WAITING,
                previous: null,
                next: null,
                createdAt: now,
                updatedAt: now
            };

            const updatedLines = lines.map(line => {
                if (line.id === selectedLine.id) {
                    // Connect to previous queue if exists
                    let updatedQueues = [...line.queues];
                    if (updatedQueues.length > 0) {
                        const lastQueue = { ...updatedQueues[updatedQueues.length - 1] };
                        newQueue.previous = lastQueue;

                        // Update the last queue's next reference
                        updatedQueues[updatedQueues.length - 1] = {
                            ...lastQueue,
                            next: newQueue
                        };
                    }

                    return {
                        ...line,
                        queues: [...updatedQueues, newQueue]
                    };
                }
                return line;
            });

            setLines(updatedLines);
            setNextQueueId(nextQueueId + 1);
            setShowAddAttendee(false);

            // Update selected line with new queue
            const updatedLine = updatedLines.find(line => line.id === selectedLine.id);
            if (updatedLine) {
                setSelectedLine(updatedLine);
            }
        }
    };

    const handleStatusChange = (queueId: number, newStatus: QueueStatus) => {
        if (!selectedLine) return;

        const updatedLines = lines.map(line => {
            if (line.id === selectedLine.id) {
                const updatedQueues = line.queues.map(queue => {
                    if (queue.id === queueId) {
                        return {
                            ...queue,
                            status: newStatus,
                            updatedAt: new Date().toISOString()
                        };
                    }
                    return queue;
                });

                return {
                    ...line,
                    queues: updatedQueues
                };
            }
            return line;
        });

        setLines(updatedLines);
        const updatedLine = updatedLines.find(line => line.id === selectedLine.id);
        if (updatedLine) {
            setSelectedLine(updatedLine);
        }
    };

    const removeQueue = (queueId: number) => {
        if (!selectedLine) return;

        const updatedLines = lines.map(line => {
            if (line.id === selectedLine.id) {
                const queueIndex = line.queues.findIndex(q => q.id === queueId);
                if (queueIndex === -1) return line;

                const updatedQueues = [...line.queues];
                const removedQueue = updatedQueues[queueIndex];

                // Connect previous and next queues
                if (removedQueue.previous && removedQueue.next) {
                    // Find and update previous queue
                    const prevIndex = updatedQueues.findIndex(q => q.id === removedQueue.previous?.id);
                    if (prevIndex !== -1) {
                        updatedQueues[prevIndex] = {
                            ...updatedQueues[prevIndex],
                            next: removedQueue.next
                        };
                    }

                    // Find and update next queue
                    const nextIndex = updatedQueues.findIndex(q => q.id === removedQueue.next?.id);
                    if (nextIndex !== -1) {
                        updatedQueues[nextIndex] = {
                            ...updatedQueues[nextIndex],
                            previous: removedQueue.previous
                        };
                    }
                } else if (removedQueue.previous) {
                    // Only has previous, update previous queue
                    const prevIndex = updatedQueues.findIndex(q => q.id === removedQueue.previous?.id);
                    if (prevIndex !== -1) {
                        updatedQueues[prevIndex] = {
                            ...updatedQueues[prevIndex],
                            next: null
                        };
                    }
                } else if (removedQueue.next) {
                    // Only has next, update next queue
                    const nextIndex = updatedQueues.findIndex(q => q.id === removedQueue.next?.id);
                    if (nextIndex !== -1) {
                        updatedQueues[nextIndex] = {
                            ...updatedQueues[nextIndex],
                            previous: null
                        };
                    }
                }

                // Remove the queue
                updatedQueues.splice(queueIndex, 1);

                return {
                    ...line,
                    queues: updatedQueues
                };
            }
            return line;
        });

        setLines(updatedLines);
        const updatedLine = updatedLines.find(line => line.id === selectedLine.id);
        if (updatedLine) {
            setSelectedLine(updatedLine);
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'dark:bg-gray-900' : 'bg-gray-100'} transition-colors duration-200`}>
            <Navbar />

            <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
                <LineSidebar
                    lines={lines}
                    onAddLine={handleAddLine}
                    onDeleteLine={handleDeleteLine}
                    onSelectLine={handleSelectLine}
                    selectedLine={selectedLine}
                />

                <div className="flex-1 p-4 md:p-6 overflow-y-auto">
                    {selectedLine ? (
                        <LineView
                            line={selectedLine}
                            showAddAttendee={showAddAttendee}
                            onBack={() => setSelectedLine(null)}
                            onStatusChange={handleStatusChange}
                            onRemoveQueue={removeQueue}
                            onShowAddForm={() => setShowAddAttendee(true)}
                            onAddAttendee={handleAddAttendee}
                            onCancelAdd={() => {
                                setShowAddAttendee(false);
                            }}
                        />
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </div>
        </div>
    );
};

export default LinePage;