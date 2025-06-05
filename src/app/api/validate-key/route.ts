import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { apiKey } = await request.json();

  if (!apiKey || !apiKey.startsWith("sk-")) {
    return NextResponse.json({ error: "Invalid API key." }, { status: 400 });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/models", {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!openaiRes.ok) {
      const errorData = await openaiRes.json();
      return NextResponse.json(
        { error: errorData.error?.message || "OpenAI API key validation failed." },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to OpenAI." },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "API key validated successfully." });
}