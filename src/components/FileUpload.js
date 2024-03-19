import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {selectFile, uploadFile} from '../redux/actions/fileActions';
import Web3 from 'web3';
import {unwrapResult} from "@reduxjs/toolkit";
import FileRegistryContract from '../contracts/FileRegistry.json';

const FileUpload = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [fileInput, setFileInput] = useState(null); // New state to hold the file input ref
    const {selectedFile, loading, error} = useSelector((state) => state.file);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        const initializeWeb3AndContract = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);

                try {
                    await window.ethereum.enable();
                    const accounts = await web3Instance.eth.getAccounts();
                    setAccounts(accounts);

                    // Assuming your contract is deployed on a network whose ID is available in FileRegistryContract.networks
                    const networkId = await web3Instance.eth.net.getId();
                    const deployedNetwork = FileRegistryContract.networks[networkId];
                    const contractInstance = new web3Instance.eth.Contract(
                        FileRegistryContract.abi,
                        deployedNetwork && deployedNetwork.address,
                    );
                    setContract(contractInstance);
                } catch (error) {
                    console.error('Error initializing Web3 or contract:', error);
                }
            } else {
                console.error('Web3 not detected');
            }
        };

        initializeWeb3AndContract();
    }, []);
    ;

    const handleFileChange = (event) => {
        dispatch(selectFile(event.target.files[0])); // Store file metadata in Redux
        setFileInput(event.target); // Store the file input ref
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
            const actionResult = await dispatch(uploadFile({file: fileInput.files[0], token, account: accounts[0]}));
            const uploadedData = unwrapResult(actionResult);
            await registerFileOnBlockchain(uploadedData.cid, uploadedData.originalFileHash);
        } catch (error) {
            console.error('Upload or registration failed:', error);
            alert('Upload or registration failed.');
        }
    };

    const registerFileOnBlockchain = async (cid, fileHash) => {
        if (!web3 || !contract || !accounts.length) {
            console.error('Web3, contract, or accounts not initialized');
            alert('Blockchain registration failed. Please ensure your wallet is connected.');
            return;
        }

        console.log("Attempting to register file with CID:", cid, "and file hash:", fileHash);

        try {
            await contract.methods.registerFile(cid, fileHash).send({from: accounts[0]});
            alert('File registered successfully on the blockchain!');
        } catch (error) {
            console.error('Error registering file on the blockchain:', error);
            alert('Failed to register file on the blockchain.');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange}/>
            <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Uploading...' : 'Upload'}
            </button>
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default FileUpload;
