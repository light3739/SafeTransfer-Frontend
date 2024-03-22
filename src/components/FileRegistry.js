import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import useWeb3 from '../hooks/useWeb3';
import {authenticateUser, checkAuthToken} from '../redux/actions/authActions';
import MetaMaskLogin from './MetaMaskLogin';
import FileUpload from './FileUpload';

const FileRegistry = () => {
    const {web3, accounts, connectToMetaMask} = useWeb3();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        dispatch(checkAuthToken()).then(() => {
            if (!isAuthenticated && accounts.length > 0) {
                dispatch(authenticateUser(web3, accounts[0]));
            }
        });
    }, [dispatch, web3, accounts, isAuthenticated]);

    const handleAuthenticateUser = () => {
        if (!accounts.length) {
            connectToMetaMask();
        } else {
            dispatch(authenticateUser(web3, accounts[0]));
        }
    };

    return (
        <div>
            {!isAuthenticated ? (
                <MetaMaskLogin onConnect={handleAuthenticateUser}/>
            ) : (
                <FileUpload/>
            )}
        </div>
    );
};

export default FileRegistry;
