// src/redux/store.js
import {configureStore} from '@reduxjs/toolkit';
import fileReducer from './reducers/fileReducer';
import authReducer from './reducers/authReducer';
import web3Reducer from './slices/web3Slice';

const store = configureStore({
    reducer: {
        auth: authReducer, file: fileReducer, web3: web3Reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['FETCH_FILE_DETAILS_SUCCESS', 'DOWNLOAD_FILE_REQUEST', 'DOWNLOAD_FILE_SUCCESS', 'DOWNLOAD_FILE_FAILURE'],
                ignoredPaths: ['file.fileDetails'],
            },
        }),
});

export default store;
