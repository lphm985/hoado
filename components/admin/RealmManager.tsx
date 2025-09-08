import React, { useState, useMemo } from 'react';
import { useGame } from '../../hooks/useGame';
import type { Realm, Stats } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const RealmManager: React.FC = () => {
    const { realms, setRealms } = useGame();
    const [editingRealm, setEditingRealm] = useState<Realm | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const openModal = (realm?: Realm) => {
        if (realm) {
            setEditingRealm({ ...realm });
        } else {
            setEditingRealm({
                id: uuidv4(),
                name: '',
                order: realms.length,
                qiNeeded: 1000,
                breakthroughGains: {
                    flatGains: { hp: 10, atk: 2, def: 1, agi: 0 },
                    percentGains: { hp: 0, atk: 0, def: 0, agi: 0 }
                },
                qiRate: 1,
                breakthroughChance: 0.8,
                qiLossOnFailure: 0.1,
                bodyRefinementCostPercent: 0.1,
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRealm(null);
    };

    const handleSave = () => {
        if (!editingRealm) return;

        const index = realms.findIndex(r => r.id === editingRealm.id);
        if (index > -1) {
            const updatedRealms = [...realms];
            updatedRealms[index] = editingRealm;
            setRealms(updatedRealms.sort((a, b) => a.order - b.order));
        } else {
            setRealms([...realms, editingRealm].sort((a, b) => a.order - b.order));
        }
        closeModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Bạn có chắc muốn xóa cảnh giới này không? Điều này có thể ảnh hưởng đến người chơi hiện tại.')) {
            setRealms(realms.filter(r => r.id !== id));
        }
    };
    
    const handleBreakthroughGainsChange = (stat: keyof Stats, type: 'flatGains' | 'percentGains', value: string) => {
        if (!editingRealm) return;
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            const finalValue = type === 'percentGains' ? Math.max(0, numValue) / 100 : Math.floor(numValue);
            const gainsType = editingRealm.breakthroughGains[type];
            setEditingRealm({
                ...editingRealm,
                breakthroughGains: {
                    ...editingRealm.breakthroughGains,
                    [type]: {
                        ...gainsType,
                        [stat]: finalValue
                    }
                }
            });
        }
    };
    
    const handleBreakthroughChanceChange = (value: string) => {
        if (!editingRealm) return;
        const percentage = parseFloat(value);
        if(!isNaN(percentage)) {
             setEditingRealm({
                ...editingRealm,
                breakthroughChance: Math.max(0, Math.min(100, percentage)) / 100
             });
        }
    };

    const handleQiLossChange = (value: string) => {
        if (!editingRealm) return;
        const percentage = parseFloat(value);
        if(!isNaN(percentage)) {
             setEditingRealm({
                ...editingRealm,
                qiLossOnFailure: Math.max(0, Math.min(100, percentage)) / 100
             });
        }
    };
    
    const handleBodyRefinementCostChange = (value: string) => {
        if (!editingRealm) return;
        const percentage = parseFloat(value);
        if(!isNaN(percentage)) {
             setEditingRealm({
                ...editingRealm,
                bodyRefinementCostPercent: Math.max(0, Math.min(100, percentage)) / 100
             });
        }
    };


    const filteredRealms = useMemo(() =>
        [...realms]
            .sort((a, b) => a.order - b.order)
            .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [realms, searchTerm]
    );

    const renderModal = () => {
        if (!isModalOpen || !editingRealm) return null;
        
        const { flatGains, percentGains } = editingRealm.breakthroughGains;

        return (
             <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                    <div className="flex justify-between items-center p-4 border-b border-gray-700">
                        <h3 className="text-xl font-semibold text-yellow-300">
                            {editingRealm.id.length > 20 ? 'Thêm Cảnh Giới Mới' : 'Sửa Cảnh Giới'}
                        </h3>
                        <button onClick={closeModal} className="text-gray-400 hover:text-white">&times;</button>
                    </div>
                    <div className="p-6 overflow-y-auto modal-scrollbar space-y-4">
                        <div><label className="block text-sm font-bold mb-1">Tên Cảnh Giới</label><input value={editingRealm.name} onChange={e => setEditingRealm({...editingRealm, name: e.target.value})} className="w-full p-2 bg-gray-700 rounded"/></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-bold mb-1">Thứ Tự</label><input type="number" value={editingRealm.order} onChange={e => setEditingRealm({...editingRealm, order: parseInt(e.target.value) || 0})} className="w-full p-2 bg-gray-700 rounded"/></div>
                            <div><label className="block text-sm font-bold mb-1">Tốc Độ Linh Khí (mỗi giây)</label><input type="number" value={editingRealm.qiRate} onChange={e => setEditingRealm({...editingRealm, qiRate: parseInt(e.target.value) || 0})} className="w-full p-2 bg-gray-700 rounded"/></div>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-bold mb-1">Tỷ Lệ Thành Công (%)</label><input type="number" min="0" max="100" value={Math.round(editingRealm.breakthroughChance * 100)} onChange={e => handleBreakthroughChanceChange(e.target.value)} className="w-full p-2 bg-gray-700 rounded"/></div>
                            <div><label className="block text-sm font-bold mb-1">Mất Linh Khí Khi Thất Bại (%)</label><input type="number" min="0" max="100" value={Math.round(editingRealm.qiLossOnFailure * 100)} onChange={e => handleQiLossChange(e.target.value)} className="w-full p-2 bg-gray-700 rounded"/></div>
                        </div>
                        <div><label className="block text-sm font-bold mb-1">Linh Khí Cần Để Đột Phá</label><input type="number" value={editingRealm.qiNeeded} onChange={e => setEditingRealm({...editingRealm, qiNeeded: parseInt(e.target.value) || 0})} className="w-full p-2 bg-gray-700 rounded"/></div>
                        <div><label className="block text-sm font-bold mb-1">Chi Phí Luyện Thể (% Linh Khí Cần)</label><input type="number" min="0" max="100" value={Math.round((editingRealm.bodyRefinementCostPercent || 0) * 100)} onChange={e => handleBodyRefinementCostChange(e.target.value)} className="w-full p-2 bg-gray-700 rounded"/></div>
                        <h4 className="font-semibold text-yellow-300 pt-2 border-t border-gray-700">Chỉ Số Tăng Khi Đột Phá</h4>
                        <div className="grid grid-cols-4 gap-x-4 gap-y-2">
                             <div className="col-span-2"><label className="block text-sm font-bold mb-1">Cộng Thẳng (+)</label></div>
                             <div className="col-span-2"><label className="block text-sm font-bold mb-1">Theo Phần Trăm (%)</label></div>

                            {(['hp', 'atk', 'def', 'agi'] as const).map(stat => (
                                <React.Fragment key={stat}>
                                    <label className="font-semibold uppercase self-center">{stat}</label>
                                    <input type="number" value={flatGains[stat]} onChange={e => handleBreakthroughGainsChange(stat, 'flatGains', e.target.value)} className="w-full p-2 bg-gray-700 rounded"/>
                                    <label className="font-semibold uppercase self-center">{stat}%</label>
                                    <input type="number" value={percentGains[stat] * 100} onChange={e => handleBreakthroughGainsChange(stat, 'percentGains', e.target.value)} className="w-full p-2 bg-gray-700 rounded"/>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 border-t border-gray-700 flex justify-end">
                        <button onClick={closeModal} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">Hủy</button>
                        <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Lưu Cảnh Giới</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-purple-400">Quản Lý Cảnh Giới</h2>
                <button onClick={() => openModal()} className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Thêm Cảnh Giới Mới</button>
            </div>
             <input
                type="text"
                placeholder="Tìm theo tên cảnh giới..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-4 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
             <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-2 bg-gray-800 p-4 rounded-lg">
                {filteredRealms.map(realm => (
                    <div key={realm.id} className="bg-gray-700 p-3 rounded-lg flex flex-col md:flex-row justify-between md:items-center">
                        <div>
                            <h4 className="font-bold text-yellow-300">{realm.order}. {realm.name}</h4>
                             <p className="text-sm text-gray-400">Linh Khí: {realm.qiRate}/s | Cần: {realm.qiNeeded.toLocaleString()} | Tỷ lệ: <span className="font-semibold text-sky-300">{Math.round(realm.breakthroughChance * 100)}%</span> | Mất: <span className="font-semibold text-red-400">{Math.round(realm.qiLossOnFailure * 100)}%</span> | L.Thể: <span className="font-semibold text-green-300">{Math.round((realm.bodyRefinementCostPercent || 0) * 100)}%</span></p>
                             <p className="text-xs text-gray-300">Tăng (+): {Object.entries(realm.breakthroughGains.flatGains).map(([k,v]) => `${k.toUpperCase()}:${v}`).join(', ')}</p>
                             <p className="text-xs text-gray-300">Tăng (%): {Object.entries(realm.breakthroughGains.percentGains).map(([k,v]) => `${k.toUpperCase()}:${v*100}%`).join(', ')}</p>
                        </div>
                        <div className="flex-shrink-0 self-end md:self-auto mt-2 md:mt-0">
                            <button onClick={() => openModal(realm)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2">Sửa</button>
                            <button onClick={() => handleDelete(realm.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">Xóa</button>
                        </div>
                    </div>
                ))}
            </div>
            {renderModal()}
        </div>
    );
};

export default RealmManager;