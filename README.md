# Resilient Live Polling System (Intervue Assignment)

A real-time polling application built with React, Node.js, Socket.io, and MongoDB. It features a resilient architecture that handles state recovery and race conditions.

### 🚀 Live Links
- **Frontend (Student & Teacher):** https://fluffy-dieffenbachia-0ec496.netlify.app/
- **Backend API:** https://poll-backend-app.onrender.com/

### ✨ Key Features
- **Resilient State Recovery:** Users can refresh the browser without losing poll state.
- **Timer Synchronization:** Server-side timer ensures students joining late see the correct remaining time.
- **Separation of Concerns:** Logic separated into Custom Hooks (`useTeacherPoll`, `useStudentPoll`) and Backend Services.
- **Poll History:** Persistent storage using MongoDB.

### 🛠️ Tech Stack
- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Real-time:** Socket.io
- **Database:** MongoDB

### 🏃‍♂️ How to Run Locally
1. Clone the repo.
2. `cd backend` -> `npm install` -> Create `.env` -> `npm run dev`
3. `cd frontend` -> `npm install` -> `npm run dev`
