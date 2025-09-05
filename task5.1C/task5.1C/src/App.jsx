import React, { useState } from 'react';

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

const TextArea = (props) => (
    <textarea
        className="shadow-sm appearance-none border rounded-md w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
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



const QuestionForm = () => (
    <div>
        {/* This entire section is rendered only when 'Question' is selected */}
        <div className="bg-gray-100 p-4 rounded-md mb-6">
            <h2 className="font-bold text-lg text-gray-800">What do you want to ask or share</h2>
            <p className="text-sm text-gray-600 mt-1">This section is designed based on the type of the post. It could be developed by conditional rendering. <span className="font-semibold text-red-600">For post a question, the following section would be appeared.</span></p>
        </div>
        <FormField label="Title">
            <Input type="text" placeholder="Start your question with how, what, why, etc." />
        </FormField>
        <FormField label="Describe your problem">
            <TextArea />
        </FormField>
        <FormField label="Tags">
            <Input type="text" placeholder="Please add up to 3 tags to describe what your question is about e.g., Java" />
        </FormField>
    </div>
);

const ArticleForm = () => (
    <div>
        {/* This entire section is rendered only when 'Article' is selected */}
        <div className="bg-gray-100 p-4 rounded-md mb-6">
            <h2 className="font-bold text-lg text-gray-800">What do you want to ask or share</h2>
            <p className="text-sm text-gray-600 mt-1">This section is designed based on the type of the post. It could be developed by conditional rendering. <span className="font-semibold text-red-600">For post an article, the following section would be appeared.</span></p>
        </div>
        <FormField label="Title">
            <Input type="text" placeholder="Enter a descriptive title" />
        </FormField>
        <FormField label="Abstract">
            <Input type="text" placeholder="Enter a 1-paragraph abstract" />
        </FormField>
        <FormField label="Article Text">
            <TextArea placeholder="Enter the full article text here..." />
        </FormField>
        <FormField label="Tags">
            <Input type="text" placeholder="Please add up to 3 tags to describe what your article is about e.g., Java" />
        </FormField>
    </div>
);




export default function NewPostPage() {
    const [postType, setPostType] = useState('question'); // 'question' or 'article'

    const handlePostTypeChange = (event) => {
        setPostType(event.target.value);
    };
    // This section will proceed with post handling but for now as the tasksheet did not specify anything, I just prevent the default action
    const handlePost = (e) => {
        e.preventDefault();
    }

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4 font-sans">
            <main className="w-full max-w-3xl">
                <Card>
                    <form onSubmit={handlePost}>
                        <header className="border-b pb-4 mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">New Post</h1>
                        </header>

                        {/* Post Type Selection */}
                        <div className="bg-gray-100 p-4 rounded-md mb-6">
                            <FormField label="Select Post Type:">
                                <div className="mt-2">
                                    <RadioButton
                                        name="postType"
                                        value="question"
                                        checked={postType === 'question'}
                                        onChange={handlePostTypeChange}
                                        label="Question"
                                    />
                                    <RadioButton
                                        name="postType"
                                        value="article"
                                        checked={postType === 'article'}
                                        onChange={handlePostTypeChange}
                                        label="Article"
                                    />
                                </div>
                            </FormField>
                        </div>

                        {/*Conditional rendering is applied here as implied in the tasksheet*/}
                        {postType === 'question' ? <QuestionForm /> : <ArticleForm />}

                        {/*{Posting}*/}
                        <div className="flex justify-end mt-8 border-t pt-6">
                            <Button type="submit">
                                Post
                            </Button>
                        </div>
                    </form>
                </Card>
            </main>
        </div>
    );
}

