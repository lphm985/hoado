import React, { useState, useMemo } from 'react';
import { useGame } from '../../hooks/useGame';
import type { Player, Stats, Item, Equipment } from '../../types';

const PlayerManager: React.FC = () => {
    const { realms, items } = useGame();

    const [players, setPlayers] = useState<Player[]>(() => {
        const savedPlayersJSON = localStorage.getItem('players');
        if (savedPlayersJSON) {
            const playersObject = JSON.parse(savedPlayersJSON);
            return Object.values(playersObject);
        }
        return [];
    });

    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [itemToAddId, setItemToAddId] = useState<string>(items[0]?.id || '');

    const handleSelectPlayer = (player: Player) => {
        setSelectedPlayer(player);
        setEditingPlayer({ ...player });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editingPlayer) return;
        const { name, value } = e.target;
        const numericFields = ['cultivationProgress', 'bodyLevel', 'spiritStones'];
        if (numericFields.includes(name)) {
             setEditingPlayer({ ...editingPlayer, [name]: parseInt(value, 10) || 0 });
        } else {
            setEditingPlayer({ ...editingPlayer, [name]: value });
        }
    };

    const handleStatChange = (stat: keyof Stats, value: string) => {
        if (!editingPlayer) return;
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
            setEditingPlayer({
                ...editingPlayer,
                stats: { ...editingPlayer.stats, [stat]: numValue }
            });
        }
    };

    const handleSaveChanges = () => {
        if (!editingPlayer || !selectedPlayer) return;

        const playerToSave = { ...editingPlayer };
        if (selectedPlayer.username !== editingPlayer.username) {
            playerToSave.id = editingPlayer.username;
        }

        const savedPlayersJSON = localStorage.getItem('players');
        const playersObject = savedPlayersJSON ? JSON.parse(savedPlayersJSON) : {};

        if (selectedPlayer.username !== editingPlayer.username && playersObject[selectedPlayer.username]) {
            delete playersObject[selectedPlayer.username];
        }

        playersObject[playerToSave.username] = playerToSave;
        localStorage.setItem('players', JSON.stringify(playersObject));

        setPlayers(players.map(p => p.id === selectedPlayer.id ? playerToSave : p));
        setSelectedPlayer(playerToSave);
        
        alert('Lưu người chơi thành công!');
    };

    const handleDeletePlayer = () => {
        if (!selectedPlayer) return;
        if (window.confirm(`Bạn có chắc muốn xóa ${selectedPlayer.username} không?`)) {
            const savedPlayersJSON = localStorage.getItem('players');
            const playersObject = savedPlayersJSON ? JSON.parse(savedPlayersJSON) : {};
            delete playersObject[selectedPlayer.username];
            localStorage.setItem('players', JSON.stringify(playersObject));

            setPlayers(players.filter(p => p.id !== selectedPlayer.id));
            setSelectedPlayer(null);
            setEditingPlayer(null);
        }
    };
    
    // --- Inventory Handlers ---
    const handleAddItem = () => {
        if (!editingPlayer || !itemToAddId) return;
        const item = items.find(i => i.id === itemToAddId);
        if (!item) return;
        setEditingPlayer({ ...editingPlayer, inventory: [...editingPlayer.inventory, item] });
    };

    const handleRemoveItem = (itemToRemove: Item) => {
        if (!editingPlayer) return;
        const itemIndex = editingPlayer.inventory.findIndex(i => i.id === itemToRemove.id);
        if (itemIndex > -1) {
            const newInventory = [...editingPlayer.inventory];
            newInventory.splice(itemIndex, 1);
            setEditingPlayer({ ...editingPlayer, inventory: newInventory });
        }
    };

    const handleEquipItem = (itemToEquip: Item) => {
        if (!editingPlayer || !itemToEquip.equipmentType) return;
        const slot = itemToEquip.equipmentType;
        const currentItemInSlot = editingPlayer.equipment[slot];

        // Find the specific instance of the item to remove
        const itemIndexInInventory = editingPlayer.inventory.findIndex(i => i === itemToEquip);

        if (itemIndexInInventory === -1) return;

        const newInventory = [...editingPlayer.inventory];
        newInventory.splice(itemIndexInInventory, 1);
        if (currentItemInSlot) {
            newInventory.push(currentItemInSlot);
        }
        
        setEditingPlayer({
            ...editingPlayer,
            inventory: newInventory,
            equipment: { ...editingPlayer.equipment, [slot]: itemToEquip }
        });
    };

    const handleUnequipItem = (slot: keyof Equipment) => {
        if (!editingPlayer) return;
        const itemToUnequip = editingPlayer.equipment[slot];
        if (!itemToUnequip) return;
        setEditingPlayer({
            ...editingPlayer,
            inventory: [...editingPlayer.inventory, itemToUnequip],
            equipment: { ...editingPlayer.equipment, [slot]: null }
        });
    };
    
    const filteredPlayers = useMemo(() => 
        players.filter(p => p.username.toLowerCase().includes(searchTerm.toLowerCase())),
        [players, searchTerm]
    );

    const groupedInventory = useMemo(() => {
        if (!editingPlayer) return {};
        return editingPlayer.inventory.reduce((acc, item, index) => {
            const uniqueKey = `${item.id}-${index}`; // Create a truly unique key for each item instance
            acc[uniqueKey] = { item, count: 1 }; // Each item is now unique
            return acc;
        }, {} as { [key: string]: { item: Item, count: number } });
    }, [editingPlayer]);

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
            <h2 className="text-3xl font-bold text-purple-400 mb-6">Quản Lý Người Chơi</h2>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Player List */}
                <div className="w-full md:w-1/3 bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold text-yellow-300 mb-4">Người Chơi</h3>
                    <input
                        type="text"
                        placeholder="Tìm theo tên người dùng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 mb-4 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="max-h-[60vh] md:max-h-[calc(100vh-20rem)] overflow-y-auto pr-2 modal-scrollbar">
                        {filteredPlayers.map(p => (
                            <button
                                key={p.id}
                                onClick={() => handleSelectPlayer(p)}
                                className={`w-full text-left p-2 rounded mb-2 ${selectedPlayer?.id === p.id ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                            >
                                {p.username}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Player Editor */}
                <div className="w-full md:w-2/3 bg-gray-800 p-4 rounded-lg">
                    {editingPlayer ? (
                        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto modal-scrollbar pr-2">
                            <h3 className="text-xl font-semibold text-yellow-300 mb-4">Chỉnh Sửa Người Chơi: {editingPlayer.username}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-bold mb-1">Tên Người Dùng</label><input name="username" value={editingPlayer.username} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded"/></div>
                                <div><label className="block text-sm font-bold mb-1">Cảnh Giới</label><select name="realmId" value={editingPlayer.realmId} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded">{realms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
                                <div><label className="block text-sm font-bold mb-1">Tiến Độ Tu Luyện</label><input name="cultivationProgress" type="number" value={editingPlayer.cultivationProgress} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded"/></div>
                                <div><label className="block text-sm font-bold mb-1">Cấp Luyện Thể</label><input name="bodyLevel" type="number" value={editingPlayer.bodyLevel} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded"/></div>
                                <div><label className="block text-sm font-bold mb-1">Linh Thạch</label><input name="spiritStones" type="number" value={editingPlayer.spiritStones} onChange={handleInputChange} className="w-full p-2 bg-gray-700 rounded"/></div>
                                <div/>
                                <div><label className="block text-sm font-bold mb-1">HP</label><input type="number" value={editingPlayer.stats.hp} onChange={e => handleStatChange('hp', e.target.value)} className="w-full p-2 bg-gray-700 rounded"/></div>
                                <div><label className="block text-sm font-bold mb-1">Công</label><input type="number" value={editingPlayer.stats.atk} onChange={e => handleStatChange('atk', e.target.value)} className="w-full p-2 bg-gray-700 rounded"/></div>
                                <div><label className="block text-sm font-bold mb-1">Thủ</label><input type="number" value={editingPlayer.stats.def} onChange={e => handleStatChange('def', e.target.value)} className="w-full p-2 bg-gray-700 rounded"/></div>
                                <div><label className="block text-sm font-bold mb-1">Nhanh Nhẹn</label><input type="number" value={editingPlayer.stats.agi} onChange={e => handleStatChange('agi', e.target.value)} className="w-full p-2 bg-gray-700 rounded"/></div>
                            </div>

                             {/* Inventory Management Section */}
                            <div className="mt-6 pt-4 border-t border-gray-700">
                                <h4 className="text-lg font-semibold text-yellow-300 mb-3">Túi Đồ & Trang Bị</h4>
                                <div className="flex gap-2 mb-4">
                                    <select value={itemToAddId} onChange={e => setItemToAddId(e.target.value)} className="w-full p-2 bg-gray-700 rounded">
                                        {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                    </select>
                                    <button onClick={handleAddItem} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Thêm</button>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <h5 className="font-bold mb-2">Đã Trang Bị</h5>
                                        <div className="space-y-2">
                                            {Object.entries(editingPlayer.equipment).map(([slot, item]) => (
                                                <div key={slot} className="bg-gray-900 p-2 rounded-lg flex items-center justify-between">
                                                    <span className="text-gray-400 capitalize w-20">{translateSlot(slot)}:</span>
                                                    {item ? <span className="font-semibold">{item.name}</span> : <span className="text-gray-500">Trống</span>}
                                                    {item && <button onClick={() => handleUnequipItem(slot as keyof Equipment)} className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white py-1 px-2 rounded">Tháo Ra</button>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-bold mb-2">Túi Đồ</h5>
                                        {Object.keys(groupedInventory).length === 0 ? (
                                            <p className="text-gray-500">Túi đồ trống.</p>
                                        ) : (
                                            <div className="space-y-2 max-h-48 overflow-y-auto modal-scrollbar pr-2">
                                                {Object.values(groupedInventory).map(({ item }, index) => (
                                                    <div key={index} className="bg-gray-900 p-2 rounded-lg flex items-center justify-between">
                                                        <span>{item.name}</span>
                                                        <div className="flex gap-1">
                                                            {item.type === 'equipment' && <button onClick={() => handleEquipItem(item)} className="text-xs bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded">Trang Bị</button>}
                                                            <button onClick={() => handleRemoveItem(item)} className="text-xs bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded">Xóa</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex gap-4">
                                <button onClick={handleSaveChanges} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Lưu Thay Đổi</button>
                                <button onClick={handleDeletePlayer} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Xóa Người Chơi</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-400">Chọn một người chơi để xem và chỉnh sửa thông tin.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlayerManager;