import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return the environment keys (only in development)
    const keys = {
      falKey: process.env.FAL_KEY || null,
      openaiKey: process.env.OPENAI_API_KEY || null,
      elevenlabsKey: process.env.ELEVENLABS_API_KEY || null,
    };

    return NextResponse.json(keys);
  } catch (error) {
    console.error('Error getting environment keys:', error);
    return NextResponse.json(
      { error: 'Failed to get environment keys' },
      { status: 500 }
    );
  }
}
