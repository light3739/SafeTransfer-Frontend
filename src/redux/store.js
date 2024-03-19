// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import fileReducer from './reducers/fileReducer';

const store = configureStore({
    reducer: {
        file: fileReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
