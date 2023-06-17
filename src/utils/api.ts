import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://api-deslocamento.herokuapp.com/api/v1',
})
