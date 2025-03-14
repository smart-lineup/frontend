import React, { useState } from 'react';
import { ChevronRight, ChevronDown, MoreHorizontal, Plus, Trash } from 'lucide-react';

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
  const [expandedLines, setExpandedLines] = useState<Record<number, boolean>>({});
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [newLineName, setNewLineName] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);
  console.log(lines);
  console.log(typeof lines);

  const toggleExpand = (lineId: number) => {
    setExpandedLines(prev => ({
      ...prev,
      [lineId]: !prev[lineId]
    }));
  };

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

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-full border-r border-gray-200 dark:border-gray-700 p-4">
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
              className={`flex items-center p-2 rounded-md cursor-pointer ${
                selectedLine?.id === line.id ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => onSelectLine(line)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(line.id);
                }}
                className="mr-1"
              >
                {expandedLines[line.id] ? (
                  <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronRight size={16} className="text-gray-500 dark:text-gray-400" />
                )}
              </button>
              <span className="truncate flex-1 dark:text-white">{line.name}</span>
              <button 
                onClick={(e) => toggleDropdown(line.id, e)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <MoreHorizontal size={16} className="text-gray-500 dark:text-gray-400" />
              </button>
              
              {openDropdown === line.id && (
                <div className="absolute right-0 mt-8 w-32 bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 border border-gray-200 dark:border-gray-700">
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
            
            {expandedLines[line.id] && line.queues && line.queues.length > 0 && (
              <div className="ml-6 mt-1 space-y-1">
                {line.queues.map((queue) => (
                  <div 
                    key={queue.id}
                    className={`p-2 rounded-md cursor-pointer ${
                      selectedLine?.selectedQueue?.id === queue.id ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => onSelectLine({ ...line, selectedQueue: queue })}
                  >
                    <span className="truncate dark:text-white">{queue.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LineSidebar;