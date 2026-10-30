# Academic Course Repository System

A modern full-stack web application for managing university syllabus documents.

## Tech Stack
- **Frontend:** React.js, Tailwind CSS (v4), React Router, Recharts, Axios, Lucide React
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), PDFKit

## Features
- **Dashboard:** Analytics on courses, PO mappings, and recent updates.
- **Course Management:** View courses, semester-wise listings, and detailed full syllabus pages.
- **PDF Generation:** Download full syllabus as PDF directly from the interface.
- **Search & Filters:** Real-time search across course titles and codes.

## Prerequisites
- Node.js (v18+)
- MongoDB running locally on `localhost:27017`

## Setup & Installation

### 1. Database Setup
Ensure your local MongoDB instance is running. Seed the database with the provided initial sample data.
```bash
cd backend
node seed.js
```

### 2. Start Backend Server
```bash
cd backend
npm install
npm run start
# Server starts on port 5000
```

### 3. Start Frontend Client
```bash
cd frontend
npm install
npm run dev
# Frontend accessible via Vite dev server (usually http://localhost:5173)
```

## Application Structure
- `/frontend` contains the React UI.
- `/backend` contains the Express API and Mongoose schema definitions.
