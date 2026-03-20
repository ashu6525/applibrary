# Library Management PWA

A modern, responsive, mobile-first Library Management Progressive Web App (PWA) built with React (Vite) and Node.js + Express (SQLite).

## Features
- **Member Login System**: Secure authentication for members and admins.
- **Book Catalog**: Browse, search, filter, and reserve books.
- **Seat Booking**: Book reading seats for morning and evening shifts.
- **Transactions**: Track issued books, return dates, and fine calculations.
- **Dashboard**: Live library status and admin statistics overview.
- **Study Materials**: Download PDF notes and previous year's exam papers.
- **Notifications**: Admin broadcast system for holidays and new additions.

---

## 🚀 How to Run Locally

### Requirements
- Node.js (v18+ recommended)
- npm (v9+)

### 1. Start the Backend Server
Open a terminal and run the following commands:
```bash
cd server
npm install
node index.js
```
*Note: The SQLite database (`library.sqlite`) will automatically initialize and seed standard seats and a default admin user (`admin` / `admin`).*

### 2. Start the Frontend Application
Open a second terminal and run:
```bash
cd client
npm install --legacy-peer-deps
npm run dev
```
*The app will automatically open in your browser at `http://localhost:3000`.*

---

## 🌐 How to Deploy to Netlify

To deploy the frontend to Netlify, follow these simple steps:

1. **Build the Application**:
   Inside the `client` directory, run:
   ```bash
   npm run build
   ```
   This generates a `dist` folder.

2. **Deploy via Netlify CLI or Drag & Drop**:
   - Go to [Netlify Drop](https://app.netlify.com/drop).
   - Drag and drop your `client/dist` folder.
   - Or, connect your GitHub repository to Netlify and set the build command to `npm run build` and publish directory to `dist`.

3. **Backend Deployment**:
   - The backend (`server`) should be deployed to a Node.js hosting provider (e.g., Render, Railway, Vercel, or Heroku). 
   - Ensure you update the API base URL in the frontend (`fetch` calls) to point to your deployed backend URL.

---

## 📱 How to Convert to an Android App

Since this project is built as a **Progressive Web App (PWA)**, there are two standard ways to transform it into a native Android App for the Google Play Store:

### Method 1: Trusted Web Activity (TWA) - Bubblewrap (Recommended)
This approach wraps your hosted PWA directly into an APK.
1. Deploy your frontend to Netlify (or any hosting) so you have a live URL with HTTPS.
2. Install Google's [Bubblewrap CLI](https://github.com/GoogleChromeLabs/bubblewrap):
   ```bash
   npm i -g @google/bubblewrap
   ```
3. Initialize the app:
   ```bash
   bubblewrap init --manifest https://your-deployed-app.com/manifest.webmanifest
   ```
4. Build the APK:
   ```bash
   bubblewrap build
   ```
   *This outputs an Android App Bundle (.aab) and APK ready for the Play Store.*

### Method 2: Capacitor (by Ionic)
If you want hardware access (camera, local push notifications), you can bundle the raw React files natively.
1. In the `client` directory, install Capacitor:
   ```bash
   npm i @capacitor/core @capacitor/android
   npm i -D @capacitor/cli
   ```
2. Initialize Capacitor:
   ```bash
   npx cap init "LibraryApp" "com.libraryapp.app"
   ```
3. Build the React project and sync with Android:
   ```bash
   npm run build
   npx cap add android
   npx cap sync
   npx cap open android
   ```
   *This opens Android Studio where you can build and sign the app for the Play Store.*
