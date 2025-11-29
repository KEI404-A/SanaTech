import { GoogleGenerativeAI } from "@google/generative-ai";

// PENTING: Ganti dengan API Key kamu sendiri.
// Sebaiknya simpan di environment variable (.env) untuk keamanan.
const API_KEY = "AIzaSyDU9IgkG0sl0RVZ9SdrOKkNgEOBYpx1Yc4";

// Inisialisasi model AI
const genAI = new GoogleGenerativeAI(API_KEY);
// Ganti menjadi model yang lebih baru dan cepat
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Fungsi utama untuk memulai chat
export async function runChat(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Gagal berkomunikasi dengan AI.");
  }
}