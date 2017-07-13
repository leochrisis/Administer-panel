import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',

  validateStatus (status) {
    return status >= 200 && status < 300
  }
})

instance.interceptors.response.use(mergeRedundantData)

export default instance

function mergeRedundantData (response) {
  if (response.data && response.data.data) {
    return Object.assign(response, response.data)
  }

  return response
}
