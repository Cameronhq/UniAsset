import { GoogleGenAI, Type } from "@google/genai";
import { Asset, MarketEvent, ChatMessage } from "../types";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_FLASH = 'gemini-3-flash-preview';

/**
 * Parses natural language input into a structured Asset object.
 */
export const parseAssetEntry = async (input: string): Promise<Partial<Asset>> => {
  if (!apiKey) throw new Error("API Key not found");

  const response = await ai.models.generateContent({
    model: MODEL_FLASH,
    contents: `Extract asset details from this user input: "${input}". 
    Return a JSON object. If a field is missing, omit it or use a sensible default (e.g., currency USD).
    For 'exposureTags', infer 2-3 tags like 'US Tech', 'Crypto', 'Safe Haven' based on the asset.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING },
          productType: { type: Type.STRING, enum: ['Stock', 'ETF', 'Crypto', 'Derivatives', 'Commodities', 'Cash', 'Other'] },
          symbol: { type: Type.STRING },
          quantity: { type: Type.NUMBER },
          unitPrice: { type: Type.NUMBER },
          currency: { type: Type.STRING },
          exposureTags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['productType', 'symbol', 'quantity']
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Failed to parse asset data");
  
  return JSON.parse(text);
};

/**
 * Generates an advisory response based on portfolio and chat history.
 */
export const getAdvisoryResponse = async (
  query: string,
  portfolio: Asset[],
  events: MarketEvent[],
  history: ChatMessage[]
): Promise<string> => {
  if (!apiKey) return "I need an API Key to provide advice. Please configure it.";

  // Simplify portfolio for token efficiency
  const portfolioSummary = portfolio.map(p => 
    `${p.quantity} ${p.symbol} ($${p.totalValue}) [${p.exposureTags.join(', ')}]`
  ).join('; ');

  const eventSummary = events.map(e => 
    `[${e.type.toUpperCase()}] ${e.title} (${e.date}): Impacts ${e.affectedAssets.join(', ')}`
  ).join('\n');

  const historyContext = history.slice(-5).map(h => `${h.role}: ${h.text}`).join('\n');

  const prompt = `
    You are an AI Investment Advisor for the Unified Asset Intelligence Platform.
    
    User Context:
    - Current Portfolio: ${portfolioSummary || "Empty Portfolio"}
    - Market Events: 
    ${eventSummary}

    Chat History:
    ${historyContext}

    User Query: "${query}"

    Task:
    Provide a concise, professional, and data-backed answer. 
    1. Analyze the user's exposure relative to their portfolio.
    2. Reference specific market events if relevant.
    3. Do not give financial advice as absolute truth, but as risk analysis.
    4. Keep it under 200 words unless detailed explanation is requested.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_FLASH,
    contents: prompt,
    config: {
      systemInstruction: "You are a sophisticated financial analyst AI helper.",
    }
  });

  return response.text || "I couldn't generate a response at this time.";
};

/**
 * (Mock) Analyzes the portfolio to generate new insights/events based on current holdngs.
 * In a real app, this would fetch live news. Here we generate plausible scenarios.
 */
export const generateMarketInsights = async (portfolio: Asset[]): Promise<MarketEvent[]> => {
  if (!apiKey || portfolio.length === 0) return [];

  const holdings = portfolio.map(p => p.symbol).join(', ');

  const response = await ai.models.generateContent({
    model: MODEL_FLASH,
    contents: `Generate 3 realistic market events (1 past, 2 upcoming) that would specifically impact this portfolio: ${holdings}.
    Make them sound professional (e.g. Fed decisions, Earnings, Geopolitical).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ['past', 'upcoming'] },
            title: { type: Type.STRING },
            date: { type: Type.STRING },
            affectedAssets: { type: Type.ARRAY, items: { type: Type.STRING } },
            impactStrength: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
            direction: { type: Type.STRING, enum: ['positive', 'negative', 'mixed', 'neutral'] },
            reasoning: { type: Type.STRING }
          }
        }
      }
    }
  });

  const text = response.text;
  if (!text) return [];
  
  const rawEvents = JSON.parse(text);
  return rawEvents.map((e: any) => ({ ...e, id: Math.random().toString(36).substr(2, 9) }));
};
