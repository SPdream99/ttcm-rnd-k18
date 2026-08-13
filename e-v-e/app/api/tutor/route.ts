import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const message = body.message;

    if (!message) {
      return NextResponse.json(
        {
          error: "Không có câu hỏi",
        },
        {
          status: 400,
        }
      );
    }

    console.log(
      "Gemini API key:",
      !!process.env.GEMINI_API_KEY
    );

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: message,
    });

    const reply = response.text;

    return NextResponse.json({
      reply,
    });

  } catch (error) {

    console.error(
      "🔥 GEMINI ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Không thể kết nối Gemini",
      },
      {
        status: 500,
      }
    );
  }
}