import axios from "axios";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const routes = {
    getFlights: {
        url: `/flights`,
        method: 'get'
    },
};

export const api = async(route, params = {}, data = {}) => {

    const r = routes[route];

    let config = {
        url: `${apiBaseUrl}/flights`,
        method: r.method,
        params,
        data
    };

    return await axios(config);
}