import OpenAI from "openai";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { text } from "stream/consumers";

export async function POST(req: NextApiRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  const body = await text(req.body);
  const prompt = JSON.parse(body).prompt;
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You will check if the given text is worthy generating Image also has detailed description about appearance.
          If the check pass You will return the JSON object with the flag "isImage" set to true and fill the description of the desirable Image.
          Image describing should be simple, give least 10 tags, the scene and in the form of danbooru tag.
          If the check fails You will return the JSON object with the flag "isImage" set to false.
          {isImage: false, description: ""}
          `,
      },
      { role: "user", content: prompt },
    ],
  });

  return NextResponse.json({ text: completion.choices[0] }, { status: 200 });
}
