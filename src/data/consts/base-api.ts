import { deleteToken, getToken } from '@/app/auth/action'
import axios from 'axios'

const baseApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const baseApiToken = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
})

baseApiToken.interceptors.request.use(
  async (config) => {
    const token = await getToken()
    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (err) => {
    return Promise.reject(err)
  },
)

baseApiToken.interceptors.response.use(
  (res) => {
    return res
  },
  async (err) => {
    if (err.response && err.response.status === 401) {
      await deleteToken()
    }
    return Promise.reject(err)
  },
)

export { baseApi, baseApiToken }
