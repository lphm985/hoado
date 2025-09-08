import React from 'react';
import { useGame } from '../../hooks/useGame';

const LogPanel: React.FC = () => {
    const { logs } = useGame();

    const getLogColor = (type: 'info' | 'success' | 'warning' | 'danger') => {
        switch (type) {
            case 'success': return 'text-green-400';
            case 'warning': return 'text-yellow-400';
            case 'danger': return 'text-red-400';
            default: return 'text-gray-300';
        }
    };

    return (
        <div className="h-full overflow-y-auto pr-2 modal-scrollbar">
            <ul>
                {logs.map((log) => (
                    <li key={log.id} className={`text-sm mb-2 ${getLogColor(log.type)}`}>
                        <span className="text-gray-500 mr-2">[{log.timestamp.toLocaleTimeString()}]</span>
                        {log.message}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LogPanel;