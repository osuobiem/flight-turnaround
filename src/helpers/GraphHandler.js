import axios from 'axios';

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

export const graphApi = async(route, client, data = {}) => {

    // Make Graph API request
    const r = routes[route];

    return await r.method === 'get' ? client.api(r.url).get() : client.api(r.url).post(data);
}