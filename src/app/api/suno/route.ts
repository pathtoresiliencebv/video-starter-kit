import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, style, duration = 60, instrumental = true } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Generating music with SUNO:', prompt);

    // SUNO API call
    const response = await fetch('https://studio-api.suno.ai/api/generate/v2/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUNO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        make_instrumental: instrumental,
        wait_audio: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SUNO API error:', errorText);
      throw new Error(`SUNO API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('SUNO response:', data);

    // Return the generation ID and status
    return NextResponse.json({
      id: data.id || data.clips?.[0]?.id,
      status: 'processing',
      title: data.clips?.[0]?.title,
      message: 'Music generation started. Check status for completion.'
    });
  } catch (error) {
    console.error('SUNO API route error:', error);
    return NextResponse.json(
      { error: 'Failed to generate music' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Generation ID is required' },
        { status: 400 }
      );
    }

    // Check generation status
    const response = await fetch(`https://studio-api.suno.ai/api/get?ids=${id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.SUNO_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`SUNO API error: ${response.status}`);
    }

    const data = await response.json();
    const clip = data[0];

    if (!clip) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: clip.id,
      status: clip.status === 'complete' ? 'completed' : 'processing',
      audio_url: clip.audio_url,
      title: clip.title,
      duration: clip.duration
    });
  } catch (error) {
    console.error('SUNO status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check generation status' },
      { status: 500 }
    );
  }
}
