import React, { useState } from 'react';
import { useGame } from '../hooks/useGame';
import PlayerInfoPanel from '../components/panels/PlayerInfoPanel';
import MainContentPanel from '../components/panels/MainContentPanel';
import MobileNav from '../components/layout/MobileNav';
import Modal from '../components/ui/Modal';
import BodyRefinementView from '../components/views/BodyRefinementView';
import ExplorationView from '../components/views/ExplorationView';
import PveView from '../components/views/PveView';
import SkillsView from '../components/views/SkillsView';
import AlchemyView from '../components/views/AlchemyView';
import PvpView from '../components/views/PvpView';
import GuildView from '../components/views/GuildView';
import MarketplaceView from '../components/views/MarketplaceView';
import TalentsView from '../components/views/TalentsView';
import InventoryView from '../components/views/InventoryView';
import BreakthroughView from '../components/views/BreakthroughView';
import PlayerInspectView from '../components/views/PlayerInspectView';
import type { Player, Realm } from '../types';
import TabbedInfoPanel from '../components/panels/TabbedInfoPanel';

// Mobile-specific header to show basic info and toggle the full info panel
const MobileHeader: React.FC<{ player: Player; realms: Realm[]; onClick: () => void; isInfoVisible: boolean }> = ({ player, realms, onClick, isInfoVisible }) => {
    const currentRealm = realms.find(r => r.id === player.realmId);
    const realmName = currentRealm ? currentRealm.name : 'Phàm Nhân';

    return (
        <header
            onClick={onClick}
            className="bg-gray-800 p-3 flex justify-between items-center cursor-pointer border-b border-gray-700 sticky top-0 z-10"
            aria-expanded={isInfoVisible}
            aria-controls="player-info-panel-mobile"
        >
            <div>
                <h1 className="text-lg font-bold text-yellow-300">{player.username}</h1>
                <p className="text-sm text-purple-300">{realmName}</p>
            </div>
            <div className="text-gray-400">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 transition-transform duration-300 ${isInfoVisible ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </header>
    );
};

const GamePage: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const { activeModal, setActiveModal, player, realms, setInspectingPlayer } = useGame();
    const [isPlayerInfoVisible, setIsPlayerInfoVisible] = useState(false);

    if (!player) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-2xl text-purple-400">Đang Tải Linh Hồn Tu Sĩ...</p>
                    <div className="mt-4 w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-300 mx-auto"></div>
                </div>
            </div>
        );
    }

    const renderModalContent = () => {
        switch (activeModal) {
            case 'body-refinement': return <BodyRefinementView />;
            case 'exploration': return <ExplorationView />;
            case 'pve': return <PveView />;
            case 'skills': return <SkillsView />;
            case 'alchemy': return <AlchemyView />;
            case 'pvp': return <PvpView />;
            case 'guild': return <GuildView />;
            case 'marketplace': return <MarketplaceView />;
            case 'talents': return <TalentsView />;
            case 'inventory': return <InventoryView />;
            case 'breakthrough': return <BreakthroughView />;
            case 'player-stats': return <PlayerInspectView />;
            default: return null;
        }
    };
    
    const getModalTitle = () => {
        switch (activeModal) {
            case 'body-refinement': return 'Luyện Thể';
            case 'exploration': return 'Thám Hiểm';
            case 'pve': return 'Thí Luyện Chi Địa';
            case 'skills': return 'Công Pháp';
            case 'alchemy': return 'Luyện Đan';
            case 'pvp': return 'Đấu Pháp';
            case 'guild': return 'Tông Môn';
            case 'marketplace': return 'Chợ Giao Dịch';
            case 'talents': return 'Lĩnh Ngộ';
            case 'inventory': return 'Túi Đồ';
            case 'breakthrough': return 'Đột Phá Cảnh Giới';
            case 'player-stats': return 'Xem Thông Tin Tu Sĩ';
            default: return '';
        }
    };

    const handleCloseModal = () => {
        setActiveModal(null);
        if (setInspectingPlayer) {
            setInspectingPlayer(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
            <div className="hidden md:flex md:flex-row max-w-7xl mx-auto p-4 gap-4 h-screen">
                <div className="w-1/4 flex-shrink-0">
                    <PlayerInfoPanel onLogout={onLogout} />
                </div>
                <div className="w-1/2 flex-grow flex flex-col">
                    <TabbedInfoPanel />
                </div>
                <div className="w-1/4 flex-shrink-0">
                    <MainContentPanel />
                </div>
            </div>

            <div className="md:hidden flex flex-col h-screen">
                 <MobileHeader 
                    player={player}
                    realms={realms}
                    onClick={() => setIsPlayerInfoVisible(v => !v)} 
                    isInfoVisible={isPlayerInfoVisible} 
                />
                 <div className="flex-grow p-2 overflow-y-auto pb-20">
                    {isPlayerInfoVisible && (
                        <>
                            <PlayerInfoPanel onLogout={onLogout} />
                            <div className="h-2"></div>
                        </>
                    )}
                    <TabbedInfoPanel />
                </div>
                <MobileNav />
            </div>
            
            <Modal title={getModalTitle()} isOpen={!!activeModal} onClose={handleCloseModal}>
                {renderModalContent()}
            </Modal>
        </div>
    );
};

export default GamePage;