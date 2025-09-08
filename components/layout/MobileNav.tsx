import React from 'react';
import { useGame } from '../../hooks/useGame';
import type { ModalType } from '../../types';

const NavButton = ({ icon, label, modal, activeModal, setActiveModal }: { icon: JSX.Element; label: string; modal: ModalType; activeModal: ModalType | null; setActiveModal: (modal: ModalType | null) => void; }) => (
    <button onClick={() => setActiveModal(modal)} className="flex flex-col items-center justify-center text-xs w-full text-gray-400 hover:text-purple-400 transition-colors">
        {icon}
        <span className="mt-1">{label}</span>
    </button>
);

const MobileNav: React.FC = () => {
    const { activeModal, setActiveModal } = useGame();
    
    const iconClass = "w-6 h-6";
    const navItems: { icon: JSX.Element; label: string; modal: ModalType; }[] = [
        { icon: <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, label: 'Luyện Thể', modal: 'body-refinement' },
        { icon: <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>, label: 'Thí Luyện', modal: 'pve' },
        { icon: <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.176-5.97M15 21h6m-6-1a6 6 0 009-5.197M15 15v-1a6 6 0 015.176-5.97m-5.176 6a6 6 0 01-9 5.197" /></svg>, label: 'Tông Môn', modal: 'guild' },
        { icon: <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, label: 'Đấu Pháp', modal: 'pvp' },
        { icon: <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>, label: 'Túi Đồ', modal: 'inventory' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-10 bg-gray-800 border-t border-gray-700">
            <div className="flex justify-around items-center h-16">
                {navItems.map(item => (
                    <NavButton key={item.modal} {...item} activeModal={activeModal} setActiveModal={setActiveModal} />
                ))}
            </div>
        </div>
    );
};

export default MobileNav;