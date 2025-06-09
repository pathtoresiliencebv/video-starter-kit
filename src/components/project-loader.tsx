"use client";

import { useEffect } from 'react';
import { db } from '@/data/db';

interface ProjectLoaderProps {
  projectId: string;
}

export function ProjectLoader({ projectId }: ProjectLoaderProps) {
  useEffect(() => {
    const loadProjectFromLocalStorage = async () => {
      try {
        // Check if project data exists in localStorage
        const projectDataString = localStorage.getItem(`project_${projectId}`);
        
        if (projectDataString) {
          console.log('Loading project data from localStorage:', projectId);
          const projectData = JSON.parse(projectDataString);
          const { project, tracks, mediaItems, keyframes } = projectData;
          
          // Check if project already exists in IndexedDB
          const existingProject = await db.projects.find(projectId);
          
          if (!existingProject) {
            console.log('Saving project data to IndexedDB...');
            
            // Save project
            await db.projects.update(project.id, project);
            
            // Save tracks
            for (const track of tracks) {
              await db.tracks.createWithId(track);
            }
            
            // Save media items
            for (const mediaItem of mediaItems) {
              await db.media.createWithId(mediaItem);
            }
            
            // Save keyframes
            for (const keyframe of keyframes) {
              await db.keyFrames.createWithId(keyframe);
            }
            
            console.log('Project data successfully saved to IndexedDB');
            
            // Clean up localStorage after successful save
            localStorage.removeItem(`project_${projectId}`);
          } else {
            console.log('Project already exists in IndexedDB');
            // Clean up localStorage
            localStorage.removeItem(`project_${projectId}`);
          }
        }
      } catch (error) {
        console.error('Error loading project from localStorage:', error);
      }
    };

    if (projectId && projectId !== '') {
      loadProjectFromLocalStorage();
    }
  }, [projectId]);

  // This component doesn't render anything
  return null;
}
