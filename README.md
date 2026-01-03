# 🎓 Student Management System

A comprehensive web-based student management system built with React and Node.js, designed for educational institutions to manage students, grades, and academic progress.

## 🌐 Live Demo

**Website**: [https://student-management-hamza.netlify.app](https://student-management-hamza.netlify.app)

### Demo Accounts:
- **Teacher**: teacher@atfp.tn / teacher123
- **Student**: test@student.com / test123
- **Sample Student**: hmizrifi2004@gmail.com / Hamzarifi2004

## ✨ Features

### For Students:
- ✅ User registration and secure login
- ✅ View grades by subject and period
- ✅ Track academic progress over time
- ✅ Upload and manage profile pictures
- ✅ Dark mode toggle
- ✅ Responsive design (mobile-friendly)

### For Teachers:
- ✅ Complete dashboard with student overview
- ✅ Add and manage student accounts
- ✅ Grade management by periods
- ✅ Student progress tracking
- ✅ Export and import functionality
- ✅ Comprehensive reporting

### Technical Features:
- ✅ Modern React frontend
- ✅ Node.js/Express backend
- ✅ MongoDB database support
- ✅ JSON file fallback for easy deployment
- ✅ RESTful API design
- ✅ Responsive UI with CSS Grid/Flexbox
- ✅ Dark/Light mode themes

## 🚀 Quick Start

### Option 1: Use Live Demo
Simply visit [https://student-management-hamza.netlify.app](https://student-management-hamza.netlify.app) and use the demo accounts above.

### Option 2: Local Development

#### Prerequisites:
- Node.js (v14 or higher)
- MongoDB (optional - uses JSON files by default)

#### Installation:
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/student-management-system.git
cd student-management-system

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### Running the Application:
```bash
# Terminal 1 - Start Backend
cd backend
npm start

# Terminal 2 - Start Frontend
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3003
- Backend API: http://localhost:3001

### Option 3: One-Click Setup
For Windows users, simply double-click `QUICK_DEMO.bat` for automatic setup and launch.

## 📁 Project Structure

```
student-management-system/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── config/          # API configuration
│   │   └── App.js           # Main application component
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                 # Node.js backend API
│   ├── routes/              # API routes
│   ├── models/              # Database models
│   ├── server.js            # Main server file
│   ├── server-json.js       # JSON file version
│   └── package.json         # Backend dependencies
├── docs/                    # Documentation files
└── README.md               # This file
```

## 🎯 Usage

### Student Workflow:
1. Register a new account or login with existing credentials
2. View your dashboard with grades and progress
3. Upload a profile picture
4. Track your academic performance across different periods
5. Switch between light and dark themes

### Teacher Workflow:
1. Login with teacher credentials
2. Access the teacher dashboard
3. Add new students with entry dates
4. Manage grades by subject and period
5. View comprehensive student reports
6. Export data for external use

## 🛠️ Technology Stack

- **Frontend**: React 18, CSS3, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with JSON file fallback)
- **Deployment**: Netlify (Frontend), Vercel (Backend)
- **Tools**: Git, npm, Vercel CLI, Netlify CLI

## 📦 Deployment

### Netlify (Frontend):
```bash
cd frontend
npm run build
netlify deploy --prod --dir=build
```

### Vercel (Full Stack):
```bash
vercel --prod
```

### Manual Deployment:
1. Build the frontend: `cd frontend && npm run build`
2. Upload the `build` folder to any static hosting service
3. Deploy the backend to any Node.js hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Hamza Rifi**
- Email: hmizrifi2004@gmail.com
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)

## 🙏 Acknowledgments

- Built for educational institutions
- Designed with user experience in mind
- Responsive design for all devices
- Comprehensive feature set for academic management

---

**⭐ If you find this project useful, please give it a star on GitHub!**