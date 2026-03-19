
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getShuttleInfo = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Anda adalah asisten virtual 'TRANSCITY'. 
      Tugas Anda: menjawab pertanyaan pelanggan seputar estimasi waktu perjalanan di Bali, 
      titik jemput populer, bagasi, dan paket wisata.
      Gunakan Bahasa Indonesia yang ramah. Pertanyaan pelanggan: ${query}`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, asisten perjalanan sedang beristirahat. Silakan hubungi admin via WhatsApp.";
  }
};

export const generateItinerary = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Buatkan rencana perjalanan di Bali untuk permintaan berikut: "${prompt}". Berikan output dalam Bahasa Indonesia.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "Judul rencana perjalanan",
            },
            summary: {
              type: Type.STRING,
              description: "Ringkasan singkat rencana perjalanan",
            },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING, description: "Waktu atau jam kegiatan" },
                  activity: { type: Type.STRING, description: "Nama kegiatan" },
                  location: { type: Type.STRING, description: "Lokasi kegiatan" },
                },
                required: ["time", "activity", "location"],
              },
            },
          },
          required: ["title", "summary", "items"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Respon kosong dari model AI");
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error in generateItinerary:", error);
    throw error;
  }
};
