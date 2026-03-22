# 🎯 Anonymous Group Debate - Professional Anonymous Group Debate Platform

A modern, professional debate platform built with the MEAN stack (MongoDB, Express.js, Angular, Node.js) that enables anonymous group discussions on important topics.

![Anonymous Group Debate](https://img.shields.io/badge/Anonymous%20Group%20Debate-Professional%20Debate%20Platform-blue?style=for-the-badge)
![MEAN Stack](https://img.shields.io/badge/MEAN-Stack-green?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-localhost:27017-brightgreen?style=for-the-badge)

## ✨ Features

### 🎨 **Professional UI/UX**
- Modern, responsive design with beautiful gradients and animations
- Professional navigation with sticky header and active states
- Interactive cards with hover effects and smooth transitions
- Mobile-first responsive design

### 📊 **Comprehensive Dashboard**
- Real-time statistics and analytics
- Debate management with filtering capabilities
- Activity monitoring and engagement metrics
- Professional data visualization

### 🏠 **Enhanced Homepage**
- Hero section with compelling call-to-action
- Live statistics overview
- Professional debate listings with status badges
- Engaging user onboarding experience

### 🔐 **Robust Authentication**
- Secure JWT-based authentication
- Professional login/signup forms with validation
- Anonymous participation for privacy
- Password security with bcrypt hashing

### 💬 **Advanced Debate Features**
- Create and manage debates with rich descriptions
- Anonymous reply system (max 3 per user)
- Community voting on closed debates
- AI-powered debate summaries
- Real-time engagement statistics

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB running on `localhost:27017`
- npm or yarn package manager

### 🔧 Installation

1. **Clone and navigate to the project:**
   ```bash
   cd anonymous-group-debate
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Ensure MongoDB is running on `localhost:27017`

4. **Start development servers:**
   
   **Option 1: Use startup scripts (Recommended)**
   ```bash
   # Windows Batch
   start-dev.bat
   
   # PowerShell
   .\start-dev.ps1
   ```
   
   **Option 2: Manual startup**
   ```bash
   # Terminal 1 - Backend
   npm run dev
   
   # Terminal 2 - Frontend
   npm run dev:frontend
   ```

### 🌐 Access the Application
- **Frontend:** http://localhost:4201
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/healthz

## 📁 Project Structure

```
anonymous-group-debate/
├── 📂 app_api/                 # Backend API
│   ├── 📂 controllers/         # Route controllers
│   ├── 📂 model/              # MongoDB schemas
│   ├── 📂 routes/             # API routes
│   └── 📂 services/           # Business logic
├── 📂 app_public/             # Angular Frontend
│   ├── 📂 src/
│   │   ├── 📂 app/
│   │   │   ├── 📂 pages/      # Page components
│   │   │   └── 📂 services/   # Angular services
│   │   └── 📄 styles.css      # Global styles
│   └── 📄 package.json
├── 📂 bin/                    # Server startup
├── 📄 app.js                  # Express app configuration
├── 📄 .env                    # Environment variables
├── 📄 start-dev.bat          # Windows startup script
├── 📄 start-dev.ps1          # PowerShell startup script
└── 📄 package.json           # Backend dependencies
```

## 🎯 Key Pages & Features

### 🏠 **Homepage (`/`)**
- Hero section with compelling messaging
- Live statistics dashboard
- Professional debate listings
- Call-to-action buttons

### 📊 **Dashboard (`/dashboard`)**
- Comprehensive statistics overview
- Recent activity monitoring
- Debate management with filters
- Professional data tables

### ✍️ **Create Debate (`/create`)**
- Professional form with validation
- Community guidelines
- Rich text descriptions
- Loading states and feedback

### 💬 **Debate Details (`/debates/:id`)**
- Professional debate layout
- Anonymous reply system
- Community voting interface
- AI summary generation

### 🔐 **Authentication (`/login`, `/signup`)**
- Modern authentication forms
- Comprehensive validation
- Benefits highlighting
- Professional design

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication

### Debates
- `GET /api/debates` - List all debates (with counts)
- `GET /api/debates/:id` - Get debate details
- `POST /api/debates` - Create new debate (auth required)
- `POST /api/debates/:id/close` - Close debate (auth required)

### Replies
- `GET /api/debates/:id/replies` - Get debate replies
- `POST /api/debates/:id/replies` - Add reply (auth required, max 3/user)

### Voting
- `GET /api/debates/:id/votes` - Get vote tally
- `POST /api/debates/:id/votes` - Cast vote (auth required, closed debates only)

### AI Summary
- `GET /api/debates/:id/summary` - Get existing summary
- `POST /api/debates/:id/summary` - Generate new summary (closed debates only)

## 🛠️ Development Scripts

```bash
# Install all dependencies (backend + frontend)
npm run install:all

# Start backend development server
npm run dev

# Start frontend development server
npm run dev:frontend

# Build frontend for production
npm run build

# Run tests
npm test
```

## 🎨 Design System

### Color Palette
- **Primary:** #3b82f6 (Blue)
- **Secondary:** #8b5cf6 (Purple)
- **Success:** #10b981 (Green)
- **Warning:** #f59e0b (Amber)
- **Danger:** #ef4444 (Red)

### Typography
- **Font Family:** 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Headings:** 600-700 weight
- **Body:** 400-500 weight

### Components
- **Cards:** White background, subtle shadows, rounded corners
- **Buttons:** Multiple variants (primary, secondary, outline, danger)
- **Forms:** Professional styling with focus states
- **Badges:** Color-coded status indicators

## 🚀 Production Deployment

1. **Environment Setup:**
   ```bash
   # Update .env for production
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_secure_jwt_secret
   PORT=3001
   ```

2. **Build Frontend:**
   ```bash
   npm run build
   ```

3. **Process Management:**
   ```bash
   # Using PM2
   pm2 start bin/www --name "anonymous-group-debate"
   ```

4. **Reverse Proxy (nginx):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:4201;
       }
       
       location /api {
           proxy_pass http://localhost:3001;
       }
   }
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🎉 Acknowledgments

Built with modern web technologies and best practices for a professional debate platform experience.

---

**Ready to start meaningful debates? Launch Anonymous Group Debate and join the conversation! 🚀**

