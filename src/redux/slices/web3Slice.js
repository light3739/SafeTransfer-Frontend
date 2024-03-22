// src/redux/slices/web3Slice.js
import { createSlice } from '@reduxjs/toolkit';

const web3Slice = createSlice({
    name: 'web3',
    initialState: {
        selectedAccount: null,
    },
    reducers: {
        setSelectedAccount: (state, action) => {
            state.selectedAccount = action.payload;
        },
    },
});

export const { setSelectedAccount } = web3Slice.actions;

export default web3Slice.reducer;
