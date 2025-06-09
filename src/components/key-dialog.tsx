"use client";

import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type KeyDialogProps = {} & Parameters<typeof Dialog>[0];

export function KeyDialog({ onOpenChange, open, ...props }: KeyDialogProps) {
  const [falKey, setFalKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [elevenlabsKey, setElevenlabsKey] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Load existing keys from localStorage
    const existingFalKey = localStorage.getItem("falKey");
    const existingOpenaiKey = localStorage.getItem("openaiKey");
    const existingElevenlabsKey = localStorage.getItem("elevenlabsKey");
    
    if (existingFalKey) setFalKey(existingFalKey);
    if (existingOpenaiKey) setOpenaiKey(existingOpenaiKey);
    if (existingElevenlabsKey) setElevenlabsKey(existingElevenlabsKey);
  }, [open]);

  const handleOnOpenChange = (isOpen: boolean) => {
    onOpenChange?.(isOpen);
  };

  const handleSave = () => {
    // Save all keys to localStorage
    if (falKey) localStorage.setItem("falKey", falKey);
    if (openaiKey) localStorage.setItem("openaiKey", openaiKey);
    if (elevenlabsKey) localStorage.setItem("elevenlabsKey", elevenlabsKey);
    
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved successfully.",
    });
    
    handleOnOpenChange(false);
  };

  const handleAutoFill = async () => {
    try {
      // Try to get keys from environment via API
      const response = await fetch('/api/get-env-keys');
      if (response.ok) {
        const keys = await response.json();
        if (keys.falKey) {
          setFalKey(keys.falKey);
          localStorage.setItem("falKey", keys.falKey);
        }
        if (keys.openaiKey) {
          setOpenaiKey(keys.openaiKey);
          localStorage.setItem("openaiKey", keys.openaiKey);
        }
        if (keys.elevenlabsKey) {
          setElevenlabsKey(keys.elevenlabsKey);
          localStorage.setItem("elevenlabsKey", keys.elevenlabsKey);
        }
        
        toast({
          title: "Keys Auto-filled",
          description: "API keys have been loaded from environment.",
        });
      }
    } catch (error) {
      console.error('Failed to auto-fill keys:', error);
    }
  };

  return (
    <Dialog {...props} onOpenChange={handleOnOpenChange} open={open}>
      <DialogContent className="flex flex-col max-w-lg h-fit">
        <DialogHeader>
          <DialogTitle className="sr-only">Access Key</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col flex-1 gap-6">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold">API Keys Settings</h2>
            <Button variant="outline" size="sm" onClick={handleAutoFill}>
              Auto-fill from Environment
            </Button>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="fal-key">FAL.ai API Key</Label>
              <Input
                id="fal-key"
                placeholder="Your FAL Key for image generation"
                value={falKey}
                onChange={(e) => setFalKey(e.target.value)}
                type="password"
              />
              <p className="text-xs text-muted-foreground">
                Get your key from{" "}
                <a
                  className="underline"
                  href="https://fal.ai/dashboard/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  fal.ai/dashboard/keys
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="openai-key">OpenAI API Key</Label>
              <Input
                id="openai-key"
                placeholder="Your OpenAI Key for script generation"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                type="password"
              />
              <p className="text-xs text-muted-foreground">
                Get your key from{" "}
                <a
                  className="underline"
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  platform.openai.com/api-keys
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="elevenlabs-key">ElevenLabs API Key</Label>
              <Input
                id="elevenlabs-key"
                placeholder="Your ElevenLabs Key for voice generation"
                value={elevenlabsKey}
                onChange={(e) => setElevenlabsKey(e.target.value)}
                type="password"
              />
              <p className="text-xs text-muted-foreground">
                Get your key from{" "}
                <a
                  className="underline"
                  href="https://elevenlabs.io/app/settings/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  elevenlabs.io/app/settings/api-keys
                </a>
              </p>
            </div>
          </div>
          
          <div className="flex flex-row items-center justify-end gap-2">
            <Button variant="outline" onClick={() => handleOnOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Keys</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
