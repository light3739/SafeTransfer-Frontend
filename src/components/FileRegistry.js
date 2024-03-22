// src/components/FileRegistry.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useWeb3 from '../hooks/useWeb3';
import { authenticateUser, fetchTestData } from '../redux/actions/authActions';
import MetaMaskLogin from './MetaMaskLogin';

const FileRegistry = () => {
    const { web3, accounts, connectToMetaMask } = useWeb3();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchTestData());
        }
    }, [dispatch, isAuthenticated]);

    const handleAuthenticateUser = () => {
        if (!accounts.length) {
            connectToMetaMask();
            return;
        }
        dispatch(authenticateUser(web3, accounts[0]));
    };

    return (
        <div>
            {!isAuthenticated ? (
                <MetaMaskLogin onConnect={handleAuthenticateUser} />
            ) : (
                <div>
                    <p className="text-green-500 mb-4">User is authenticated</p>
                    {/* Add your file upload and download components here */}
                </div>
            )}
        </div>
    );
};

export default FileRegistry;
