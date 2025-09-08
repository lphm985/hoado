import React, { useState } from 'react';

interface AuthPageProps {
    onLogin: (username: string, password: string) => boolean;
    onRegister: (username: string, password: string) => boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            onLogin(username, password);
        } else {
            if (password !== confirmPassword) {
                alert("Mật khẩu không khớp.");
                return;
            }
            if(password.length < 6) {
                alert("Mật khẩu phải có ít nhất 6 ký tự.");
                return;
            }
            const success = onRegister(username, password);
            if (success) {
                setIsLogin(true); // Switch to login form after successful registration
                setUsername('');
                setPassword('');
                setConfirmPassword('');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-gray-200 p-4">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-yellow-300">Thiên Hạ Đồ</h1>
                <p className="text-purple-400 mt-2">Thiên Niên Sử</p>
            </div>
            <div className="w-full max-w-md bg-gray-800 p-6 sm:p-8 rounded-lg shadow-2xl">
                <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Đăng Nhập' : 'Đăng Ký'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2" htmlFor="username">
                            Tên Người Dùng
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 border-gray-600 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-bold mb-2" htmlFor="password">
                            Mật Khẩu
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 border-gray-600 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="mb-6">
                            <label className="block text-sm font-bold mb-2" htmlFor="confirm-password">
                                Xác Nhận Mật Khẩu
                            </label>
                            <input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 border-gray-600 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            {isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="inline-block align-baseline font-bold text-sm text-purple-400 hover:text-purple-300"
                        >
                            {isLogin ? 'Cần một tài khoản?' : 'Đã có tài khoản?'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;