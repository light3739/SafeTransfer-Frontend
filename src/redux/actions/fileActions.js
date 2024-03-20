// src/redux/actions/fileActions.js
import Web3 from 'web3';
import FileRegistryContract from '../../contracts/FileRegistry.json';
import {createAsyncThunk} from '@reduxjs/toolkit';

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


export const uploadFile = createAsyncThunk(
    'file/uploadFile',
    async ({ file, token, account }, { rejectWithValue }) => {
        const formData = new FormData();
        formData.append('file', file); // Use the file directly from the input

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Optionally include EthereumAddress if needed
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            const data = await response.json();
            console.log('File uploaded successfully:', data);

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const fetchFileDetails = (cid, navigate) => async (dispatch) => {
    dispatch({type: 'FETCH_FILE_DETAILS_REQUEST'});

    try {
        const web3 = new Web3(window.ethereum);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = FileRegistryContract.networks[networkId];
        const contract = new web3.eth.Contract(FileRegistryContract.abi, deployedNetwork && deployedNetwork.address);

        const fileHash = await contract.methods.getFileHash(cid).call();
        const details = await contract.methods.getFileDetails(fileHash).call();

        dispatch({type: 'FETCH_FILE_DETAILS_SUCCESS', payload: details});

        // Proceed with file download after fetching file details
        dispatch(downloadFile(cid, fileHash, navigate));
    } catch (error) {
        dispatch({type: 'FETCH_FILE_DETAILS_FAILURE', payload: error.message});
    }
};

export const downloadFile = (cid, fileHash, navigate) => async (dispatch) => {
    dispatch({type: 'DOWNLOAD_FILE_REQUEST'});

    const token = localStorage.getItem('jwtToken');
    if (!token) {
        console.error('No JWT token found in local storage.');
        navigate('/');
        return;
    }

    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/download/${cid}`, {
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
        link.setAttribute('download', `${fileHash}.txt`);
        document.body.appendChild(link);
        link.click();
        link.remove();

        dispatch({type: 'DOWNLOAD_FILE_SUCCESS'});
    } catch (error) {
        dispatch({type: 'DOWNLOAD_FILE_FAILURE', payload: error.message});
    }
};
