// src/redux/store.js
import {configureStore} from '@reduxjs/toolkit';
import fileReducer from './reducers/fileReducer';
import authReducer from './reducers/authReducer';
import web3Reducer from './slices/web3Slice';

const store = configureStore({
    reducer: {
        auth: authReducer, file: fileReducer, web3 : web3Reducer
    }, middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
