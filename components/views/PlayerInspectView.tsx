import React, { useMemo } from 'react';
import { useGame } from '../../hooks/useGame';
import StatDisplay from '../ui/StatDisplay';
import type { Stats, Item, Player } from '../../types';

const PlayerInspectView: React.FC = () => {
    const { inspectingPlayer, realms } = useGame();

    const playerRank = useMemo(() => {
        if (!inspectingPlayer) return null;

        const savedPlayersJSON = localStorage.getItem('players');
        if (!savedPlayersJSON) return null;
        
        const playersObject: { [username: string]: Player } = JSON.parse(savedPlayersJSON);
        const allPlayers = Object.values(playersObject);

        const rankedPlayers = allPlayers
            .map(p => {
                const realm = realms.find(r => r.id === p.realmId);
                return {
                    player: p,
                    realmOrder: realm?.order || 0,
                };
            })
            .sort((a, b) => {
                if (b.realmOrder !== a.realmOrder) {
                    return b.realmOrder - a.realmOrder;
                }
                return b.player.cultivationProgress - a.player.cultivationProgress;
            });
        
        const rankIndex = rankedPlayers.findIndex(p => p.player.id === inspectingPlayer.id);

        return rankIndex !== -1 ? rankIndex + 1 : null;

    }, [inspectingPlayer, realms]);

    const totalStats = useMemo<Stats>(() => {
        if (!inspectingPlayer) return { hp: 0, atk: 0, def: 0, agi: 0 };
        
        const total: Stats = { ...inspectingPlayer.stats };
        
        Object.values(inspectingPlayer.equipment).forEach(item => {
            if (item && item.stats) {
                total.hp += item.stats.hp;
                total.atk += item.stats.atk;
                total.def += item.stats.def;
                total.agi += item.stats.agi;
            }
        });
        
        return total;
    }, [inspectingPlayer]);

    if (!inspectingPlayer) {
        return <div className="text-center p-8">Không có thông tin tu sĩ.</div>;
    }

    const currentRealm = realms.find(r => r.id === inspectingPlayer.realmId);
    const realmName = currentRealm ? currentRealm.name : 'Phàm Nhân';

    const renderItemStats = (item: Item) => {
        if (!item.stats) return null;
        return (
             <p className="text-xs text-green-400">
                {item.stats.hp > 0 && `HP: +${item.stats.hp} `}
                {item.stats.atk > 0 && `Công: +${item.stats.atk} `}
                {item.stats.def > 0 && `Thủ: +${item.stats.def} `}
                {item.stats.agi > 0 && `Nhanh Nhẹn: +${item.stats.agi}`}
            </p>
        );
    };

    const translateSlot = (slot: string) => {
        switch (slot) {
            case 'weapon': return 'Vũ Khí';
            case 'armor': return 'Giáp';
            case 'accessory': return 'Phụ Kiện';
            default: return slot;
        }
    };

    return (
        <div className="text-gray-200">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-yellow-300">{inspectingPlayer.username}</h2>
                 <div className="flex justify-center items-baseline gap-4 mt-1">
                    <p className="text-lg text-purple-300">{realmName}</p>
                    {playerRank && (
                        <p className="text-lg text-yellow-400 font-bold">Hạng: #{playerRank}</p>
                    )}
                </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-yellow-300 mb-3 text-center">Chỉ Số Tổng</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <StatDisplay label="HP" value={totalStats.hp} />
                    <StatDisplay label="Công" value={totalStats.atk} />
                    <StatDisplay label="Thủ" value={totalStats.def} />
                    <StatDisplay label="Nhanh Nhẹn" value={totalStats.agi} />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-yellow-300 mb-3 text-center">Trang Bị</h3>
                <div className="space-y-2">
                    {Object.entries(inspectingPlayer.equipment).map(([slot, item]) => (
                        <div key={slot} className="bg-gray-700 p-3 rounded-lg flex items-center justify-between">
                           <div className="flex items-center space-x-3">
                                <span className="text-gray-400 capitalize w-20">{translateSlot(slot)}:</span>
                                {item ? (
                                    <div>
                                        <p className="font-bold">{item.name}</p>
                                        {renderItemStats(item)}
                                    </div>
                                ) : <p className="text-gray-500">Trống</p>}
                           </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlayerInspectView;