# YouTube Clone

A comprehensive YouTube clone with pixel-perfect UI and advanced interaction features. The platform provides a seamless video watching experience with robust backend functionality and intuitive user interactions.

## Features

- Video playback with React Player
- Like/Dislike functionality
- Comments system
- Video upload
- Search functionality
- Real-time interaction handling
- Responsive design

## Tech Stack

- Frontend:
  - React.js
  - TypeScript
  - TanStack Query for data fetching
  - Tailwind CSS + shadcn/ui for styling
  - Wouter for routing
  - React Player for video playback
  
- Backend:
  - Express.js
  - PostgreSQL (optional, can use in-memory storage)
  - Drizzle ORM
  - Zod for validation

## Prerequisites

- Node.js 18+ (20.x recommended)
- npm or yarn
- PostgreSQL (optional)

## Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd youtube-clone
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5000

## Database Setup

The application supports both in-memory storage and PostgreSQL. By default, it uses in-memory storage for quick development.

### Using PostgreSQL

1. Create a PostgreSQL database
2. Set up environment variables in `.env`:
```env
DATABASE_URL=postgresql://user:password@host:port/dbname
```

3. Run database migrations:
```bash
npm run db:push
```

## Deployment

### Deploying to Render

1. Create a new Web Service on Render
2. Connect your repository
3. Configure the service:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables:
     - `NODE_ENV=production`
     - `DATABASE_URL` (if using PostgreSQL)

4. Click "Create Web Service"

### Deploying to Koyeb

1. Install Koyeb CLI (optional)
2. Create a new app on Koyeb dashboard
3. Configure the deployment:
   - Runtime: Node.js
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables:
     - `NODE_ENV=production`
     - `DATABASE_URL` (if using PostgreSQL)

4. Connect your repository and deploy

## Environment Variables

- `NODE_ENV`: Set to `production` in production environment
- `DATABASE_URL`: PostgreSQL connection string (optional)
- `PORT`: Port number (defaults to 5000)

## Project Structure

```
├── client/               # Frontend code
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utility functions
│   │   └── hooks/       # Custom React hooks
├── server/              # Backend code
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Data storage layer
│   └── index.ts         # Server entry point
├── shared/              # Shared types and schemas
└── migrations/          # Database migrations
```

## API Endpoints

### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get video by ID
- `POST /api/videos` - Upload new video
- `POST /api/videos/:id/like` - Like a video
- `POST /api/videos/:id/dislike` - Dislike a video

### Comments
- `GET /api/videos/:id/comments` - Get video comments
- `POST /api/videos/:id/comments` - Add comment
- `POST /api/comments/:id/like` - Like comment
- `POST /api/comments/:id/dislike` - Dislike comment

### Search
- `GET /api/search?q=query` - Search videos

## User Manual

### Watching Videos
1. Browse videos on the homepage
2. Click on a video to watch
3. Use the video player controls for playback
4. Like or dislike videos
5. Add comments
6. Share videos using the share button

### Uploading Videos
1. Click the upload button in the header
2. Fill in video details:
   - Title
   - Description
   - Video URL (currently supports external URLs)
   - Thumbnail URL
   - Duration
3. Click "Upload Video"

### Searching Videos
1. Use the search bar in the header
2. Enter your search query
3. Press enter or click the search button
4. Browse search results

### Interacting with Videos
- Like/Dislike: Click the thumbs up/down buttons
- Comments: Scroll down to the comments section
- Share: Click the share button to copy the video URL
- Save: Click the save button to add to your playlist

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
