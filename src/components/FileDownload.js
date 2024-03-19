import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';

const FileDownload = () => {
    const [cid, setCid] = useState('');
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [fileDetails, setFileDetails] = useState(null);
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

                    // Initialize the contract
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

    const fetchFileDetails = async () => {
        if (!contract || !cid) return;

        console.log("Fetching details for CID:", cid);

        try {
            // Get the file hash associated with the CID
            const fileHash = await contract.methods.getFileHash(cid).call();

            const details = await contract.methods.getFileDetails(fileHash).call();
            setFileDetails(details);
            console.log('File details fetched successfully:', details);

            // Proceed with file download after fetching file details
            await downloadFile();
        } catch (error) {
            console.error('Error fetching file details:', error);
            alert('Failed to fetch file details. File may not be registered.');
        }
    };

    const downloadFile = async () => {
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
            link.setAttribute('download', `${fileDetails.fileHash}.txt`); // Specify the desired file name and extension
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading file:', error);
            // You can handle the error as needed (e.g., display an error message)
        }
    };

    const handleDownload = async () => {
        if (!cid) {
            alert('Please enter a CID.');
            return;
        }

        await fetchFileDetails();
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
