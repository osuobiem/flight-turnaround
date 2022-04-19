import axios from "axios";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const api2BaseUrl = process.env.REACT_APP_API2_BASE_URL;

const routes = {
    getFlights: {
        url: `flights`,
        method: 'get'
    },
    switchTokens: {
        url: 'auth/switch-tokens',
        method: 'post'
    },
    createTeam: {
        url: 'graph/channels',
        method: 'post'
    }
};

export const api = async(route, params = {}, data = {}) => {

    const r = routes[route];

    let config = {
        url: `${apiBaseUrl}/${r.url}`,
        method: r.method,
        params,
        data
    };

    return await axios(config);
}

export const otherApi = async(route, params = {}, data = {}) => {

    const r = routes[route];

    let config = {
        url: `${api2BaseUrl}/${r.url}`,
        method: r.method,
        params,
        data
    };

    return await axios(config);
}