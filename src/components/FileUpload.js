// src/components/FileUpload.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectFile, uploadFile, initializeContractInstance } from '../redux/actions/fileActions';
import { setSelectedAccount } from '../redux/slices/web3Slice';
import useWeb3 from '../hooks/useWeb3';

const FileUpload = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { web3, accounts } = useWeb3();
    const [fileInput, setFileInput] = useState(null);
    const { selectedFile, loading, error } = useSelector((state) => state.file);

    useEffect(() => {
        if (accounts && accounts.length > 0) {
            dispatch(setSelectedAccount(accounts[0]));
        }
    }, [dispatch, accounts]);

    const handleFileChange = (event) => {
        dispatch(selectFile(event.target.files[0]));
        setFileInput(event.target);
    };

    const handleUpload = async () => {
        if (!selectedFile || !fileInput || !fileInput.files[0]) {
            alert('Please select a file to upload.');
            return;
        }

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error('No JWT token found in local storage.');
            navigate('/login');
            return;
        }

        if (!web3 || !accounts || accounts.length === 0) {
            console.error('Web3 or accounts not available.');
            alert('Please connect your Ethereum wallet.');
            return;
        }

        try {
            const contract = await initializeContractInstance(web3);
            await dispatch(uploadFile({ file: fileInput.files[0], token, account: accounts[0], contract }));
        } catch (error) {
            console.error('Upload or registration failed:', error);
            alert('Upload or registration failed.');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Uploading...' : 'Upload'}
            </button>
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default FileUpload;
