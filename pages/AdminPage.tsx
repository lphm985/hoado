import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminDashboard from '../components/admin/AdminDashboard';
import PlayerManager from '../components/admin/PlayerManager';
import GameDataManager from '../components/admin/GameDataManager';
import GameSettingsManager from '../components/admin/GameSettingsManager';
import RealmManager from '../components/admin/RealmManager';

export type AdminView = 'dashboard' | 'players' | 'game-data' | 'game-settings' | 'realms';

const AdminPage: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [activeView, setActiveView] = useState<AdminView>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const renderView = () => {
        switch (activeView) {
            case 'players': return <PlayerManager />;
            case 'game-data': return <GameDataManager />;
            case 'game-settings': return <GameSettingsManager />;
            case 'realms': return <RealmManager />;
            default: return <AdminDashboard />;
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col md:flex-row relative">
            {/* Mobile Header */}
            <header className="md:hidden bg-gray-800 p-4 flex justify-between items-center sticky top-0 z-20 border-b border-gray-700">
                <h1 className="text-xl font-bold text-yellow-300">Bảng Quản Trị</h1>
                <button onClick={() => setIsSidebarOpen(true)} aria-label="Mở điều hướng">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </header>
            
            <AdminSidebar 
                setActiveView={setActiveView} 
                onLogout={onLogout}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            <main className="flex-grow p-4 md:p-8 overflow-y-auto">
                {renderView()}
            </main>
        </div>
    );
};

export default AdminPage;