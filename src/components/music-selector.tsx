"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Play, Pause, Upload, Loader2 } from "lucide-react";
import { MUSIC_CATEGORIES, MusicTrack, generateMusicPrompt, generateMusicWithSuno } from "@/lib/suno";

interface MusicSelectorProps {
  selectedMusic?: string;
  onMusicSelect: (musicId: string, musicUrl?: string, musicType?: 'library' | 'generated' | 'none') => void;
  template: string;
  scriptContent: string;
}

type MusicTab = "library" | "generate" | "none";

export function MusicSelector({ selectedMusic, onMusicSelect, template, scriptContent }: MusicSelectorProps) {
  const [activeTab, setActiveTab] = useState<MusicTab>("library");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMusic, setGeneratedMusic] = useState<{ id: string; url?: string; title?: string } | null>(null);

  const filteredTracks = MUSIC_CATEGORIES.flatMap(category => 
    category.tracks.filter(track => 
      track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handlePlayPause = (trackId: string) => {
    if (playingTrack === trackId) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(trackId);
      // In a real implementation, you would play the audio here
      setTimeout(() => setPlayingTrack(null), 3000); // Auto-stop after 3 seconds for demo
    }
  };

  const handleGenerateMusic = async () => {
    setIsGenerating(true);
    try {
      const prompt = generateMusicPrompt(template, scriptContent);
      const result = await generateMusicWithSuno({
        prompt,
        instrumental: true,
        duration: 60
      });
      
      setGeneratedMusic({
        id: result.id,
        title: result.title || "Generated Music",
        url: result.audio_url
      });
      
      if (result.audio_url) {
        onMusicSelect(result.id, result.audio_url, 'generated');
      }
    } catch (error) {
      console.error('Failed to generate music:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderLibraryTab = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Input
          placeholder="Search music..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-gray-900/50 border-gray-600 text-white"
        />
        <Button variant="outline" className="border-gray-600 text-gray-300">
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
        {filteredTracks.map((track) => (
          <div
            key={track.id}
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
              selectedMusic === track.id
                ? "border-blue-500 bg-blue-500/10"
                : "border-gray-600 bg-gray-900/30 hover:border-gray-500"
            }`}
            onClick={() => onMusicSelect(track.id, track.preview_url, 'library')}
          >
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="ghost"
                className="w-8 h-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause(track.id);
                }}
              >
                {playingTrack === track.id ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              <div>
                <h4 className="font-medium text-white">{track.name}</h4>
                <p className="text-sm text-gray-400">{track.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {track.category}
              </Badge>
              <span className="text-xs text-gray-500">{track.duration}s</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-400 text-sm mb-2">Drop your audio file or</p>
        <Button variant="outline" className="border-gray-600 text-gray-300">
          click here to browse files
        </Button>
      </div>
    </div>
  );

  const renderGenerateTab = () => (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold text-white mb-2">AI Music Generation</h3>
        <p className="text-gray-400 mb-4">
          Generate custom background music that perfectly matches your video content and style.
        </p>
        
        <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-white mb-2">Generated Prompt:</h4>
          <p className="text-sm text-gray-300">
            {generateMusicPrompt(template, scriptContent)}
          </p>
        </div>

        {generatedMusic ? (
          <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">{generatedMusic.title}</h4>
                <p className="text-sm text-gray-400">AI Generated Music</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handlePlayPause(generatedMusic.id)}
              >
                {playingTrack === generatedMusic.id ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        ) : null}

        <Button
          onClick={handleGenerateMusic}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Music...
            </>
          ) : (
            "Generate with SUNO AI"
          )}
        </Button>
      </div>
    </div>
  );

  const renderNoMusicTab = () => (
    <div className="text-center py-12">
      <h3 className="text-lg font-semibold text-white mb-2">No Background Music</h3>
      <p className="text-gray-400 mb-4">
        Your video will be created without background music, focusing purely on the voice-over.
      </p>
      <Button
        onClick={() => onMusicSelect('none', undefined, 'none')}
        variant={selectedMusic === 'none' ? 'default' : 'outline'}
        className={selectedMusic === 'none' ? 'bg-blue-600' : 'border-gray-600 text-gray-300'}
      >
        Select No Music
      </Button>
    </div>
  );

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Select Background Music</CardTitle>
        <CardDescription className="text-gray-400">
          Choose from our audio library, generate custom music with AI, or proceed without background music.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-lg">
          <Button
            variant={activeTab === "library" ? "default" : "ghost"}
            className={`flex-1 ${activeTab === "library" ? "bg-blue-600" : "text-gray-400"}`}
            onClick={() => setActiveTab("library")}
          >
            Audio Library
          </Button>
          <Button
            variant={activeTab === "generate" ? "default" : "ghost"}
            className={`flex-1 ${activeTab === "generate" ? "bg-blue-600" : "text-gray-400"}`}
            onClick={() => setActiveTab("generate")}
          >
            Generate Music
          </Button>
          <Button
            variant={activeTab === "none" ? "default" : "ghost"}
            className={`flex-1 ${activeTab === "none" ? "bg-blue-600" : "text-gray-400"}`}
            onClick={() => setActiveTab("none")}
          >
            No Music
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "library" && renderLibraryTab()}
        {activeTab === "generate" && renderGenerateTab()}
        {activeTab === "none" && renderNoMusicTab()}
      </CardContent>
    </Card>
  );
}
