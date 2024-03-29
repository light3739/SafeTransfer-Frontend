import React, {useState, useEffect, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {uploadFile, initializeContractInstance} from '../redux/actions/fileActions';
import {setSelectedAccount} from '../redux/slices/web3Slice';
import useWeb3 from '../hooks/useWeb3';
import {FaCloudUploadAlt, FaSpinner} from 'react-icons/fa';
import {unwrapResult} from "@reduxjs/toolkit";


const FileUpload = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {web3, accounts} = useWeb3();
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadCID, setDownloadCID] = useState(""); // State to store the CID for download


    useEffect(() => {
        if (accounts && accounts.length > 0) {
            dispatch(setSelectedAccount(accounts[0]));
        }
    }, [dispatch, accounts]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error('No JWT token found in local storage.');
            navigate('/');
            return;
        }

        if (!web3 || !accounts || accounts.length === 0) {
            console.error('Web3 or accounts not available.');
            alert('Please connect your Ethereum wallet.');
            return;
        }

        try {
            const contract = await initializeContractInstance(web3);
            if (!contract) {
                alert('Failed to initialize contract instance.');
                return;
            }

            // Dispatch the uploadFile action and unwrap the result
            const actionResult = await dispatch(uploadFile({
                file,
                token,
                account: accounts[0],
                contract,
                onUploadProgress: (progress) => {
                    const adjustedProgress = progress * 0.9;
                    setUploadProgress(adjustedProgress);
                    if (adjustedProgress >= 90) {
                        setIsProcessing(true);
                    }
                }
            }));
            const result = unwrapResult(actionResult);
            setDownloadCID(result.cid);
            // Use unwrapResult to handle the promise returned by dispatch
            unwrapResult(actionResult);

            // If unwrapResult doesn't throw, the upload was successful
            setUploadProgress(100);
            setIsProcessing(false);
        } catch (error) {
            // If unwrapResult throws, it means the action was rejected
            console.error('Upload or registration failed:', error);
            alert('Upload or registration failed.');
            setUploadProgress(0); // Reset progress
            setIsProcessing(false); // Reset processing state
        }
    };
    const navigateToDownload = () => {
        if (downloadCID) {
            navigate(`/download/${downloadCID}`);
        }
    };

    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        // Add visual feedback
    }, []);

    const handleDrop = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer.files;
        if (files.length) {
            setFile(files[0]);
        }
        // Remove visual feedback
    }, []);
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-full md:max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Upload File</h2>
                <div
                    className="border-4 border-dashed border-blue-500 p-8 mb-6 text-center rounded-lg cursor-pointer transition duration-300 ease-in-out hover:bg-blue-100"
                    onClick={() => document.getElementById('fileInput').click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <FaCloudUploadAlt className="text-6xl text-blue-500 mb-4 mx-auto"/>
                    <p className="text-xl text-gray-600 mb-4">
                        Drag and drop a file here or click to select a file
                    </p>
                    <input
                        id="fileInput"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
                {file && (
                    <div className="mb-6">
                        <p className="text-lg text-gray-800">Selected file: {file.name}</p>
                        <p className="text-gray-600">Size: {file.size} bytes</p>
                    </div>
                )}
                <button
                    className={`bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-md transition duration-300 ease-in-out w-full ${file && !isProcessing ? '' : 'opacity-50 cursor-not-allowed'}`}
                    onClick={handleUpload}
                    disabled={!file || isProcessing}
                >
                    {isProcessing ? <FaSpinner className="animate-spin inline mr-2"/> : null}
                    {uploadProgress > 0 ? 'Uploading...' : 'Upload'}
                </button>
                {uploadProgress === 100 && !isProcessing && downloadCID && (
                    <div className="my-4">
                        <p className="text-center text-green-500 font-bold">Upload and processing complete!</p>
                        <p
                            className="text-blue-500 hover:underline cursor-pointer"
                            onClick={navigateToDownload}
                        >
                            Download File
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
