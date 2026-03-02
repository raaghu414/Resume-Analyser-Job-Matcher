# 🚀 Resume Analyzer & Job Matcher

An AI-powered full-stack web application that analyzes resumes, extracts skills, scores them, and matches them with job opportunities. Built with React, Node.js, Express, and MongoDB.

## 🎯 Features

✅ **User Authentication** – JWT-based login/register with bcrypt password hashing  
✅ **Resume Upload** – PDF file upload with secure file handling  
✅ **PDF Parsing** – Extract text from PDF resumes using pdf-parse  
✅ **AI Analysis** – Extract skills and generate resume score (0-100) using OpenAI API  
✅ **Job Matching** – Match candidate skills against job database with skill gap analysis  
✅ **Beautiful UI** – Modern, colorful React frontend with responsive design  
✅ **MongoDB Integration** – Persist users and resumes to database  
✅ **Skill Gap Detection** – Shows what skills you need to learn for each job  

## 🛠 Tech Stack

**Frontend:**
- React 18
- CSS3 (Flexbox, Grid, Gradients)
- Fetch API for HTTP requests

**Backend:**
- Node.js + Express
- MongoDB with Mongoose ODM
- JWT authentication (jsonwebtoken)
- bcrypt for password hashing
- OpenAI API integration
- pdf-parse for PDF extraction

## 📋 Project Structure

```
.
├── README.md
├── .gitignore
├── server/
│   ├── package.json
│   ├── index.js                    # Express server entry point
│   ├── .env.example               # Environment variables template
│   ├── routes/
│   │   ├── auth.js               # /api/auth/register, /api/auth/login
│   │   ├── upload.js             # /api/upload (PDF resume parsing)
│   │   └── match.js              # /api/match (job matching)
│   ├── models/
│   │   ├── user.js               # User schema
│   │   └── resume.js             # Resume schema
│   ├── services/
│   │   ├── ai.js                 # OpenAI integration & skill extraction
│   │   └── matcher.js            # Job matching algorithm
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT authentication middleware
│   ├── utils/
│   │   └── pdfParser.js          # PDF text extraction
│   └── data/
│       └── jobs.json             # Sample job listings
└── client/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js              # React entry point
        ├── App.js                # Main app component
        ├── App.css               # Styling (purple gradient theme)
        ├── Auth.js               # Login/Register component
        ├── Upload.js             # Resume upload component
        └── Results.js            # Job matches display component
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+)
- MongoDB running locally or connection string to MongoDB Atlas
- OpenAI API key (optional for full AI features, heuristic fallback available)

### 1. Backend Setup

```bash
cd server
npm install
```

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/resume_analyzer
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_strong_secret_key_here
```

Start the backend server:

```bash
npm run dev
```

The server will run at `http://localhost:5000`

### 2. Frontend Setup

In a **new terminal**:

```bash
cd client
npm install
npm start
```

The React app will open at `http://localhost:3000`

## 📖 Usage

### 1. **Register/Login**
   - Create an account or login with existing credentials

### 2. **Upload Resume**
   - Click "📄 Upload Your Resume"
   - Select a PDF file
   - Click "Upload & Analyze"

### 3. **View Analysis**
   - Resume score (0-100) with progress bar
   - Extracted skills displayed
   - Improvement suggestions

### 4. **See Job Matches**
   - Top 5 matching jobs with match percentages
   - Shows what skills you have vs. need to learn
   - Color-coded by match strength (green = best, red = needs work)

## 🔑 API Endpoints

- `POST /api/auth/register` – Create a new user
- `POST /api/auth/login` – Login and get JWT token
- `POST /api/upload` – Upload PDF resume and analyze
- `POST /api/match` – Match skills against job listings

## 🔐 Security

- ✅ JWT tokens with 30-day expiration
- ✅ Passwords hashed with bcrypt
- ✅ Protected routes require valid Bearer token
- ✅ CORS enabled
- ✅ Input validation

## 🎨 Beautiful UI

- Modern purple gradient theme
- Responsive design (desktop, tablet, mobile)
- Color-coded skill displays
- Smooth animations and transitions

## 📚 Environment Variables

Create `.env` in `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/resume_analyzer
OPENAI_API_KEY=sk-... (from https://platform.openai.com/api-keys)
JWT_SECRET=your_strong_secret_key_here
```

## 🐛 Troubleshooting

**MongoDB Connection Error:** Ensure MongoDB is running locally or update `MONGO_URI` to use MongoDB Atlas

**OpenAI Errors:** Set `OPENAI_API_KEY` in `.env` (fallback heuristic works without it)

**CORS/Port Errors:** Backend must run on port 5000, frontend on port 3000

## 📄 License

MIT License - Open source for everyone

---

⭐ Star this repo if you find it helpful!

**GitHub:** https://github.com/raaghu414/Resume-Analyser-Job-Matcher
