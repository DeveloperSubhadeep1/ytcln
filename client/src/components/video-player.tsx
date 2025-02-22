import { Video } from "@shared/schema";
import ReactPlayer from "react-player";
import { ThumbsUp, ThumbsDown, Share, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function VideoPlayer({ video }: { video: Video }) {
  const { toast } = useToast();
  const { data: interactions } = useQuery({
    queryKey: ["/api/user/interactions"],
    queryFn: () => {
      // For demo purposes, return default interactions
      return {
        likedVideos: new Set<number>(),
        dislikedVideos: new Set<number>(),
        likedComments: new Set<number>(),
        dislikedComments: new Set<number>(),
      };
    },
  });

  const isLiked = interactions?.likedVideos.has(video.id);
  const isDisliked = interactions?.dislikedVideos.has(video.id);

  const likeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/videos/${video.id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/videos/${video.id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/interactions"] });
      toast({
        title: isLiked ? "Removed like" : "Liked video",
        description: isLiked
          ? "Your like has been removed."
          : "Your like has been recorded.",
      });
    },
  });

  const dislikeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/videos/${video.id}/dislike`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/videos/${video.id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/interactions"] });
      toast({
        title: isDisliked ? "Removed dislike" : "Disliked video",
        description: isDisliked
          ? "Your dislike has been removed."
          : "Your dislike has been recorded.",
      });
    },
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Video link has been copied to clipboard.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Video saved",
      description: "Video has been added to your playlist.",
    });
  };

  return (
    <div>
      <div className="aspect-video">
        <ReactPlayer
          url={video.videoUrl}
          width="100%"
          height="100%"
          controls
          playing
        />
      </div>

      <div className="mt-4">
        <h1 className="text-2xl font-bold">{video.title}</h1>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-muted-foreground">
            {video.views.toLocaleString()} views
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={isLiked ? "secondary" : "ghost"}
              size="sm"
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending || dislikeMutation.isPending}
            >
              <ThumbsUp className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
              {video.likes.toLocaleString()}
            </Button>
            <Button 
              variant={isDisliked ? "secondary" : "ghost"}
              size="sm"
              onClick={() => dislikeMutation.mutate()}
              disabled={likeMutation.isPending || dislikeMutation.isPending}
            >
              <ThumbsDown className={`h-4 w-4 mr-2 ${isDisliked ? "fill-current" : ""}`} />
              {video.dislikes.toLocaleString()}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}