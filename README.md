# HealthMate – Sehat ka Smart Dost
A bilingual (English + Roman Urdu) AI-powered personal health companion mobile app for managing medical reports and tracking health vitals.

---

## 📱 The Real-Life Story
Every family has someone who needs regular tests and prescriptions. Managing all those files, reports, and follow-ups becomes very hard. When the doctor asks, *"Pichlay reports laao"*, we start digging through WhatsApp or old folders 😩.

**Goal:** Build a mobile app where individuals can upload all their medical reports, store them safely, and get AI-powered summaries in simple words.

---

## 💡 The Big Idea – HealthMate
A personal health vault mobile app where you can:

- 📄 Upload all test reports & prescriptions
- 🤖 Let Gemini AI read and explain the reports (no manual OCR needed)
- 📝 Get easy-to-understand summaries (English + Roman Urdu)
- 📅 View your entire medical timeline in one place
- ❤️ Manually add vitals (BP, Sugar, Weight, etc.) even without lab reports
- 👨‍👩‍👧 Manage health records for multiple family members

**Example:** *"On 10th Oct, BP was 130/80, Sugar 95"* — add it as a manual entry to track regular health.

---

## 🧩 Tech Stack
| Category           | Technology                       |
| ------------------ | -------------------------------- |
| **Frontend**       | React Native (0.85) + TypeScript |
| **Backend**        | Node.js + Express                |
| **Database**       | MongoDB (Atlas)                  |
| **AI Model**       | Google Gemini 2.5 flash          |
| **Storage**        | Cloudinary                       |
| **Authentication** | JWT + AsyncStorage               |
| **Navigation**     | React Navigation (Tab + Stack)   |

> ⚡ Gemini can directly read PDFs, images, and scanned reports — no OCR needed.

---

## Step-by-Step Journey
| Step   | Task                     | Roman Urdu Explanation                                                      |
| ------ | ------------------------ | --------------------------------------------------------------------------- |
| 1️⃣    | Understand the Problem   | Samjho ke problem kya hai – reports manage karna aur unka samajhna          |
| 2️⃣    | Project Setup            | React Native CLI project + TypeScript setup                                 |
| 3️⃣    | Design Database Models   | Models: User, FamilyMember, Report, ManualVitals                            |
| 4️⃣    | Setup Auth (JWT)         | Login/Register backend + protected routes                                   |
| 5️⃣    | Family Member Management | Add/edit/delete family members (self, spouse, children, parents)            |
| 6️⃣    | File Upload System       | PDF or image upload to Cloudinary                                           |
| 7️⃣    | Gemini Integration       | Send uploaded file directly to Gemini for analysis                          |
| 8️⃣    | AI Summary Generation    | Gemini se summary + Roman Urdu explanation + doctor questions               |
| 9️⃣    | UI Screens               | Onboarding, Login/Signup, Home Dashboard, Upload, Vitals, Timeline, Profile |
| 🔟     | Add Manual Vitals        | User manually adds BP, Sugar, Weight readings (without reports)             |
| 1️⃣1️⃣ | Push Notifications       | Local notifications when AI analysis completes                              |
| 1️⃣2️⃣ | Security + Privacy       | JWT + encrypted storage + medical disclaimers                               |
| 1️⃣3️⃣ | Testing & Build          | Android APK generation + testing                                            |

---

## 🧠 How Gemini Helps
Gemini reads your uploaded PDF or image directly — whether lab report, X-ray result, or ultrasound summary — and explains it in simple words:

✅ Highlights abnormal values (e.g., WBC high, Hb low)  
✅ Gives bilingual (English + Roman Urdu) summary  
✅ Suggests 3–5 questions to ask your doctor  
✅ Recommends foods to avoid and better foods to eat  
✅ Suggests home remedies  
✅ Adds disclaimer: *"Always consult your doctor before making any decision."*

---

## 🏗️ Architecture (High-Level)
```
Mobile App (React Native)
↓
Backend API (Node.js)
↓
MongoDB + Cloudinary
↓
Gemini AI (Google)
```

**Flow:**
1. User uploads file or enters vitals manually
2. Backend sends data to Gemini for analysis
3. Gemini returns bilingual explanation
4. Backend saves results in MongoDB and Cloudinary
5. App shows report + summary + vitals timeline

---

## 🎨 UI Screens
| Screen               | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| **Onboarding**       | 3-step intro to app features                               |
| **Login / Register** | User authentication with JWT                               |
| **Home Dashboard**   | Health score, recent reports, quick actions                |
| **Upload Report**    | PDF/image upload + date + type + family member             |
| **Reports Timeline** | List of all reports with AI status                         |
| **Report Detail**    | View report image + AI summary (English/Roman Urdu toggle) |
| **Vitals Tracking**  | List of all vitals + FAB to add new                        |
| **Add Vitals**       | BP, Sugar, Weight, Heart Rate, Oxygen Level                |
| **Vital Analysis**   | AI insights for vitals trends                              |
| **Profile**          | User info, family members, settings                        |
| **Edit Profile**     | Update name, phone, DOB, gender, blood group, photo        |

