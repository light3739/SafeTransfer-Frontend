// src/components/FileDownload.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFileDetails } from '../redux/actions/fileActions';
import { FaDownload, FaSpinner } from 'react-icons/fa';

const FileDownload = () => {
  const [cid, setCid] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fileDetails, loading, error } = useSelector((state) => state.file);

  const handleDownload = async () => {
    if (!cid) {
      alert('Please enter a CID.');
      return;
    }

    dispatch(fetchFileDetails(cid, navigate));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-6">Download File</h2>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Enter CID"
            value={cid}
            onChange={(e) => setCid(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleDownload}
          disabled={loading}
          className={`bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-md transition duration-300 ease-in-out w-full ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <FaSpinner className="animate-spin inline mr-2" />
          ) : (
            <FaDownload className="inline mr-2" />
          )}
          {loading ? 'Downloading...' : 'Download'}
        </button>
        {error && <p className="text-red-500 mt-4">Error: {error}</p>}
        {fileDetails && (
          <div className="mt-8">
            <p className="text-lg font-bold mb-2">File Details</p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-left mb-2">
                <span className="font-bold">Owner:</span> {fileDetails.owner}
              </p>
              <p className="text-left mb-2">
                <span className="font-bold">File Hash:</span> {fileDetails.fileHash}
              </p>
              <p className="text-left">
                <span className="font-bold">Timestamp:</span>{' '}
                {new Date(parseInt(fileDetails.timestamp, 10) * 1000).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDownload;
