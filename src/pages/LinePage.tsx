import React, { useState, useEffect } from 'react';
import LineSidebar from '../components/line/LineSidebar';
import Navbar from '../components/Navbar';
import { useDarkMode } from '../components/DarkModeContext';
import LineView from '../components/line/LineView';
import EmptyState from '../components/line/EmptyState';
import { Line, Queue, QueueStatus } from '../components/types';
import axios from 'axios';
import config from '../config';
import { QRCodeSVG } from 'qrcode.react';

const LinePage: React.FC = () => {
    const { darkMode } = useDarkMode();
    const [lines, setLines] = useState<Line[]>([]);
    const [selectedLine, setSelectedLine] = useState<Line | null>(null);
    const [queues, setQueues] = useState<Queue[]>([]);
    const [showAddAttendee, setShowAddAttendee] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    const [shareUrl, setShareUrl] = useState("");

    // 페이지 로드시 라인 목록만 가져오기
    useEffect(() => {
        fetchAllLines();
    }, []);

    const fetchAllLines = () => {
        axios.get(config.backend + "/line/list", {
            withCredentials: true
        })
        .then((response) => {
            console.log("Lines loaded:", response.data);
            setLines(response.data);
        })
        .catch((e) => console.error("Error loading lines:", e));
    };

    // 선택된 라인의 큐 데이터 가져오기
    const fetchLineQueues = (lineId: number) => {
        axios.get(`${config.backend}/line/${lineId}/queues`, {
            withCredentials: true
        })
        .then((response) => {
            console.log("Queues loaded:", response.data);
            setQueues(response.data);
        })
        .catch((e) => console.error(`Error loading queues for line ${lineId}:`, e));
    };

    const handleAddLine = (name: string) => {
        axios.post(config.backend + "/line/add", {
            name: name
        }, {
            withCredentials: true
        })
        .then((response) => {
            console.log("Line added:", response.data);
            fetchAllLines(); // 라인 추가 후 목록 다시 가져오기
        })
        .catch((e) => console.error("Error adding line:", e));
    };

    const handleDeleteLine = (id: number) => {
        axios.delete(`${config.backend}/line/${id}`, {
            withCredentials: true
        })
        .then(() => {
            if (selectedLine?.id === id) {
                setSelectedLine(null);
                setQueues([]);
            }
            fetchAllLines(); // 라인 삭제 후 목록 다시 가져오기
        })
        .catch((e) => console.error(`Error deleting line ${id}:`, e));
    };

    const handleEditLine = (id:number, name: string) => {
        axios.put(`${config.backend}/line/name`, {
            id: id,
            name: name
        }, {
            withCredentials: true
        })
        .then(() => {
            fetchAllLines(); // 라인 수정 후 목록 다시 가져오기
        })
        .catch((e) => console.error(`Error editing line ${id}:`, e));
    };

    const handleSelectLine = (line: Line) => {
        setSelectedLine(line);
        fetchLineQueues(line.id); // 선택한 라인의 큐 데이터 가져오기
        setShowAddAttendee(false);
        setShowQRCode(false);
        
        // 공유 URL 생성
        const shareUrl = `${window.location.origin}/line/${line.id}`;
        setShareUrl(shareUrl);
    };

    const handleAddAttendee = (phone: string, info: string) => {
        if (!phone.trim() || !selectedLine) return;
        
        axios.post(`${config.backend}/line/${selectedLine.id}/queue/add`, {
            phone: phone,
            info: info || JSON.stringify({ name: "손님" })
        }, {
            withCredentials: true
        })
        .then(() => {
            fetchLineQueues(selectedLine.id); // 큐 추가 후 다시 가져오기
            setShowAddAttendee(false);
        })
        .catch((e) => console.error("Error adding attendee:", e));
    };

    const handleStatusChange = (queueId: number, newStatus: QueueStatus) => {
        if (!selectedLine) return;

        axios.put(`${config.backend}/queue/${queueId}/status`, {
            status: newStatus
        }, {
            withCredentials: true
        })
        .then(() => {
            fetchLineQueues(selectedLine.id); // 상태 변경 후 큐 다시 가져오기
        })
        .catch((e) => console.error(`Error updating queue ${queueId} status:`, e));
    };

    const removeQueue = (queueId: number) => {
        if (!selectedLine) return;

        axios.delete(`${config.backend}/queue/${queueId}`, {
            withCredentials: true
        })
        .then(() => {
            fetchLineQueues(selectedLine.id); // 큐 삭제 후 다시 가져오기
        })
        .catch((e) => console.error(`Error removing queue ${queueId}:`, e));
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${selectedLine?.name} 줄서기`,
                url: shareUrl
            }).catch((error) => console.error('Error sharing:', error));
        } else {
            // 공유 API가 지원되지 않을 경우 URL을 클립보드에 복사
            navigator.clipboard.writeText(shareUrl)
                .then(() => alert('URL이 클립보드에 복사되었습니다.'))
                .catch((e) => console.error('클립보드 복사 실패:', e));
        }
    };

    const toggleQRCode = () => {
        setShowQRCode(!showQRCode);
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'dark:bg-gray-900' : 'bg-gray-100'} transition-colors duration-200`}>
            <Navbar />

            <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
                <LineSidebar
                    lines={lines}
                    onAddLine={handleAddLine}
                    onDeleteLine={handleDeleteLine}
                    onEditLine={handleEditLine}
                    onSelectLine={handleSelectLine}
                    selectedLine={selectedLine}
                />

                <div className="flex-1 p-4 md:p-6 overflow-y-auto">
                    {selectedLine ? (
                        <div>
                            <div className="mb-4 flex flex-wrap gap-2">
                                <button 
                                    onClick={handleShare} 
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    URL로 공유하기
                                </button>
                                <button 
                                    onClick={toggleQRCode} 
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                    </svg>
                                    QR 코드 생성하기
                                </button>
                            </div>
                            
                            {showQRCode && (
                                <div className="mb-4 p-4 bg-white rounded-lg shadow-md flex flex-col items-center">
                                    <QRCodeSVG value={shareUrl} size={200} />
                                    <p className="mt-2 text-sm text-gray-600">{shareUrl}</p>
                                    <button 
                                        onClick={() => setShowQRCode(false)}
                                        className="mt-2 px-4 py-1 bg-gray-200 rounded-md hover:bg-gray-300 text-sm"
                                    >
                                        닫기
                                    </button>
                                </div>
                            )}
                            
                            <LineView
                                line={selectedLine}
                                queues={queues}
                                showAddAttendee={showAddAttendee}
                                onBack={() => {
                                    setSelectedLine(null);
                                    setQueues([]);
                                }}
                                onStatusChange={handleStatusChange}
                                onRemoveQueue={removeQueue}
                                onShowAddForm={() => setShowAddAttendee(true)}
                                onAddAttendee={handleAddAttendee}
                                onCancelAdd={() => setShowAddAttendee(false)}
                            />
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </div>
        </div>
    );
};

export default LinePage;