import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVideoSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/videos", async (req, res) => {
    const videos = await storage.getVideos();
    res.json(videos);
  });

  app.get("/api/videos/:id", async (req, res) => {
    const video = await storage.getVideo(parseInt(req.params.id));
    if (!video) return res.status(404).send("Video not found");
    res.json(video);
  });

  app.get("/api/videos/:id/comments", async (req, res) => {
    const videoId = parseInt(req.params.id);
    const comments = await storage.getVideoComments(videoId);
    res.json(comments);
  });

  app.post("/api/videos/:id/comments", async (req, res) => {
    const videoId = parseInt(req.params.id);
    const { userId, content } = req.body;
    const comment = await storage.addComment(videoId, userId, content);
    res.status(201).json(comment);
  });

  app.post("/api/videos/:id/like", async (req, res) => {
    const videoId = parseInt(req.params.id);
    await storage.likeVideo(videoId);
    res.sendStatus(200);
  });

  app.post("/api/videos/:id/dislike", async (req, res) => {
    const videoId = parseInt(req.params.id);
    await storage.dislikeVideo(videoId);
    res.sendStatus(200);
  });

  app.post("/api/comments/:id/like", async (req, res) => {
    const commentId = parseInt(req.params.id);
    await storage.likeComment(commentId);
    res.sendStatus(200);
  });

  app.post("/api/comments/:id/dislike", async (req, res) => {
    const commentId = parseInt(req.params.id);
    await storage.dislikeComment(commentId);
    res.sendStatus(200);
  });

  app.get("/api/channels/:id", async (req, res) => {
    const channelId = parseInt(req.params.id);
    const channel = await storage.getChannel(channelId);
    if (!channel) return res.status(404).send("Channel not found");
    res.json(channel);
  });

  app.get("/api/search", async (req, res) => {
    const query = req.query.q as string;
    const videos = await storage.searchVideos(query);
    res.json(videos);
  });

  app.post("/api/videos", async (req, res) => {
    try {
      const parsedVideo = insertVideoSchema.parse(req.body);
      const video = await storage.uploadVideo(parsedVideo);
      res.status(201).json(video);
    } catch (error) {
      res.status(400).json({ error: "Invalid video data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}