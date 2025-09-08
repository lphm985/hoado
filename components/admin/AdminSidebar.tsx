import React from 'react';
import type { AdminView } from '../../pages/AdminPage';

interface AdminSidebarProps {
    setActiveView: (view: AdminView) => void;
    onLogout: () => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ setActiveView, onLogout, isOpen, setIsOpen }) => {
    
    const handleNavigate = (view: AdminView) => {
        setActiveView(view);
        setIsOpen(false);
    };

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden ${isOpen ? 'block' : 'hidden'}`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            ></div>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-800 p-4 flex-shrink-0 flex flex-col z-40
                transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 md:h-screen md:sticky md:top-0`}>
                <div className="flex-grow">
                    <h1 className="text-2xl font-bold text-yellow-300 mb-8">Bảng Quản Trị</h1>
                    <nav>
                        <ul>
                            <li className="mb-4"><button onClick={() => handleNavigate('dashboard')} className="text-left w-full hover:text-purple-400 transition-colors">Bảng Điều Khiển</button></li>
                            <li className="mb-4"><button onClick={() => handleNavigate('players')} className="text-left w-full hover:text-purple-400 transition-colors">Quản Lý Người Chơi</button></li>
                            <li className="mb-4"><button onClick={() => handleNavigate('game-data')} className="text-left w-full hover:text-purple-400 transition-colors">Dữ Liệu Game</button></li>
                            <li className="mb-4"><button onClick={() => handleNavigate('game-settings')} className="text-left w-full hover:text-purple-400 transition-colors">Cài Đặt Game</button></li>
                            <li className="mb-4"><button onClick={() => handleNavigate('realms')} className="text-left w-full hover:text-purple-400 transition-colors">Quản lý Cảnh Giới</button></li>
                        </ul>
                    </nav>
                </div>
                 <button
                    onClick={onLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    aria-label="Đăng xuất"
                >
                    Đăng Xuất
                </button>
            </aside>
        </>
    );
};

export default AdminSidebar;