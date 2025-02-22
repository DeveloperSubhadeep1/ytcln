import { Video, Comment, Channel } from "@shared/schema";

export interface IStorage {
  getVideos(): Promise<Video[]>;
  getVideo(id: number): Promise<Video | undefined>;
  getVideoBySlug(slug: string): Promise<Video | undefined>;
  getVideoComments(videoId: number): Promise<Comment[]>;
  getChannel(id: number): Promise<Channel | undefined>;
  searchVideos(query: string): Promise<Video[]>;
  addComment(videoId: number, userId: number, content: string): Promise<Comment>;
  likeVideo(videoId: number): Promise<void>;
  dislikeVideo(videoId: number): Promise<void>;
  likeComment(commentId: number): Promise<void>;
  dislikeComment(commentId: number): Promise<void>;
  getUserInteractions(userId: number): Promise<{
    likedVideos: Set<number>;
    dislikedVideos: Set<number>;
    likedComments: Set<number>;
    dislikedComments: Set<number>;
  }>;
  uploadVideo(video: Omit<Video, "id" | "createdAt" | "views" | "likes" | "dislikes">): Promise<Video>;
}

export class MemStorage implements IStorage {
  private videos: Map<number, Video>;
  private comments: Map<number, Comment>;
  private channels: Map<number, Channel>;
  private userInteractions: Map<number, {
    likedVideos: Set<number>;
    dislikedVideos: Set<number>;
    likedComments: Set<number>;
    dislikedComments: Set<number>;
  }>;

  constructor() {
    this.videos = new Map();
    this.comments = new Map();
    this.channels = new Map();
    this.userInteractions = new Map();
    this.initializeSampleData();
  }

  async getUserInteractions(userId: number) {
    return (
      this.userInteractions.get(userId) || {
        likedVideos: new Set<number>(),
        dislikedVideos: new Set<number>(),
        likedComments: new Set<number>(),
        dislikedComments: new Set<number>(),
      }
    );
  }

  async getVideos(): Promise<Video[]> {
    return Array.from(this.videos.values());
  }

  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getVideoBySlug(slug: string): Promise<Video | undefined> {
    return Array.from(this.videos.values()).find(video => video.slug === slug);
  }

  async getChannel(id: number): Promise<Channel | undefined> {
    return this.channels.get(id);
  }

  async getVideoComments(videoId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(
      (comment) => comment.videoId === videoId
    );
  }

