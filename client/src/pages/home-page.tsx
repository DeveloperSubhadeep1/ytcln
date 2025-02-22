import { useQuery } from "@tanstack/react-query";
import { Video } from "@shared/schema";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { VideoGrid } from "@/components/video-grid";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { data: videos, isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <main className="p-6">
          <VideoGrid videos={videos || []} />
        </main>
      </div>
    </div>
  );
}
