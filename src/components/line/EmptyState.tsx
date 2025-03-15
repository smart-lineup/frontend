import React from 'react';

const EmptyState: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="max-w-md">
                <h1 className="text-xl md:text-2xl font-bold mb-4 dark:text-white">라인 관리</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6">왼쪽 사이드바에서 라인을 선택하거나 새 라인을 추가하세요.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">모바일에서는 하단 우측의 버튼을 눌러 사이드바를 열 수 있습니다.</p>
            </div>
        </div>
    );
};

export default EmptyState;