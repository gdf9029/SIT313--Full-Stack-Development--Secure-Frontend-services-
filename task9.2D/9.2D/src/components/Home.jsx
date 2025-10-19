import React, { useState, useEffect } from 'react';
import { Search, Star, Facebook, Twitter, Instagram } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOutUser } from '../services/authService';

// --- MOCK DATA ---
const featuredArticles = [
    {
        id: 1,
        image: 'https://picsum.photos/600/400?random=1',
        title: 'Best Practices in Modern Web Development',
        description: 'A look into the popular frameworks and how does they affect development.',
        rating: 4.6,
        author: 'Love babbar',
    },
    {
        id: 2,
        image: 'https://picsum.photos/600/400?random=2',
        title: 'Backend Development with Node.js',
        description: 'An overview of building scalable server-side applications with node and express.',
        rating: 3.5,
        author: 'Javascript Mastery',
    },
    {
        id: 3,
        image: 'https://picsum.photos/600/400?random=3',
        title: 'The Power of React Hooks and Routers',
        description: 'Unlock functional components with the latest React features.',
        rating: 4.7,
        author: 'web dev camp',
    },
];

const questions = [
    {
        id: 1,
        image: 'https://picsum.photos/600/400?random=4',
        title: 'How to implement JWT authentication?',
        description: 'I need help understanding how to properly implement JWT authentication in my React application.',
        username: 'ReactDeveloper',
    },
    {
        id: 2,
        image: 'https://picsum.photos/600/400?random=5',
        title: 'Best practices for React state management',
        description: 'What are the current best practices for managing state in large React applications?',
        username: 'StateManager',
    },
    {
        id: 3,
        image: 'https://picsum.photos/600/400?random=6',
        title: 'Docker deployment strategies',
        description: 'Looking for advice on deploying React apps using Docker containers.',
        username: 'DevOpsGuru',
    },
];

// --- REUSABLE COMPONENTS ---

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handlePostClick = () => {
        console.log('Post button clicked!');
        
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            navigate('/new-post');
        } else {
            navigate('/login');
        }
    };

    const handleFindQuestionClick = () => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            navigate('/find-question');
        } else {
            navigate('/login');
        }
    };

    const handleLogout = async () => {
        try {
            await signOutUser();
            localStorage.removeItem('user');
            onLogout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            alert('Error logging out: ' + error.message);
        }
    };

    return (
        <header className="bg-white shadow-sm py-4 px-6 md:px-10">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 cursor-pointer" onClick={() => navigate('/')}>DEV@Deakin</h1>
                <div className="hidden md:flex items-center border rounded-md flex-grow max-w-md mx-4">
                    <Search className="text-gray-400 mx-2" size={20} />
                    <input type="text" placeholder="Search..." className="w-full py-2 px-2 focus:outline-none rounded-md" />
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handlePostClick}
                        className="font-semibold text-gray-600 hover:text-blue-600 transition-colors duration-200 px-3 py-1 rounded hover:bg-blue-50"
                    >
                        Post
                    </button>
                    <button 
                        onClick={handleFindQuestionClick}
                        className="font-semibold text-gray-600 hover:text-green-600 transition-colors duration-200 px-3 py-1 rounded hover:bg-green-50"
                    >
                        Find Question
                    </button>
                    <button 
                        onClick={() => navigate('/plans')}
                        className="font-semibold text-gray-600 hover:text-purple-600 transition-colors duration-200 px-3 py-1 rounded hover:bg-purple-50"
                    >
                        Plans
                    </button>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">Welcome, {user.name}!</span>
                            <button 
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={handleLoginClick}
                            className="bg-gray-800 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-700"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

const Hero = () => (
    <section className="container mx-auto my-8 px-6 md:px-10">
        <div className="h-64 md:h-96 rounded-lg overflow-hidden">
            <img
                src="https://picsum.photos/1200/400?random=hero"
                alt="Featured content"
                className="w-full h-full object-cover"
            />
        </div>
    </section>
);

const Card = ({ item }) => {
    const isArticle = !!item.author;
    return (
        <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        {isArticle && (
                            <>
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span>{item.rating}</span>
                            </>
                        )}
                    </div>
                    <span>{isArticle ? item.author : item.username}</span>
                </div>
            </div>
        </div>
    );
};

const Section = ({ title, items, showAllText }) => (
    <section className="container mx-auto my-8 px-6 md:px-10">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
                {showAllText}
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
                <Card key={item.id} item={item} />
            ))}
        </div>
    </section>
);

const Newsletter = () => (
    <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-6 md:px-10 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">SIGN UP FOR OUR DAILY INSIDER</h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-gray-800 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-700 whitespace-nowrap">
                    Subscribe
                </button>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-lg font-bold mb-4">Explore</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li><a href="#" className="hover:text-white">Home</a></li>
                        <li><a href="#" className="hover:text-white">Questions</a></li>
                        <li><a href="#" className="hover:text-white">Articles</a></li>
                        <li><a href="#" className="hover:text-white">Tutorials</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-4">Support</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li><a href="#" className="hover:text-white">FAQs</a></li>
                        <li><a href="#" className="hover:text-white">Help</a></li>
                        <li><a href="#" className="hover:text-white">Contact Us</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-4">Stay connected</h3>
                    <div className="flex space-x-4">
                        <Facebook className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer" />
                        <Twitter className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer" />
                        <Instagram className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer" />
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-4">DEV@Deakin</h3>
                    <p className="text-gray-300 text-sm">
                        Building the next generation of developers through quality content and community.
                    </p>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
                <p>&copy; 2024 DEV@Deakin. All rights reserved.</p>
                <div className="flex justify-center space-x-6 mt-4">
                    <a href="#" className="hover:text-white">Privacy Policy</a>
                    <a href="#" className="hover:text-white">Terms</a>
                    <a href="#" className="hover:text-white">Code of Conduct</a>
                </div>
            </div>
        </div>
    </footer>
);

// --- MAIN APP COMPONENT ---
const Home = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if user is logged in - run on mount and whenever location changes
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('user');
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [location]); // Add location as dependency to re-check on navigation

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header user={user} onLogout={handleLogout} />
            <Hero />
            <Section 
                title="Featured Articles" 
                items={featuredArticles} 
                showAllText="See all articles" 
            />
            <Section 
                title="Featured Questions" 
                items={questions} 
                showAllText="See all questions" 
            />
            <Newsletter />
            <Footer />
        </div>
    );
};

export default Home;