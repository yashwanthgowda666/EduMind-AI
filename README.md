# EduMind-AI 🧠
### AI-Powered Doubt Solver for Students

> Ask doubts via **text**, **image**, or **voice** — get instant step-by-step explanations powered by Groq LLaMA & AssemblyAI. Available 24/7, no waiting for a teacher.

![EduMind-AI](https://img.shields.io/badge/Status-Live-brightgreen) ![Node.js](https://img.shields.io/badge/Node.js-v18+-green) ![React](https://img.shields.io/badge/React-18-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📌 Problem Statement

Students face doubts at the worst times — late at night, weekends, during self-study. Teachers aren't available 24/7. Search engines bury answers under ads. Generic chatbots don't understand images or academic context.

**EduMind-AI solves this** — a full-stack AI tutoring platform where students get instant, step-by-step explanations for any doubt, in any format, at any time.

---

## 🚀 Live Demo

- **Frontend:** [edumind-ai.vercel.app](#)
- **Backend API:** [edumind-ai.onrender.com/api/health](#)

> ⚠️ Backend hosted on Render free tier — first request may take ~30 seconds to wake up.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure register/login with bcrypt password hashing |
| 💬 **Text Doubts** | Ask any question and get step-by-step AI explanations |
| 🖼️ **Image Doubts** | Upload photos of textbook problems — AI analyzes and solves |
| 🎙️ **Voice Doubts** | Record your doubt — transcribed by AssemblyAI, answered by Groq |
| 🧠 **Auto Subject Detection** | Automatically detects Mathematics, Physics, Chemistry, and more |
| 📚 **Chat History** | All conversations saved and grouped by subject |
| 📊 **Dashboard Stats** | Track total doubts solved and subjects covered |
| 📝 **Markdown Rendering** | AI responses with proper headings, code blocks, and math notation |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (React + Vite)                 │
│  Landing → Login/Register → Dashboard → Chat Interface   │
│  Context API (Auth + Chat) | Axios with JWT interceptors │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP (REST API)
┌──────────────────────▼──────────────────────────────────┐
│                   SERVER (Express.js)                    │
│  Auth Routes    │  Chat Routes    │  Upload Middleware   │
│  JWT Middleware │  Error Handler  │  Multer (files)      │
└──────┬──────────────────┬─────────────────┬─────────────┘
       │                  │                 │
┌──────▼──────┐  ┌────────▼───────┐  ┌─────▼──────────┐
│  MongoDB    │  │   Groq API     │  │  AssemblyAI    │
│  (Atlas)    │  │  LLaMA 3.3 70B │  │  Speech-to-Text│
│  Users+Chats│  │  LLaMA 4 Vision│  │                │
└─────────────┘  └────────────────┘  └────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
- **Node.js + Express.js** — REST API server
- **MongoDB + Mongoose** — Database with embedded message documents
- **JWT + bcryptjs** — Authentication and password security
- **Groq SDK** — LLaMA 3.3 70B (text) + LLaMA 4 Scout Vision (images)
- **AssemblyAI** — Speech-to-text transcription
- **Multer** — File upload handling
- **Helmet + CORS** — Security middleware

### Frontend
- **React 18 + Vite** — UI framework and build tool
- **Tailwind CSS** — Utility-first styling
- **React Router v6** — Client-side routing
- **Axios** — HTTP client with interceptors
- **React Markdown + Syntax Highlighter** — Rich AI response rendering
- **Context API** — Global auth and chat state management

---

## 📁 Project Structure

```
EduMind-AI/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat/          # MessageBubble, InputArea, VoiceInput
│   │   │   ├── Layout/        # Navbar
│   │   │   └── common/        # LoadingSpinner
│   │   ├── context/           # AuthContext, ChatContext
│   │   ├── pages/             # Landing, Login, Register, Dashboard, ChatPage
│   │   └── services/          # api.js (Axios instance + interceptors)
│   └── vite.config.js
│
└── server/                    # Express Backend
    ├── config/                # MongoDB connection
    ├── controllers/           # authController, chatController
    ├── middleware/            # auth (JWT), upload (Multer), errorHandler
    ├── models/                # User.js, Chat.js (with embedded messages)
    ├── routes/                # authRoutes, chatRoutes
    ├── services/              # geminiService (Groq AI), speechService (AssemblyAI)
    └── server.js
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register    → Register new user
POST   /api/auth/login       → Login and get JWT token
GET    /api/auth/me          → Get current user profile (protected)
```

### Chats
```
GET    /api/chats            → Get all user's chats
POST   /api/chats            → Create new chat
GET    /api/chats/stats      → Get dashboard statistics
GET    /api/chats/:id        → Get single chat with messages
DELETE /api/chats/:id        → Delete a chat
POST   /api/chats/:id/text   → Send text doubt → AI responds
POST   /api/chats/:id/image  → Send image doubt → Vision AI responds
POST   /api/chats/:id/voice  → Send voice doubt → Transcribe → AI responds
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Groq API key (free at console.groq.com)
- AssemblyAI API key (free at assemblyai.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/yashwanthgowda666/EduMind-AI.git
cd EduMind-AI

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Variables

Create `server/.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
GROQ_API_KEY=your_groq_api_key
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
NODE_ENV=development
MAX_FILE_SIZE=10485760
```

### Run the App

```bash
# Start backend (from server/)
npm run dev

# Start frontend (from client/)
npm run dev
```

Open `http://localhost:5173`

---

## 🔑 Key Engineering Decisions

**Why embedded messages in Chat document?**
Messages are always read together with their chat — embedding eliminates a separate DB query and improves read performance.

**Why JWT over sessions?**
JWT is stateless — no server-side session storage needed. Scales horizontally without shared session store.

**Why Groq over OpenAI?**
Groq provides significantly faster inference for LLaMA models, crucial for real-time tutoring UX where response latency matters.

**Why optimistic UI updates?**
User messages appear instantly before server confirms — improves perceived performance and feels natural like WhatsApp.

**Why `pre('save')` for password hashing?**
Centralizes hashing logic in the model — impossible to accidentally skip it regardless of where user is saved (register, password reset, admin update).

---

## 🔒 Security Implementation

- Passwords hashed with **bcrypt** (10 salt rounds)
- JWT tokens expire in **7 days**
- `select: false` on password field — never returned in queries
- **Helmet.js** sets secure HTTP headers
- **CORS** restricted to specific frontend origins
- File uploads validated by **MIME type + size limit** (10MB)
- Same error message for wrong email/password — prevents user enumeration attacks
- Environment variables for all secrets — never hardcoded

---

## 📸 Screenshots

| Dashboard | Chat Interface |
|---|---|
| ![Dashboard](#) | ![Chat](#) |

---

## 🧑‍💻 Author

**Yashwanth Gowda**
- GitHub: [@yashwanthgowda666](https://github.com/yashwanthgowda666)
- LinkedIn: [your-linkedin](#)

---

## 📄 License

MIT License — feel free to use and modify.

---

<p align="center">Built with ❤️ for students who deserve better than Googling at midnight</p>
