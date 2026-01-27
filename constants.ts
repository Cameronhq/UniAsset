import { Asset, MarketEvent } from "./types";

export const COMMON_SYMBOLS = [
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'Stock' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'Stock' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', type: 'Stock' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'Stock' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'Stock' },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Stock' },
  { symbol: 'META', name: 'Meta Platforms', type: 'Stock' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', type: 'Stock' },
  { symbol: 'COIN', name: 'Coinbase Global', type: 'Stock' },
  { symbol: 'PLTR', name: 'Palantir Technologies', type: 'Stock' },
  { symbol: 'BTC', name: 'Bitcoin', type: 'Crypto' },
  { symbol: 'ETH', name: 'Ethereum', type: 'Crypto' },
  { symbol: 'SOL', name: 'Solana', type: 'Crypto' },
  { symbol: 'DOGE', name: 'Dogecoin', type: 'Crypto' },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'ETF' },
  { symbol: 'QQQ', name: 'Invesco QQQ', type: 'ETF' },
  { symbol: 'VOO', name: 'Vanguard S&P 500', type: 'ETF' },
  { symbol: 'TLT', name: 'iShares 20+ Year Treasury', type: 'ETF' },
  { symbol: 'GLD', name: 'SPDR Gold Shares', type: 'Commodities' },
  { symbol: 'USDC', name: 'USD Coin', type: 'Cash / Yield' },
];

export const INITIAL_ASSETS: Asset[] = [
  {
    id: '1',
    platform: 'Fidelity',
    productType: 'Stock',
    symbol: 'NVDA',
    quantity: 50,
    unitPrice: 850,
    totalValue: 42500,
    currency: 'USD',
    exposureTags: ['AI Hardware', 'Semiconductors', 'Growth'],
    change24h: 3.2,
    createdAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    platform: 'Coinbase',
    productType: 'Crypto',
    symbol: 'ETH',
    quantity: 4.5,
    unitPrice: 3200,
    totalValue: 14400,
    currency: 'USD',
    exposureTags: ['Crypto Layer 1', 'Risk-on', 'DeFi'],
    change24h: -1.5,
    createdAt: '2024-02-20T14:30:00Z'
  },
  {
    id: '3',
    platform: 'Robinhood',
    productType: 'ETF',
    symbol: 'TLT',
    quantity: 200,
    unitPrice: 94,
    totalValue: 18800,
    currency: 'USD',
    exposureTags: ['US Treasury', 'Interest Rate Sensitive', 'Defensive'],
    change24h: 0.4,
    createdAt: '2024-03-10T11:15:00Z'
  }
];

export const INITIAL_EVENTS: MarketEvent[] = [
  {
    id: 'e1',
    type: 'past',
    title: 'Fed Holds Interest Rates Steady',
    date: '2024-05-01',
    affectedAssets: ['TLT', 'Growth Stocks'],
    impactStrength: 'high',
    direction: 'mixed',
    reasoning: 'Jerome Powell signaled rates will stay higher for longer, suppressing bond prices but removing the immediate fear of a hike.'
  },
  {
    id: 'e2',
    type: 'upcoming',
    title: 'NVIDIA Earnings Report',
    date: '2024-05-22',
    affectedAssets: ['NVDA', 'AI Hardware', 'Nasdaq'],
    impactStrength: 'high',
    direction: 'neutral',
    reasoning: 'Market expectations are extremely high. Any miss in guidance could trigger a sector-wide correction in AI stocks.'
  },
  {
    id: 'e3',
    type: 'upcoming',
    title: 'Ethereum ETF Decision Deadline',
    date: '2024-05-23',
    affectedAssets: ['ETH', 'Crypto'],
    impactStrength: 'medium',
    direction: 'positive',
    reasoning: 'Speculation is mounting regarding the SEC approval of Spot ETH ETFs. Approval would likely lead to significant inflows.'
  }
];