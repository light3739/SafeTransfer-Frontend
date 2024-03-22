// src/redux/reducers/authReducer.js

const initialState = {
    isAuthenticated: false,
    testData: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'AUTHENTICATE_USER_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
            };
        case 'AUTHENTICATE_USER_FAILURE':
            return {
                ...state,
                isAuthenticated: false,
            };
        case 'FETCH_TEST_DATA_SUCCESS':
            return {
                ...state,
                testData: action.payload,
            };
        case 'FETCH_TEST_DATA_FAILURE':
            return {
                ...state,
                testData: null,
            };
        default:
            return state;
    }
};

export default authReducer;
