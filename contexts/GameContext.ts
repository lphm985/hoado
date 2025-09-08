import { createContext, Dispatch, SetStateAction } from 'react';
import type { Player, Realm, Monster, Item, LogEntry, ModalType, Stats, ChatMessage } from '../types';

export interface GameContextType {
    player: Player | null;
    setPlayer: Dispatch<SetStateAction<Player | null>>;
    realms: Realm[];
    setRealms: Dispatch<SetStateAction<Realm[]>>;
    monsters: Monster[];
    setMonsters: Dispatch<SetStateAction<Monster[]>>;
    items: Item[];
    setItems: Dispatch<SetStateAction<Item[]>>;
    logs: LogEntry[];
    addLog: (message: string, type?: 'info' | 'success' | 'warning' | 'danger') => void;
    activeModal: ModalType | null;
    setActiveModal: (modal: ModalType | null) => void;
    bodyRefinementConfig: { [level: number]: Stats };
    setBodyRefinementConfig: Dispatch<SetStateAction<{ [level: number]: Stats }>>;
    chatMessages: ChatMessage[];
    addChatMessage: (username: string, message: string) => void;
    inspectingPlayer: Player | null;
    setInspectingPlayer: Dispatch<SetStateAction<Player | null>>;
}

// Fix: Corrected createContext to not be undefined by default to avoid issues in consumers.
// The default value will be overridden by the Provider, but providing a default shape helps with type inference.
export const GameContext = createContext<GameContextType | undefined>(undefined);