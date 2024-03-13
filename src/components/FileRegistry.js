import React, {useState, useEffect} from 'react';
import Web3 from 'web3';

const FileRegistry = () => {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [fileHash, setFileHash] = useState('');
    const [metadata, setMetadata] = useState('');
    const [fileDetails, setFileDetails] = useState(null);

    // Smart contract details
    const contractAddress = '0x4577d7d81ea11657885784faf2a4edb8fd97e04b';
    const abi = [
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
                    "name": "fileHash",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "metadata",
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
                    "name": "",
                    "type": "string"
                }
            ],
            "name": "files",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "metadata",
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
                },
                {
                    "internalType": "string",
                    "name": "metadata",
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
                            "name": "metadata",
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
        }
    ];

    useEffect(() => {
        if (window.ethereum) {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);

            const loadBlockchainData = async () => {
                const accs = await web3Instance.eth.requestAccounts();
                setAccounts(accs);

                const contractInstance = new web3Instance.eth.Contract(abi, contractAddress);
                setContract(contractInstance);
            };

            loadBlockchainData();
        } else {
            alert('MetaMask is not installed!');
        }
    }, []);

    const registerFile = async () => {
        if (!contract) return;

        console.log("Attempting to register file with hash:", fileHash, "and metadata:", metadata);

        try {
            await contract.methods.registerFile(fileHash, metadata).send({from: accounts[0]});
            alert('File registered successfully!');
        } catch (error) {
            console.error('Error registering file:', error);
            alert('Failed to register file.');
        }
    };

    const fetchFileDetails = async () => {
        if (!contract) return;

        console.log("Fetching details for file hash:", fileHash);

        try {
            const details = await contract.methods.getFileDetails(fileHash).call();
            setFileDetails(details);
            console.log('File details fetched successfully:', details);
        } catch (error) {
            console.error('Error fetching file details:', error);
            alert('Failed to fetch file details.');
        }
    };

    return (
        <div>
            <input type="text" value={fileHash} onChange={(e) => setFileHash(e.target.value)} placeholder="File Hash"/>
            <input type="text" value={metadata} onChange={(e) => setMetadata(e.target.value)} placeholder="Metadata"/>
            <button onClick={registerFile}>Register File</button>
            <button onClick={fetchFileDetails}>Fetch File Details</button>
            {fileDetails && (
                <div>
                    <p>Owner: {fileDetails.owner}</p>
                    <p>Metadata: {fileDetails.metadata}</p>
                    {/* Convert BigInt to String for safe display */}
                    <p>Timestamp: {new Date(parseInt(fileDetails.timestamp, 10) * 1000).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
};

export default FileRegistry;