---

## 📁 Project Structure

### Frontend (React Native)
```
src/
├── api/ # API service calls
├── components/ # Reusable UI components
├── constants/ # Colors, theme constants
├── context/ # Auth, Reports, Vitals, Family Context
├── hooks/ # Custom hooks for data fetching
├── navigation/ # Tab + Stack navigators
├── screens/ # All UI screens
├── theme/ # Light/Dark theme support
├── types/ # TypeScript interfaces
└── utils/ # Helper functions, notifications
```

### Backend (Node.js)
```
backend/
├── config/ # Cloudinary, Gemini config
├── controllers/ # Auth, Reports, Vitals, Family controllers
├── middleware/ # Auth, Upload middleware
├── models/ # MongoDB models
└── routes/ # API routes
```

---

## 🔐 Security & Privacy
- ✅ JWT-based authentication with 7-day expiration
- ✅ Cloudinary signed URLs for file access
- ✅ Passwords hashed with bcryptjs
- ✅ AsyncStorage for local session persistence
- ✅ Medical disclaimer on all AI outputs

> **Disclaimer:** *"This AI summary is for understanding only, not medical advice. Always consult your doctor."*  
> **Roman Urdu:** *"Yeh AI sirf samajhne ke liye hai, ilaaj ke liye nahi."*

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Cloudinary account
- Google Gemini API key

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Add your keys
npm run dev
```

### Frontend Setup
```bash
npm install
npm run android  # or
npx react-native start  # (in one terminal)
npx react-native run-android  # (in another terminal) For Android
# npx react-native run-ios    # For iOS (Mac only)
```


### Environment Variables (.env)
```
env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_key
```

### 📱 Build APK
```bash
cd android
./gradlew assembleRelease
```
- APK location: android/app/build/outputs/apk/release/app-release.apk

## 💬 Key Features Summary
| Feature                   | Status                          |
| ------------------------- | ------------------------------- |
| User Authentication       | ✅ JWT + AsyncStorage            |
| Family Member Management  | ✅ CRUD operations               |
| Report Upload (PDF/Image) | ✅ Cloudinary storage            |
| AI Medical Analysis       | ✅ Gemini 1.5 Pro                |
| Bilingual Output          | ✅ English + Roman Urdu          |
| Manual Vitals Tracking    | ✅ BP, Sugar, Weight, Heart Rate |
| AI Vitals Insights        | ✅ Trends and recommendations    |
| Local Notifications       | ✅ When AI analysis completes    |
| Dark/Light Theme          | ✅ Full theme support            |
| Profile Management        | ✅ Photo upload, edit info       |


## 🔮 Future Integrations

| Feature                           | Status     | Description                                     |
| --------------------------------- | ---------- | ----------------------------------------------- |
| 💊 Medicine Reminder              | 🚧 Planned | Smart reminders for medication schedules        |
| 📊 Health Charts                  | 🚧 Planned | Visual graphs for BP, Sugar, Weight trends      |
| 🏥 Doctor Appointment Booking     | 🚧 Planned | Book appointments directly from app             |
| 📤 Share Reports                  | 🚧 Planned | Share AI analysis via WhatsApp/PDF              |
| 🔔 Push Notifications             | 🚧 Planned | Real-time Firebase notifications                |
| 🌍 Full Multi-language            | 🚧 Planned | Complete app translation (Urdu, Sindhi, Pashto) |
| 📱 Wearable Integration           | 🚧 Planned | Connect with smartwatches for real-time vitals  |
| 🏆 Health Score Gamification      | 🚧 Planned | Earn badges for regular health tracking         |
| 👨‍👩‍👧‍👦 Multi-profile Support | 🚧 Planned | Switch between family members quickly           |
| 💾 Offline Mode                   | 🚧 Planned | Access reports without internet                 |
| 📄 Export Medical History         | 🚧 Planned | Download complete medical history as PDF        |
| 🤖 Enhanced AI Analysis           | 🚧 Planned | Disease prediction and risk assessment          |
| 📹 Video Consultation             | 🚧 Planned | Connect with doctors via video call             |
| 🏥 Nearby Labs & Hospitals        | 🚧 Planned | Find nearest diagnostic centers                 |
| 💳 Insurance Integration          | 🚧 Planned | Claim submission and tracking                   |

---

### 💬 Final Words
- "Yeh sirf ek project nahi, ek real-life problem ka digital solution hai."

- "AI ke zariye kisi ke liye life easy banana — that's real impact."

**Goal**: Ek simple, secure, aur helpful mobile solution banana that makes healthcare management easier for everyone.

### 📄 License
MIT License - Feel free to use, modify, and distribute.

### 🤝 Contributors
| Name      | Role                 |
| --------- | -------------------- |
| Asha Ram  | Full Stack Developer |
🔗 Links
- [**GitHub Frontend**](https://github.com/asharaam1/HealthMate-Native-App) 
- [**GitHub Backend**](https://github.com/asharaam1/HealthMate-Native-App-backend) 


Made with ❤️ for better healthcare management
---