"use client";

import { useState } from "react";
import { ShortsCreationWizard } from "@/components/shorts/creation-wizard";

export default function CreateShortsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Create Your YouTube Short
            </h1>
            <p className="text-gray-400 text-lg">
              Follow the steps below to generate your professional YouTube Short
            </p>
          </div>
          
          <ShortsCreationWizard />
        </div>
      </div>
    </div>
  );
}
