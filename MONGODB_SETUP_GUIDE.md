# MongoDB Setup Guide

## ✅ What You Need to Do in MongoDB Compass

### Step 1: Connect to MongoDB
1. Open **MongoDB Compass**
2. Connection string: `mongodb://localhost:27017`
3. Click **"Connect"**

### Step 2: Create Database
1. Click **"Create Database"** (green button)
2. **Database Name:** `student_db`
3. **Collection Name:** `students`
4. Click **"Create Database"**

### Step 3: Import Students Data
1. In the left sidebar, select: `student_db` → `students`
2. Click **"ADD DATA"** button → **"Import JSON or CSV file"**
3. Select file: `backend/students-data.json`
4. Format: **JSON**
5. Click **"Import"**
6. You should see 1 student imported

### Step 4: Create Subjects Collection
1. In `student_db`, click the **"+"** button next to "Collections"
2. **Collection Name:** `subjects`
3. Click **"Create Collection"**

### Step 5: Import Subjects Data
1. Select the `subjects` collection
2. Click **"ADD DATA"** → **"Import JSON or CSV file"**
3. Select file: `backend/subjects-data.json`
4. Format: **JSON**
5. Click **"Import"**
6. You should see 43 subjects imported

---

## 🚀 Running Your Application with MongoDB

### Start Backend (MongoDB version)
```bash
cd backend
npm start
```

### Start Frontend
```bash
cd frontend
npm start
```

---

## 🔄 Switch Between JSON and MongoDB

Your backend now supports both:

**Use MongoDB (default):**
```bash
npm start
```

**Use JSON files (backup):**
```bash
npm run start:json
```

---

## ✅ Verify Everything Works

1. **Check MongoDB Compass:**
   - `student_db` database exists
   - `students` collection has 1 document
   - `subjects` collection has 43 documents

2. **Test Backend:**
   - Start backend: `npm start`
   - Open browser: http://localhost:5000
   - Should see: `{"message":"Student Management API"}`

3. **Test Login:**
   - Email: `hmizrifi2004@gmail.com`
   - Password: `Hamzarifi2004`

---

## 📝 Notes

- MongoDB must be running for the app to work
- Your JSON files are still there as backup
- All data is now stored in MongoDB
- You can view/edit data in MongoDB Compass anytime
