// src/redux/actions/authActions.js

export const authenticateUser = (web3, account) => async (dispatch) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BACK_END_API_BASE_URL}/generateNonce`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ethereumAddress: account}),
        });
        const data = await response.json();
        const nonce = data.nonce;

        const signature = await web3.eth.personal.sign(nonce, account, '');

        const verifyResponse = await fetch(`${process.env.REACT_APP_BACK_END_API_BASE_URL}/verifySignature`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ethereumAddress: account, signature, message: nonce}),
        });
        const verifyData = await verifyResponse.json();
        if (verifyData.token) {
            localStorage.setItem('jwtToken', verifyData.token);
            dispatch({type: 'AUTHENTICATE_USER_SUCCESS'});
            console.log("Authentication successful, JWT token stored.");
        } else {
            console.error('Authentication failed');
            dispatch({type: 'AUTHENTICATE_USER_FAILURE'});
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        alert('Authentication failed.');
        dispatch({type: 'AUTHENTICATE_USER_FAILURE'});
    }
};


export const checkAuthToken = () => async (dispatch) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        console.error('No JWT token found in local storage.');
        dispatch({type: 'AUTHENTICATE_USER_FAILURE'});
        return;
    }

    try {
        const response = await fetch(`${process.env.REACT_APP_BACK_END_API_BASE_URL}/checkToken`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            dispatch({type: 'AUTHENTICATE_USER_SUCCESS'});
        } else {
            console.error('Token validation failed');
            dispatch({type: 'AUTHENTICATE_USER_FAILURE'});
        }
    } catch (error) {
        console.error('Error validating token:', error);
        dispatch({type: 'AUTHENTICATE_USER_FAILURE'});
    }
};