  async searchVideos(query: string): Promise<Video[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.videos.values()).filter((video) =>
      video.title.toLowerCase().includes(lowercaseQuery)
    );
  }

  async addComment(videoId: number, userId: number, content: string): Promise<Comment> {
    const commentId = Math.max(0, ...Array.from(this.comments.keys())) + 1;
    const comment: Comment = {
      id: commentId,
      videoId,
      userId,
      content,
      likes: 0,
      createdAt: new Date(),
    };
    this.comments.set(commentId, comment);
    return comment;
  }

  async likeVideo(videoId: number): Promise<void> {
    const video = this.videos.get(videoId);
    const userId = 1; // For demo purposes
    if (!video) return;

    const interactions = await this.getUserInteractions(userId);

    // If already liked, remove like
    if (interactions.likedVideos.has(videoId)) {
      video.likes = Math.max(0, video.likes - 1);
      interactions.likedVideos.delete(videoId);
    } else {
      // Remove dislike if exists
      if (interactions.dislikedVideos.has(videoId)) {
        video.dislikes = Math.max(0, video.dislikes - 1);
        interactions.dislikedVideos.delete(videoId);
      }
      // Add like
      video.likes += 1;
      interactions.likedVideos.add(videoId);
    }

    this.videos.set(videoId, video);
    this.userInteractions.set(userId, interactions);
  }

  async dislikeVideo(videoId: number): Promise<void> {
    const video = this.videos.get(videoId);
    const userId = 1; // For demo purposes
    if (!video) return;

    const interactions = await this.getUserInteractions(userId);

    // If already disliked, remove dislike
    if (interactions.dislikedVideos.has(videoId)) {
      video.dislikes = Math.max(0, video.dislikes - 1);
      interactions.dislikedVideos.delete(videoId);
    } else {
      // Remove like if exists
      if (interactions.likedVideos.has(videoId)) {
        video.likes = Math.max(0, video.likes - 1);
        interactions.likedVideos.delete(videoId);
      }
      // Add dislike
      video.dislikes += 1;
      interactions.dislikedVideos.add(videoId);
    }

    this.videos.set(videoId, video);
    this.userInteractions.set(userId, interactions);
  }

  async likeComment(commentId: number): Promise<void> {
    const comment = this.comments.get(commentId);
    const userId = 1; // For demo purposes
    if (!comment) return;

    const interactions = await this.getUserInteractions(userId);

    // If already liked, remove like
    if (interactions.likedComments.has(commentId)) {
      comment.likes = Math.max(0, comment.likes - 1);
      interactions.likedComments.delete(commentId);
    } else {
      // Remove dislike if exists
      if (interactions.dislikedComments.has(commentId)) {
        interactions.dislikedComments.delete(commentId);
      }
      // Add like
      comment.likes += 1;
      interactions.likedComments.add(commentId);
    }

    this.comments.set(commentId, comment);
    this.userInteractions.set(userId, interactions);
  }

  async dislikeComment(commentId: number): Promise<void> {
    const comment = this.comments.get(commentId);
    const userId = 1; // For demo purposes
    if (!comment) return;

    const interactions = await this.getUserInteractions(userId);

    // If already disliked, remove dislike
    if (interactions.dislikedComments.has(commentId)) {
      interactions.dislikedComments.delete(commentId);
    } else {
      // Remove like if exists
      if (interactions.likedComments.has(commentId)) {
        comment.likes = Math.max(0, comment.likes - 1);
        interactions.likedComments.delete(commentId);
      }
      // Add dislike
      interactions.dislikedComments.add(commentId);
    }

    this.comments.set(commentId, comment);
    this.userInteractions.set(userId, interactions);
  }

  async uploadVideo(video: Omit<Video, "id" | "createdAt" | "views" | "likes" | "dislikes">): Promise<Video> {
    const id = Math.max(0, ...Array.from(this.videos.keys())) + 1;
    const newVideo: Video = {
      ...video,
      id,
      views: 0,
      likes: 0,
      dislikes: 0,
      createdAt: new Date(),
    };
    this.videos.set(id, newVideo);
    return newVideo;
  }

  private initializeSampleData() {
    // Initialize user interactions
    this.userInteractions.set(1, {
      likedVideos: new Set<number>(),
      dislikedVideos: new Set<number>(),
      likedComments: new Set<number>(),
      dislikedComments: new Set<number>(),
    });

    const channels: Channel[] = [
      {
        id: 1,
        name: "Tech Academy",
        description: "Learn programming and web development",
        avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=tech",
        bannerUrl: "https://picsum.photos/seed/tech/1920/1080",
        subscribers: 500000,
        verified: true,
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      },
      {
        id: 2,
        name: "Gaming Central",
        description: "Your daily dose of gaming content",
        avatarUrl: "https://api.dicebear.com/7.x/personas/svg?seed=gaming",
        bannerUrl: "https://picsum.photos/seed/gaming/1920/1080",
        subscribers: 1000000,
        verified: true,
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      }
    ];

    channels.forEach(channel => this.channels.set(channel.id, channel));

    const videos: Video[] = [
      {
        id: 1,
        title: "Complete Web Development Course 2024",
        slug: "complete-web-development-course-2024",
        description: "Learn web development from scratch with this comprehensive guide",
        videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4",
        thumbnailUrl: "https://picsum.photos/seed/webdev/1280/720",
        channelId: 1,
        views: 250000,
        likes: 25000,
        dislikes: 500,
        duration: "3:45:20",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: 2,
        title: "React.js Tutorial for Beginners",
        slug: "reactjs-tutorial-for-beginners",
        description: "Step-by-step guide to learning React.js",
        videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
        thumbnailUrl: "https://picsum.photos/seed/react/1280/720",
        channelId: 1,
        views: 150000,
        likes: 18000,
        dislikes: 300,
        duration: "2:30:15",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        id: 3,
        title: "Top 10 Games of 2024",
        slug: "top-10-games-of-2024",
        description: "The best games released this year",
        videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
        thumbnailUrl: "https://picsum.photos/seed/games/1280/720",
        channelId: 2,
        views: 500000,
        likes: 45000,
        dislikes: 1000,
        duration: "15:30",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      }
    ];

    videos.forEach(video => this.videos.set(video.id, video));

    const comments: Comment[] = [
      {
        id: 1,
        videoId: 1,
        userId: 1,
        content: "Great tutorial! Really helped me understand web development.",
        likes: 150,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: 2,
        videoId: 1,
        userId: 2,
        content: "Very clear explanations. Thanks for making this!",
        likes: 75,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      }
    ];

    comments.forEach(comment => this.comments.set(comment.id, comment));
  }
}

export const storage = new MemStorage();