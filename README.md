

# 🎯 Scrabble Score Calculator - Implementation

This project was an exciting challenge to enhance a React/Express starter application into a fully-featured Scrabble word scoring tool. The goal was to not only meet the technical requirements but to create an engaging, polished user experience that demonstrates thoughtful design and attention to craft.

## ✨ Features Implemented

### Core Functionality
- **Scrabble Score Calculation** - Accurate point calculation for any word based on official Scrabble letter values
- **Real-time Score Display** - See your score update instantly as you type
- **Word History** - Track all submitted words with timestamps
- **Total Score Tracking** - Cumulative score across all valid words

### Enhanced User Experience
- **Animated Letter Tiles** 🎲
  - Letters appear as authentic Scrabble tiles with point values
  - Smooth scale-in animations when typing
  - Hover effects that make tiles grow slightly larger
  - Wood-textured tile rack matching real Scrabble aesthetics

- **Dictionary Validation** 📚
  - Real-time word validation using free Dictionary API
  - Green checkmark (✓) for valid dictionary words
  - Red X (✗) for invalid/made-up words
  - Word definitions displayed for valid entries
  - Part of speech labels (noun, verb, etc.)
  - Invalid words excluded from total score

- **Micro-Interactions & Polish** ✨
  - Animated loading spinner during API calls
  - Empty state with bouncing dice emoji
  - Clickable example words (QUARTZ, JAZZ, FIZZY)
  - Enhanced error messages with dismiss button
  - Smooth transitions and animations throughout
  - Keyboard shortcuts (Enter to submit, Escape to clear)

- **Accessibility** ♿
  - Full keyboard navigation support
  - Focus-visible styles with orange outline rings
  - High contrast text for readability
  - ARIA-friendly structure

### Design System
- **Colors**: Primary orange (#ec7f13), tile cream (#f7e8d0), wood tones, validation green/red
- **Typography**: Spline Sans font family (300-900 weights)
- **Animations**: Tile appear, slide-in, pop, bounce, fade effects
- **Responsive**: Works on desktop and mobile devices

## 🚀 Running the Application

### Prerequisites
- Node.js 16.0.0 or 18.0.0
- Yarn 1.22.19

### Installation
```bash
# Install dependencies
yarn

# Optional: Create .env file if needed
touch .env
```

### Development Mode
```bash
# Option 1: Run both frontend and backend together
yarn dev

# Option 2: Run separately in two terminals
# Terminal 1 - Backend (port 3001)
yarn server

# Terminal 2 - Frontend (port 3000)
yarn start
```

The app will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001`

### Testing the API
```bash
# Test the scrabble-score endpoint
curl -X POST http://localhost:3001/api/scrabble-score \
  -H "Content-Type: application/json" \
  -d '{"word":"QUARTZ"}'

# Expected response:
# {"word":"QUARTZ","score":24,"breakdown":[...]}
```

## 📦 Production Build

### Build for Production
```bash
# Create optimized production build
yarn build

# The build folder will contain the static files
# Serve with any static file server
```

### Deployment Options

**Environment Configuration**
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
# Edit .env with your values
```

**Frontend (Static Hosting)**
- **Netlify/Vercel/GitHub Pages**
  - Build command: `yarn build`
  - Publish directory: `build`
  - Environment: Node 18.x
  - Set env var: `REACT_APP_API_URL=https://your-backend-url.com`

**Backend (Node.js Hosting)**
- **Heroku/Railway/Render**
  - Start command: `node server/index.js`
  - Set env var: `PORT` (auto-provided by most platforms)

**Full Stack Deployment**
1. Deploy backend to Node.js hosting platform
2. Set `REACT_APP_API_URL` environment variable to backend URL
3. Build frontend: `yarn build`
4. Deploy frontend build directory to static hosting

## 🛠️ Technical Stack

**Backend**
- Express.js
- CORS enabled
- Body parser for JSON
- Custom scoring algorithm

**Frontend**
- React 16.13 (class components)
- CSS3 animations
- Fetch API for HTTP requests
- Dictionary API integration

**Build Tools**
- React Scripts 3.4.0
- Webpack 4 (with OpenSSL legacy provider for Node 18+)

## 📁 Project Structure

```
/server
  ├── index.js              # Express server with API endpoints
  └── scrabbleScorer.js     # Scoring logic and validation

/src
  ├── App.js                # Main React component
  ├── App.css               # Complete styling with animations
  └── index.css             # Base styles

/public
  └── index.html            # HTML template with Spline Sans font
```

## 🎨 Design Decisions

This implementation prioritizes:
- **Visual Authenticity** - Tiles look and feel like real Scrabble pieces
- **Immediate Feedback** - Real-time scoring and validation
- **Delightful Interactions** - Smooth animations and micro-interactions
- **Accessibility First** - Keyboard navigation and focus management
- **Error Recovery** - Clear error messages with actionable solutions

The design was inspired by the provided reference while adding modern polish and thoughtful UX enhancements.

---
