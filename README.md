# Video Player Web Application

## Overview

This is a VLC-style video player application built with React and Express. It allows users to upload video files, load subtitles, and play videos with comprehensive controls including keyboard shortcuts, subtitle management, and full-screen support.

## System Architecture

The application uses a monorepo structure with client-server separation:

- **Frontend**: React with TypeScript, using Vite for development and building
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for data persistence
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state, React hooks for local state

##  Live Demo

The website is deployed at render and accessible [here](https://myplayer-u7f7.onrender.com/)

## Key Components

### Frontend Architecture
- **React Router**: Using `wouter` for client-side routing
- **Component Structure**: Modular components with UI library (shadcn/ui)
- **Video Player**: Custom video player with controls, subtitles, and keyboard shortcuts
- **File Upload**: Drag-and-drop interface for video and subtitle files
- **State Management**: React Query for API calls and caching

### Backend Architecture
- **Express Server**: RESTful API with middleware for logging and error handling
- **File Upload**: Multer for handling multipart/form-data uploads
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **Development Setup**: Vite integration for hot reloading in development

### Database Schema
- **Video Files Table**: Stores video metadata, audio tracks, subtitle tracks
- **Subtitle Files Table**: Stores subtitle content, format, and language information
- **Drizzle ORM**: Type-safe database operations with PostgreSQL

## Data Flow

1. **File Upload**: Users upload videos/subtitles via drag-and-drop or file input
2. **Metadata Extraction**: Server extracts video metadata (duration, tracks, etc.)
3. **Database Storage**: File information stored in PostgreSQL via Drizzle ORM
4. **Video Playback**: Frontend fetches video list and plays selected videos
5. **Subtitle Processing**: Subtitles parsed and synchronized with video playback

## External Dependencies

### Core Technologies
- **React**: Frontend framework with hooks and context
- **Express**: Backend web framework
- **PostgreSQL**: Primary database (via Neon serverless)
- **Drizzle ORM**: Database ORM with type safety
- **Vite**: Development server and build tool

### UI Libraries
- **shadcn/ui**: Pre-built React components
- **Radix UI**: Headless UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### File Handling
- **Multer**: File upload middleware
- **FFprobe**: Video metadata extraction (mocked in current implementation)

## Deployment Strategy

### Development
- **Vite Dev Server**: Frontend development with hot reloading
- **Express Server**: Backend API with file watching via tsx
- **Database**: Neon serverless PostgreSQL connection

### Production Build
- **Frontend**: Vite builds to `dist/public`
- **Backend**: ESBuild bundles server to `dist/index.js`
- **Static Files**: Express serves built frontend files
- **Database**: Production PostgreSQL via environment variables

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **NODE_ENV**: Environment mode (development/production)
- **File Storage**: Local uploads directory with 5GB limit

The application is designed to be easily deployable on platforms like Render, with proper environment variable configuration for the database connection.
Just load the website and watch videos offline, no installation needed.
