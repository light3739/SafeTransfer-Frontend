import React from 'react';
import {render, screen} from '@testing-library/react';
import MetaMaskLogin from '../MetaMaskLogin'; // Adjust the import path based on the file location

test('renders MetaMaskLogin component', () => {
    render(<MetaMaskLogin/>);
    expect(screen.getByText(/Connect to MetaMask/i)).toBeInTheDocument();
});
