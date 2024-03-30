# Front-end Documentation

## Overview

This documentation provides an overview of the front-end structure and key components for a web application that integrates with Ethereum blockchain using MetaMask for authentication and file handling operations such as upload and download. The application is built using React, Redux for state management, and Web3.js for interacting with Ethereum.

## Project Structure

The project is organized as follows:
- **src/**
    - **assets/**: Static assets like images.
    - **components/**: Reusable UI components.
    - **contracts/**: Smart contract JSON files.
    - **hooks/**: Custom React hooks.
    - **redux/**: Redux setup including actions, reducers, and slices.
    - **App.css**: Global styles.
    - **App.js**: Main application component.
    - **App.test.js**: Tests for the App component.
    - **index.css**: Base CSS.
    - **index.js**: Entry point for React application.
    - **logo.svg**: Application logo.
    - **reportWebVitals.js**: Tool for measuring performance.
    - **setupTests.js**: Setup file for Jest tests.

### Key Components

- **MetaMaskLogin**: Handles MetaMask wallet connection.
- **FileUpload**: Allows users to upload files to the Ethereum blockchain.
- **FileDownload**: Enables users to download files from the Ethereum blockchain.
- **FileRegistry**: Main component that switches between MetaMask login and file upload based on authentication status.

### Hooks

- **useWeb3**: Custom hook for initializing and managing Web3 and user accounts.

### Redux Structure

- **actions**: Contains Redux actions for authentication and file operations.
- **reducers**: Reducers for handling actions related to authentication and file operations.
- **slices**: Uses Redux Toolkit to manage Web3 state.

## Key Functionalities

### MetaMask Authentication

The application uses MetaMask for user authentication. Users are prompted to connect their MetaMask wallet to interact with the application.

### File Upload

Authenticated users can upload files to the Ethereum blockchain. The application initializes a smart contract instance and uses it to store file details.

### File Download

Users can download files from the Ethereum blockchain using a unique content identifier (CID). The application fetches file details from the blockchain and provides a download option.

## Development Best Practices

- **State Management**: Use Redux Toolkit for efficient state management and to reduce boilerplate code.
- **Smart Contract Interaction**: Use Web3.js for interacting with Ethereum blockchain and handling smart contracts.
- **UI Components**: Utilize React functional components and hooks for better performance and code readability.
- **Error Handling**: Implement comprehensive error handling to improve user experience and debug issues effectively.
- **Security**: Ensure secure handling of user authentication and interaction with the blockchain.

## Libraries and Frameworks

- **React**: For building the user interface.
- **Redux and Redux Toolkit**: For state management.
- **Web3.js**: For interacting with Ethereum blockchain.
- **React Router**: For routing and navigation.
- **Tailwind CSS**: For styling components.

## Conclusion

This documentation outlines the structure and functionalities of a React-based front-end application that integrates with the Ethereum blockchain for file handling operations. By following the outlined best practices and utilizing the mentioned libraries and frameworks, developers can efficiently build and maintain blockchain-integrated applications.
