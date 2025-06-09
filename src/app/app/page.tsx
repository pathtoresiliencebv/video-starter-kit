import { App } from "@/components/main";
import { PROJECT_PLACEHOLDER } from "@/data/schema";
import { cookies } from "next/headers";

interface PageProps {
  searchParams: { project?: string };
}

export default function IndexPage({ searchParams }: PageProps) {
  const cookieStore = cookies();
  const lastProjectId = cookieStore.get("__aivs_lastProjectId");
  
  // Use project from URL params, fallback to cookie, then to placeholder
  const projectId = searchParams.project ?? lastProjectId?.value ?? PROJECT_PLACEHOLDER.id;
  
  return <App projectId={projectId} />;
}
