import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronDown, MoreHorizontal, Plus, Trash, Menu, X } from 'lucide-react';

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

interface LineSidebarProps {
    lines: Line[];
    onAddLine: (name: string) => void;
    onDeleteLine: (id: number) => void;
    onSelectLine: (line: Line) => void;
    selectedLine?: Line | null;
}

const LineSidebar: React.FC<LineSidebarProps> = ({ lines, onAddLine, onDeleteLine, onSelectLine, selectedLine }) => {
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [newLineName, setNewLineName] = useState('');
    const [showAddInput, setShowAddInput] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = (lineId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenDropdown(openDropdown === lineId ? null : lineId);
    };

    const handleDeleteLine = (lineId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        onDeleteLine(lineId);
        setOpenDropdown(null);
    };

    const handleAddLine = () => {
        if (newLineName.trim()) {
            onAddLine(newLineName);
            setNewLineName('');
            setShowAddInput(false);
        }
    };

    const toggleMobileSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    return (
        <>
            {/* Mobile sidebar toggle button */}
            <button
                className="md:hidden fixed bottom-4 right-4 z-40 bg-blue-600 text-white rounded-full p-3 shadow-lg"
                onClick={toggleMobileSidebar}
                aria-label="Toggle sidebar"
            >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar overlay for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar content */}
            <div
                className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full transition-all duration-300 ${isMobileOpen
                    ? 'fixed left-0 top-0 bottom-0 w-64 z-40 shadow-lg'
                    : 'hidden md:block w-64'
                    }`}
            >
                <div className="p-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold dark:text-white">내 라인</h2>
                        <button
                            onClick={() => setShowAddInput(true)}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Plus size={20} className="text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>

                    {showAddInput && (
                        <div className="mb-4 flex">
                            <input
                                type="text"
                                value={newLineName}
                                onChange={(e) => setNewLineName(e.target.value)}
                                placeholder="라인 이름"
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                                autoFocus
                            />
                            <button
                                onClick={handleAddLine}
                                className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                추가
                            </button>
                        </div>
                    )}

                    <div className="space-y-1">
                        {lines?.map((line) => (
                            <div key={line.id} className="relative">
                                <div
                                    className={`flex items-center p-2 rounded-md cursor-pointer ${selectedLine?.id === line.id ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    onClick={() => {
                                        onSelectLine(line);
                                        if (window.innerWidth < 768) {
                                            setIsMobileOpen(false);
                                        }
                                    }}
                                >
                                    <span className="truncate flex-1 dark:text-white">{line.name}</span>
                                    <div ref={dropdownRef}>
                                        <button
                                            onClick={(e) => toggleDropdown(line.id, e)}
                                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                                        >
                                            <MoreHorizontal size={16} className="text-gray-500 dark:text-gray-400" />
                                        </button>

                                        {openDropdown === line.id && (
                                            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 border border-gray-200 dark:border-gray-700">
                                                <button
                                                    onClick={(e) => handleDeleteLine(line.id, e)}
                                                    className="flex items-center w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                                                >
                                                    <Trash size={16} className="mr-2 text-red-500" />
                                                    삭제
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LineSidebar;