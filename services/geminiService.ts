import { GoogleGenAI } from "@google/genai";
import { ImageSize } from "../types";

// Helper to check for API key availability and triggering selection
export const ensureApiKey = async (): Promise<boolean> => {
  if (process.env.API_KEY) return true; // Already have env var (fallback)

  // Use the window.aistudio helper if available
  if (window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      try {
        await window.aistudio.openSelectKey();
        return true;
      } catch (e) {
        console.error("Failed to select key", e);
        return false;
      }
    }
    return true;
  }
  
  return false;
};

export const generateRadioVisual = async (prompt: string, size: ImageSize): Promise<string | null> => {
  try {
    const keyAvailable = await ensureApiKey();
    if (!keyAvailable) {
       // If no key capability, fallback to env or fail gracefully
       if (!process.env.API_KEY) throw new Error("No API Key available");
    }

    // Re-instantiate to ensure latest key is picked up if selected via UI
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "16:9" // Cinematic for radio background
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }

    return null;
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    throw error;
  }
};