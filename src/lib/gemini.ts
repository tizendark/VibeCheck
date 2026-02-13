import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export async function analyzeSentiment(text: string): Promise<number> {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    console.warn("Gemini API Key missing. Using neutral sentiment.");
    return 0;
  }

  try {
    // Usamos flash para baja latencia
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.1, // Baja temperatura para mayor consistencia
        topP: 0.1,
        topK: 1,
        maxOutputTokens: 5, // Solo necesitamos un número
      },
      // Ajustamos filtros para permitir analizar lenguaje "picante" o informal típico de un chat
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      ]
    });
    
    const prompt = `Analyze the emotional sentiment of this message: "${text}".
    
    Rules:
    1. Return ONLY a decimal number between -1.0 and 1.0.
    2. -1.0 is maximum hate, anger, or sadness.
    3. 0.0 is completely neutral or a simple fact.
    4. 1.0 is maximum joy, love, or excitement.
    5. DO NOT include any text, explanation, or punctuation. Just the number.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text().trim();
    
    // Limpieza de seguridad por si la IA devuelve algo como "Score: 0.5"
    const match = rawText.match(/-?\d+(\.\d+)?/);
    const score = match ? parseFloat(match[0]) : 0;
    
    // Asegurar que esté en el rango
    return Math.max(-1, Math.min(1, score));
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return 0; // Fallback a neutral
  }
}
