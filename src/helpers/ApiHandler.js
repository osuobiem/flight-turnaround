import axios from "axios";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const routes = {
    getFlights: {
        url: `api/flights`,
        method: 'get'
    },
    getTeams: {
        url: 'api/airport-teams',
        method: 'get'
    },
    createAirportTeam: {
        url: 'api/airport-teams',
        method: 'post'
    },
    getStations: {
        url: 'api/flight/stations',
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