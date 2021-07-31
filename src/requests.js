import axios from 'axios';

export const getData = (query) => axios.get(`https://mock-rest.herokuapp.com/api/bills?${query}`);
