import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuestions, deleteQuestion, filterQuestions } from '../services/postService';
import { ChevronDown, ChevronUp, Search, Filter, Trash2, Calendar, Tag, User } from 'lucide-react';

const Card = ({ children, className = '' }) => (
    <div className={`bg-white shadow-md rounded-lg ${className}`}>
        {children}
    </div>
);

const Input = (props) => (
    <input
        className="shadow-sm appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
        {...props}
    />
);

const Button = ({ children, variant = 'primary', size = 'md', ...props }) => {
    const baseClasses = "font-bold rounded-md focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-gray-600 hover:bg-gray-700 text-white",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
        danger: "bg-red-600 hover:bg-red-700 text-white"
    };
    const sizes = {
        sm: "py-1 px-3 text-sm",
        md: "py-2 px-4",
        lg: "py-3 px-6"
    };
    
    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
            {...props}
        >
            {children}
        </button>
    );
};

const QuestionCard = ({ question, onDelete, onToggleExpand, isExpanded }) => {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const canDelete = user && (user.id === question.authorId || user.role === 'admin');
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Card className="p-6 mb-4 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {question.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 space-x-4 mb-3">
                        <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            <span>{question.author}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{formatDate(question.createdAt)}</span>
                        </div>
                    </div>
                    
                    {/* Tags */}
                    {question.tags && question.tags.length > 0 && (
                        <div className="flex items-center flex-wrap gap-2 mb-3">
                            <Tag className="w-4 h-4 text-gray-500" />
                            {question.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onToggleExpand(question.id)}
                        className="flex items-center"
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp className="w-4 h-4 mr-1" />
                                Less
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4 mr-1" />
                                More
                            </>
                        )}
                    </Button>
                    
                    {canDelete && (
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onDelete(question.id)}
                            className="flex items-center"
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                        </Button>
                    )}
                </div>
            </div>
            
            {/* Question Description - Always show a preview */}
            <div className="text-gray-700">
                {isExpanded ? (
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2">Description:</h4>
                            <p className="whitespace-pre-wrap">{question.description}</p>
                        </div>
                        {question.imageUrl && (
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Image:</h4>
                                <img 
                                    src={question.imageUrl} 
                                    alt="Question attachment" 
                                    className="max-w-full h-64 object-cover rounded-lg border"
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-600">
                        {question.description?.length > 150 
                            ? `${question.description.substring(0, 150)}...` 
                            : question.description}
                    </p>
                )}
            </div>
        </Card>
    );
};

const FilterBar = ({ filters, onFiltersChange, onSearch }) => {
    const [localFilters, setLocalFilters] = useState(filters);
    
    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        onFiltersChange(newFilters);
    };
    
    const handleSearch = () => {
        onSearch(localFilters);
    };
    
    const clearFilters = () => {
        const clearedFilters = {
            searchTerm: '',
            tag: '',
            dateFrom: '',
            dateTo: '',
            author: ''
        };
        setLocalFilters(clearedFilters);
        onFiltersChange(clearedFilters);
        onSearch(clearedFilters);
    };

    return (
        <Card className="p-6 mb-6">
            <div className="flex items-center mb-4">
                <Filter className="w-5 h-5 mr-2 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Filter Questions</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Search in title/description
                    </label>
                    <Input
                        type="text"
                        placeholder="Enter keywords..."
                        value={localFilters.searchTerm}
                        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tag
                    </label>
                    <Input
                        type="text"
                        placeholder="e.g., javascript, react"
                        value={localFilters.tag}
                        onChange={(e) => handleFilterChange('tag', e.target.value)}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Author
                    </label>
                    <Input
                        type="text"
                        placeholder="Author name"
                        value={localFilters.author}
                        onChange={(e) => handleFilterChange('author', e.target.value)}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date From
                    </label>
                    <Input
                        type="date"
                        value={localFilters.dateFrom}
                        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date To
                    </label>
                    <Input
                        type="date"
                        value={localFilters.dateTo}
                        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    />
                </div>
            </div>
            
            <div className="flex items-center space-x-3">
                <Button onClick={handleSearch} className="flex items-center">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                </Button>
                <Button variant="secondary" onClick={clearFilters}>
                    Clear Filters
                </Button>
            </div>
        </Card>
    );
};

