import OpenAI from "openai";

export const runtime = "edge"; // Optimized for serverless functions

export async function POST(req: Request) {
  try {
    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.`;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    // Use "gpt-4-turbo" instead of "gpt-4"
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", 
        messages: [{ role: "user", content: prompt }],
        stream: true,
      });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


