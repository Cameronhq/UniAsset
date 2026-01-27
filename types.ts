
export type ProductType = 'Stock' | 'ETF' | 'Crypto' | 'Derivatives' | 'Commodities' | 'Cash / Yield' | 'Other';

export interface Asset {
  id: string;
  platform: string; // e.g., Robinhood, Coinbase
  productType: ProductType;
  symbol: string; // e.g., AAPL, BTC
  quantity: number;
  unitPrice: number;
  totalValue: number;
  currency: string;
  expectedYieldApy?: number; // %
  notes?: string;
  exposureTags: string[];
  change24h?: number; // percentage
  createdAt: string; // ISO timestamp
}

export type EventType = 'past' | 'upcoming';
export type ImpactStrength = 'low' | 'medium' | 'high';
export type ImpactDirection = 'positive' | 'negative' | 'mixed' | 'neutral';

export interface MarketEvent {
  id: string;
  type: EventType;
  title: string;
  date: string; // ISO date string or "Ongoing"
  affectedAssets: string[]; // Symbols or tags
  impactStrength: ImpactStrength;
  direction: ImpactDirection;
  reasoning: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum View {
  DASHBOARD = 'dashboard',
  PORTFOLIO = 'portfolio',
  INTELLIGENCE = 'intelligence',
  ADVISORY = 'advisory',
}
