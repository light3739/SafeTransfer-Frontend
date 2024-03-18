import React, {useState, useEffect} from 'react';
import Web3 from 'web3';

const Blockchain = () => {
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [fileHash, setFileHash] = useState('');
    const [metadata, setMetadata] = useState('');
    const [fileDetails, setFileDetails] = useState(null);

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