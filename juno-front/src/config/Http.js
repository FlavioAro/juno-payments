import Axios from 'axios'

const apiUrl = 'http://localhost:8080/'

export const Http = Axios.create({
    baseURL: apiUrl
})