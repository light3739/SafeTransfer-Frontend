import React from 'react';
import metamaskLogo from '../assets/metamask-logo.svg';

const MetaMaskLogin = ({ onConnect }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto">
                <img src={metamaskLogo} alt="MetaMask Logo" className="w-16 h-16 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4 text-gray-800">Connect to MetaMask</h2>
                <p className="text-gray-600 mb-8">Please connect your MetaMask wallet to continue.</p>
                <button
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-md transition duration-300 ease-in-out"
                    onClick={onConnect}
                >
                    Connect Wallet
                </button>
            </div>
        </div>
    );
};

export default MetaMaskLogin;
