import { Comment } from "@shared/schema";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function CommentSection({
  videoId,
  comments,
}: {
  videoId: number;
  comments: Comment[];
}) {
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");

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

  const addCommentMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/videos/${videoId}/comments`, {
        userId: 1, // For demo purposes, we're using a fixed user ID
        content: newComment,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/videos/${videoId}/comments`] });
      setNewComment("");
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      await apiRequest("POST", `/api/comments/${commentId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/videos/${videoId}/comments`] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/interactions"] });
    },
  });

  const dislikeCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      await apiRequest("POST", `/api/comments/${commentId}/dislike`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/videos/${videoId}/comments`] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/interactions"] });
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addCommentMutation.mutate();
    }
  };

  const isCommentLiked = (commentId: number) => interactions?.likedComments.has(commentId);
  const isCommentDisliked = (commentId: number) => interactions?.dislikedComments.has(commentId);

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-4">
        {comments.length} Comments
      </h3>

      <form onSubmit={handleSubmitComment} className="flex gap-4 mb-6">
        <Avatar className="h-8 w-8" />
        <div className="flex-1">
          <Input 
            placeholder="Add a comment..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          {newComment && (
            <div className="mt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setNewComment("")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addCommentMutation.isPending}
              >
                Comment
              </Button>
            </div>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar className="h-8 w-8" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">User {comment.userId}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="mt-1">{comment.content}</p>
              <div className="mt-2 flex items-center gap-2">
                <Button 
                  variant={isCommentLiked(comment.id) ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => likeCommentMutation.mutate(comment.id)}
                  disabled={likeCommentMutation.isPending || dislikeCommentMutation.isPending}
                >
                  <ThumbsUp className={`h-4 w-4 mr-2 ${isCommentLiked(comment.id) ? "fill-current" : ""}`} />
                  {comment.likes}
                </Button>
                <Button 
                  variant={isCommentDisliked(comment.id) ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => dislikeCommentMutation.mutate(comment.id)}
                  disabled={likeCommentMutation.isPending || dislikeCommentMutation.isPending}
                >
                  <ThumbsDown className={`h-4 w-4 ${isCommentDisliked(comment.id) ? "fill-current" : ""}`} />
                </Button>
                <Button variant="ghost" size="sm">
                  Reply
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}