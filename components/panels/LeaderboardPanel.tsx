import React, { useMemo, useState } from 'react';
import { useGame } from '../../hooks/useGame';
import type { Player } from '../../types';

const LeaderboardPanel: React.FC = () => {
    const { realms, player: currentPlayer, setActiveModal, setInspectingPlayer, addLog } = useGame();
    const [searchTerm, setSearchTerm] = useState('');

    const rankedPlayers = useMemo(() => {
        const savedPlayersJSON = localStorage.getItem('players');
        if (!savedPlayersJSON) return [];

        const playersObject: { [username: string]: Player } = JSON.parse(savedPlayersJSON);
        const allPlayers = Object.values(playersObject);

        return allPlayers
            .map(p => {
                const realm = realms.find(r => r.id === p.realmId);
                return {
                    player: p,
                    realmName: realm?.name || 'Phàm Nhân',
                    realmOrder: realm?.order || 0,
                };
            })
            .sort((a, b) => {
                if (b.realmOrder !== a.realmOrder) {
                    return b.realmOrder - a.realmOrder;
                }
                return b.player.cultivationProgress - a.player.cultivationProgress;
            });
    }, [realms]);

    const displayedPlayers = useMemo(() => {
        return rankedPlayers.slice(0, 20);
    }, [rankedPlayers]);

    const handleInspectPlayer = (playerToInspect: Player) => {
        if (setInspectingPlayer) {
            setInspectingPlayer(playerToInspect);
            setActiveModal('player-stats');
        }
    };
    
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        const foundPlayer = rankedPlayers.find(p => p.player.username.toLowerCase() === searchTerm.trim().toLowerCase());

        if (foundPlayer) {
            handleInspectPlayer(foundPlayer.player);
        } else {
            addLog(`Không tìm thấy tu sĩ '${searchTerm.trim()}'.`, 'warning');
        }
    };

    if (rankedPlayers.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                Chưa có tu sĩ nào trên Danh Nhân Bảng.
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex-grow overflow-y-auto pr-2 modal-scrollbar">
                <ul className="space-y-2">
                    {displayedPlayers.map(({ player, realmName }, index) => {
                        const isCurrentUser = player.id === currentPlayer?.id;
                        const realRank = rankedPlayers.findIndex(p => p.player.id === player.id) + 1;
                        return (
                            <li
                                key={player.id}
                                onClick={() => handleInspectPlayer(player)}
                                className={`flex items-center p-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                                    isCurrentUser 
                                    ? 'bg-purple-800 border border-purple-500' 
                                    : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                                 aria-label={`Xem thông tin ${player.username}`}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleInspectPlayer(player); }}
                            >
                                <div className="flex items-center overflow-hidden">
                                    <span className="text-lg font-bold w-8 text-center text-yellow-300 flex-shrink-0">{realRank}</span>
                                    <div className="ml-3 truncate">
                                        <p className={`font-semibold truncate ${isCurrentUser ? 'text-white' : 'text-gray-200'}`}>{player.username}</p>
                                        <p className="text-sm text-purple-300">{realmName}</p>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <form onSubmit={handleSearch} className="mt-2 pt-2 border-t border-gray-700 flex-shrink-0 flex gap-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm tu sĩ..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    aria-label="Tìm kiếm tu sĩ trong Danh Nhân Bảng"
                />
                <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-md text-sm transition-colors flex-shrink-0"
                    aria-label="Tìm kiếm"
                >
                    Tìm
                </button>
            </form>
        </div>
    );
};

export default LeaderboardPanel;