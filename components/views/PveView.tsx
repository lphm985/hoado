import React, { useState, useEffect, useMemo } from 'react';
import { useGame } from '../../hooks/useGame';
import type { Monster, Item, Stats } from '../../types';

const PveView: React.FC = () => {
    const { player, setPlayer, monsters, addLog, items } = useGame();
    const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
    const [battleLog, setBattleLog] = useState<string[]>([]);
    const [isFighting, setIsFighting] = useState(false);
    
    const [cooldownTime, setCooldownTime] = useState(0);

    const playerTotalStats = useMemo<Stats>(() => {
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

    useEffect(() => {
        if (!player) return;
        const lastFight = player.lastPveFightTimestamp || 0;
        const now = Date.now();
        const timeSinceLastFight = (now - lastFight) / 1000;
        const remainingCooldown = Math.max(0, player.lastPveCooldown - timeSinceLastFight);
        setCooldownTime(remainingCooldown);

        if (remainingCooldown > 0) {
            const interval = setInterval(() => {
                setCooldownTime(prev => Math.max(0, prev - 1));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [player]);
    
    if (!player) return <div>Đang tải...</div>;

    const calculateDodgeChance = (defenderAgi: number, attackerAgi: number) => {
        const totalAgi = defenderAgi + attackerAgi;
        if (totalAgi <= 0) {
            return 0; // If neither has agility, no one can dodge.
        }
        // This formula represents the defender's share of the total agility pool,
        // resulting in a relative dodge chance that is always between 0 and 1.
        return defenderAgi / totalAgi;
    };

    const handleFight = (monster: Monster) => {
        if (cooldownTime > 0) return;
        
        setSelectedMonster(monster);
        setIsFighting(true);
        setBattleLog([`Bạn gặp một ${monster.name}!`]);

        let playerHP = playerTotalStats.hp;
        let monsterHP = monster.stats.hp;
        const newLog: string[] = [];

        const fightInterval = setInterval(() => {
            if (playerHP <= 0 || monsterHP <= 0) {
                clearInterval(fightInterval);

                setPlayer(p => p ? { ...p, lastPveFightTimestamp: Date.now(), lastPveCooldown: monster.cooldown } : null);

                if (playerHP > 0) {
                    newLog.push(`Bạn đã đánh bại ${monster.name}!`);
                    let rewardsLog = `Phần thưởng: +${monster.qiReward} Linh Khí`;
                    
                    const droppedItems: Item[] = [];
                    monster.drops.forEach(drop => {
                        if(Math.random() < drop.chance) {
                            const item = items.find(i => i.id === drop.itemId);
                            if (item) {
                                for (let i = 0; i < drop.quantity; i++) {
                                    droppedItems.push(item);
                                }
                                rewardsLog += `, ${item.name} x${drop.quantity}`;
                            }
                        }
                    });

                    newLog.push(rewardsLog);
                    addLog(`Bạn đã đánh bại ${monster.name} và nhận được ${monster.qiReward} Linh Khí.`, 'success');

                    setPlayer(p => {
                        if (!p) return null;
                        return { 
                            ...p, 
                            cultivationProgress: p.cultivationProgress + monster.qiReward,
                            inventory: [...p.inventory, ...droppedItems],
                        };
                    });
                } else {
                    newLog.push(`Bạn đã bị ${monster.name} đánh bại.`);
                    addLog(`Bạn đã bị ${monster.name} đánh bại.`, 'danger');
                }
                
                setBattleLog(prev => [...prev, ...newLog, '--- Trận Đấu Kết Thúc ---']);
                setIsFighting(false);
                return;
            }

            // Player attacks
            const monsterDodgeChance = calculateDodgeChance(monster.stats.agi, playerTotalStats.agi);
            if (Math.random() < monsterDodgeChance) {
                newLog.push(`${monster.name} đã né đòn tấn công của bạn!`);
            } else {
                const playerDivisor = playerTotalStats.atk + monster.stats.def;
                const playerRawDamage = playerDivisor > 0 ? playerTotalStats.atk * (playerTotalStats.atk / playerDivisor) : playerTotalStats.atk;
                const playerDamage = Math.max(1, Math.round(playerRawDamage));
                monsterHP -= playerDamage;
                newLog.push(`Bạn gây ${playerDamage} sát thương cho ${monster.name}. [${monster.name} HP: ${Math.max(0, monsterHP)}]`);
            }

            if (monsterHP > 0) {
                // Monster attacks
                const playerDodgeChance = calculateDodgeChance(playerTotalStats.agi, monster.stats.agi);
                if (Math.random() < playerDodgeChance) {
                    newLog.push(`Bạn đã né đòn tấn công của ${monster.name}!`);
                } else {
                    const monsterDivisor = monster.stats.atk + playerTotalStats.def;
                    const monsterRawDamage = monsterDivisor > 0 ? monster.stats.atk * (monster.stats.atk / monsterDivisor) : monster.stats.atk;
                    const monsterDamage = Math.max(1, Math.round(monsterRawDamage));
                    playerHP -= monsterDamage;
                    newLog.push(`${monster.name} gây ${monsterDamage} sát thương cho bạn. [HP của bạn: ${Math.max(0, playerHP)}]`);
                }
            }
            
            setBattleLog(prev => [...prev, ...newLog.splice(0)]);

        }, 1000);
    };

    if (selectedMonster) {
        return (
            <div>
                 <h3 className="text-xl font-bold text-center mb-4 text-red-400">Đang chiến đấu: {selectedMonster.name}</h3>
                 <div className="bg-gray-900 p-4 rounded-lg h-64 overflow-y-auto modal-scrollbar mb-4">
                     {battleLog.map((log, i) => <p key={i} className="text-sm">{log}</p>)}
                 </div>
                 {!isFighting && (
                    <button onClick={() => setSelectedMonster(null)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Quay Lại Chọn
                    </button>
                 )}
            </div>
        )
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-4">Chọn một yêu thú để khiêu chiến:</h3>
            <div className="space-y-3">
                {monsters.map(monster => (
                    <div key={monster.id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-yellow-300">{monster.name}</h4>
                            <p className="text-sm text-gray-400">HP: {monster.stats.hp}, ATK: {monster.stats.atk}, AGI: {monster.stats.agi}</p>
                        </div>
                        <button 
                            onClick={() => handleFight(monster)}
                            disabled={cooldownTime > 0}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {cooldownTime > 0 ? `Chờ ${Math.ceil(cooldownTime)}s` : 'Khiêu Chiến'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PveView;