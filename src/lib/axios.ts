import baseAxios from 'axios';

export const axios = baseAxios.create({
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('session_id')
    }
});