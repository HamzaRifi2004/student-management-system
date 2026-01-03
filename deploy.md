# Quick Deployment Steps

## 1. Push to GitHub (if not done already)
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

## 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Select your repository
5. Click "Deploy" (Vercel will use the vercel.json config automatically)

## 3. Set Environment Variables in Vercel
After deployment, go to your project settings and add:
- **MONGODB_URI**: `mongodb+srv://username:password@cluster.mongodb.net/student_db`
- **PORT**: `4000`

## 4. Set Up MongoDB Atlas
1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add database user
4. Whitelist all IPs (0.0.0.0/0)
5. Get connection string
6. Import your data using MongoDB Compass

## Test Credentials
- Student: `hmizrifi2004@gmail.com` / `Hamzarifi2004`
- Teacher: `teacher@atfp.tn` / `teacher123`

Your site will be live at: `https://your-project-name.vercel.app`