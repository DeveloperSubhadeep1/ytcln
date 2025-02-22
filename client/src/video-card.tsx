import { Video } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

export function VideoCard({ video }: { video: Video }) {
  return (
    <Link href={`/watch/${video.id}`}>
      <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full aspect-video object-cover rounded-t-lg"
        />
        <div className="p-3">
          <h3 className="font-semibold line-clamp-2">{video.title}</h3>
          <div className="mt-2 text-sm text-muted-foreground">
            <div>{video.views.toLocaleString()} views</div>
            <div>
              {formatDistanceToNow(new Date(video.createdAt), {
                addSuffix: true,
              })}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}