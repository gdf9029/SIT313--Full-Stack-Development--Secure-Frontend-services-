import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  where,
  updateDoc 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import bcrypt from 'bcryptjs';

// Collection reference
const usersCollection = collection(db, 'users');

// Hash password using bcrypt
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password with hashed password
export const comparePassword = async (password, hashedPassword) => {
return await bcrypt.compare(password, hashedPassword);
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    const { name, lastName, email, password } = userData;
    
    // Check if user already exists
    const existingUserQuery = query(usersCollection, where('email', '==', email));
    const existingUserSnapshot = await getDocs(existingUserQuery);
    
    if (!existingUserSnapshot.empty) {
      throw new Error('User with this email already exists');
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Create user document
    const userDoc = {
      name,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };
    
    // Add user to Firestore
    const docRef = await addDoc(usersCollection, userDoc);
    
    return {
      success: true,
      message: 'User registered successfully',
      userId: docRef.id
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    // Find user by email
    const userQuery = query(usersCollection, where('email', '==', email.toLowerCase()));
    const userSnapshot = await getDocs(userQuery);
    
    if (userSnapshot.empty) {
      throw new Error('Invalid email or password');
    }
    
    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    
    // Compare password
    const isPasswordValid = await comparePassword(password, userData.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    
    // Update last login
    await updateDoc(doc(db, 'users', userDoc.id), {
      lastLogin: new Date().toISOString()
    });
    
    return {
      success: true,
      message: 'Login successful',
      user: {
        id: userDoc.id,
        name: userData.name,
        lastName: userData.lastName,
        email: userData.email
      }
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const signOutUser = async () => {
  try {
    localStorage.removeItem('user');
    console.log('User signed out successfully');
    return true;
  } catch (error) {
    console.error('Sign-out error:', error.message);
    throw error;
  }
};