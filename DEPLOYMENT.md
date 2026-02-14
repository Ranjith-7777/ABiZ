# Deploying BizAI

This guide covers how to host BizAI for free using **Vercel** (Frontend) and **Render** (Backend).

---
## 📜 Prerequisites
1.  **GitHub Repository**: Ensure your code is pushed to GitHub (you just did this!).
2.  **Render Account**: Sign up at [render.com](https://render.com).
3.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).

---
## 1️⃣ Backend Deployment (Render)
*Since the frontend needs the backend URL, we deploy the backend first.*

1.  **Create New Web Service**:
    - Go to Render Dashboard -> **New +** -> **Web Service**.
    - Connect your GitHub repository (`kaushalrog/ABiz`).

2.  **Configure Settings**:
    - **Name**: `bizai-backend` (or similar)
    - **Root Directory**: `backend` (Important: tell Render where the API code lives)
    - **Environment**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
    - **Instance Type**: Free

3.  **Environment Variables**:
    Scroll down to "Environment Variables" and add:
    - `NODE_ENV`: `production`
    - `PORT`: `10000` (Render's default port)
    - `GEMINI_API_KEY`: *(Paste your Google Gemini AI Key)*
    - `YOUTUBE_API_KEY`: *(Paste your YouTube API Key)*
    - `FIREBASE_SERVICE_ACCOUNT`: *(Paste JSON content if using Database features)*

4.  **Deploy**:
    - Click **Create Web Service**.
    - Wait for the build to finish.
    - **Copy the URL** provided (e.g., `https://bizai-backend.onrender.com`).

---
## 2️⃣ Frontend Deployment (Vercel)

1.  **Create New Project**:
    - Go to Vercel Dashboard -> **Add New...** -> **Project**.
    - Import your GitHub repository (`kaushalrog/ABiz`).

2.  **Configure Project**:
    - **Framework Preset**: Vite (should detect automatically).
    - **Root Directory**: Click "Edit" and select `frontend`.

3.  **Environment Variables**:
    - Expand "Environment Variables".
    - Add `VITE_API_URL` with value: `https://bizai-backend.onrender.com` (The URL you copied from Render).
    - **Note**: Do *not* add a trailing slash `/`.

4.  **Deploy**:
    - Click **Deploy**.
    - Vercel will build your React app and assign a domain (e.g., `abiz-frontend.vercel.app`).

---
## 🔗 Final Connection Check

1.  Open your new Vercel URL.
2.  The app should load.
3.  It might take ~30 seconds for the backend (Render Free Tier) to wake up on the first request.
4.  Check the "Network" tab in browser DevTools to ensure requests are hitting your Render URL, not `localhost`.

---
## 📱 Android Build (Already Includes URL?)

If you built the Android app `apk`, it defaults to `localhost` unless you change it.
To point the mobile app to your new live backend:
1.  Open `frontend/.env` (or create one).
2.  Set `VITE_API_URL=https://bizai-backend.onrender.com`.
3.  Run:
    ```bash
    cd frontend
    npm run build
    npx cap sync
    ```
4.  Rebuild the app in Android Studio.
