import { useQuery } from "@tanstack/react-query";
import { Video, Comment } from "@shared/schema";
import { Header } from "@/components/header";
import { VideoPlayer } from "@/components/video-player";
import { CommentSection } from "@/components/comment-section";
import { Loader2 } from "lucide-react";

export default function WatchPage({ params }: { params: { id: string } }) {
  const { data: video, isLoading: videoLoading } = useQuery<Video>({
    queryKey: [`/api/videos/${params.id}`],
  });

  const { data: comments, isLoading: commentsLoading } = useQuery<Comment[]>({
    queryKey: [`/api/videos/${params.id}/comments`],
    enabled: !!video,
  });

  if (videoLoading || commentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (!video) return <div>Video not found</div>;

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VideoPlayer video={video} />
              <CommentSection videoId={video.id} comments={comments || []} />
            </div>
            <div className="hidden lg:block">
              {/* Related videos */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}