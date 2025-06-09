import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      );
    }

    console.log('Transcribing audio with Whisper:', audioFile.name, audioFile.size);

    // Convert File to Buffer for OpenAI
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    
    // Create a new File object with the buffer
    const file = new File([buffer], audioFile.name, {
      type: audioFile.type,
    });

    // Transcribe with Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      response_format: 'verbose_json',
      timestamp_granularities: ['word'],
    });

    console.log('Whisper transcription completed');

    // Process the response to create segments
    const segments = transcription.words?.map((word, index) => ({
      id: index + 1,
      start: word.start,
      end: word.end,
      text: word.word
    })) || [];

    // Group words into sentences/phrases for better caption display
    const groupedSegments = groupWordsIntoSegments(segments, 3);

    return NextResponse.json({
      text: transcription.text,
      segments: groupedSegments,
      language: transcription.language,
      duration: transcription.duration
    });
  } catch (error) {
    console.error('Whisper API route error:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}

function groupWordsIntoSegments(
  words: Array<{ id: number; start: number; end: number; text: string }>,
  maxWordsPerSegment: number = 3
) {
  const segments = [];
  let segmentId = 1;

  for (let i = 0; i < words.length; i += maxWordsPerSegment) {
    const segmentWords = words.slice(i, i + maxWordsPerSegment);
    
    if (segmentWords.length > 0) {
      segments.push({
        id: segmentId++,
        start: segmentWords[0].start,
        end: segmentWords[segmentWords.length - 1].end,
        text: segmentWords.map(w => w.text).join(' ').trim()
      });
    }
  }

  return segments;
}
