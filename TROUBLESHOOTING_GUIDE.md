# Troubleshooting Guide - Student Management System

## Current Status
✅ MongoDB is installed and running
✅ Students data imported (1 student: hamza Rifi)
✅ Subjects data imported (43 subjects)
✅ Backend configured for MongoDB
✅ Frontend configured to connect to backend

## Problem
Teacher dashboard shows students but NOT their notes (grades)

## Root Cause
The `/api/subjects` endpoint is returning 500 Internal Server Error

---

## Solution Steps

### Step 1: Verify Backend is Running
Open Command Prompt and run:
```bash
cd "C:\Users\Hamzewi\OneDrive\Desktop\projet AYOUB\backend"
npm start
```

You should see:
```
Server running on port 4000
MongoDB connected
```

**Keep this terminal open!**

---

### Step 2: Test the Subjects Endpoint
Open your browser and go to:
```
http://localhost:4000/api/subjects
```

**Expected Result:** You should see JSON data with 43 subjects

**If you see an error:** Copy the error message and check the backend terminal for details

---

### Step 3: Test the Students Endpoint
Open your browser and go to:
```
http://localhost:4000/api/students
```

**Expected Result:** You should see JSON data with hamza Rifi's information including notes

---

### Step 4: Check MongoDB Compass
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Check `student_db` database has:
   - `students` collection (1 document)
   - `subjects` collection (43 documents)

---

### Step 5: Restart Everything
If endpoints still fail:

1. **Kill all Node processes:**
```bash
taskkill /F /IM node.exe
```

2. **Start Backend:**
```bash
cd "C:\Users\Hamzewi\OneDrive\Desktop\projet AYOUB\backend"
npm start
```

3. **Start Frontend (new terminal):**
```bash
cd "C:\Users\Hamzewi\OneDrive\Desktop\projet AYOUB\frontend"
npm start
```

4. **Refresh browser**

---

## Quick Test Commands

### Test if MongoDB is running:
```bash
mongosh
```
(Type `exit` to quit)

### Test if port 4000 is in use:
```bash
netstat -ano | findstr :4000
```

### Kill process on port 4000:
```bash
taskkill /PID [process_id] /F
```

---

## Login Credentials

**Student:**
- Email: `hmizrifi2004@gmail.com`
- Password: `Hamzarifi2004`

**Teacher:**
- Email: `teacher@atfp.tn`
- Password: `teacher123`

---

## File Locations

- **Backend:** `C:\Users\Hamzewi\OneDrive\Desktop\projet AYOUB\backend`
- **Frontend:** `C:\Users\Hamzewi\OneDrive\Desktop\projet AYOUB\frontend`
- **MongoDB Data:** MongoDB Compass → `student_db`

---

## Common Issues

### Issue: "EADDRINUSE" error
**Solution:** Port is already in use. Kill the process:
```bash
netstat -ano | findstr :4000
taskkill /PID [number] /F
```

### Issue: "MongoDB connection error"
**Solution:** Make sure MongoDB service is running

### Issue: 500 error on /api/subjects
**Solution:** Check backend terminal for error details

---

## Next Steps if Still Not Working

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Copy ALL error messages
4. Check backend terminal for error messages
5. Share both sets of errors for further help
