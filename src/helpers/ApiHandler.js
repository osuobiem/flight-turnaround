import axios from "axios";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const api2BaseUrl = process.env.REACT_APP_API2_BASE_URL;

const routes = {
    getFlights: {
        url: `flights`,
        method: 'get'
    },
    getTeams: {
        url: 'airport-teams',
        method: 'get'
    },
    createTeam: {
        url: 'airport-teams',
        method: 'post'
    },

    // Graph Related Endpoints
    switchTokens: {
        url: 'auth/switch-tokens',
        method: 'post'
    },
    createChannel: {
        url: 'graph/channels',
        method: 'post'
    },
    getPeople: {
        url: 'graph/people',
        method: 'get'
    }
};

export const api = async(route, params = {}, data = {}) => {

    const r = (typeof route === 'string') ? routes[route] : route;

    let config = {
        url: `${apiBaseUrl}/${r.url}`,
        method: r.method,
        params,
        data
    };

    return await axios(config);
}

export const graphApi = async(route, params = {}, data = {}) => {

    const r = (typeof route === 'string') ? routes[route] : route;

    let config = {
        url: `${api2BaseUrl}/${r.url}`,
        method: r.method,
        params,
        data
    };

    return await axios(config);
}