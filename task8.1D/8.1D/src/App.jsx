import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import NewPost from './components/NewPost';
import FindQuestion from './components/FindQuestion';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/new-post" element={<NewPost />} />
                    <Route path="/find-question" element={<FindQuestion />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

