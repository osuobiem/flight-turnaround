import axios from 'axios';

const routes = {
    getToken: {
        url: `${process.env.REACT_APP_NODE_SERVER}/auth`,
        method: 'get'
    }
};

export const serverReq = async route => {

    const r = routes[route];

    return await axios[r.method](r.url)
        .then(res => res.data.data.access_token)
        .catch(err => {
            console.error(err);
            return err;
        })

}