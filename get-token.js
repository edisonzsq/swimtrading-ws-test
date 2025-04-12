const axios = require('axios');
require('dotenv').config();
async function getAuthToken() {
  try {
    // Step 1: Get session token
    console.log("Getting Session Token...");
    const sessionResponse = await axios.post(`${process.env.TASTY_API_URL}/sessions`, {
      login: process.env.USERNAME,
      password: process.env.PASSWORD,
      "remember-me": true
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Extract session token from response
    const sessionToken = sessionResponse.data.data["session-token"];
    console.log("Session Token:",sessionToken);

    // Step 2: Get auth token using session token
    console.log("Getting Auth Token...");
    const authResponse = await axios.get(`${process.env.TASTY_API_URL}/api-quote-tokens`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': sessionToken
      }
    });

    return authResponse.data;

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// Usage
getAuthToken()
  .then(result => {
    console.log('Auth Token:', result.data.token);
  })
  .catch(error => {
    console.error('Failed to get auth token:', error);
  });