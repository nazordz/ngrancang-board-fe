import { getAccessToken,  refreshToken } from "@/services/AuthenticationService";
import Axios from "axios";
import { setupCache } from "axios-cache-interceptor";

const axiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

axiosInstance.interceptors.request.use(function (config) {
  const accessToken = getAccessToken();
  if (config.headers && accessToken) {
    config.headers["Authorization"] = "Bearer " + accessToken;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  null,
  async function(error){
    const errorStatus = error.response.data.status
    const config = error?.config;

    if (errorStatus == 'TOKEN_EXPIRED') {
      config.sent = true;
      try {
        const data = await refreshToken()

        config.headers['Authorization'] = 'Bearer ' + data.access_token
        return Axios(config);
      } catch (error) {
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }
    return Promise.reject(error);
  }
)

const http = setupCache(axiosInstance);


export default http;
