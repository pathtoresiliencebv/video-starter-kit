export interface MusicTrack {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: number;
  url?: string;
  preview_url?: string;
}

export interface MusicCategory {
  id: string;
  name: string;
  description: string;
  tracks: MusicTrack[];
}

// Predefined music library
export const MUSIC_CATEGORIES: MusicCategory[] = [
  {
    id: "motivational",
    name: "Motivational",
    description: "Inspiring and uplifting background music",
    tracks: [
      {
        id: "motivational-1",
        name: "Rise Up",
        category: "Motivational",
        description: "Uplifting and inspiring instrumental",
        duration: 60,
        preview_url: "/audio/previews/rise-up.mp3"
      },
      {
        id: "motivational-2", 
        name: "Success Journey",
        category: "Motivational",
        description: "Energetic and empowering background music",
        duration: 45,
        preview_url: "/audio/previews/success-journey.mp3"
      }
    ]
  },
  {
    id: "calm",
    name: "Calm",
    description: "Peaceful and relaxing background music",
    tracks: [
      {
        id: "calm-1",
        name: "Peaceful Mind",
        category: "Calm",
        description: "Soft and gentle instrumental",
        duration: 60,
        preview_url: "/audio/previews/peaceful-mind.mp3"
      },
      {
        id: "calm-2",
        name: "Serenity",
        category: "Calm", 
        description: "Relaxing ambient background",
        duration: 50,
        preview_url: "/audio/previews/serenity.mp3"
      }
    ]
  },
  {
    id: "electro",
    name: "Electro",
    description: "Modern electronic and tech-focused music",
    tracks: [
      {
        id: "electro-1",
        name: "Digital Future",
        category: "Electro",
        description: "Modern tech-inspired electronic music",
        duration: 55,
        preview_url: "/audio/previews/digital-future.mp3"
      },
      {
        id: "electro-2",
        name: "Cyber Pulse",
        category: "Electro",
        description: "Energetic electronic background",
        duration: 40,
        preview_url: "/audio/previews/cyber-pulse.mp3"
      }
    ]
  },
  {
    id: "suspense",
    name: "Suspense",
    description: "Dramatic and tension-building music",
    tracks: [
      {
        id: "suspense-1",
        name: "Building Tension",
        category: "Suspense",
        description: "Dramatic and mysterious background",
        duration: 65,
        preview_url: "/audio/previews/building-tension.mp3"
      }
    ]
  }
];

export const getAllMusicTracks = (): MusicTrack[] => {
  return MUSIC_CATEGORIES.flatMap(category => category.tracks);
};

export const getMusicTrackById = (id: string): MusicTrack | undefined => {
  return getAllMusicTracks().find(track => track.id === id);
};

export const getMusicCategoryById = (id: string): MusicCategory | undefined => {
  return MUSIC_CATEGORIES.find(category => category.id === id);
};

// SUNO AI Music Generation
export interface SunoGenerationRequest {
  prompt: string;
  style?: string;
  duration?: number;
  instrumental?: boolean;
}

export interface SunoGenerationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  audio_url?: string;
  title?: string;
  duration?: number;
}

export const generateMusicPrompt = (
  template: string,
  scriptContent: string
): string => {
  const templatePrompts: Record<string, string> = {
    educational: "Professional background music for educational content, calm and focused, instrumental, suitable for learning",
    entertainment: "Upbeat and engaging background music, fun and energetic, instrumental, perfect for entertainment",
    motivational: "Inspiring and uplifting background music, motivational and empowering, instrumental, builds energy",
    news: "Professional news-style background music, serious and authoritative, instrumental, broadcast quality",
    trendy: "Modern and trendy background music, social media style, catchy and contemporary, instrumental"
  };

  const basePrompt = templatePrompts[template.toLowerCase()] || templatePrompts.educational;
  
  // Add context from script if it contains specific themes
  let contextualPrompt = basePrompt;
  
  if (scriptContent.toLowerCase().includes('tech') || scriptContent.toLowerCase().includes('ai')) {
    contextualPrompt += ", tech-inspired, modern digital sound";
  }
  
  if (scriptContent.toLowerCase().includes('success') || scriptContent.toLowerCase().includes('achieve')) {
    contextualPrompt += ", success-oriented, triumphant feeling";
  }
  
  return contextualPrompt + ", 60 seconds duration, high quality";
};

export const generateMusicWithSuno = async (request: SunoGenerationRequest): Promise<SunoGenerationResponse> => {
  try {
    const response = await fetch('/api/suno', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`SUNO API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating music with SUNO:', error);
    throw error;
  }
};
