import React, { useState } from 'react';
import { useGame } from '../../hooks/useGame';
import ProgressBar from '../ui/ProgressBar';

const BreakthroughView: React.FC = () => {
    const { player, setPlayer, realms, addLog } = useGame();
    const [isLoading, setIsLoading] = useState(false);

    if (!player) {
        return <div className="text-center p-8">Đang tải...</div>;
    }
    
    const sortedRealms = [...realms].sort((a, b) => a.order - b.order);
    const currentRealmIndex = sortedRealms.findIndex(r => r.id === player.realmId);
    const currentRealm = sortedRealms[currentRealmIndex];
    const nextRealm = currentRealmIndex < sortedRealms.length - 1 ? sortedRealms[currentRealmIndex + 1] : null;

    if (!currentRealm) {
         return <div className="text-center p-8">Lỗi: Không tìm thấy cảnh giới hiện tại.</div>;
    }

    const canBreakthrough = player.cultivationProgress >= currentRealm.qiNeeded;

    const handleBreakthrough = () => {
        if (!nextRealm || !canBreakthrough || isLoading) return;

        setIsLoading(true);
        addLog(`Đang thử đột phá lên ${nextRealm.name}...`);
        
        setTimeout(() => {
            const isSuccess = Math.random() < nextRealm.breakthroughChance;

            if (isSuccess) {
                setPlayer(p => {
                    if (!p) return null;

                    const { flatGains, percentGains } = nextRealm.breakthroughGains;
                    const currentStats = p.stats;
                    
                    const newHp = Math.floor(currentStats.hp * (1 + percentGains.hp) + flatGains.hp);
                    const newAtk = Math.floor(currentStats.atk * (1 + percentGains.atk) + flatGains.atk);
                    const newDef = Math.floor(currentStats.def * (1 + percentGains.def) + flatGains.def);
                    const newAgi = Math.floor(currentStats.agi * (1 + percentGains.agi) + flatGains.agi);
        
                    return {
                        ...p,
                        realmId: nextRealm.id,
                        cultivationProgress: 0,
                        bodyRefinementsInRealm: 0, // Reset for the new realm
                        stats: {
                            hp: newHp,
                            atk: newAtk,
                            def: newDef,
                            agi: newAgi,
                        }
                    };
                });
                addLog(`Đột phá thành công! Bạn đã đạt tới ${nextRealm.name}! Sức mạnh của bạn đã tăng vọt.`, 'success');
            } else {
                const qiLoss = currentRealm.qiNeeded * nextRealm.qiLossOnFailure;
                setPlayer(p => {
                    if (!p) return null;
                    return {
                        ...p,
                        cultivationProgress: Math.max(0, p.cultivationProgress - qiLoss),
                    }
                });
                addLog(`Đột phá thất bại! Cảnh giới dao động, bạn mất ${qiLoss.toLocaleString()} Linh Khí.`, 'danger');
            }
            
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="flex flex-col items-center text-center">
            <p className="text-lg mb-2">Cảnh Giới Hiện Tại: <span className="font-bold text-purple-400">{currentRealm.name}</span></p>

            <div className="bg-gray-700 p-4 rounded-lg w-full mb-6">
                <ProgressBar
                    label="Tiến Độ Tu Luyện"
                    value={player.cultivationProgress}
                    max={currentRealm.qiNeeded}
                    color="bg-sky-500"
                />
            </div>
            
            {nextRealm ? (
                 <div>
                    <p className="text-gray-400 mb-2">Khi tiến độ tu luyện đầy, bạn có thể thử đột phá đến cảnh giới tiếp theo: <span className="font-bold text-yellow-300">{nextRealm.name}</span>.</p>
                    <div className="bg-gray-900 p-3 rounded-md mb-4 text-sm space-y-1">
                        <p>Tỷ lệ thành công: <span className="font-bold text-sky-400">{Math.round(nextRealm.breakthroughChance * 100)}%</span></p>
                        <p>Nếu thất bại, bạn sẽ mất <span className="font-bold text-red-400">{Math.round(nextRealm.qiLossOnFailure * 100)}%</span> Linh Khí đã tu luyện.</p>
                    </div>
                     <button
                        onClick={handleBreakthrough}
                        disabled={!canBreakthrough || isLoading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Đang Đột Phá...' : `Đột Phá Lên ${nextRealm.name}`}
                    </button>
                 </div>
            ) : (
                <p className="text-yellow-300 font-bold">Bạn đã đạt đến đỉnh cao tu luyện. Hiện tại không có cảnh giới cao hơn để đột phá...</p>
            )}
        </div>
    );
};

export default BreakthroughView;