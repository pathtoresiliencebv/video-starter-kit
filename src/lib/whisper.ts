export interface CaptionSegment {
  id: number;
  start: number;
  end: number;
  text: string;
}

export interface CaptionStyle {
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor?: string;
  position: 'bottom' | 'center' | 'top';
  alignment: 'left' | 'center' | 'right';
  maxWidth: number;
  padding: number;
  borderRadius?: number;
  shadow?: boolean;
}

export interface WhisperTranscriptionResponse {
  text: string;
  segments: CaptionSegment[];
  language: string;
  duration: number;
}

// Caption styles per template
export const CAPTION_STYLES: Record<string, CaptionStyle> = {
  educational: {
    fontSize: 24,
    fontFamily: 'Inter, sans-serif',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'bottom',
    alignment: 'center',
    maxWidth: 80,
    padding: 12,
    borderRadius: 8,
    shadow: true
  },
  entertainment: {
    fontSize: 28,
    fontFamily: 'Poppins, sans-serif',
    color: '#FFFF00',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'bottom',
    alignment: 'center',
    maxWidth: 85,
    padding: 10,
    borderRadius: 12,
    shadow: true
  },
  motivational: {
    fontSize: 32,
    fontFamily: 'Montserrat, sans-serif',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 69, 0, 0.9)',
    position: 'center',
    alignment: 'center',
    maxWidth: 90,
    padding: 16,
    borderRadius: 16,
    shadow: true
  },
  news: {
    fontSize: 22,
    fontFamily: 'Roboto, sans-serif',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    position: 'bottom',
    alignment: 'center',
    maxWidth: 75,
    padding: 8,
    borderRadius: 4,
    shadow: false
  },
  trendy: {
    fontSize: 26,
    fontFamily: 'Nunito, sans-serif',
    color: '#FF1493',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'bottom',
    alignment: 'center',
    maxWidth: 85,
    padding: 12,
    borderRadius: 20,
    shadow: true
  }
};

export const getCaptionStyleByTemplate = (template: string): CaptionStyle => {
  return CAPTION_STYLES[template.toLowerCase()] || CAPTION_STYLES.educational;
};

export const transcribeAudioWithWhisper = async (audioFile: File | Blob): Promise<WhisperTranscriptionResponse> => {
  try {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json');
    formData.append('timestamp_granularities[]', 'word');

    const response = await fetch('/api/whisper', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Whisper API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error transcribing audio with Whisper:', error);
    throw error;
  }
};

export const generateSRTFromSegments = (segments: CaptionSegment[]): string => {
  return segments.map((segment, index) => {
    const startTime = formatSRTTime(segment.start);
    const endTime = formatSRTTime(segment.end);
    
    return `${index + 1}\n${startTime} --> ${endTime}\n${segment.text}\n`;
  }).join('\n');
};

export const formatSRTTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
};

export const splitTextIntoWords = (text: string, maxWordsPerSegment: number = 3): string[] => {
  const words = text.split(' ');
  const segments: string[] = [];
  
  for (let i = 0; i < words.length; i += maxWordsPerSegment) {
    const segment = words.slice(i, i + maxWordsPerSegment).join(' ');
    segments.push(segment);
  }
  
  return segments;
};

export const createTimedCaptions = (
  segments: CaptionSegment[],
  maxWordsPerCaption: number = 3
): CaptionSegment[] => {
  const timedCaptions: CaptionSegment[] = [];
  let captionId = 1;
  
  segments.forEach(segment => {
    const words = segment.text.split(' ');
    const segmentDuration = segment.end - segment.start;
    const timePerWord = segmentDuration / words.length;
    
    for (let i = 0; i < words.length; i += maxWordsPerCaption) {
      const captionWords = words.slice(i, i + maxWordsPerCaption);
      const captionStart = segment.start + (i * timePerWord);
      const captionEnd = segment.start + ((i + captionWords.length) * timePerWord);
      
      timedCaptions.push({
        id: captionId++,
        start: captionStart,
        end: Math.min(captionEnd, segment.end),
        text: captionWords.join(' ')
      });
    }
  });
  
  return timedCaptions;
};
