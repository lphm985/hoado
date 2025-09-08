import React, { useState } from 'react';
import LogPanel from './LogPanel';
import LeaderboardPanel from './LeaderboardPanel';
import ChatPanel from './ChatPanel';

type Tab = 'chat' | 'log' | 'leaderboard';

const TabbedInfoPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('chat');

    const tabs = [
        { id: 'chat', label: 'Kênh Thế Giới' },
        { id: 'log', label: 'Nhật Ký Tu Luyện' },
        { id: 'leaderboard', label: 'Danh Nhân Bảng' }
    ];

    return (
        <div className="bg-gray-800 p-2 md:p-4 rounded-lg h-full flex flex-col shadow-lg">
            <div className="flex border-b border-gray-700 mb-2 flex-shrink-0">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`py-2 px-4 text-sm font-semibold transition-colors duration-200 focus:outline-none ${activeTab === tab.id
                                ? 'border-b-2 border-purple-400 text-purple-400'
                                : 'text-gray-400 hover:text-purple-300'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="flex-grow overflow-hidden">
                {activeTab === 'chat' && <ChatPanel />}
                {activeTab === 'log' && <LogPanel />}
                {activeTab === 'leaderboard' && <LeaderboardPanel />}
            </div>
        </div>
    );
};

export default TabbedInfoPanel;