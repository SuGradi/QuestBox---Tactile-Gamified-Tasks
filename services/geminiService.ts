
// import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuests = async (currentInput: string, lang: Language = 'en'): Promise<string[]> => {
  // Mock delay to simulate "thinking"
  await new Promise(resolve => setTimeout(resolve, 1500));

  // AI Service temporarily disabled as per request
  /*
  const model = 'gemini-2.5-flash';
  
  const languageInstruction = lang === 'zh' ? 'Output must be in Simplified Chinese.' : 'Output must be in English.';

  const prompt = currentInput 
    ? `The user wants to do this task: "${currentInput}". Break this down into 3-5 smaller, fun, RPG-style sub-quests (keep them under 6 words each). ${languageInstruction} Return only the JSON array of strings.`
    : `Generate 3 fun, random "side quests" for a human to do today to boost their mood or productivity (e.g., "Drink a potion of hydration", "Slay the dust bunnies"). Keep them playful and short. ${languageInstruction} Return only the JSON array of strings.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to summon quests from the oracle:", error);
    return lang === 'zh' 
      ? ["整理行囊", "查看地图", "旅店休息"] 
      : ["Clean the Inventory", "Check the Map", "Rest at Inn"];
  }
  */

  // Return mock data since AI is disabled
  return lang === 'zh' 
    ? ["整理行囊", "查看地图", "旅店休息"] 
    : ["Clean the Inventory", "Check the Map", "Rest at Inn"];
};
