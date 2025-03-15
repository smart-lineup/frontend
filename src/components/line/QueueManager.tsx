import React, { useState } from 'react';
import { Plus, Trash, User, Phone, X } from 'lucide-react';

interface Column {
  id: string;
  label: string;
  editable: boolean;
  required: boolean;
}

interface QueueEntry {
  id: number;
  name: string;
  phone: string;
  timestamp: string;
  [key: string]: string | number;
}

interface Line {
  id: number;
  name: string;
  queues?: Array<{ id: number, name: string }>;
  selectedQueue?: { id: number, name: string };
}

interface QueueManagerProps {
  selectedLine: Line | null;
}

const QueueManager: React.FC<QueueManagerProps> = ({ selectedLine }) => {
  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>([]);
  const [newEntry, setNewEntry] = useState<{ name: string, phone: string }>({ name: '', phone: '' });
  const [columns, setColumns] = useState<Column[]>([
    { id: 'name', label: '이름', editable: false, required: true },
    { id: 'phone', label: '휴대폰 번호', editable: false, required: true },
  ]);
  const [showColumnAdder, setShowColumnAdder] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  const handleAddEntry = () => {
    if (newEntry.name && newEntry.phone) {
      const entryData: QueueEntry = {
        id: Date.now(),
        name: newEntry.name,
        phone: newEntry.phone,
        timestamp: new Date().toISOString(),
      };

      // Initialize any custom columns with empty values
      columns.forEach(col => {
        if (!['name', 'phone'].includes(col.id)) {
          entryData[col.id] = '';
        }
      });

      setQueueEntries([...queueEntries, entryData]);
      setNewEntry({ name: '', phone: '' });
    }
  };

  const handleRemoveEntry = (id: number) => {
    setQueueEntries(queueEntries.filter(entry => entry.id !== id));
  };

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const columnId = newColumnName.toLowerCase().replace(/\s+/g, '_');
      setColumns([...columns, {
        id: columnId,
        label: newColumnName,
        editable: true,
        required: false
      }]);
      setNewColumnName('');
      setShowColumnAdder(false);

      // Add empty value for new column to all existing entries
      setQueueEntries(queueEntries.map(entry => ({
        ...entry,
        [columnId]: ''
      })));
    }
  };

  const handleRemoveColumn = (columnId: string) => {
    if (['name', 'phone'].includes(columnId)) return; // Don't remove required columns

    setColumns(columns.filter(col => col.id !== columnId));

    // Remove this column from all entries
    setQueueEntries(queueEntries.map(entry => {
      const newEntry = { ...entry };
      delete newEntry[columnId];
      return newEntry;
    }));
  };

  const handleUpdateEntry = (id: number, field: string, value: string) => {
    setQueueEntries(queueEntries.map(entry =>
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  if (!selectedLine) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        라인을 선택해주세요
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 dark:text-white">{selectedLine.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {queueEntries.length === 0
            ? '아직 대기자가 없습니다.'
            : `현재 ${queueEntries.length}명이 대기 중입니다.`}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex p-4">
            {columns.map((column) => (
              <div key={column.id} className="flex-1 flex items-center font-medium text-gray-700 dark:text-gray-300">
                {column.label}
                {column.editable && (
                  <button
                    onClick={() => handleRemoveColumn(column.id)}
                    className="ml-2 text-gray-400 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            <div className="w-12"></div>

            <button
              onClick={() => setShowColumnAdder(true)}
              className="ml-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Plus size={20} className="text-blue-500" />
            </button>
          </div>

          {showColumnAdder && (
            <div className="flex p-4 bg-gray-50 dark:bg-gray-700">
              <input
                type="text"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                placeholder="컬럼 이름"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
                autoFocus
              />
              <button
                onClick={handleAddColumn}
                className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                추가
              </button>
              <button
                onClick={() => {
                  setShowColumnAdder(false);
                  setNewColumnName('');
                }}
                className="ml-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                취소
              </button>
            </div>
          )}
        </div>

        {queueEntries.length > 0 ? (
          <div>
            {queueEntries.map((entry) => (
              <div key={entry.id} className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                {columns.map((column) => (
                  <div key={column.id} className="flex-1">
                    {column.editable ? (
                      <input
                        type="text"
                        value={entry[column.id]?.toString() || ''}
                        onChange={(e) => handleUpdateEntry(entry.id, column.id, e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <span className="dark:text-white">{entry[column.id]}</span>
                    )}
                  </div>
                ))}
                <div className="w-12 flex justify-center">
                  <button
                    onClick={() => handleRemoveEntry(entry.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex-1 flex space-x-4">
            <div className="flex-1 flex items-center">
              <User size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                value={newEntry.name}
                onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                placeholder="이름"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex-1 flex items-center">
              <Phone size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                value={newEntry.phone}
                onChange={(e) => setNewEntry({ ...newEntry, phone: e.target.value })}
                placeholder="휴대폰 번호"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <button
            onClick={handleAddEntry}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueueManager;