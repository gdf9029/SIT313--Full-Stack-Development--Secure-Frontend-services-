import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc,
  doc,
  where,
  or,
  and
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Collection references
const postsCollection = collection(db, 'posts');
const questionsCollection = collection(db, 'questions');

// Convert image file to base64
export const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    // Check file size (limit to 1MB for base64 storage)
    if (file.size > 1024 * 1024) {
      reject(new Error('Image size must be less than 1MB'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

// Upload image as base64 (no external storage needed)
export const uploadImage = async (file, folder = 'posts') => {
  try {
    const base64Image = await convertImageToBase64(file);
    return { success: true, url: base64Image };
  } catch (error) {
    console.error('Error converting image:', error);
    return { success: false, message: error.message };
  }
};

// Save post to Firestore
export const savePost = async (postData) => {
  try {
    const docRef = await addDoc(postsCollection, {
      ...postData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      success: true,
      message: 'Post saved successfully',
      postId: docRef.id
    };
  } catch (error) {
    console.error('Error saving post:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

// Save question to Firestore
export const saveQuestion = async (questionData) => {
  try {
    const docRef = await addDoc(questionsCollection, {
      ...questionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return {
      success: true,
      message: 'Question saved successfully',
      questionId: docRef.id
    };
  } catch (error) {
    console.error('Error saving question:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

// Get all posts from Firestore
export const getPosts = async () => {
  try {
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return {
      success: true,
      data: posts
    };
  } catch (error) {
    console.error('Error getting posts:', error);
    return {
      success: false,
      message: error.message,
      data: []
    };
  }
};

// Get all questions from Firestore
export const getQuestions = async () => {
  try {
    const q = query(questionsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const questions = [];
    querySnapshot.forEach((doc) => {
      questions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return {
      success: true,
      data: questions
    };
  } catch (error) {
    console.error('Error getting questions:', error);
    return {
      success: false,
      message: error.message,
      data: []
    };
  }
};

// Delete a question from Firestore
export const deleteQuestion = async (questionId) => {
  try {
    await deleteDoc(doc(questionsCollection, questionId));
    return {
      success: true,
      message: 'Question deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting question:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

// Delete a post from Firestore
export const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(postsCollection, postId));
    return {
      success: true,
      message: 'Post deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting post:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

// Filter questions based on search criteria
export const filterQuestions = async (filters) => {
  try {
    let q = query(questionsCollection, orderBy('createdAt', 'desc'));
    
    // Get all questions first, then filter in memory for complex queries
    const querySnapshot = await getDocs(q);
    
    let questions = [];
    querySnapshot.forEach((doc) => {
      questions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Apply filters in memory
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      questions = questions.filter(question => 
        question.title?.toLowerCase().includes(searchTerm) ||
        question.description?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.tag) {
      const filterTag = filters.tag.toLowerCase();
      questions = questions.filter(question => 
        question.tags && question.tags.some(tag => 
          tag.toLowerCase().includes(filterTag)
        )
      );
    }
    
    if (filters.author) {
      const filterAuthor = filters.author.toLowerCase();
      questions = questions.filter(question => 
        question.author?.toLowerCase().includes(filterAuthor)
      );
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      questions = questions.filter(question => 
        new Date(question.createdAt) >= fromDate
      );
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      questions = questions.filter(question => 
        new Date(question.createdAt) <= toDate
      );
    }
    
    return {
      success: true,
      data: questions
    };
  } catch (error) {
    console.error('Error filtering questions:', error);
    return {
      success: false,
      message: error.message,
      data: []
    };
  }
};

// Filter posts based on search criteria
export const filterPosts = async (filters) => {
  try {
    let q = query(postsCollection, orderBy('createdAt', 'desc'));
    
    // Get all posts first, then filter in memory for complex queries
    const querySnapshot = await getDocs(q);
    
    let posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Apply filters in memory
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      posts = posts.filter(post => 
        post.title?.toLowerCase().includes(searchTerm) ||
        post.content?.toLowerCase().includes(searchTerm) ||
        post.abstract?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.tag) {
      const filterTag = filters.tag.toLowerCase();
      posts = posts.filter(post => 
        post.tags && post.tags.some(tag => 
          tag.toLowerCase().includes(filterTag)
        )
      );
    }
    
    if (filters.author) {
      const filterAuthor = filters.author.toLowerCase();
      posts = posts.filter(post => 
        post.author?.toLowerCase().includes(filterAuthor)
      );
    }
    
    return {
      success: true,
      data: posts
    };
  } catch (error) {
    console.error('Error filtering posts:', error);
    return {
      success: false,
      message: error.message,
      data: []
    };
  }
};