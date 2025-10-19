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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [tags, setTags] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const postData = {
      type: postType,
      title,
      description,
      code: postType === 'question' ? code : null,
      codeLanguage: postType === 'question' ? codeLanguage : null,
      tags: tags.split(',').map(tag => tag.trim()),
      timestamp: new Date().toISOString()
    };

    console.log('Submitting post:', postData);
  };

  return (
    <div className="post-question-container">
      <h2>Create a Post</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Post Type</label>
          <select value={postType} onChange={(e) => setPostType(e.target.value)}>
            <option value="question">Question</option>
            <option value="article">Article</option>
          </select>
        </div>

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

        {postType === 'question' && (
          <>
            <div className="form-group">
              <label>Programming Language</label>
              <select value={codeLanguage} onChange={(e) => setCodeLanguage(e.target.value)}>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="clike">C/C++</option>
              </select>
            </div>

            <div className="form-group">
              <label>Code Snippet</label>
              <button
                type="button"
                className="preview-toggle"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? 'Edit Code' : 'Preview'}
              </button>
              
              {!showPreview ? (
                <CodeMirror
                  value={code}
                  options={{
                    mode: codeLanguage,
                    theme: 'material',
                    lineNumbers: true,
                    lineWrapping: true,
                  }}
                  onBeforeChange={(editor, data, value) => {
                    setCode(value);
                  }}
                />
              ) : (
                <div className="code-preview">
                  <pre>
                    <code className={`language-${codeLanguage}`}>
                      {code}
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
          Post {postType === 'question' ? 'Question' : 'Article'}
        </button>
      </form>
    </div>
  );
};

export default PostQuestion;
