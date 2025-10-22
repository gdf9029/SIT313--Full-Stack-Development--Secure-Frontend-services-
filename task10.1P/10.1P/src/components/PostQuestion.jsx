import React, { useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import ReactMarkdown from 'react-markdown';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/java/java';
import './PostQuestion.css';

const PostQuestion = () => {
  const [postType, setPostType] = useState('question');
  const [isCodingQuestion, setIsCodingQuestion] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [tags, setTags] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const languages = [
    { value: 'javascript', label: 'JavaScript', mode: 'javascript' },
    { value: 'python', label: 'Python', mode: 'python' },
    { value: 'java', label: 'Java', mode: 'java' },
    { value: 'clike', label: 'C/C++', mode: 'clike' },
  ];

  const handleQuestionTypeSelect = (type) => {
    setPostType('question');
    setIsCodingQuestion(type === 'coding');
  };

  const handleArticleSelect = () => {
    setPostType('article');
    setIsCodingQuestion(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const postData = {
      type: postType,
      subType: isCodingQuestion ? 'coding' : 'regular',
      title,
      description,
      code: isCodingQuestion ? code : null,
      codeLanguage: isCodingQuestion ? codeLanguage : null,
      tags: tags.split(',').map(tag => tag.trim()),
      timestamp: new Date().toISOString()
    };

    console.log('Submitting post:', postData);
    // TODO: Save to database
  };

  const selectedLanguage = languages.find(l => l.value === codeLanguage);

  return (
    <div className="post-question-container">
      <h2>Create a Post</h2>
      
      {/* Post Type Selection Buttons */}
      <div className="post-type-selector">
        <button
          type="button"
          className={`post-type-btn ${postType === 'question' && !isCodingQuestion ? 'active' : ''}`}
          onClick={() => handleQuestionTypeSelect('regular')}
        >
          <span className="btn-icon">❓</span>
          <span className="btn-label">Question</span>
        </button>
        
        <button
          type="button"
          className={`post-type-btn coding-btn ${postType === 'question' && isCodingQuestion ? 'active' : ''}`}
          onClick={() => handleQuestionTypeSelect('coding')}
        >
          <span className="btn-icon">💻</span>
          <span className="btn-label">Question (Coding)</span>
        </button>
        
        <button
          type="button"
          className={`post-type-btn article-btn ${postType === 'article' ? 'active' : ''}`}
          onClick={handleArticleSelect}
        >
          <span className="btn-icon">📝</span>
          <span className="btn-label">Article</span>
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your question or article (supports Markdown)"
            rows="6"
            required
          />
        </div>

        {/* Code Section - Shows only for Coding Questions */}
        {isCodingQuestion && (
          <>
            <div className="form-group language-selector-group">
              <label>Programming Language</label>
              <div className="language-selector">
                <select 
                  value={codeLanguage} 
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="language-dropdown"
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <span className="language-badge">
                  {selectedLanguage?.label}
                </span>
              </div>
            </div>

            <div className="form-group code-section">
              <div className="code-header">
                <label>Code Snippet</label>
                <button
                  type="button"
                  className="preview-toggle"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <span className="toggle-icon">
                    {showPreview ? '✏️' : '👁️'}
                  </span>
                  {showPreview ? 'Edit Code' : 'Preview Code'}
                </button>
              </div>
              
              {!showPreview ? (
                <div className="code-mirror-wrapper">
                  <CodeMirror
                    value={code}
                    options={{
                      mode: selectedLanguage?.mode || 'javascript',
                      theme: 'material',
                      lineNumbers: true,
                      lineWrapping: true,
                      indentUnit: 2,
                      indentWithTabs: false,
                      tabSize: 2,
                      autoCloseBrackets: true,
                      matchBrackets: true,
                    }}
                    onBeforeChange={(editor, data, value) => {
                      setCode(value);
                    }}
                  />
                </div>
              ) : (
                <div className="code-preview">
                  <div className="code-preview-header">
                    <span className="language-label">{selectedLanguage?.label}</span>
                  </div>
                  <pre>
                    <code className={`language-${codeLanguage}`}>
                      {code || '// No code provided'}
                    </code>
                  </pre>
                </div>
              )}
            </div>
          </>
        )}

        <div className="form-group">
          <label>Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="react, javascript, api"
          />
        </div>

        <div className="markdown-preview">
          <h3>Description Preview:</h3>
          <ReactMarkdown>{description}</ReactMarkdown>
        </div>

        <button type="submit" className="submit-btn">
          Post {isCodingQuestion ? 'Coding Question' : postType === 'question' ? 'Question' : 'Article'}
        </button>
      </form>
    </div>
  );
};

export default PostQuestion;
