import React, { useState, useMemo } from 'react';
import { useGame } from '../../hooks/useGame';

const MAX_REFINEMENTS_PER_REALM = 20;

const BodyRefinementView: React.FC = () => {
    const { player, setPlayer, addLog, bodyRefinementConfig, realms } = useGame();
    const [isLoading, setIsLoading] = useState(false);

    const cost = useMemo(() => {
        if (!player || !realms) return Infinity;
        const currentRealm = realms.find(r => r.id === player.realmId);
        if (!currentRealm) return Infinity;
        
        // The cost is now a fixed percentage of the current realm's total Qi needed.
        return Math.floor(currentRealm.qiNeeded * (currentRealm.bodyRefinementCostPercent || 0.1));
    }, [player, realms]);

    if (!player) {
        return <div className="text-center p-8">Đang tải...</div>;
    }
    
    const isMaxedForRealm = player.bodyRefinementsInRealm >= MAX_REFINEMENTS_PER_REALM;
    const canAfford = player.cultivationProgress >= cost;
    const nextRefinementLevelInRealm = player.bodyRefinementsInRealm + 1;
    const statGain = bodyRefinementConfig[nextRefinementLevelInRealm] || { hp: 0, atk: 0, def: 0, agi: 0 };

    const handleRefine = () => {
        if (!canAfford || isLoading || isMaxedForRealm) return;

        setIsLoading(true);
        setPlayer(p => {
            if (!p) return null;
            return { ...p, cultivationProgress: p.cultivationProgress - cost };
        });
        addLog(`Đang tôi luyện thân thể với ${cost.toLocaleString()} Linh Khí...`);

        setTimeout(() => {
            setPlayer(p => {
                if (!p) return null;
                const gain = bodyRefinementConfig[p.bodyRefinementsInRealm + 1] || { hp: 0, atk: 0, def: 0, agi: 0 };
                return {
                    ...p,
                    bodyLevel: p.bodyLevel + 1,
                    bodyRefinementsInRealm: p.bodyRefinementsInRealm + 1,
                    stats: {
                        hp: p.stats.hp + gain.hp,
                        atk: p.stats.atk + gain.atk,
                        def: p.stats.def + gain.def,
                        agi: p.stats.agi + gain.agi,
                    }
                };
            });
            addLog('Luyện thể thành công! Sức mạnh thể chất của bạn đã tăng lên.', 'success');
            setIsLoading(false);
        }, 1500);
    };
    
    if (isMaxedForRealm) {
        return (
            <div className="text-center">
                <p className="text-lg mb-2">Cấp Luyện Thể: <span className="font-bold text-green-400">{player.bodyLevel}</span></p>
                <p className="text-yellow-400 mt-4">Bạn đã đạt đến giới hạn luyện thể của cảnh giới này. Hãy đột phá để tiếp tục con đường cường hóa thân thể.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center text-center">
            <p className="text-lg mb-2">Cấp Luyện Thể: <span className="font-bold text-green-400">{player.bodyLevel}</span></p>
            <p className="text-gray-400 mb-4">Cường hóa thân thể để chống lại những khắc nghiệt của con đường tu luyện.</p>

            <div className="bg-gray-700 p-4 rounded-lg w-full mb-6">
                <p className="mb-2">Chi phí cho lần tiếp theo (cấp {player.bodyLevel + 1}):</p>
                <p className={`text-2xl font-bold ${canAfford ? 'text-sky-400' : 'text-red-500'}`}>{cost.toLocaleString()} Linh Khí</p>
                <div className="mt-4 text-left grid grid-cols-4 gap-2">
                    <div className="text-center">
                        <p className="text-sm text-gray-400">HP</p>
                        <p className="text-green-400">+{statGain.hp}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-400">Công</p>
                        <p className="text-green-400">+{statGain.atk}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-400">Thủ</p>
                        <p className="text-green-400">+{statGain.def}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-400">Nhanh Nhẹn</p>
                        <p className="text-green-400">+{statGain.agi}</p>
                    </div>
                </div>
            </div>

            <button
                onClick={handleRefine}
                disabled={!canAfford || isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Đang tôi luyện...' : 'Luyện Thể'}
            </button>
        </div>
    );
};

export default BodyRefinementView;