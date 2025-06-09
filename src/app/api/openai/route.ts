import { generateScript, improveScript } from '@/lib/openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, action, originalScript, feedback } = body;

    if (!prompt && action !== 'improve') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    let script: string;

    if (action === 'improve') {
      if (!originalScript || !feedback) {
        return NextResponse.json(
          { error: 'Original script and feedback are required for improvement' },
          { status: 400 }
        );
      }
      script = await improveScript(originalScript, feedback);
    } else {
      script = await generateScript(prompt);
    }

    console.log('Generated script:', script);
    return NextResponse.json({ script });
  } catch (error) {
    console.error('OpenAI API route error:', error);
    return NextResponse.json(
      { error: 'Failed to generate script' },
      { status: 500 }
    );
  }
}
