// src/components/FileUpload.js

import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const navigate = useNavigate();
    const contractAddress = '0xF5fcaD7E80AFee336dF0d8026d63697038e18504';
    const contractABI = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "cid",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "fileHash",
                    "type": "string"
                }
            ],
            "name": "FileRegistered",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "cid",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "fileHash",
                    "type": "string"
                }
            ],
            "name": "registerFile",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "name": "cidToFileHash",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "name": "fileDetails",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "fileHash",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "fileHash",
                    "type": "string"
                }
            ],
            "name": "getFileDetails",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        },
                        {
                            "internalType": "string",
                            "name": "fileHash",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "timestamp",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct FileRegistry.FileDetails",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "cid",
                    "type": "string"
                }
            ],
            "name": "getFileHash",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    useEffect(() => {
        const initializeWeb3 = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);

                try {
                    await window.ethereum.enable();
                    const accounts = await web3Instance.eth.getAccounts();
                    setAccounts(accounts);

                    const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
                    setContract(contractInstance);
                } catch (error) {
                    console.error('Error initializing Web3:', error);
                }
            } else {
                console.error('Web3 not detected');
            }
        };

        initializeWeb3();
    }, []);

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

            // Register the file on the blockchain
            await registerFileOnBlockchain(data.cid, data.originalFileHash);
        } catch (error) {
            console.error('Error uploading file:', error);
            // You can handle the error as needed (e.g., display an error message)
        }
    };

    const registerFileOnBlockchain = async (cid, fileHash) => {
        if (!contract) return;

        console.log("Attempting to register file with CID:", cid, "and file hash:", fileHash);

        try {
            await contract.methods.registerFile(cid, fileHash).send({ from: accounts[0] });
            alert('File registered successfully!');
        } catch (error) {
            console.error('Error registering file:', error);
            alert('Failed to register file.');
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
