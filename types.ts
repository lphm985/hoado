// Fix: Removed self-import of 'Stats' which conflicted with its own declaration.
export interface Stats {
  hp: number;
  atk: number;
  def: number;
  agi: number;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'material' | 'consumable' | 'equipment';
  stats?: Stats;
  equipmentType?: 'weapon' | 'armor' | 'accessory';
}

export interface Equipment {
  weapon: Item | null;
  armor: Item | null;
  accessory: Item | null;
}

export interface Player {
  id: string;
  username: string;
  realmId: string;
  cultivationProgress: number;
  bodyLevel: number;
  bodyRefinementsInRealm: number; // New: Tracks refinements within the current realm
  stats: Stats;
  spiritStones: number;
  inventory: Item[];
  equipment: Equipment;
  lastPveFightTimestamp: number;
  lastPveCooldown: number;
  lastLoginTimestamp: number;
}

export interface ItemDrop {
  itemId: string;
  chance: number;
  quantity: number;
}

export interface Monster {
  id:string;
  name: string;
  stats: Stats;
  qiReward: number;
  cooldown: number;
  drops: ItemDrop[];
}

export interface Realm {
  id: string;
  name: string;
  qiNeeded: number;
  order: number;
  breakthroughGains: {
      flatGains: Stats;
      percentGains: Stats; // Values are 0-1 for multipliers
  };
  qiRate: number;
  breakthroughChance: number; // Value between 0 and 1
  qiLossOnFailure: number; // Percentage of Qi lost on breakthrough failure (0 to 1)
  bodyRefinementCostPercent: number; // Percentage of qiNeeded for base body refinement cost
}

export interface LogEntry {
  id: number;
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
}

export interface ChatMessage {
  id: string;
  timestamp: number;
  username: string;
  message: string;
}

export type ModalType =
  | 'body-refinement'
  | 'exploration'
  | 'pve'
  | 'skills'
  | 'alchemy'
  | 'pvp'
  | 'guild'
  | 'marketplace'
  | 'talents'
  | 'inventory'
  | 'breakthrough'
  | 'player-stats';

export type AdminView = 'dashboard' | 'players' | 'game-data' | 'game-settings' | 'realms';