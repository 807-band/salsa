import React from 'react';
import ReactDOM from 'react-dom';
import './styles/global.scss';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import HttpsRedirect from 'react-https-redirect';
import App from './App';
import { msalConfig } from './authConfig';

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <HttpsRedirect>
        <App />
      </HttpsRedirect>
    </MsalProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
