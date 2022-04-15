import axios from 'axios';

const graphApiUrl = process.env.REACT_APP_GRAPH_API_URL;
const teamId = process.env.REACT_APP_TEAM_ID;

const routes = {
    createChannel: {
        url: `/teams/${teamId}/channels`,
        method: 'post'
    },
    getPeople: {
        url: `/me/people`,
        method: 'get'
    }
};

const config = {
    baseURL: graphApiUrl,
}

export const graphApi = async(route, appToken, data = {}) => {

    config.headers = { 'Authorization': `Bearer ${appToken}` };

    // Make Graph API request
    const r = routes[route];
    console.log(config)

    return await axios[r.method](graphApiUrl + r.url, data, config);

}