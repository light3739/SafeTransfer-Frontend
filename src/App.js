// src/App.js

import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import FileRegistry from './components/FileRegistry';
import FileUpload from './components/FileUpload';
import FileDownload from './components/FileDownload';

const App = () => {
    return (
        <Router>
            <div>
                <h1>File Registry</h1>
                <Routes>
                    <Route path="/" element={<FileRegistry/>}/>
                    <Route path="/upload" element={<FileUpload/>}/>
                    <Route path="/download" element={<FileDownload/>}/>
                </Routes>
            </div>
        </Router>
    );
};

export default App;
