import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FileDownload = () => {
    const [cid, setCid] = useState('');
    const navigate = useNavigate();

    const handleDownload = async () => {
        if (!cid) {
            alert('Please enter a CID.');
            return;
        }

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error('No JWT token found in local storage.');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8083/download/${cid}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to download file');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${cid}.txt`); // Specify the desired file name and extension
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading file:', error);
            // You can handle the error as needed (e.g., display an error message)
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter CID"
                value={cid}
                onChange={(e) => setCid(e.target.value)}
            />
            <button onClick={handleDownload}>Download</button>
        </div>
    );
};

export default FileDownload;
