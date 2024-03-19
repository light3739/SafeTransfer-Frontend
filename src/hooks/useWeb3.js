// src/hooks/useWeb3.js

import { useState, useEffect } from 'react';
import Web3 from 'web3';

const useWeb3 = () => {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const initializeWeb3 = async () => {
            if (window.ethereum) {
                try {
                    // Request account access
                    await window.ethereum.request({ method: 'eth_requestAccounts' });

                    // Create Web3 instance
                    const web3Instance = new Web3(window.ethereum);
                    setWeb3(web3Instance);

                    // Get accounts
                    const fetchedAccounts = await web3Instance.eth.getAccounts();
                    setAccounts(fetchedAccounts);

                    // Listen for account changes
                    window.ethereum.on('accountsChanged', handleAccountsChanged);
                } catch (error) {
                    console.error('Error initializing Web3:', error);
                }
            } else {
                console.error('Web3 not detected');
            }
        };

        const handleAccountsChanged = (newAccounts) => {
            setAccounts(newAccounts);
        };

        initializeWeb3();

        // Clean up the listener when the component unmounts
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }, []);

    return { web3, accounts };
};

export default useWeb3;
