import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../../hooks/useGame';

const ChatPanel: React.FC = () => {
    const { player, chatMessages, addChatMessage } = useGame();
    const [newMessage, setNewMessage] = useState('');
    const chatEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (player && newMessage.trim()) {
            addChatMessage(player.username, newMessage);
            setNewMessage('');
        }
    };

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-grow overflow-y-auto pr-2 modal-scrollbar mb-4">
                {chatMessages.map((msg) => {
                    const isOwnMessage = msg.username === player?.username;
                    return (
                        <div key={msg.id} className="flex flex-col mb-3 items-start">
                            <div className="text-xs mb-1 text-left">
                                <span className={`font-bold ${isOwnMessage ? 'text-purple-400' : 'text-green-400'}`}>{msg.username}</span>
                                <span className="text-gray-500 ml-2">{formatTimestamp(msg.timestamp)}</span>
                            </div>
                            <div className={`p-2 rounded-lg max-w-[80%] break-words ${isOwnMessage ? 'bg-purple-800' : 'bg-gray-700'}`}>
                                <p className="text-sm">{msg.message}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="flex-grow bg-gray-700 border border-gray-600 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        aria-label="Chat message input"
                    />
                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-r-md text-sm transition-colors"
                        aria-label="Send chat message"
                    >
                        Gửi
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatPanel;