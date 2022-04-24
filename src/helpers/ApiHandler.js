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
    createAirportTeam: {
        url: 'airport-teams',
        method: 'post'
    },
    getStations: {
        url: 'flight/stations',
        method: 'get'
    },

    // Graph Related Endpoints
    switchTokens: {
        url: 'auth/switch-tokens',
        method: 'post'
    },
    createTeam: {
        url: 'graph/teams',
        method: 'post'
    },
    getUsers: {
        url: 'graph/users',
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