# DEV@Deakin - Authentication System

This project implements a complete authentication system with login and registration functionality using React, Firebase Firestore, and bcrypt for password hashing.

## Features

- ✅ User Registration with validation
- ✅ User Login with email and password
- ✅ Password hashing using bcrypt
- ✅ Firebase Firestore integration
- ✅ React Router for navigation
- ✅ Responsive design with Tailwind CSS
- ✅ Form validation and error handling
- ✅ User session management

## Prerequisites

Before running this application, you need:

1. **Node.js** (v14 or higher)
2. **Firebase Project** - Create a new project at [Firebase Console](https://console.firebase.google.com/)
3. **Firestore Database** - Enable Firestore in your Firebase project

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd client
npm install
```

### 2. Firebase Configuration

1. Go to your Firebase project settings
2. Create a web app and copy the configuration
3. Create a `.env` file in the `client` directory:

```bash
cp .env.example .env
```

4. Update the `.env` file with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 3. Firestore Database Setup

1. In Firebase Console, go to Firestore Database
2. Create a database in test mode (you can configure security rules later)
3. Create a collection called `users` (it will be created automatically when first user registers)

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Home.jsx          # Main homepage with authentication awareness
│   │   ├── Login.jsx         # Login page component
│   │   └── SignUp.jsx        # Registration page component
│   ├── firebase/
│   │   └── config.js         # Firebase configuration
│   ├── services/
│   │   └── authService.js    # Authentication logic and API calls
│   ├── App.jsx               # Main app with routing
│   └── main.jsx              # Entry point
├── .env.example              # Environment variables template
└── package.json
```

## Routes

- `/` - Home page (shows login status)
- `/login` - Login page
- `/signup` - Registration page

## User Data Structure

When a user registers, the following data is stored in Firestore:

```javascript
{
  name: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  password: "hashedPassword", // bcrypt hashed
  createdAt: "2024-10-02T...",
  lastLogin: "2024-10-02T..." // updated on each login
}
```

## Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Email validation
- ✅ Password strength validation (8+ chars, uppercase, lowercase, number)
- ✅ Duplicate email prevention
- ✅ Form validation and sanitization
- ✅ Error handling for network issues

## Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter  
- At least 1 number

## Environment Variables

All sensitive Firebase configuration is stored in environment variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## Development

### Running in Development Mode

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Troubleshooting

### Common Issues

1. **Firebase errors**: Make sure your `.env` file has correct Firebase config
2. **CORS issues**: Enable CORS in your Firebase project if needed
3. **Firestore permissions**: Update Firestore security rules if needed
4. **bcrypt errors**: Make sure you have the right Node.js version

### Firestore Security Rules

For production, update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## License

This project is for educational purposes as part of SIT313 Full-Stack Development course.