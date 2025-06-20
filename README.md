# MERN Stack Authentication Application

## Overview
This is a complete MERN (MongoDB, Express.js, React, Node.js) stack application that implements user registration, login, and comment posting functionality. The application meets all the specified requirements for the web programming assignment.

## Features Implemented

### ✅ Core Requirements
1. **User Registration with Database Storage**
   - User registration data is stored in MongoDB database
   - Registered user records are maintained and checked during new registration
   - Both offline (database) and online (real-time) validation implemented

2. **Duplicate Registration Prevention**
   - Real-time availability checking for username and email
   - Visual indicators (green checkmark for available, red X for taken)
   - Error message display when user tries to register with existing credentials
   - "User already registered" message functionality implemented

3. **User Login and Comment Posting**
   - Registered users can log in using email or username
   - Authenticated users can post comments
   - Comments are displayed with user information and timestamps
   - User dashboard with profile information

### ✅ Additional Features
- **Authentication & Authorization**: JWT-based authentication system
- **Route Protection**: Protected routes that require authentication
- **Password Security**: Bcrypt password hashing
- **Real-time Validation**: Live username/email availability checking
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **User Experience**: Smooth animations with Framer Motion
- **Data Persistence**: All data stored in MongoDB database

## Technology Stack

### Frontend
- **React 18** with JSX
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API communication
- **React Router** for navigation

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **CORS** for cross-origin requests
- **dotenv** for environment variables

## Project Structure

```
mern-auth-app/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Comment.js       # Comment schema
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── comments.js      # Comment routes
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── server.js            # Main server file
│   ├── .env                 # Environment variables
│   └── package.json         # Backend dependencies
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── LoginPage.jsx      # Login component
    │   │   ├── RegisterPage.jsx   # Registration component
    │   │   └── DashboardPage.jsx  # User dashboard
    │   ├── context/
    │   │   └── AuthContext.jsx    # Authentication context
    │   ├── services/
    │   │   └── api.js             # API service functions
    │   ├── components/
    │   │   └── ProtectedRoute.jsx # Route protection
    │   ├── App.jsx                # Main app component
    │   └── main.jsx               # App entry point
    ├── index.html               # HTML template
    ├── .env                     # Frontend environment variables
    └── package.json             # Frontend dependencies
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v7.0 or higher)
- npm or pnpm package manager

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mern_auth_app
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
   ```

4. Start MongoDB service:
   ```bash
   sudo systemctl start mongod
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure environment variables in `.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   pnpm run dev --host
   ```

## Usage Instructions

### 1. User Registration
- Navigate to `http://localhost:5173/register`
- Fill in all required fields:
  - First Name
  - Last Name
  - Username (must be unique)
  - Email (must be unique)
  - Password
  - Confirm Password
- Real-time validation will show availability status
- Click "Create Account" to register

### 2. User Login
- Navigate to `http://localhost:5173/login`
- Enter email or username and password
- Click "Sign In" to login
- Successful login redirects to dashboard

### 3. Dashboard & Comments
- View your profile information
- Post comments using the text area
- View all comments from the community
- Delete your own comments
- Logout using the logout button

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /check-availability` - Check username/email availability

### Comment Routes (`/api/comments`)
- `GET /` - Get all comments
- `POST /` - Create new comment (protected)
- `DELETE /:id` - Delete comment (protected)

## Testing Results

The application has been thoroughly tested and all requirements are working:

✅ **User Registration**: Successfully stores user data in MongoDB  
✅ **Duplicate Prevention**: Real-time checking prevents duplicate registrations  
✅ **Login Functionality**: Users can login with email or username  
✅ **Comment Posting**: Authenticated users can post and view comments  
✅ **Data Persistence**: All data is properly stored and retrieved  
✅ **Security**: Passwords are hashed, JWT tokens for authentication  
✅ **User Experience**: Responsive design with smooth animations  

## Screenshots

The application includes:
- Beautiful login and registration forms
- Real-time validation indicators
- User dashboard with profile information
- Comment posting interface
- Responsive design for all screen sizes

## Assignment Compliance

This application fully meets all the specified requirements:

1. ✅ **Database Storage**: User registration data stored in MongoDB
2. ✅ **Duplicate Checking**: Both offline and online validation implemented
3. ✅ **Error Messages**: "User already registered" message displayed
4. ✅ **Login & Comments**: Registered users can login and post comments
5. ✅ **MERN Stack**: Complete implementation using MongoDB, Express, React, Node.js
6. ✅ **Additional Technologies**: Vite, Tailwind CSS, Framer Motion, Axios

## Development Notes

- The application uses modern React patterns with hooks and context
- JWT tokens are stored in localStorage for persistence
- Password validation includes strength requirements
- Real-time availability checking provides immediate feedback
- Error handling is implemented throughout the application
- The UI is responsive and works on both desktop and mobile devices

## Future Enhancements

Potential improvements for future versions:
- Email verification for registration
- Password reset functionality
- User profile editing
- Comment replies and threading
- File upload for profile pictures
- Social media authentication
- Advanced comment features (likes, replies)

---

**Assignment Completed Successfully** ✅  
**Date**: June 18, 2025  
**Technology Stack**: MERN (MongoDB, Express.js, React, Node.js)  
**Additional Tools**: Vite, Tailwind CSS, Framer Motion, Axios

