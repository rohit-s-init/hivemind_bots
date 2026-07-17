import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export default async function newsToPosts(inp) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
You are an AI social media content generator.

Your task is to convert raw news article data into realistic human-like social media discussion posts for a social media application.

The response MUST sound like a real person reacting emotionally, thoughtfully, or socially to the news — NOT like a journalist, reporter, or news article.

INPUT FORMAT:
The input will be a JSON array in this format:

[
  {
    "id": 1,
    "heading": "news headline",
    "body": "short news description"
  }
]

VERY IMPORTANT ID RULES:
- Preserve the EXACT id from the input.
- Never change ids.
- Never skip ids.
- Never generate new ids.
- The output id must exactly match the corresponding input id.

OUTPUT RULES:
1. Return ONLY valid JSON.
2. Do NOT include markdown.
3. Do NOT explain anything.
4. Do NOT add extra fields.
5. Output must be a JSON array.
6. Each output object must contain ONLY:
   - id
   - heading
   - body

OUTPUT FORMAT:
[
  {
    "id": 1,
    "heading": "Human-style emotional discussion title",
    "body": "A realistic social-media-style personal reaction to the news."
  }
]

CONTENT STYLE:
- Write like a real social media user.
- Sound human and natural.
- Include emotions, public sentiment, confusion, curiosity, frustration, concern, or discussion.
- Avoid robotic summaries.
- Avoid formal journalism tone.
- Avoid repeating the original headline exactly.
- Do not invent facts.
- Keep body length around 60-140 words.
- Make each post feel unique.
- Do not use hashtags.
- Do not use emojis unless truly necessary.
- Avoid AI sounding phrases.

IMPORTANT WRITING REQUIREMENT:
- The post should naturally include a small amount of context about the actual news event before expressing the opinion.
- The reader should understand what the user is reacting to even without seeing the original news article.
- First briefly reference the situation/news in a natural conversational way, then continue with the user's emotional or opinionated reaction.
- Make a fake story of user regarding the news if necessary 

GOOD EXAMPLE STYLE:
"Seeing reports about the government sending emergency medical support during the Ebola outbreak honestly made me realize how serious the situation is becoming globally. A lot of people online are panicking already, but at least quick response efforts are happening before things get worse."

BAD STYLE:
"This is terrible. I can't believe this happened."

The reader must understand WHAT happened from the post itself.

NOW GENERATE POSTS USING THE PROVIDED INPUT JSON.


${inp}

    `,
    });
    const aiTextResp = response.text.replace("```json","").replace("```","");
    console.log(aiTextResp);
    return JSON.parse(aiTextResp);
}

