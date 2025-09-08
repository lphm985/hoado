import React from 'react';
import { useGame } from '../../hooks/useGame';
import type { ModalType } from '../../types';

const ActionButton = ({ label, modal, onClick }: { label: string, modal: ModalType, onClick: (modal: ModalType) => void }) => (
    <button
        onClick={() => onClick(modal)}
        className="bg-gray-700 hover:bg-purple-600 text-gray-200 font-medium text-sm py-2 px-3 rounded-lg transition duration-200 text-left w-full shadow-md"
    >
        {label}
    </button>
);

const MainContentPanel: React.FC = () => {
    const { setActiveModal } = useGame();
    
    const actions: {label: string, modal: ModalType}[] = [
        { label: 'Luyện Thể', modal: 'body-refinement' },
        { label: 'Thám Hiểm', modal: 'exploration' },
        { label: 'Công Pháp', modal: 'skills' },
        { label: 'Luyện Đan', modal: 'alchemy' },
        { label: 'Thí Luyện Chi Địa', modal: 'pve' },
        { label: 'Đấu Pháp', modal: 'pvp' },
        { label: 'Tông Môn', modal: 'guild' },
        { label: 'Chợ Giao Dịch', modal: 'marketplace' },
        { label: 'Lĩnh Ngộ', modal: 'talents' },
        { label: 'Túi Đồ', modal: 'inventory' },
    ];

    return (
        <div className="bg-gray-800 p-4 rounded-lg h-full flex flex-col shadow-lg">
            <h2 className="text-xl font-bold text-yellow-300 mb-4 text-center">Hoạt Động</h2>
            <div className="flex-grow grid grid-cols-1 gap-2 overflow-y-auto pr-2 modal-scrollbar">
                {actions.map(action => (
                    <ActionButton key={action.modal} label={action.label} modal={action.modal} onClick={setActiveModal} />
                ))}
            </div>
        </div>
    );
};

export default MainContentPanel;