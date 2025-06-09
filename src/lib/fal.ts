"use client";

import { createFalClient } from "@fal-ai/client";

export const fal = createFalClient({
  credentials: () => (typeof window !== 'undefined' ? localStorage?.getItem("falKey") : null) as string,
  proxyUrl: "/api/fal",
});

// Re-export types and endpoints from the separate file
export type { InputAsset, ApiInfo } from "@/lib/endpoints";
export { AVAILABLE_ENDPOINTS } from "@/lib/endpoints";
