import { createClient } from '@supabase/supabase-js';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';
const SITE_NAME = 'VibeCheck Arena';

export async function analyzeSentiment(text: string): Promise<number> {
    if (!OPENROUTER_API_KEY) {
        console.warn("OpenRouter API Key missing. Using neutral sentiment.");
        return 0;
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": SITE_URL,
                "X-Title": SITE_NAME,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemma-3-12b-it:free",
                "messages": [
                    {
                        "role": "user",
                        "content": `Analiza el sentimiento de este mensaje y responde ÚNICAMENTE con un número entre -1 (muy negativo) y 1 (muy positivo). Mensaje: "${text}"`
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API Error:", response.status, errorText);
            throw new Error(`OpenRouter API Error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) return 0;

        // Extract number from response
        const match = content.match(/-?\d+(\.\d+)?/);
        const score = match ? parseFloat(match[0]) : 0;

        // Clamp between -1 and 1
        return Math.max(-1, Math.min(1, score));

    } catch (error) {
        console.error("Sentiment Analysis Error:", error);
        return 0;
    }
}
