import axios, { AxiosInstance, AxiosResponse } from "axios";

const axiosClient: AxiosInstance= axios.create({
  baseURL: 'http://ec2-43-206-233-247.ap-northeast-1.compute.amazonaws.com:3000',
  // baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
  responseType: 'json',
})

export default axiosClient