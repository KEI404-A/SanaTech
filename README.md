# SanaTech

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Ionic](https://img.shields.io/badge/Ionic-7.0.0-3880FF?logo=ionic)](https://ionicframework.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.1.0-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-5.2.0-646CFF?logo=vite)](https://vitejs.dev/)

A modern health and wellness web application built with React and Ionic, featuring AI-powered chat assistance, health tracking, educational content, and community forums.

## 🌟 Features

- **🏠 Home Dashboard** - Personalized health overview and quick access to key features
- **💪 Physical Health** - Track and monitor your physical wellness
- **🧠 Mental Health** - Resources and tools for mental well-being
- **📚 Education** - Educational content and materials for health awareness
- **💬 Community Forum** - Connect with others and share experiences
- **🤖 AI Chat Assistant** - Powered by Google Gemini AI for health-related queries
- **📰 News & Updates** - Stay informed with the latest health news
- **👤 User Profile** - Manage your account and preferences
- **🔐 Authentication** - Secure login and protected routes
- **🌓 Dark/Light Theme** - Customizable theme support

## 🚀 Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **UI Framework**: Ionic React 7
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **Authentication & Backend**: Firebase (Authentication, Firestore, Hosting)
- **AI Integration**: Google Generative AI (Gemini 1.5 Flash)
- **Mobile Support**: Capacitor 7
- **Testing**: Vitest, Cypress
- **Routing**: React Router 5

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account (for deployment)
- Google Generative AI API key (for AI features)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/SanaTech.git
   cd SanaTech
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Copy your Firebase configuration to `src/firebase-config.ts`
   - Update Firestore rules in `firestore.rules`

4. **Configure Google Gemini AI**
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add your API key to `src/services/geminiService.ts` or use environment variables

5. **Run the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Build and deploy to Firebase Hosting
- `npm run deploy:all` - Build and deploy everything (hosting + firestore)
- `npm run test.unit` - Run unit tests
- `npm run test.e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Deploy to Firebase Hosting

1. **Install Firebase CLI** (if not already installed)
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Build and Deploy**
   ```bash
   npm run deploy
   ```

   Or manually:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

For detailed deployment instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

## 📁 Project Structure

```
SanaTech/
├── src/
│   ├── components/          # Reusable React components
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   │   ├── ChatAI/          # AI chat interface
│   │   ├── Tab1.tsx         # Home page
│   │   ├── Tab2.tsx         # Physical health
│   │   ├── Tab3.tsx         # Mental health
│   │   ├── Tab4.tsx         # Education
│   │   ├── Tab5.tsx         # Forum
│   │   └── Tab6.tsx         # Profile
│   ├── services/            # API and service integrations
│   ├── theme/               # Theme and styling files
│   └── App.tsx              # Main app component
├── public/                  # Static assets
├── dist/                    # Build output
├── firebase.json            # Firebase configuration
├── firestore.rules          # Firestore security rules
└── vite.config.ts          # Vite configuration
```

## 🔒 Security Notes

- **Important**: Never commit API keys or sensitive credentials to version control
- Use environment variables for API keys and configuration
- Review and update Firestore security rules before production deployment
- Keep dependencies updated for security patches

## 🧪 Testing

- **Unit Tests**: Run with `npm run test.unit`
- **E2E Tests**: Run with `npm run test.e2e`
- Tests are located in `src/` and `cypress/e2e/`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 👨‍💻 Developer

For more information about the developer, visit the About Developer page in the application.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ using React, Ionic, and Firebase

