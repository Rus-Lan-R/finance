import axios, { AxiosRequestConfig } from "axios";
import * as Cookies from "js-cookie";
import { Handlers } from "@/helpers/handlers";
import { ApiParams } from "./types";

const Url: string = process.env.REACT_APP_BASE_URL || "";

export class ServiceBase {
  protected static CreateAxiosResponseInterceptor(config: AxiosRequestConfig) {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!Cookies.get("accessToken") || error.response.status !== 401) {
          return Promise.reject(error);
        }

        axios.interceptors.response.eject(interceptor);

        const accessToken = Cookies.get("accessToken");
        const refreshToken = Cookies.get("refreshToken");

        return axios
          .get(`${this.authBaseURL}/v1/password/reset`, {
            data: {
              access_token: accessToken,
              refresh_token: refreshToken,
            },
          })
          .then((response) => {
            Cookies.set("accessToken", response.data.accessToken);
            Cookies.set("refreshToken", response.data.refreshToken);
            error.response.config.headers.Authorization = `Bearer ${response.data.access_token}`;
            return axios(error.response.config);
          })
          .catch((error) => {
            Cookies.set("accessToken", "");
            Cookies.set("refreshToken", "");
            window.location.assign("/login");
            return Promise.reject(error);
          })
          .finally(() => {
            this.CreateAxiosResponseInterceptor(config);
          });
      }
    );
  }

  protected static async callApi({
                                   data = null,
                                   method,
                                   url,
                                   baseURL,
                                   contentType,
                                   params,
                                 }: ApiParams) {
    const config: AxiosRequestConfig = {
      baseURL,
      data,
      method,
      url,
      params,
      withCredentials: false,
    };
    if (!config.baseURL) config.baseURL = baseURL || Url;

    if (url !== "/login" && Cookies.get("accessToken")) {
      const token = Cookies.get("accessToken");
      config.headers = {
        Authorization: "Bearer " + token,
      };
    }
    if (contentType) {
      config.headers = {
        "content-type": contentType,
      };
    }

    try {
      this.CreateAxiosResponseInterceptor(config);
      const response = await axios.request(config);
      return response.data;
    } catch (error: any) {
      if (Object.prototype.hasOwnProperty.call(error, "response")) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        Handlers.defaultErrorAPIHandler(
          error.response.data.error != null
            ? error.response.data.error
            : error.response.data,
          error.response.status
        );
        throw new Error(error.response.data.error);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        Handlers.defaultErrorHandler(
          "Произошла ошибка при отправлении запроса, либо сервер не ответил вовремя"
        );
        throw new Error(error);
      } else {
        // handlers.defaultErrorHandler(error.message);
        // Something happened in setting up the request that triggered an Error
      }
    }
  }
  private static authBaseURL =
    "https://master-yamaha-user-access-module.yamaha.dev-kodix.ru";

}
