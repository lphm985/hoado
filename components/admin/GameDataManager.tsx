import React, { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useGame } from '../../hooks/useGame';
import type { Item, Monster, Stats, ItemDrop } from '../../types';

type ActiveTab = 'monsters' | 'items';

const GameDataManager: React.FC = () => {
    const { items, setItems, monsters, setMonsters } = useGame();
    const [activeTab, setActiveTab] = useState<ActiveTab>('monsters');
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMonster, setEditingMonster] = useState<Monster | null>(null);
    const [editingItem, setEditingItem] = useState<Item | null>(null);

    // Fix: Restructured `openModal` with explicit type guards to resolve TypeScript errors.
    // This ensures that `setEditingMonster` only receives `Monster` types and `setEditingItem` only receives `Item` types.
    const openModal = (entry?: Monster | Item) => {
        if (activeTab === 'monsters') {
            if (!entry) {
                // Create new monster
                setEditingMonster({ id: uuidv4(), name: '', stats: { hp: 10, atk: 2, def: 1, agi: 0 }, qiReward: 10, cooldown: 10, drops: [] });
            } else if ('qiReward' in entry) {
                // Edit existing monster
                setEditingMonster({ ...entry });
            } else {
                // Don't open modal if an item is passed on the monster tab
                return;
            }
        } else { // activeTab === 'items'
            if (!entry) {
                // Create new item
                setEditingItem({ id: uuidv4(), name: '', description: '', type: 'material', equipmentType: 'weapon', stats: { hp: 0, atk: 0, def: 0, agi: 0 } });
            } else if ('description' in entry) {
                // Edit existing item
                setEditingItem({ ...entry });
            } else {
                // Don't open modal if a monster is passed on the item tab
                return;
            }
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingMonster(null);
        setEditingItem(null);
    };
    
    const handleSave = () => {
        if(editingMonster) {
            const index = monsters.findIndex(m => m.id === editingMonster.id);
            if(index > -1) {
                setMonsters(monsters.map((m, i) => i === index ? editingMonster : m));
            } else {
                setMonsters([...monsters, editingMonster]);
            }
        }
        if(editingItem) {
             const index = items.findIndex(i => i.id === editingItem.id);
            if(index > -1) {
                setItems(items.map((i, idx) => idx === index ? editingItem : i));
            } else {
                setItems([...items, editingItem]);
            }
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        if(window.confirm('Bạn có chắc muốn xóa mục này không?')) {
            if(activeTab === 'monsters') {
                setMonsters(monsters.filter(m => m.id !== id));
            } else {
                setItems(items.filter(i => i.id !== id));
            }
        }
    };
    
    const filteredMonsters = useMemo(() => monsters.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())), [monsters, searchTerm]);
    const filteredItems = useMemo(() => items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())), [items, searchTerm]);

    const renderMonsters = () => (
        <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-2">
            {filteredMonsters.map(monster => (
                <div key={monster.id} className="bg-gray-700 p-3 rounded-lg flex flex-col md:flex-row justify-between md:items-center">
                    <div className="mb-2 md:mb-0">
                        <h4 className="font-bold text-yellow-300">{monster.name}</h4>
                        <p className="text-sm text-gray-400">HP: {monster.stats.hp}, ATK: {monster.stats.atk}, DEF: {monster.stats.def}, AGI: {monster.stats.agi}</p>
                    </div>
                    <div className="flex-shrink-0 self-end md:self-auto">
                        <button onClick={() => openModal(monster)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2">Sửa</button>
                        <button onClick={() => handleDelete(monster.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">Xóa</button>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderItems = () => (
        <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-2">
            {filteredItems.map(item => (
                <div key={item.id} className="bg-gray-700 p-3 rounded-lg flex flex-col md:flex-row justify-between md:items-center">
                    <div className="mb-2 md:mb-0">
                        <h4 className="font-bold text-yellow-300">{item.name}</h4>
                        <p className="text-sm text-gray-400 capitalize">{item.type} - {item.description}</p>
                    </div>
                    <div className="flex-shrink-0 self-end md:self-auto">
                        <button onClick={() => openModal(item)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2">Sửa</button>
                        <button onClick={() => handleDelete(item.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">Xóa</button>
                    </div>
                </div>
            ))}
        </div>
    );
    
    const handleMonsterStatChange = (stat: keyof Stats, value: string) => {
        if (!editingMonster) return;
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
            setEditingMonster({
                ...editingMonster,
                stats: { ...editingMonster.stats, [stat]: numValue }
            });
        }
    };
    
    const handleItemStatChange = (stat: keyof Stats, value: string) => {
        if (!editingItem) return;
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
            setEditingItem({
                ...editingItem,
                stats: { ...(editingItem.stats || {hp:0, atk:0, def:0, agi: 0}), [stat]: numValue }
            });
        }
    };
    
    const handleDropChange = (index: number, field: keyof ItemDrop, value: string | number) => {
        if(!editingMonster) return;
        const newDrops = [...editingMonster.drops];
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        if (!isNaN(numValue) || field === 'itemId') {
            (newDrops[index] as any)[field] = field === 'itemId' ? value : numValue;
            setEditingMonster({...editingMonster, drops: newDrops});
        }
    };

    const addDrop = () => {
        if(!editingMonster) return;
        setEditingMonster({
            ...editingMonster,
            drops: [...editingMonster.drops, {itemId: items[0]?.id || '', chance: 0.1, quantity: 1}]
        });
    };
    
    const removeDrop = (index: number) => {
        if(!editingMonster) return;
        setEditingMonster({
            ...editingMonster,
            drops: editingMonster.drops.filter((_, i) => i !== index)
        });
    };

    const renderModal = () => {
        if (!isModalOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                    <div className="flex justify-between items-center p-4 border-b border-gray-700">
                        <h3 className="text-xl font-semibold text-yellow-300">
                            {editingMonster ? 'Sửa Yêu Thú' : 'Sửa Vật Phẩm'}
                        </h3>
                        <button onClick={closeModal} className="text-gray-400 hover:text-white">&times;</button>
                    </div>
                    <div className="p-6 overflow-y-auto modal-scrollbar">
                        {editingMonster && (
                            <div className="space-y-4">
                                <div><label className="block text-sm font-bold mb-1">Tên Yêu Thú</label><input value={editingMonster.name} onChange={e => setEditingMonster({...editingMonster, name: e.target.value})} className="w-full p-2 bg-gray-700 rounded"/></div>
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                                    <div><label className="block text-sm font-bold mb-1">HP</label><input type="number" value={editingMonster.stats.hp} onChange={e => handleMonsterStatChange('hp', e.target.value)} className="w-full p-2 bg-gray-700 rounded"/></div>
                                    <div><label className="block text-sm font-bold mb-1">Công</label><input type="number" value={editingMonster.stats.atk} onChange={e => handleMonsterStatChange('atk', e.target.value)} className="w-full p-2 bg-gray-700 rounded"/></div>
                                    <div><label className="block text-sm font-bold mb-1">Thủ</label><input type="number" value={editingMonster.stats.def} onChange={e => handleMonsterStatChange('def', e.target.value)} className="w-full p-2 bg-gray-700 rounded"/></div>
                                    <div><label className="block text-sm font-bold mb-1">Nhanh Nhẹn</label><input type="number" value={editingMonster.stats.agi} onChange={e => handleMonsterStatChange('agi', e.target.value)} className="w-full p-2 bg-gray-700 rounded"/></div>
                                </div>
                                <div><label className="block text-sm font-bold mb-1">Linh Khí Thưởng</label><input type="number" value={editingMonster.qiReward} onChange={e => setEditingMonster({...editingMonster, qiReward: parseInt(e.target.value) || 0})} className="w-full p-2 bg-gray-700 rounded"/></div>
                                <div><label className="block text-sm font-bold mb-1">Hồi chiêu (giây)</label><input type="number" value={editingMonster.cooldown} onChange={e => setEditingMonster({...editingMonster, cooldown: parseInt(e.target.value) || 0})} className="w-full p-2 bg-gray-700 rounded"/></div>
                                <div>
                                    <h4 className="font-semibold text-yellow-300 mb-2">Vật Phẩm Rơi</h4>
                                    {editingMonster.drops.map((drop, index) => (
                                        <div key={index} className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2 p-2 border border-gray-700 sm:border-none rounded-lg items-center">
                                            <select value={drop.itemId} onChange={e => handleDropChange(index, 'itemId', e.target.value)} className="p-2 bg-gray-700 rounded col-span-2"><option value="">- Chọn Vật Phẩm -</option>{items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</select>
                                            <input type="number" step="0.01" min="0" max="1" value={drop.chance} onChange={e => handleDropChange(index, 'chance', e.target.value)} className="p-2 bg-gray-700 rounded" placeholder="Tỷ Lệ"/>
                                            <div className="flex items-center"><input type="number" min="1" value={drop.quantity} onChange={e => handleDropChange(index, 'quantity', e.target.value)} className="p-2 bg-gray-700 rounded w-full"/><button onClick={() => removeDrop(index)} className="ml-2 text-red-500 hover:text-red-400 text-2xl font-bold">&times;</button></div>
                                        </div>
                                    ))}
                                    <button onClick={addDrop} className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">Thêm Vật Phẩm Rơi</button>
                                </div>
                            </div>
                        )}
                        {editingItem && (
                            <div className="space-y-4">
                                <div><label className="block text-sm font-bold mb-1">Tên Vật Phẩm</label><input value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="w-full p-2 bg-gray-700 rounded"/></div>
                                <div><label className="block text-sm font-bold mb-1">Mô Tả</label><input value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} className="w-full p-2 bg-gray-700 rounded"/></div>
                                <div><label className="block text-sm font-bold mb-1">Loại</label><select value={editingItem.type} onChange={e => setEditingItem({...editingItem, type: e.target.value as any})} className="w-full p-2 bg-gray-700 rounded"><option value="material">Nguyên Liệu</option><option value="consumable">Tiêu Hao</option><option value="equipment">Trang Bị</option></select></div>
                                {editingItem.type === 'equipment' && (
                                     <>
                                        <div>
                                            <label className="block text-sm font-bold mb-1">Loại Trang Bị</label>
                                            <select 
                                                value={editingItem.equipmentType || 'weapon'} 
                                                onChange={e => setEditingItem({...editingItem, equipmentType: e.target.value as any})} 
                                                className="w-full p-2 bg-gray-700 rounded"
                                            >
                                                <option value="weapon">Vũ Khí (Kiếm)</option>
                                                <option value="armor">Giáp</option>
                                                <option value="accessory">Phụ Trợ</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                                            <div><label className="block text-sm font-bold mb-1">HP</label><input type="number" value={editingItem.stats?.hp || 0} onChange={e => handleItemStatChange('hp', e.target.value)} className="w-full p-2 bg-gray-700 rounded"/></div>
                                            <div><label className="block text-sm font-bold mb-1">Công</label><input type="number" value={editingItem.stats?.atk || 0} onChange={e => handleItemStatChange('atk', e.target.value)} className="w-full p-2 bg-gray-700 rounded"/></div>
                                            <div><label className="block text-sm font-bold mb-1">Thủ</label><input type="number" value={editingItem.stats?.def || 0} onChange={e => handleItemStatChange('def', e.target.value)} className="w-full p-2 bg-gray-700 rounded"/></div>
                                            <div><label className="block text-sm font-bold mb-1">Nhanh Nhẹn</label><input type="number" value={editingItem.stats?.agi || 0} onChange={e => handleItemStatChange('agi', e.target.value)} className="w-full p-2 bg-gray-700 rounded"/></div>
                                        </div>
                                     </>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t border-gray-700 flex justify-end">
                        <button onClick={closeModal} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">Hủy</button>
                        <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Lưu</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-purple-400 mb-6">Quản Lý Dữ Liệu Game</h2>

            <div className="flex border-b border-gray-700 mb-4">
                <button onClick={() => { setActiveTab('monsters'); setSearchTerm(''); }} className={`py-2 px-4 ${activeTab === 'monsters' ? 'border-b-2 border-purple-400 text-purple-400' : 'text-gray-400'}`}>Quản Lý Yêu Thú</button>
                <button onClick={() => { setActiveTab('items'); setSearchTerm(''); }} className={`py-2 px-4 ${activeTab === 'items' ? 'border-b-2 border-purple-400 text-purple-400' : 'text-gray-400'}`}>Quản Lý Vật Phẩm</button>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                 <input
                    type="text"
                    placeholder={`Tìm ${activeTab === 'monsters' ? 'Yêu Thú' : 'Vật Phẩm'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button onClick={() => openModal()} className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Thêm {activeTab === 'monsters' ? 'Yêu Thú' : 'Vật Phẩm'} Mới
                </button>
            </div>

            {activeTab === 'monsters' ? renderMonsters() : renderItems()}
            {renderModal()}
        </div>
    );
};

export default GameDataManager;