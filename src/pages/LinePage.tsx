import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import LineSidebar from '../components/LineSidebar';
import QueueManager from '../components/QueueManager';
import { Sun, Moon } from 'lucide-react';
import Navbar from '../components/Navbar';

// 인터페이스 정의
interface Queue {
    id: number;
    name: string;
}

interface Line {
    id: number;
    name: string;
    queues?: Queue[];
    selectedQueue?: Queue;
}

interface QueueEntry {
    id: number;
    name: string;
    phone: string;
    timestamp: string;
    [key: string]: string | number;
}

// API 클라이언트
const api = {
    // 라인 관련 API
    getLines: async (): Promise<Line[]> => {
        return [];
        try {
            const response = await axios.get('/api/lines');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch lines:', error);
            return [];
        }
    },

    createLine: async (line: { name: string }): Promise<Line | null> => {
        try {
            const response = await axios.post('/api/lines', line);
            return response.data;
        } catch (error) {
            console.error('Failed to create line:', error);
            return null;
        }
    },

    deleteLine: async (lineId: number): Promise<boolean> => {
        try {
            await axios.delete(`/api/lines/${lineId}`);
            return true;
        } catch (error) {
            console.error('Failed to delete line:', error);
            return false;
        }
    },

    // 큐 관련 API
    getLineQueues: async (lineId: number): Promise<QueueEntry[]> => {
        try {
            const response = await axios.get(`/api/lines/${lineId}/queues`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch queues:', error);
            return [];
        }
    },

    addQueueEntry: async (lineId: number, entry: Partial<QueueEntry>): Promise<QueueEntry | null> => {
        try {
            const response = await axios.post(`/api/lines/${lineId}/queues`, entry);
            return response.data;
        } catch (error) {
            console.error('Failed to add queue entry:', error);
            return null;
        }
    }
};

const LinePage: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [lines, setLines] = useState<Line[]>([]);
    const [selectedLine, setSelectedLine] = useState<Line | null>(null);

    // 다크 모드 감지 및 적용
    useEffect(() => {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            setDarkMode(true);
        } else {
            document.documentElement.classList.remove('dark');
            setDarkMode(false);
        }
    }, []);

    // 시스템 다크모드 변경 감지 (추가)
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: any) => {
            const newDarkMode = e.matches;
            if (newDarkMode) {
                document.documentElement.classList.add('dark');
                setDarkMode(true);
            } else {
                document.documentElement.classList.remove('dark');
                setDarkMode(false);
            }
        };

        // 이벤트 리스너 등록 방식은 브라우저 호환성을 위해 조건부로 처리
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        } else {
            // 구형 브라우저 지원
            mediaQuery.addListener(handleChange);
            return () => mediaQuery.removeListener(handleChange);
        }
    }, []);

    // 초기 라인 데이터 로드
    useEffect(() => {
        const loadLines = async () => {
            const fetchedLines = await api.getLines();
            setLines(fetchedLines);
        };

        loadLines();
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);

        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // 라인 추가
    const handleAddLine = async (name: string) => {
        const newLine = await api.createLine({ name });
        if (newLine) {
            setLines([...lines, newLine]);
            setSelectedLine(newLine);
        }
    };

    // 라인 삭제
    const handleDeleteLine = async (lineId: number) => {
        const success = await api.deleteLine(lineId);
        if (success) {
            setLines(lines.filter(line => line.id !== lineId));
            if (selectedLine && selectedLine.id === lineId) {
                setSelectedLine(null);
            }
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            <LineSidebar
                lines={lines}
                onAddLine={handleAddLine}
                onDeleteLine={handleDeleteLine}
                onSelectLine={setSelectedLine}
                selectedLine={selectedLine}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

                <main className="flex-1 overflow-hidden">
                    <QueueManager selectedLine={selectedLine} />
                </main>
            </div>
        </div>
    );
};

export default LinePage;
