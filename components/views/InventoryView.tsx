import React from 'react';
import { useGame } from '../../hooks/useGame';
import type { Item } from '../../types';

const InventoryView: React.FC = () => {
    const { player, setPlayer } = useGame();

    if (!player) {
        return <div className="text-center p-8">Đang tải túi đồ...</div>;
    }

    const handleEquip = (itemToEquip: Item) => {
        if (itemToEquip.type !== 'equipment' || !itemToEquip.equipmentType) return;

        const slot = itemToEquip.equipmentType;

        setPlayer(p => {
            if (!p) return null;

            const currentItem = p.equipment[slot];
            
            // Find the first occurrence of the item to equip in the inventory
            const itemIndex = p.inventory.findIndex(i => i.id === itemToEquip.id);
            if (itemIndex === -1) return p; // Should not happen if UI is correct

            const newInventory = [...p.inventory];
            const itemToActuallyEquip = newInventory.splice(itemIndex, 1)[0]; // Remove one instance and get it

            if (currentItem) {
                newInventory.push(currentItem); // Add the currently equipped item back
            }

            return {
                ...p,
                inventory: newInventory,
                equipment: {
                    ...p.equipment,
                    [slot]: itemToActuallyEquip,
                }
            };
        });
    };

    const handleUnequip = (slot: keyof typeof player.equipment) => {
        setPlayer(p => {
            if (!p) return null;
            const itemToUnequip = p.equipment[slot];
            if (!itemToUnequip) return p;

            return {
                ...p,
                inventory: [...p.inventory, itemToUnequip],
                equipment: {
                    ...p.equipment,
                    [slot]: null,
                }
            };
        });
    };

    const groupedInventory: { [key: string]: { item: Item, count: number } } = player.inventory.reduce((acc, item) => {
        if (!acc[item.id]) {
            acc[item.id] = { item, count: 0 };
        }
        acc[item.id].count++;
        return acc;
    }, {} as { [key: string]: { item: Item, count: number } });

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
            case 'accessory': return 'Phụ Trợ';
            default: return slot;
        }
    };

    return (
        <div>
             <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-semibold text-purple-400">Túi Đồ</h3>
                 <p className="text-gray-400">Linh Thạch: <span className="text-yellow-300">{player.spiritStones.toLocaleString()}</span></p>
            </div>

            {/* Equipped Items Section */}
            <div className="mb-6">
                <h4 className="font-semibold text-yellow-300 mb-3 border-b border-gray-700 pb-2">Trang Bị Trên Người</h4>
                <div className="space-y-2">
                    {Object.entries(player.equipment).map(([slot, item]) => (
                        <div key={slot} className="bg-gray-700 p-2 rounded-lg flex items-center justify-between">
                           <div className="flex items-center space-x-3">
                                <span className="text-gray-500 capitalize w-20">{translateSlot(slot)}:</span>
                                {item ? (
                                    <div>
                                        <p className="font-bold">{item.name}</p>
                                        {renderItemStats(item)}
                                    </div>
                                ) : <p className="text-gray-500">Trống</p>}
                           </div>
                           {item && <button onClick={() => handleUnequip(slot as keyof typeof player.equipment)} className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-3 rounded">Tháo Ra</button>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Inventory Section */}
            <div>
                 <h4 className="font-semibold text-yellow-300 mb-3 border-b border-gray-700 pb-2">Vật Phẩm Trong Túi</h4>
                {Object.keys(groupedInventory).length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Túi đồ của bạn trống rỗng.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.values(groupedInventory).map(({ item, count }) => (
                            <div key={item.id} className="bg-gray-700 p-3 rounded-lg flex flex-col justify-between">
                                <div>
                                    <p className="font-bold">{item.name} <span className="text-gray-400 text-sm">x{count}</span></p>
                                    <p className="text-xs text-gray-400 mb-1">{item.description}</p>
                                    {renderItemStats(item)}
                                </div>
                                {item.type === 'equipment' && (
                                     <button onClick={() => handleEquip(item)} className="mt-2 text-xs w-full bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded">Trang Bị</button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryView;