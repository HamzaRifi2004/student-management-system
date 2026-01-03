# Vercel Deployment Guide

## ⚠️ Important Note
Your app uses MongoDB which needs to be hosted separately. Vercel is for the frontend and backend API only.

## Prerequisites
1. GitHub account
2. Vercel account (sign up at vercel.com)
3. MongoDB Atlas account (for cloud database)

---

## Step 1: Set Up MongoDB Atlas (Cloud Database)

### 1.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new cluster (choose FREE tier)

### 1.2 Configure Database Access
1. In Atlas, go to "Database Access"
2. Click "Add New Database User"
3. Username: `student_admin`
4. Password: Create a strong password (save it!)
5. Click "Add User"

### 1.3 Configure Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.4 Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   ```
   mongodb+srv://student_admin:<password>@cluster0.xxxxx.mongodb.net/student_db
   ```
4. Replace `<password>` with your actual password
5. Save this connection string!

### 1.5 Import Data to Atlas
1. Download MongoDB Compass
2. Connect to your Atlas cluster using the connection string
3. Create database: `student_db`
4. Import your data:
   - `students` collection: import `backend/students-data.json`
   - `subjects` collection: import `backend/subjects-data.json`

---

## Step 2: Push Code to GitHub

### 2.1 Create .gitignore
Create a `.gitignore` file in your project root:
```
node_modules/
.env
.DS_Store
*.log
build/
dist/
```

### 2.2 Initialize Git and Push
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## Step 3: Deploy to Vercel

### 3.1 Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### 3.2 Deploy via Vercel Website
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will automatically detect the configuration from `vercel.json`
6. No manual configuration needed - just click "Deploy"!

### 3.3 Add Environment Variables
In Vercel project settings, add:
- **Name:** `MONGODB_URI`
- **Value:** Your MongoDB Atlas connection string
- **Name:** `PORT`
- **Value:** `4000`

### 3.4 Deploy
Click "Deploy" and wait for deployment to complete!

---

## Step 4: Update Frontend to Use Vercel Backend

After deployment, Vercel will give you a URL like: `https://your-app.vercel.app`

Update `frontend/package.json`:
```json
{
  "proxy": "https://your-app.vercel.app"
}
```

Redeploy to apply changes.

---

## Alternative: Deploy Frontend and Backend Separately

### Option A: Frontend on Vercel, Backend on Render

**Frontend (Vercel):**
1. Deploy only the `frontend` folder to Vercel
2. Set build command: `npm install && npm run build`
3. Set output directory: `build`

**Backend (Render):**
1. Go to https://render.com
2. Create new "Web Service"
3. Connect your GitHub repo
4. Root directory: `backend`
5. Build command: `npm install`
6. Start command: `npm start`
7. Add environment variable: `MONGODB_URI`

**Update Frontend:**
In `frontend/package.json`, change proxy to your Render backend URL:
```json
{
  "proxy": "https://your-backend.onrender.com"
}
```

---

## Option B: Both on Vercel (Simpler)

This is what the `vercel.json` file I created does:
- Deploys frontend as static site
- Deploys backend as serverless functions
- Routes `/api/*` to backend
- Routes everything else to frontend

---

## Testing Your Deployment

1. Visit your Vercel URL
2. Try logging in with:
   - Student: `hmizrifi2004@gmail.com` / `Hamzarifi2004`
   - Teacher: `teacher@atfp.tn` / `teacher123`

---

## Troubleshooting

### Issue: "Cannot connect to database"
- Check MongoDB Atlas connection string
- Verify IP whitelist includes 0.0.0.0/0
- Check environment variables in Vercel

### Issue: "API routes not working"
- Verify `vercel.json` is in project root
- Check backend routes start with `/api`
- Redeploy after changes

### Issue: "Build failed"
- Check build logs in Vercel dashboard
- Verify all dependencies in package.json
- Test build locally: `cd frontend && npm run build`

---

## Summary

1. ✅ Set up MongoDB Atlas (cloud database)
2. ✅ Import your data to Atlas
3. ✅ Push code to GitHub
4. ✅ Deploy to Vercel
5. ✅ Add MongoDB connection string to Vercel env variables
6. ✅ Test your live website!

Your website will be live at: `https://your-project-name.vercel.app`
