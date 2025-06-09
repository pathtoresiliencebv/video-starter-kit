"use client";

import { useEffect } from 'react';

export function AutoKeyLoader() {
  useEffect(() => {
    const loadKeysFromEnvironment = async () => {
      try {
        // Check if keys are already in localStorage
        const existingFalKey = localStorage.getItem("falKey");
        const existingOpenaiKey = localStorage.getItem("openaiKey");
        const existingElevenlabsKey = localStorage.getItem("elevenlabsKey");

        // Only load from environment if keys are missing
        if (!existingFalKey || !existingOpenaiKey || !existingElevenlabsKey) {
          const response = await fetch('/api/get-env-keys');
          if (response.ok) {
            const keys = await response.json();
            
            // Only set keys that don't already exist
            if (keys.falKey && !existingFalKey) {
              localStorage.setItem("falKey", keys.falKey);
              console.log('FAL key loaded from environment');
            }
            if (keys.openaiKey && !existingOpenaiKey) {
              localStorage.setItem("openaiKey", keys.openaiKey);
              console.log('OpenAI key loaded from environment');
            }
            if (keys.elevenlabsKey && !existingElevenlabsKey) {
              localStorage.setItem("elevenlabsKey", keys.elevenlabsKey);
              console.log('ElevenLabs key loaded from environment');
            }
          }
        }
      } catch (error) {
        console.error('Failed to load keys from environment:', error);
      }
    };

    loadKeysFromEnvironment();
  }, []);

  // This component doesn't render anything
  return null;
}
