import axios from 'axios'
export default axios.create({
  baseURL: `http://policy-server:8081`,
})
