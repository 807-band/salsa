require('dotenv').config();

export const msalConfig = {
  auth: {
    clientId: '1cbeb08d-14bd-47e1-b92a-0a9ab28bf3bf',
    authority: 'https://login.microsoftonline.com/1b0d02db-fc9e-4495-9537-1d379cca2ae7',
    redirectUri: process.env.REACT_APP_AZURE_REDIRECT,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ['User.Read'],
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};
