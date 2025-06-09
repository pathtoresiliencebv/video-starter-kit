export interface Voice {
  voice_id: string;
  name: string;
  category: string;
  description: string;
}

export const AVAILABLE_VOICES: Voice[] = [
  {
    voice_id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    category: "Female",
    description: "Calm, young adult female voice"
  },
  {
    voice_id: "AZnzlk1XvdvUeBnXmlld",
    name: "Domi",
    category: "Female", 
    description: "Strong, confident female voice"
  },
  {
    voice_id: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella",
    category: "Female",
    description: "Soft, gentle female voice"
  },
  {
    voice_id: "ErXwobaYiN019PkySvjV",
    name: "Antoni",
    category: "Male",
    description: "Well-rounded, young adult male voice"
  },
  {
    voice_id: "VR6AewLTigWG4xSOukaG",
    name: "Arnold",
    category: "Male",
    description: "Crisp, mature male voice"
  },
  {
    voice_id: "pNInz6obpgDQGcFmaJgB",
    name: "Adam",
    category: "Male",
    description: "Deep, authoritative male voice"
  },
  {
    voice_id: "yoZ06aMxZJJ28mfd3POQ",
    name: "Sam",
    category: "Male",
    description: "Casual, friendly male voice"
  }
];

export async function generateVoiceover(text: string, voiceId: string): Promise<ArrayBuffer> {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': process.env.ELEVENLABS_API_KEY!,
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
        style: 0.0,
        use_speaker_boost: true
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('ElevenLabs API error:', errorText);
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }

  return await response.arrayBuffer();
}

export async function getAvailableVoices(): Promise<Voice[]> {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
      },
    });

    if (!response.ok) {
      console.warn('Failed to fetch voices from API, using default voices');
      return AVAILABLE_VOICES;
    }

    const data = await response.json();
    return data.voices.map((voice: any) => ({
      voice_id: voice.voice_id,
      name: voice.name,
      category: voice.category || 'Unknown',
      description: voice.description || `${voice.name} voice`
    }));
  } catch (error) {
    console.warn('Error fetching voices, using default voices:', error);
    return AVAILABLE_VOICES;
  }
}

export function getVoiceById(voiceId: string): Voice | undefined {
  return AVAILABLE_VOICES.find(voice => voice.voice_id === voiceId);
}
