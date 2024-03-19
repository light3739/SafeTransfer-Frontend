// src/components/FileDownload.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFileDetails, downloadFile } from '../redux/actions/fileActions';

const FileDownload = () => {
    const [cid, setCid] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { fileDetails, loading, error } = useSelector((state) => state.file);

    const handleDownload = async () => {
        if (!cid) {
            alert('Please enter a CID.');
            return;
        }

        dispatch(fetchFileDetails(cid, navigate));
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter CID"
                value={cid}
                onChange={(e) => setCid(e.target.value)}
            />
            <button onClick={handleDownload} disabled={loading}>
                {loading ? 'Downloading...' : 'Download'}
            </button>
            {error && <p>Error: {error}</p>}
            {fileDetails && (
                <div>
                    <p>Owner: {fileDetails.owner}</p>
                    <p>File Hash: {fileDetails.fileHash}</p>
                    <p>Timestamp: {new Date(parseInt(fileDetails.timestamp, 10) * 1000).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
};

export default FileDownload;
