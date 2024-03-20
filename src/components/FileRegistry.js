import React, {useState, useEffect} from 'react';
import Web3 from 'web3';


const FileRegistry = () => {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
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
        const loadBlockchainData = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);

                try {
                    const accs = await web3Instance.eth.requestAccounts();
                    setAccounts(accs);
                    const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
                    setContract(contractInstance);
                } catch (error) {
                    console.error("Error loading blockchain data:", error);
                }
            } else {
                alert('MetaMask is not installed!');
            }
        };

        loadBlockchainData();
        const token = localStorage.getItem('jwtToken');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const authenticateUser = async () => {
        if (!accounts.length) {
            alert('Please connect your MetaMask wallet first.');
            return;
        }

        try {
            // Request a nonce from the server
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/generateNonce`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ethereumAddress: accounts[0]}),
            });
            const data = await response.json();
            const nonce = data.nonce;

            // Sign the nonce with MetaMask
            const signature = await web3.eth.personal.sign(nonce, accounts[0], '');

            // Send the signature and Ethereum address to the server for verification
            const verifyResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/verifySignature`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ethereumAddress: accounts[0], signature, message: nonce}),
            });
            const verifyData = await verifyResponse.json();
            if (verifyData.token) {
                localStorage.setItem('jwtToken', verifyData.token);
                setIsAuthenticated(true);
                console.log("Authentication successful, JWT token stored.");
            } else {
                throw new Error('Authentication failed');
            }
        } catch (error) {
            console.error('Error during authentication:', error);
            alert('Authentication failed.');
        }
    };
    // Function to fetch data from the test endpoint
    const fetchTestData = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error('No JWT token found in local storage.');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/checkToken`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch test data');
            }

            const data = await response.json();
            console.log('Test data:', data);
            // You can set the test data to state and render it in your component
        } catch (error) {
            console.error('Error fetching test data:', error);
        }
    };

    // Call the fetchTestData function when the component mounts
    useEffect(() => {
        if (isAuthenticated) {
            fetchTestData();
        }
    }, [isAuthenticated]);

    return (
        <div>
            <button onClick={authenticateUser}>Authenticate with MetaMask</button>
            {isAuthenticated && <div>User is authenticated</div>}
        </div>
    );
};

export default FileRegistry;
