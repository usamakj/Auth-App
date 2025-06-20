# MERN Auth App - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Install MongoDB
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 2: Start Backend
```bash
cd backend
npm install
npm run dev
```
Backend will run on: http://localhost:5000

### Step 3: Start Frontend
```bash
cd frontend
pnpm install
pnpm run dev --host
```
Frontend will run on: http://localhost:5173

### Step 4: Test the Application
1. Open http://localhost:5173
2. Register a new user
3. Login and test comment posting

## 🧪 Test Scenarios

### Test 1: User Registration
- Go to registration page
- Fill all fields with valid data
- Verify real-time validation (green checkmarks)
- Submit form
- Should redirect to dashboard

### Test 2: Duplicate Registration
- Try to register with same email/username
- Should see red X indicators
- Form should prevent submission

### Test 3: Login
- Use registered credentials
- Should redirect to dashboard
- Profile information should display

### Test 4: Comments
- Post a comment
- Should appear in recent comments
- Should show your name and timestamp

## 🔧 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod
```

### Port Conflicts
- Backend: Change PORT in backend/.env
- Frontend: Change port in vite.config.js

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📱 Features Demonstrated

✅ User Registration with MongoDB storage  
✅ Real-time duplicate checking  
✅ Secure login with JWT authentication  
✅ Comment posting for authenticated users  
✅ Responsive design with Tailwind CSS  
✅ Smooth animations with Framer Motion  
✅ Protected routes and authentication  

## 🎯 Assignment Requirements Met

1. **Database Storage**: ✅ MongoDB with Mongoose
2. **Duplicate Prevention**: ✅ Real-time + database validation
3. **Error Messages**: ✅ "User already registered" functionality
4. **Login & Comments**: ✅ Full authentication and comment system
5. **MERN Stack**: ✅ Complete implementation

---
**Ready for submission!** 🎉

