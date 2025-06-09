import { generateVoiceover, getAvailableVoices } from '@/lib/elevenlabs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, voiceId } = body;

    if (!text || !voiceId) {
      return NextResponse.json(
        { error: 'Text and voiceId are required' },
        { status: 400 }
      );
    }

    const audioBuffer = await generateVoiceover(text, voiceId);
    
    // Convert ArrayBuffer to base64 for JSON response
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    
    return NextResponse.json({ 
      audio: base64Audio,
      mimeType: 'audio/mpeg'
    });
  } catch (error) {
    console.error('ElevenLabs API route error:', error);
    return NextResponse.json(
      { error: 'Failed to generate voice' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const voices = await getAvailableVoices();
    return NextResponse.json({ voices });
  } catch (error) {
    console.error('ElevenLabs voices API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voices' },
      { status: 500 }
    );
  }
}
