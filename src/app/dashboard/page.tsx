import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <Button asChild>
          <Link href="/app">
            <PlusIcon className="w-4 h-4 mr-2" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <Link
            key={project.id}
            href={`/app?project=${project.id}`}
            className="block p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors"
          >
            <h2 className="font-semibold mb-2">{project.title}</h2>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}