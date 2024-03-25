// src/redux/actions/fileActions.js
import FileRegistryContract from '../../contracts/FileRegistry.json';
import { createAsyncThunk } from '@reduxjs/toolkit';
import Web3 from "web3";
import axios from 'axios';

export const selectFile = (file) => {
    const fileAttributes = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
    };

    return {
        type: 'SELECT_FILE',
        payload: fileAttributes,
    };
};

export const initializeContractInstance = async (web3) => {
    if (web3) {
        try {
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = FileRegistryContract.networks[networkId];
            const contractInstance = new web3.eth.Contract(
                FileRegistryContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            return contractInstance;
        } catch (error) {
            console.error('Error initializing contract:', error);
            throw error;
        }
    } else {
        console.error('Web3 not available');
        throw new Error('Web3 not available');
    }
};

export const uploadFile = createAsyncThunk(
    'file/uploadFile',
    async ({file, token, account, contract, onUploadProgress}, {rejectWithValue}) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onUploadProgress(percentCompleted); // Callback function to update progress
                },
            });

            if (response.status !== 200) {
                throw new Error('Failed to upload file');
            }

            const data = response.data;
            console.log('File uploaded successfully:', data);

            await registerFileOnBlockchain(contract, account, data.cid, data.originalFileHash);

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
    {
        serializableCheck: {
            ignoredActionPaths: ['meta.arg.contract', 'meta.arg.onUploadProgress'],
            ignoredPaths: ['web3.web3'],
        },
    }
);

const registerFileOnBlockchain = async (contract, account, cid, fileHash) => {
    console.log("Attempting to register file with CID:", cid, "and file hash:", fileHash);

    try {
        await contract.methods.registerFile(cid, fileHash).send({ from: account });
        alert('File registered successfully on the blockchain!');
    } catch (error) {
        console.error('Error registering file on the blockchain:', error);
        alert('Failed to register file on the blockchain.');
        throw error;
    }
};

export const fetchFileDetails = (cid, navigate) => async (dispatch) => {
    dispatch({ type: 'FETCH_FILE_DETAILS_REQUEST' });

    try {
        const web3 = new Web3(window.ethereum);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = FileRegistryContract.networks[networkId];
        const contract = new web3.eth.Contract(FileRegistryContract.abi, deployedNetwork && deployedNetwork.address);

        const fileHash = await contract.methods.getFileHash(cid).call();
        // Convert BigInt to String for serialization
        const fileHashStr = fileHash.toString();
        const details = await contract.methods.getFileDetails(fileHashStr).call();

        dispatch({ type: 'FETCH_FILE_DETAILS_SUCCESS', payload: details });
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error('No JWT token found in local storage.');
            navigate('/');
            return;
        }

        // Proceed with file download after fetching file details
        dispatch(downloadFile(cid, fileHashStr, navigate, token));
        ;
    } catch (error) {
        dispatch({ type: 'FETCH_FILE_DETAILS_FAILURE', payload: error.message });
    }
};

export const downloadFile = (cid, expectedHash, navigate, token) => async (dispatch) => {
    dispatch({ type: 'DOWNLOAD_FILE_REQUEST' });

    try {
        // Assuming you have the token available here, similar to the upload process
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/download/${cid}`, {
            method: 'GET',
            headers: {
                // Include the Authorization header with the token
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to download file');
        }

        const receivedHash = response.headers.get('X-File-Hash');
        console.log(receivedHash)
        if (receivedHash !== expectedHash) {
            throw new Error('File hash does not match the blockchain record.');
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = cid; // You might want to use a more descriptive filename
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        a.remove();

        dispatch({ type: 'DOWNLOAD_FILE_SUCCESS' });
    } catch (error) {
        dispatch({ type: 'DOWNLOAD_FILE_FAILURE', payload: error.message });
    }
};