const FindQuestion = () => {
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCards, setExpandedCards] = useState(new Set());
    const [filters, setFilters] = useState({
        searchTerm: '',
        tag: '',
        dateFrom: '',
        dateTo: '',
        author: ''
    });
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            loadQuestions();
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const loadQuestions = async () => {
        setLoading(true);
        try {
            console.log('Loading questions...');
            const result = await getQuestions();
            console.log('Questions result:', result);
            if (result.success) {
                setQuestions(result.data);
                setFilteredQuestions(result.data);
                console.log(`Loaded ${result.data.length} questions`);
            } else {
                console.error('Failed to load questions:', result.message);
                setQuestions([]);
                setFilteredQuestions([]);
            }
        } catch (error) {
            console.error('Error loading questions:', error);
            setQuestions([]);
            setFilteredQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (questionId) => {
        if (!window.confirm('Are you sure you want to delete this question?')) {
            return;
        }

        try {
            const result = await deleteQuestion(questionId);
            if (result.success) {
                await loadQuestions(); // Reload questions after deletion
                alert('Question deleted successfully!');
            } else {
                alert('Failed to delete question: ' + result.message);
            }
        } catch (error) {
            alert('Error deleting question: ' + error.message);
        }
    };

    const handleToggleExpand = (questionId) => {
        const newExpanded = new Set(expandedCards);
        if (newExpanded.has(questionId)) {
            newExpanded.delete(questionId);
        } else {
            newExpanded.add(questionId);
        }
        setExpandedCards(newExpanded);
    };

    const handleSearch = async (searchFilters) => {
        if (!searchFilters || Object.values(searchFilters).every(value => !value)) {
            // If no filters, show all questions
            setFilteredQuestions(questions);
            return;
        }

        try {
            const result = await filterQuestions(searchFilters);
            if (result.success) {
                setFilteredQuestions(result.data);
            } else {
                console.error('Filter failed:', result.message);
                setFilteredQuestions([]);
            }
        } catch (error) {
            console.error('Error filtering questions:', error);
            setFilteredQuestions([]);
        }
    };

    if (!user) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto p-4 pt-8">
                <header className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">Find Questions</h1>
                        <div className="flex items-center space-x-4">
                            <Button 
                                variant="secondary" 
                                onClick={() => navigate('/')}
                            >
                                ← Back to Home
                            </Button>
                            <Button onClick={() => navigate('/new-post')}>
                                Ask Question
                            </Button>
                        </div>
                    </div>
                    <p className="text-gray-600">
                        Discover and explore questions from the community. Welcome, {user.name}!
                    </p>
                </header>

                <FilterBar 
                    filters={filters} 
                    onFiltersChange={setFilters}
                    onSearch={handleSearch}
                />

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        <p className="mt-4 text-gray-600">Loading questions...</p>
                    </div>
                ) : filteredQuestions.length === 0 ? (
                    <Card className="p-12 text-center">
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            No questions found
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {Object.values(filters).some(value => value) 
                                ? "Try adjusting your filters or search terms."
                                : "Be the first to ask a question!"
                            }
                        </p>
                        <Button onClick={() => navigate('/new-post')}>
                            Ask the First Question
                        </Button>
                    </Card>
                ) : (
                    <div>
                        <div className="mb-6">
                            <p className="text-gray-600">
                                {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''} found
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            {filteredQuestions.map((question) => (
                                <QuestionCard
                                    key={question.id}
                                    question={question}
                                    onDelete={handleDelete}
                                    onToggleExpand={handleToggleExpand}
                                    isExpanded={expandedCards.has(question.id)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindQuestion;