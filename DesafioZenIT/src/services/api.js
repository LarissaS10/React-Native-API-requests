import axios from 'axios'

//https://dog.ceo/api/breeds/list
//https://dog.ceo/api/breed/%7bra%C3%A7a_escolhida%7d/images/random

//método para a utilização das Api's
const api = axios.create ({
    baseURL: 'https://dog.ceo/api/'
})

export default api