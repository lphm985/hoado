import React, { useMemo } from 'react';
import { useGame } from '../../hooks/useGame';
import StatDisplay from '../ui/StatDisplay';
import ProgressBar from '../ui/ProgressBar';
import type { Player, Stats } from '../../types';

const PlayerInfoPanel: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const { player, realms, setActiveModal } = useGame();

    const totalStats = useMemo<Stats>(() => {
        if (!player) return { hp: 0, atk: 0, def: 0, agi: 0 };
        
        const total: Stats = { ...player.stats };
        
        Object.values(player.equipment).forEach(item => {
            if (item && item.stats) {
                total.hp += item.stats.hp;
                total.atk += item.stats.atk;
                total.def += item.stats.def;
                total.agi += item.stats.agi;
            }
        });
        
        return total;
    }, [player]);

    if (!player) {
        return (
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-full">
                <p>Đang tải dữ liệu người chơi...</p>
            </div>
        );
    }
    
    const sortedRealms = [...realms].sort((a, b) => a.order - b.order);
    const currentRealmIndex = sortedRealms.findIndex(r => r.id === player.realmId);
    const currentRealm = sortedRealms[currentRealmIndex];
    const nextRealm = currentRealmIndex < sortedRealms.length - 1 ? sortedRealms[currentRealmIndex + 1] : null;
    const isReadyForBreakthrough = currentRealm && player.cultivationProgress >= currentRealm.qiNeeded;

    const realmName = currentRealm ? currentRealm.name : 'Phàm Nhân';

    return (
        <div id="player-info-panel-mobile" className="bg-gray-800 p-2 md:p-4 rounded-lg shadow-lg h-full flex flex-col">
            <h2 className="text-xl font-bold text-yellow-300 mb-2 text-center">{player.username}</h2>
            <div className="text-center mb-4">
                <p className="text-lg text-purple-300">{realmName}</p>
            </div>
            <div className="space-y-3 md:space-y-4 flex-grow">
                <ProgressBar
                    label="Tu Luyện"
                    value={player.cultivationProgress}
                    max={currentRealm?.qiNeeded || 1}
                    color="bg-sky-500"
                />
                 <ProgressBar
                    label="HP"
                    value={totalStats.hp}
                    max={totalStats.hp} // Assuming current HP is max HP outside of combat
                    color="bg-red-500"
                />
                <div className="grid grid-cols-3 gap-2 text-center">
                    <StatDisplay label="Công" value={totalStats.atk} />
                    <StatDisplay label="Thủ" value={totalStats.def} />
                    <StatDisplay label="Nhanh Nhẹn" value={totalStats.agi} />
                </div>
                 <div className="grid grid-cols-2 gap-2 text-center">
                    <StatDisplay label="Luyện Thể" value={player.bodyLevel} />
                    <StatDisplay label="Linh Thạch" value={player.spiritStones.toLocaleString()} />
                </div>
            </div>
            <div className="mt-4 md:mt-6 space-y-2">
                {nextRealm && (
                     <button
                        onClick={() => setActiveModal('breakthrough')}
                        disabled={!isReadyForBreakthrough}
                        className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors ${isReadyForBreakthrough ? 'animate-pulse' : ''} disabled:bg-gray-600 disabled:opacity-75 disabled:cursor-not-allowed`}
                        aria-label="Đột phá cảnh giới kế tiếp"
                    >
                        Đột Phá Cảnh Giới
                    </button>
                )}
                <button
                    onClick={onLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    aria-label="Đăng xuất"
                >
                    Đăng Xuất
                </button>
            </div>
        </div>
    );
};

export default PlayerInfoPanel;