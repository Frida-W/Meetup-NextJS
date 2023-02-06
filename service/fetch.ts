import axios from "axios";
import { message } from 'antd';
const requestInstance = axios.create({
  baseURL: "/",
});

requestInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

requestInstance.interceptors.response.use(
  (response) => {
    if (response?.status === 200) {
      return response?.data;
    } else {
      // return {
      //   code: -1,
      //   msg: "unknown error",
      //   data: null,
      // };
      message.error(response.data);
    }
  },
  (error) => Promise.reject(error)
);

export default requestInstance;
