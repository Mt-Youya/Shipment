import axios, {
  AxiosResponse,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosInstance
} from "axios";
import { HttpCodeConfig } from "./httpCode";
import { ResponseModel, UploadFileItemModel, UploadRequestConfig } from "./types";
import { notification } from "antd";
import { Token } from "./token";
import { createBrowserRouter, useNavigate } from "react-router-dom";
import { Local, Session } from "../storage.ts";

class HttpRequest {
  service: AxiosInstance;

  constructor() {
    this.service = axios.create({
      baseURL: import.meta.env.VITE_APP_BASE_URL,
      timeout: 15 * 1000
    });
    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.headers.Authorization = Token.getToken();
        return config;
      },
      (error: AxiosError) => {
        console.log("requestError: ", error);
        return Promise.reject(error);
      },
      {
        synchronous: true
      }
    );

    this.service.interceptors.response.use(
      async (response: AxiosResponse<ResponseModel>): Promise<any> => {
        const { data } = response;
        const { code, msg } = data;
        if (code !== undefined) {
          if (code !== HttpCodeConfig.success) {
            notification.open({
              type: "error",
              message: "接口出错",
              description: msg,
              duration: 3
            });
            if (
              code === HttpCodeConfig.REFRESH_TOKEN_UNVALID &&
              window.location.pathname !== "/login"
            ) {
              Token.logout();
            }
            return Promise.reject(data.msg);
          } else {
            return data.data;
          }
        } else if (code === 401) {
          Session.clear();
          Local.clear();
          location.reload();
          return;
        } else {
          return Promise.reject(new Error("Error! code missing!"));
        }
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    /**
     * TODO: execute other methods according to config
     */
    return new Promise((resolve, reject) => {
      try {
        this.service
          .request<T>(config)
          .then((res: AxiosResponse["data"]) => {
            resolve(res as T);
          })
          .catch((err) => {
            // do something
            reject(err);
          });
      } catch (err) {
        return Promise.reject(err);
      }
    });
  }

  get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ method: "GET", ...config });
  }

  post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ method: "POST", ...config });
  }

  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ method: "PUT", ...config });
  }

  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ method: "DELETE", ...config });
  }

  upload<T = string>(
    fileItem: UploadFileItemModel,
    config?: UploadRequestConfig
  ): Promise<T> | null {
    if (!import.meta.env.VITE_UPLOAD_URL) return null;

    const fd = new FormData();
    fd.append(fileItem.name, fileItem.value);
    let configCopy: UploadRequestConfig;
    if (!config) {
      configCopy = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
    } else {
      config.headers!["Content-Type"] = "multipart/form-data";
      configCopy = config;
    }
    return this.request({
      url: import.meta.env.VITE_UPLOAD_URL,
      data: fd,
      ...configCopy
    });
  }
}

const httpRequest = new HttpRequest();
export default httpRequest;
