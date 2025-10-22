import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadImage, savePost, saveQuestion } from '../services/postService';
import ReactMarkdown from 'react-markdown';

const Card = ({ children, className = '' }) => (
    <div className={`bg-white shadow-md rounded-lg p-6 sm:p-8 ${className}`}>
        {children}
    </div>
);

const FormField = ({ label, children }) => (
    <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
        {children}
    </div>
);

const Input = (props) => (
    <input
        className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
        {...props}
    />
);

const TextArea = ({ className = '', ...props }) => (
    <textarea
        className={className || "shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"}
        rows="6"
        {...props}
    ></textarea>
);

const Button = ({ children, ...props }) => (
    <button
        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
        {...props}
    >
        {children}
    </button>
);

const RadioButton = ({ name, value, checked, onChange, label }) => (
    <label className="inline-flex items-center mr-6 cursor-pointer">
        <input
            type="radio"
            className="form-radio h-5 w-5 text-blue-600"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
        />
        <span className="ml-2 text-gray-700">{label}</span>
    </label>
);

const ImageUpload = ({ onImageUpload, imageUrl, isUploading }) => {
    const [dragActive, setDragActive] = useState(false);
    
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };
    
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onImageUpload(e.dataTransfer.files[0]);
        }
    };
    
    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            onImageUpload(e.target.files[0]);
        }
    };
    
    return (
        <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Add an image:</label>
            <div 
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                } ${imageUrl ? 'bg-gray-50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {imageUrl ? (
                    <div className="space-y-4">
                        <img 
                            src={imageUrl} 
                            alt="Uploaded preview" 
                            className="max-w-full h-32 object-cover mx-auto rounded"
                        />
                        <p className="text-sm text-green-600">Image uploaded successfully!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                                className="hidden"
                                id="image-upload"
                                disabled={isUploading}
                            />
                            <label
                                htmlFor="image-upload"
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer transition-colors disabled:opacity-50"
                            >
                                {isUploading ? 'Uploading...' : 'Browse'}
                            </label>
                            <span className="text-gray-500">or drag and drop an image here</span>
                        </div>
                        <p className="text-xs text-gray-400">Supported formats: JPG, PNG, GIF (max 1MB)</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const QuestionForm = ({ formData, setFormData, isCoding = false }) => {
    const [showPreview, setShowPreview] = useState(false);

    return (
        <div>
            {/* This entire section is rendered only when 'Question' is selected */}
            <div className="bg-gray-100 p-4 rounded-md mb-6">
                <h2 className="font-bold text-lg text-gray-800">What do you want to ask or share</h2>
                <p className="text-sm text-gray-600 mt-1">This section is designed based on the type of the post. It could be developed by conditional rendering. <span className="font-semibold text-red-600">For post a question, the following section would be appeared.</span></p>
            </div>
            <FormField label="Title">
                <Input 
                    type="text" 
                    placeholder="Start your question with how, what, why, etc."
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
            </FormField>
            <FormField label="Describe your problem">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span></span>
                        <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                        >
                            {showPreview ? '✏️ Edit' : '👁️ Preview'}
                        </button>
                    </div>
                    {!showPreview ? (
                        <TextArea 
                            placeholder="Describe your problem in detail (supports Markdown)..."
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        />
                    ) : (
                        <div className="bg-gray-50 p-4 rounded border border-gray-300 prose prose-sm max-w-none">
                            <ReactMarkdown>{formData.description}</ReactMarkdown>
                        </div>
                    )}
                </div>
            </FormField>
            
            {isCoding && (
                <>
                    <FormField label="Programming Language">
                        <select 
                            className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                            value={formData.codeLanguage}
                            onChange={(e) => setFormData(prev => ({ ...prev, codeLanguage: e.target.value }))}
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="cpp">C/C++</option>
                        </select>
                    </FormField>
                    <FormField label="Code Snippet">
                        <TextArea 
                            placeholder="Paste your code here..."
                            value={formData.code}
                            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                            className="bg-gray-900 text-green-400 font-mono text-sm p-4"
                        />
                    </FormField>
                </>
            )}
            
            <FormField label="Tags">
                <Input 
                    type="text" 
                    placeholder="Please add up to 3 tags to describe what your question is about e.g., Java"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                />
            </FormField>
        </div>
    );
};

const ArticleForm = ({ formData, setFormData, onImageUpload, imageUrl, isUploading }) => (
    <div>
        {/* This entire section is rendered only when 'Article' is selected */}
        <div className="bg-gray-100 p-4 rounded-md mb-6">
            <h2 className="font-bold text-lg text-gray-800">What do you want to ask or share</h2>
            <p className="text-sm text-gray-600 mt-1">This section is designed based on the type of the post. It could be developed by conditional rendering. <span className="font-semibold text-red-600">For post an article, the following section would be appeared.</span></p>
        </div>
        <FormField label="Title">
            <Input 
                type="text" 
                placeholder="Enter a descriptive title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
        </FormField>
        
        <ImageUpload 
            onImageUpload={onImageUpload} 
            imageUrl={imageUrl} 
            isUploading={isUploading} 
        />
        
        <FormField label="Abstract">
            <Input 
                type="text" 
                placeholder="Enter a 1-paragraph abstract"
                value={formData.abstract}
                onChange={(e) => setFormData(prev => ({ ...prev, abstract: e.target.value }))}
            />
        </FormField>
        <FormField label="Article Text">
            <TextArea 
                placeholder="Enter the full article text here..."
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            />
        </FormField>
        <FormField label="Tags">
            <Input 
                type="text" 
                placeholder="Please add up to 3 tags to describe what your article is about e.g., Java"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            />
        </FormField>
    </div>
);

const NewPost = () => {
    const [postType, setPostType] = useState('question');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        abstract: '',
        content: '',
        tags: '',
        code: '',
        codeLanguage: 'javascript'
    });
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        } else {
            // Redirect to login if not authenticated
            navigate('/login');
        }
    }, [navigate]);

    const handlePostTypeChange = (event) => {
        setPostType(event.target.value);
        setFormData({
            title: '',
            description: '',
            abstract: '',
            content: '',
            tags: ''
        });
        setImageFile(null);
        setImageUrl('');
    };

    const handleImageUpload = async (file) => {
        if (file.size > 1024 * 1024) { // 1MB limit for base64
            alert('File size must be less than 1MB for upload');
            return;
        }
        
        setIsUploading(true);
        try {
            const result = await uploadImage(file, 'articles');
            if (result.success) {
                setImageUrl(result.url);
                setImageFile(file);
            } else {
                alert('Failed to upload image: ' + result.message);
            }
        } catch (error) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handlePost = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.title.trim()) {
            alert('Please enter a title');
            return;
        }
        
        if (postType === 'question' && !formData.description.trim()) {
            alert('Please describe your problem');
            return;
        }
        
        if (postType === 'article' && (!formData.abstract.trim() || !formData.content.trim())) {
            alert('Please fill in all article fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const postData = {
                type: postType,
                author: user?.name || 'Anonymous',
                authorId: user?.id,
                title: formData.title,
                tags: formData.tags.split(',').map(tag => tag.trim().toLowerCase()),
                imageUrl: imageUrl || null,
                ...(postType === 'question' ? { description: formData.description } : {
                    abstract: formData.abstract,
                    content: formData.content
                })
            };

            const result = postType === 'question' 
                ? await saveQuestion(postData) 
                : await savePost(postData);
                
            if (result.success) {
                alert(`${postType === 'question' ? 'Question' : 'Article'} posted successfully!`);
                navigate('/');
            } else {
                alert('Failed to post: ' + result.message);
            }
        } catch (error) {
            alert('Error posting: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading or redirect if not authenticated
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
        <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4 font-sans">
            <main className="w-full max-w-3xl">
                <Card>
                    <form onSubmit={handlePost}>
                        <header className="border-b pb-4 mb-6">
                            <div className="flex justify-between items-center">
                                <h1 className="text-3xl font-bold text-gray-900">New Post</h1>
                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="text-gray-600 hover:text-gray-800 text-sm"
                                >
                                    ← Back to Home
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">Welcome, {user.name}!</p>
                        </header>

                        {/* Post Type Selection */}
                        <div className="bg-gray-100 p-4 rounded-md mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-4">Select Post Type:</label>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPostType('question');
                                        setFormData({ title: '', description: '', abstract: '', content: '', tags: '' });
                                        setImageFile(null);
                                        setImageUrl('');
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                                        postType === 'question' && !formData.description
                                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                                            : 'border-gray-300 bg-white text-gray-600 hover:border-blue-400'
                                    }`}
                                >
                                    <span>❓</span>
                                    <span className="font-semibold">Question</span>
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPostType('question-coding');
                                        setFormData({ title: '', description: '', abstract: '', content: '', tags: '' });
                                        setImageFile(null);
                                        setImageUrl('');
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                                        postType === 'question-coding'
                                            ? 'border-purple-500 bg-purple-50 text-purple-600'
                                            : 'border-gray-300 bg-white text-gray-600 hover:border-purple-400'
                                    }`}
                                >
                                    <span>💻</span>
                                    <span className="font-semibold">Question (Coding)</span>
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPostType('article');
                                        setFormData({ title: '', description: '', abstract: '', content: '', tags: '' });
                                        setImageFile(null);
                                        setImageUrl('');
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                                        postType === 'article'
                                            ? 'border-amber-500 bg-amber-50 text-amber-600'
                                            : 'border-gray-300 bg-white text-gray-600 hover:border-amber-400'
                                    }`}
                                >
                                    <span>📝</span>
                                    <span className="font-semibold">Article</span>
                                </button>
                            </div>
                        </div>

                        {/*Conditional rendering is applied here as implied in the tasksheet*/}
                        {postType === 'question' || postType === 'question-coding' ? (
                            <QuestionForm 
                                formData={formData} 
                                setFormData={setFormData}
                                isCoding={postType === 'question-coding'}
                            />
                        ) : (
                            <ArticleForm 
                                formData={formData} 
                                setFormData={setFormData}
                                onImageUpload={handleImageUpload}
                                imageUrl={imageUrl}
                                isUploading={isUploading}
                            />
                        )}

                        {/*{Posting}*/}
                        <div className="flex justify-between items-center mt-8 border-t pt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
                            >
                                Cancel
                            </button>
                            <Button type="submit" disabled={isSubmitting || isUploading}>
                                {isSubmitting ? 'Posting...' : postType === 'article' ? 'Post Article' : postType === 'question-coding' ? 'Post Coding Question' : 'Post Question'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </main>
        </div>
    );
};

export default NewPost;