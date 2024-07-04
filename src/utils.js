import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:8080",
  baseURL: `${process.env.REACT_APP_SERVER_LINK}`,
});
// axiosInstance.interceptors.request.use((config)=>{
//   const token='fe453042-4eb3-463c-a2e2-06436acd57df';
//   if(token){
//     config.headers['Authorization']=`Bearer ${token}`;
//   }
//   return config;
// },(error)=>{
//   return Promise.reject(error);
// }
// );

export default axiosInstance; 