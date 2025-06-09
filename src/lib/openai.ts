import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateScript(prompt: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a YouTube Shorts script writer. Create engaging, concise scripts for 60-second videos that are perfect for YouTube Shorts format. 

Guidelines:
- Keep scripts between 150-200 words (60 seconds when spoken)
- Start with a strong hook in the first 3 seconds
- Use simple, conversational language
- Include natural pauses and emphasis
- End with a call-to-action or engaging question
- Structure for vertical video format (9:16)
- Make it engaging and shareable

Format the response as a clean script without stage directions or formatting markers.`
        },
        {
          role: "user",
          content: `Create a YouTube Shorts script about: ${prompt}`
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "Failed to generate script";
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate script');
  }
}

export async function improveScript(originalScript: string, feedback: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a YouTube Shorts script editor. Improve the given script based on the feedback while maintaining the 60-second format and engaging style."
        },
        {
          role: "user",
          content: `Original script: ${originalScript}\n\nFeedback: ${feedback}\n\nPlease improve the script based on this feedback.`
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || originalScript;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to improve script');
  }
}
