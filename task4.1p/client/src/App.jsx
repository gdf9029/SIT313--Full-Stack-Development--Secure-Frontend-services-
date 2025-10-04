import React, { useState } from 'react';
import { Search, Star, Facebook, Twitter, Instagram } from 'lucide-react';

// --- MOCK DATA ---
// Updated to use random images from Picsum.photos
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

const featuredTutorials = [
    {
        id: 1,
        image: 'https://picsum.photos/600/400?random=4',
        title: 'Creative CSS Solutions with Tailwind v4',
        description: 'Discover unique ways to style your components with advanced CSS.',
        rating: 5,
        username: 'freecodecamp',
    },
    {
        id: 2,
        image: 'https://picsum.photos/600/400?random=5',
        title: 'Routing in Single-Page Apps',
        description: 'A practical guide to implementing navigation in your projects.',
        rating: 5,
        username: 'ReactUS',
    },
    {
        id: 3,
        image: 'https://picsum.photos/600/400?random=6',
        title: 'Understanding Express Middleware',
        description: 'Learn how middleware can supercharge your Express server.',
        rating: 4.9,
        username: 'Nodemon',
    },
];


// --- REUSABLE COMPONENTS ---

const Header = () => (
    <header className="bg-white shadow-sm py-4 px-6 md:px-10">
        <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">DEV@Deakin</h1>
            <div className="hidden md:flex items-center border rounded-md flex-grow max-w-md mx-4">
                <Search className="text-gray-400 mx-2" size={20} />
                <input type="text" placeholder="Search..." className="w-full py-2 px-2 focus:outline-none rounded-md" />
            </div>
            <div className="flex items-center gap-4">
                <button className="font-semibold text-gray-600 hover:text-blue-600">Post</button>
                <button className="bg-gray-800 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-700">Login</button>
            </div>
        </div>
    </header>
);

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
                        <Star className="text-yellow-500" size={16} fill="currentColor" />
                        <span className="font-semibold">{item.rating}</span>
                    </div>
                    <span>{isArticle ? item.author : item.username}</span>
                </div>
            </div>
        </div>
    );
};

const CardList = ({ title, items }) => (
    <section className="container mx-auto my-12 px-6 md:px-10">
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => <Card key={item.id} item={item} />)}
        </div>
        <div className="text-center mt-8">
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-semibold hover:bg-gray-300">
                See all {title.toLowerCase()}
            </button>
        </div>
    </section>
);

// --- UPDATED SUBSCRIBE COMPONENT ---
const Subscribe = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Subscribing...');

        try {
            // The React app sends a request to the Express backend
            const response = await fetch('http://localhost:3000/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || 'Success! Please check your email.');
                setEmail(''); // Clear input field on success
            } else {
                setMessage(data.error || 'Error: Could not subscribe. Please try again.');
            }
        } catch (error) {
            console.error('Network error:', error);
            setMessage('Error: Could not connect to the server.');
        }
    };

    return (
        <section className="bg-gray-100 py-8">
            <div className="container mx-auto px-6 md:px-10 flex flex-col items-center justify-center gap-4">
                <h3 className="text-lg font-bold text-gray-800 uppercase text-center">Sign up for our daily insider</h3>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="border rounded-md py-2 px-4 w-64"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-gray-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-600"
                    >
                        Subscribe
                    </button>
                </form>
                {message && <p className="mt-4 text-sm">{message}</p>}
            </div>
        </section>
    );
};

const Footer = () => (
    <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6 md:px-10">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div>
                    <h4 className="font-bold text-lg mb-4">Explore</h4>
                    <ul>
                        <li className="mb-2"><a href="#" className="hover:underline">Home</a></li>
                        <li className="mb-2"><a href="#" className="hover:underline">Questions</a></li>
                        <li className="mb-2"><a href="#" className="hover:underline">Articles</a></li>
                        <li><a href="#" className="hover:underline">Tutorials</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-4">Support</h4>
                    <ul>
                        <li className="mb-2"><a href="#" className="hover:underline">FAQs</a></li>
                        <li className="mb-2"><a href="#" className="hover:underline">Help</a></li>
                        <li><a href="#" className="hover:underline">Contact Us</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-4">Stay connected</h4>
                    <div className="flex gap-4">
                        <a href="#" aria-label="Facebook"><Facebook /></a>
                        <a href="#" aria-label="Twitter"><Twitter /></a>
                        <a href="#" aria-label="Instagram"><Instagram /></a>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
                <p className="font-bold text-xl mb-4">DEV@Deakin 2022</p>
                <div className="flex justify-center gap-6">
                    <a href="#" className="hover:underline">Privacy Policy</a>
                    <a href="#" className="hover:underline">Terms</a>
                    <a href="#" className="hover:underline">Code of Conduct</a>
                </div>
            </div>
        </div>
    </footer>
);

function App() {
    return (
        <div className="bg-white">
            <Header />
            <main>
                <Hero />
                <CardList title="Featured Articles" items={featuredArticles} />
                <CardList title="Featured Tutorials" items={featuredTutorials} />
            </main>
            <Subscribe />
            <Footer />
        </div>
    );
}

export default App;
