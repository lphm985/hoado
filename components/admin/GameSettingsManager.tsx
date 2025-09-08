import React, { useState, useMemo } from 'react';
import { useGame } from '../../hooks/useGame';
import type { Stats } from '../../types';

const GameSettingsManager: React.FC = () => {
    const { bodyRefinementConfig, setBodyRefinementConfig } = useGame();
    const [localConfig, setLocalConfig] = useState<{ [level: number]: Stats }>(bodyRefinementConfig);
    const [searchTerm, setSearchTerm] = useState('');

    const handleStatChange = (level: number, stat: keyof Stats, value: string) => {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
            setLocalConfig(prev => ({
                ...prev,
                [level]: { ...(prev[level] || { hp: 0, atk: 0, def: 0, agi: 0 }), [stat]: numValue }
            }));
        }
    };

    const handleAddLevel = () => {
        const newLevel = Object.keys(localConfig).length > 0 ? Math.max(...Object.keys(localConfig).map(Number)) + 1 : 1;
        setLocalConfig(prev => ({
            ...prev,
            [newLevel]: { hp: 0, atk: 0, def: 0, agi: 0 }
        }));
    };

    const handleSaveChanges = () => {
        setBodyRefinementConfig(localConfig);
        alert('Lưu cài đặt game thành công!');
    };

    const configAsArray = useMemo(() =>
        Object.entries(localConfig)
            .map(([level, stats]) => ({ level: Number(level), stats }))
            .sort((a, b) => a.level - b.level)
            .filter(item => item.level.toString().includes(searchTerm)),
        [localConfig, searchTerm]
    );

    return (
        <div>
            <h2 className="text-3xl font-bold text-purple-400 mb-6">Cài Đặt Game</h2>

            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-yellow-300 mb-2">Chỉ Số Tăng Khi Luyện Thể</h3>
                <p className="text-sm text-gray-400 mb-4">
                    Chỉ số dưới đây là phần thưởng cố định cho 20 cấp Luyện Thể có thể thực hiện trong mỗi cảnh giới. "Cấp 1" tương ứng với lần luyện thể đầu tiên trong một cảnh giới, "Cấp 2" là lần thứ hai, v.v.
                </p>
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <input
                        type="text"
                        placeholder="Tìm theo cấp..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/3 p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button onClick={handleAddLevel} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Thêm Cấp Mới</button>
                </div>
                
                <div className="max-h-[55vh] overflow-y-auto pr-2">
                    <div className="hidden md:grid grid-cols-5 gap-2 font-bold mb-2 p-2 border-b border-gray-700">
                        <span>Cấp</span>
                        <span>HP Tăng</span>
                        <span>Công Tăng</span>
                        <span>Thủ Tăng</span>
                        <span>Nhanh Nhẹn Tăng</span>
                    </div>
                    {configAsArray.map(({ level, stats }) => (
                        <div key={level} className="bg-gray-700 p-3 rounded-lg mb-2 md:grid md:grid-cols-5 md:gap-2 md:items-center md:p-2 md:bg-transparent md:hover:bg-gray-700 md:mb-0">
                            <div className="flex justify-between items-center text-lg md:text-base mb-2 md:mb-0">
                                <span className="font-bold text-gray-400 md:hidden">Cấp:</span>
                                <span className="font-bold">{level}</span>
                            </div>

                            <div className="mb-2 md:mb-0">
                                <label className="text-sm text-gray-400 md:hidden">HP Tăng</label>
                                <input type="number" value={stats.hp} onChange={e => handleStatChange(level, 'hp', e.target.value)} className="w-full p-2 bg-gray-600 rounded mt-1 md:mt-0"/>
                            </div>
                            <div className="mb-2 md:mb-0">
                                <label className="text-sm text-gray-400 md:hidden">Công Tăng</label>
                                <input type="number" value={stats.atk} onChange={e => handleStatChange(level, 'atk', e.target.value)} className="w-full p-2 bg-gray-600 rounded mt-1 md:mt-0"/>
                            </div>
                            <div className="mb-2 md:mb-0">
                                <label className="text-sm text-gray-400 md:hidden">Thủ Tăng</label>
                                <input type="number" value={stats.def} onChange={e => handleStatChange(level, 'def', e.target.value)} className="w-full p-2 bg-gray-600 rounded mt-1 md:mt-0"/>
                            </div>
                             <div className="mb-2 md:mb-0">
                                <label className="text-sm text-gray-400 md:hidden">Nhanh Nhẹn Tăng</label>
                                <input type="number" value={stats.agi} onChange={e => handleStatChange(level, 'agi', e.target.value)} className="w-full p-2 bg-gray-600 rounded mt-1 md:mt-0"/>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-6">
                    <button onClick={handleSaveChanges} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Lưu Tất Cả Cài Đặt
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameSettingsManager;