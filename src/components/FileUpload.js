// src/components/FileUpload.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error('No JWT token found in local storage.');
            navigate('/');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://localhost:8083/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            const data = await response.json();
            console.log('File uploaded successfully:', data);
            // You can handle the response data as needed (e.g., display a success message)
        } catch (error) {
            console.error('Error uploading file:', error);
            // You can handle the error as needed (e.g., display an error message)
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default FileUpload;
