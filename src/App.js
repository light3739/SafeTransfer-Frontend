// src/App.js
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './redux/store';
import FileRegistry from './components/FileRegistry';
import FileDownload from './components/FileDownload';

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <div>
                    <Routes>
                        <Route path="/" element={<FileRegistry/>}/>
                        <Route path="/download" element={<FileDownload/>}/>
                        <Route path="/download/:cid" element={<FileDownload/>}/>
                    </Routes>
                </div>
            </Router>
        </Provider>
    );
};

export default App;
