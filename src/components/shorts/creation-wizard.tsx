"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, Loader2, Play, Download } from "lucide-react";
import { SHORTS_TEMPLATES, getTemplateById } from "@/lib/templates";
import { AVAILABLE_VOICES } from "@/lib/elevenlabs";
import { MusicSelector } from "@/components/music-selector";
import { transcribeAudioWithWhisper } from "@/lib/whisper";

type WizardStep = "prompt" | "script" | "voice" | "template" | "visuals" | "music" | "captions" | "preview" | "export";

interface ShortsData {
  prompt: string;
  script: string;
  selectedVoice: string;
  selectedTemplate: string;
  audioUrl?: string;
  videoUrl?: string;
  visualUrl?: string;
  selectedMusic?: string;
  musicUrl?: string;
  musicType?: 'library' | 'generated' | 'none';
  captions?: Array<{ id: number; start: number; end: number; text: string }>;
  captionsEnabled?: boolean;
}

export function ShortsCreationWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>("prompt");
  const [shortsData, setShortsData] = useState<ShortsData>({
    prompt: "",
    script: "",
    selectedVoice: "",
    selectedTemplate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps: { key: WizardStep; title: string; description: string }[] = [
    { key: "prompt", title: "Enter Your Idea", description: "Describe your YouTube Short concept" },
    { key: "script", title: "Generate Script", description: "AI creates your video script" },
    { key: "voice", title: "Choose Voice", description: "Select AI voice for narration" },
    { key: "template", title: "Pick Style", description: "Choose visual template" },
    { key: "visuals", title: "Generate Visuals", description: "AI creates background images" },
    { key: "music", title: "Select Music", description: "Choose background music" },
    { key: "captions", title: "Generate Captions", description: "AI creates synchronized captions" },
    { key: "preview", title: "Preview", description: "Review your Short" },
    { key: "export", title: "Export", description: "Download your video" },
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const generateScript = async () => {
    if (!shortsData.prompt.trim()) {
      setError("Please enter a prompt for your video");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: shortsData.prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate script");
      }

      const data = await response.json();
      console.log('Received script data:', data);
      setShortsData(prev => ({ ...prev, script: data.script }));
      setCurrentStep("script");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate script");
    } finally {
      setIsLoading(false);
    }
  };

  const generateVoice = async () => {
    if (!shortsData.selectedVoice) {
      setError("Please select a voice");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/elevenlabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: shortsData.script,
          voiceId: shortsData.selectedVoice,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate voice");
      }

      const data = await response.json();
      // Convert base64 to blob URL for audio playback
      const audioBlob = new Blob([Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))], {
        type: data.mimeType,
      });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      setShortsData(prev => ({ ...prev, audioUrl }));
      setCurrentStep("template");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate voice");
    } finally {
      setIsLoading(false);
    }
  };

  const selectTemplate = () => {
    if (!shortsData.selectedTemplate) {
      setError("Please select a template");
      return;
    }
    setCurrentStep("visuals");
  };

  const generateVisuals = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const selectedTemplate = getTemplateById(shortsData.selectedTemplate);
      const response = await fetch("/api/fal-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: shortsData.prompt,
          template: selectedTemplate?.name || "professional",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate visuals");
      }

      const data = await response.json();
      console.log('Received visual data:', data);
      setShortsData(prev => ({ ...prev, visualUrl: data.imageUrl }));
      setCurrentStep("music");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate visuals");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "prompt":
        return (
          <div className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-3">What's your YouTube Short about?</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Describe your video idea in a few sentences. Be specific about the topic, style, or message you want to convey.
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-6">
              <Textarea
                placeholder="Example: Create a motivational video about overcoming challenges and achieving your dreams. Make it inspiring and energetic."
                value={shortsData.prompt}
                onChange={(e) => setShortsData(prev => ({ ...prev, prompt: e.target.value }))}
                className="min-h-32 bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 text-lg resize-none"
              />
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  {shortsData.prompt.length}/500 characters
                </div>
                <Button 
                  onClick={generateScript}
                  disabled={!shortsData.prompt.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 text-lg font-semibold"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Script...
                    </>
                  ) : (
                    <>
                      Generate Script
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        );

      case "script":
        return (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Generated Script</CardTitle>
              <CardDescription className="text-gray-400">
                Review and edit your AI-generated script. This will be used for the voice-over.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={shortsData.script}
                onChange={(e) => setShortsData(prev => ({ ...prev, script: e.target.value }))}
                className="min-h-40 bg-gray-900/50 border-gray-600 text-white"
              />
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep("prompt")}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentStep("voice")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Continue to Voice
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "voice":
        return (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Choose Your Voice</CardTitle>
              <CardDescription className="text-gray-400">
                Select an AI voice that matches your content style and audience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AVAILABLE_VOICES.map((voice) => (
                  <div
                    key={voice.voice_id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      shortsData.selectedVoice === voice.voice_id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-600 bg-gray-900/30 hover:border-gray-500"
                    }`}
                    onClick={() => setShortsData(prev => ({ ...prev, selectedVoice: voice.voice_id }))}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">{voice.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {voice.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">{voice.description}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep("script")}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={generateVoice}
                  disabled={!shortsData.selectedVoice || isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Voice...
                    </>
                  ) : (
                    <>
                      Generate Voice
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "template":
        return (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Choose Your Style</CardTitle>
              <CardDescription className="text-gray-400">
                Select a visual template that matches your content type and brand.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SHORTS_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      shortsData.selectedTemplate === template.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-600 bg-gray-900/30 hover:border-gray-500"
                    }`}
                    onClick={() => setShortsData(prev => ({ ...prev, selectedTemplate: template.id }))}
                  >
                    <div className="aspect-[9/16] bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Preview</span>
                    </div>
                    <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">{template.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep("voice")}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={selectTemplate}
                  disabled={!shortsData.selectedTemplate}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Generate Visuals
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "visuals":
        const selectedTemplateForVisuals = getTemplateById(shortsData.selectedTemplate);
        return (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Generate Background Visuals</CardTitle>
              <CardDescription className="text-gray-400">
                AI will create professional background images that match your content and selected template.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                {isLoading ? (
                  <>
                    <Loader2 className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin" />
                    <h3 className="text-lg font-semibold text-white mb-2">Generating Visuals with FAL.ai...</h3>
                    <p className="text-gray-400">
                      Creating professional background images for your {selectedTemplateForVisuals?.name} template.
                    </p>
                  </>
                ) : shortsData.visualUrl ? (
                  <>
                    <div className="aspect-[9/16] max-w-xs mx-auto mb-4 rounded-lg overflow-hidden border border-gray-600">
                      <img 
                        src={shortsData.visualUrl} 
                        alt="Generated visual" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Visual Generated Successfully!</h3>
                    <p className="text-gray-400">
                      Your background image has been created and is ready for the final video.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="aspect-[9/16] max-w-xs mx-auto mb-4 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center border border-gray-600">
                      <span className="text-gray-400 text-sm">Visual Preview</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Ready to Generate Visuals</h3>
                    <p className="text-gray-400">
                      Click below to create professional background images using FAL.ai.
                    </p>
                  </>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep("template")}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  disabled={isLoading}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                {shortsData.visualUrl ? (
                  <Button 
                    onClick={() => setCurrentStep("music")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Continue to Music
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={generateVisuals}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate with FAL.ai
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case "music":
        const selectedTemplateForMusic = getTemplateById(shortsData.selectedTemplate);
        return (
          <div className="space-y-6">
            <MusicSelector
              selectedMusic={shortsData.selectedMusic}
              onMusicSelect={(musicId, musicUrl, musicType) => {
                setShortsData(prev => ({
                  ...prev,
                  selectedMusic: musicId,
                  musicUrl,
                  musicType
                }));
              }}
              template={selectedTemplateForMusic?.name || "educational"}
              scriptContent={shortsData.script}
            />
            
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep("visuals")}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={() => setCurrentStep("captions")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue to Captions
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case "captions":
        return (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Generate Captions</CardTitle>
              <CardDescription className="text-gray-400">
                AI will create synchronized captions from your voice-over using Whisper technology.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                {isLoading ? (
                  <>
                    <Loader2 className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin" />
                    <h3 className="text-lg font-semibold text-white mb-2">Generating Captions with Whisper...</h3>
                    <p className="text-gray-400">
                      Creating synchronized captions from your voice-over audio.
                    </p>
                  </>
                ) : shortsData.captions ? (
                  <>
                    <h3 className="text-lg font-semibold text-white mb-2">Captions Generated Successfully!</h3>
                    <p className="text-gray-400 mb-4">
                      {shortsData.captions.length} caption segments created with perfect timing.
                    </p>
                    <div className="bg-gray-900/50 rounded-lg p-4 max-h-40 overflow-y-auto">
                      {shortsData.captions.slice(0, 5).map((caption) => (
                        <div key={caption.id} className="text-left mb-2">
                          <span className="text-xs text-gray-500">
                            {caption.start.toFixed(1)}s - {caption.end.toFixed(1)}s:
                          </span>
                          <span className="text-gray-300 ml-2">{caption.text}</span>
                        </div>
                      ))}
                      {shortsData.captions.length > 5 && (
                        <p className="text-xs text-gray-500 text-center mt-2">
                          ...and {shortsData.captions.length - 5} more segments
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-white mb-2">Ready to Generate Captions</h3>
                    <p className="text-gray-400">
                      Click below to create synchronized captions using OpenAI Whisper.
                    </p>
                  </>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep("music")}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  disabled={isLoading}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                {shortsData.captions ? (
                  <Button 
                    onClick={() => setCurrentStep("preview")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Continue to Preview
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={async () => {
                      if (!shortsData.audioUrl) return;
                      setIsLoading(true);
                      try {
                        // Convert audio URL to blob for Whisper
                        const response = await fetch(shortsData.audioUrl);
                        const audioBlob = await response.blob();
                        const transcription = await transcribeAudioWithWhisper(audioBlob);
                        setShortsData(prev => ({ 
                          ...prev, 
                          captions: transcription.segments,
                          captionsEnabled: true 
                        }));
                      } catch (error) {
                        setError("Failed to generate captions");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading || !shortsData.audioUrl}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate with Whisper
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case "preview":
        const selectedTemplate = getTemplateById(shortsData.selectedTemplate);
        return (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Preview Your Short</CardTitle>
              <CardDescription className="text-gray-400">
                Review your YouTube Short before exporting. You can go back to make changes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Video Preview</h3>
                  <div className="aspect-[9/16] bg-gray-900 rounded-lg flex items-center justify-center border border-gray-600">
                    <div className="text-center">
                      <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">Video Preview</p>
                      <p className="text-sm text-gray-500">Template: {selectedTemplate?.name}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Script</h4>
                    <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-600">
                      <p className="text-gray-300 text-sm">{shortsData.script}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Voice</h4>
                    <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-600">
                      <p className="text-gray-300 text-sm">
                        {AVAILABLE_VOICES.find(v => v.voice_id === shortsData.selectedVoice)?.name}
                      </p>
                      {shortsData.audioUrl && (
                        <audio controls className="w-full mt-2">
                          <source src={shortsData.audioUrl} type="audio/mpeg" />
                        </audio>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">Template</h4>
                    <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-600">
                      <p className="text-gray-300 text-sm">{selectedTemplate?.name}</p>
                      <p className="text-gray-500 text-xs">{selectedTemplate?.description}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">Background Music</h4>
                    <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-600">
                      <p className="text-gray-300 text-sm">
                        {shortsData.musicType === 'none' ? 'No Background Music' : 
                         shortsData.musicType === 'generated' ? 'AI Generated Music (SUNO)' :
                         shortsData.selectedMusic || 'No music selected'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">Captions</h4>
                    <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-600">
                      <p className="text-gray-300 text-sm">
                        {shortsData.captions ? 
                          `${shortsData.captions.length} synchronized caption segments` : 
                          'No captions generated'}
                      </p>
                      {shortsData.captions && (
                        <p className="text-gray-500 text-xs mt-1">
                          Generated with OpenAI Whisper
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep("captions")}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div className="flex space-x-3">
                  <Button 
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        const response = await fetch('/api/create-project', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(shortsData)
                        });
                        
                        if (!response.ok) {
                          throw new Error('Failed to create project');
                        }
                        
                        const result = await response.json();
                        console.log('Project created:', result);
                        
                        // Save project data to localStorage for immediate access
                        if (result.projectData) {
                          localStorage.setItem(`project_${result.projectId}`, JSON.stringify(result.projectData));
                          console.log('Project data saved to localStorage');
                        }
                        
                        // Redirect to editor with the new project
                        window.location.href = `/app?project=${result.projectId}`;
                      } catch (error) {
                        setError('Failed to create project for editing');
                        console.error('Error creating project:', error);
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Project...
                      </>
                    ) : (
                      <>
                        Edit in Studio
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep("export")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Export Video
                    <Download className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "export":
        return (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Export Your Short</CardTitle>
              <CardDescription className="text-gray-400">
                Your YouTube Short is being generated. This may take a few minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <Loader2 className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-semibold text-white mb-2">Generating Your Video...</h3>
                <p className="text-gray-400">
                  We're combining your script, voice, and visuals into a professional YouTube Short.
                </p>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep("preview")}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Create Your YouTube Short
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Follow the steps below to generate your professional YouTube Short with AI
          </p>
        </div>

        {/* Progress Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700/50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex]?.title}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">{Math.round(progress)}% Complete</span>
              <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Step Indicators */}
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step.key} className="flex flex-col items-center space-y-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    index <= currentStepIndex
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="text-center">
                  <p className={`text-xs font-medium transition-colors duration-300 ${
                    index <= currentStepIndex ? "text-white" : "text-gray-500"
                  }`}>
                    {step.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <p className="text-red-300 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}
