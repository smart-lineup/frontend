import React, { useState } from 'react';

interface AddAttendeeFormProps {
  onAdd: (phone: string, info: string) => void;
  onCancel: () => void;
}

const AddAttendeeForm: React.FC<AddAttendeeFormProps> = ({ onAdd, onCancel }) => {
  const [phone, setPhone] = useState('');
  const [info, setInfo] = useState('');

  const handleSubmit = () => {
    if (phone.trim()) {
      onAdd(phone, info);
      setPhone('');
      setInfo('');
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
      <h3 className="text-md font-medium mb-3 dark:text-white">새 손님 추가</h3>
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">전화번호</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
            pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">고객 정보 (JSON)</label>
          <textarea
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            placeholder='{"name": "홍길동", "note": "특이사항"}'
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
            rows={3}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          추가
        </button>
        <button 
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default AddAttendeeForm;