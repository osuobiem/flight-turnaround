import * as msal from "@azure/msal-browser";

const msalConfig = {
    auth: {
        clientId: process.env.REACT_APP_CLIENT_ID
    }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);
export default msalInstance;