import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import type { VideoProject, VideoTrack, VideoKeyFrame, MediaItem } from '@/data/schema';

interface AIGeneratedContent {
  prompt: string;
  script: string;
  selectedVoice: string;
  selectedTemplate: string;
  audioUrl?: string;
  visualUrl?: string;
  selectedMusic?: string;
  musicUrl?: string;
  musicType?: 'library' | 'generated' | 'none';
  captions?: Array<{ id: number; start: number; end: number; text: string }>;
}

export async function POST(request: NextRequest) {
  try {
    const aiContent: AIGeneratedContent = await request.json();

    // Create new project
    const projectId = nanoid();
    const project: VideoProject = {
      id: projectId,
      title: `AI Generated Short - ${new Date().toLocaleDateString()}`,
      description: aiContent.prompt,
      aspectRatio: "9:16"
    };

    // Create tracks
    const tracks: VideoTrack[] = [
      {
        id: "main-video",
        locked: false,
        label: "Video",
        type: "video",
        projectId
      },
      {
        id: "voiceover-track",
        locked: false,
        label: "Voice Over",
        type: "voiceover",
        projectId
      }
    ];

    // Add music track if music is selected
    if (aiContent.musicType !== 'none' && aiContent.musicUrl) {
      tracks.push({
        id: "music-track",
        locked: false,
        label: "Background Music",
        type: "music",
        projectId
      });
    }

    // Create media items
    const mediaItems: MediaItem[] = [];
    const keyframes: VideoKeyFrame[] = [];

    // Add background visual
    if (aiContent.visualUrl) {
      const visualMediaId = nanoid();
      mediaItems.push({
        id: visualMediaId,
        kind: "generated",
        endpointId: "fal-ai",
        requestId: nanoid(),
        projectId,
        mediaType: "image",
        status: "completed",
        createdAt: Date.now(),
        input: { prompt: aiContent.prompt, template: aiContent.selectedTemplate },
        output: { url: aiContent.visualUrl },
        url: aiContent.visualUrl,
        metadata: { 
          template: aiContent.selectedTemplate,
          aspectRatio: "9:16"
        }
      });

      // Create keyframe for background visual (full duration)
      keyframes.push({
        id: nanoid(),
        timestamp: 0,
        duration: 60, // Default 60 seconds, will be adjusted based on voice duration
        trackId: "main-video",
        data: {
          type: "image",
          mediaId: visualMediaId,
          prompt: aiContent.prompt,
          url: aiContent.visualUrl
        }
      });
    }

    // Add voice-over
    if (aiContent.audioUrl) {
      const voiceMediaId = nanoid();
      mediaItems.push({
        id: voiceMediaId,
        kind: "generated",
        endpointId: "elevenlabs",
        requestId: nanoid(),
        projectId,
        mediaType: "voiceover",
        status: "completed",
        createdAt: Date.now(),
        input: { 
          text: aiContent.script, 
          voice_id: aiContent.selectedVoice 
        },
        output: { url: aiContent.audioUrl },
        url: aiContent.audioUrl,
        metadata: {
          voice_id: aiContent.selectedVoice,
          script: aiContent.script,
          captions: aiContent.captions
        }
      });

      // Create keyframe for voice-over
      keyframes.push({
        id: nanoid(),
        timestamp: 0,
        duration: 60, // Will be calculated from audio duration
        trackId: "voiceover-track",
        data: {
          type: "video", // Using video type for voiceover in keyframe
          mediaId: voiceMediaId,
          prompt: aiContent.script,
          url: aiContent.audioUrl
        }
      });
    }

    // Add background music
    if (aiContent.musicType !== 'none' && aiContent.musicUrl) {
      const musicMediaId = nanoid();
      
      if (aiContent.musicType === 'generated') {
        mediaItems.push({
          id: musicMediaId,
          kind: "generated",
          endpointId: "suno",
          requestId: nanoid(),
          projectId,
          mediaType: "music",
          status: "completed",
          createdAt: Date.now(),
          input: { 
            prompt: `Background music for ${aiContent.selectedTemplate} content`,
            template: aiContent.selectedTemplate 
          },
          output: { url: aiContent.musicUrl },
          url: aiContent.musicUrl,
          metadata: {
            musicType: aiContent.musicType,
            selectedMusic: aiContent.selectedMusic
          }
        });
      } else {
        mediaItems.push({
          id: musicMediaId,
          kind: "uploaded",
          projectId,
          mediaType: "music",
          status: "completed",
          createdAt: Date.now(),
          url: aiContent.musicUrl,
          metadata: {
            musicType: aiContent.musicType,
            selectedMusic: aiContent.selectedMusic
          }
        });
      }

      // Create keyframe for background music (using video type for compatibility)
      keyframes.push({
        id: nanoid(),
        timestamp: 0,
        duration: 60,
        trackId: "music-track",
        data: {
          type: "video", // Using video type for music in keyframe
          mediaId: musicMediaId,
          prompt: `Background music for ${aiContent.selectedTemplate}`,
          url: aiContent.musicUrl
        }
      });
    }

    // Return project data for client-side storage
    const projectData = {
      project,
      tracks,
      mediaItems,
      keyframes,
      aiContent
    };

    console.log('Created project from AI content:', {
      projectId,
      mediaItemsCount: mediaItems.length,
      keyframesCount: keyframes.length,
      tracksCount: tracks.length
    });

    return NextResponse.json({
      success: true,
      projectId,
      projectData,
      editorUrl: `/app?project=${projectId}`,
      message: 'Project created successfully'
    });

  } catch (error) {
    console.error('Error creating project from AI content:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
