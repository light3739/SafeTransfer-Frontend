// src/redux/reducers/fileReducer.js
const initialState = {
    selectedFile: null,
    fileDetails: null,
    loading: false,
    error: null,
};

const fileReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SELECT_FILE':
            return { ...state, selectedFile: { ...action.payload } };
        case 'UPLOAD_FILE_REQUEST':
        case 'FETCH_FILE_DETAILS_REQUEST':
        case 'DOWNLOAD_FILE_REQUEST':
            return { ...state, loading: true, error: null };
        case 'UPLOAD_FILE_SUCCESS':
            return { ...state, selectedFile: null, loading: false };
        case 'FETCH_FILE_DETAILS_SUCCESS':
            return { ...state, fileDetails: action.payload, loading: false };
        case 'DOWNLOAD_FILE_SUCCESS':
            return { ...state, loading: false };
        case 'UPLOAD_FILE_FAILURE':
        case 'FETCH_FILE_DETAILS_FAILURE':
        case 'DOWNLOAD_FILE_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default fileReducer;
