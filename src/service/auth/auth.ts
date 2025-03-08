import http from "../../utils/axios";
import { ILoginReq, ILoginResult } from "./auth.type";

/**
 * 用户登录
 * @returns
 */
export const login = (data: any) => http.post<ILoginResult>({ data, url: "/web/login" });

/**
 * 刷新token
 * @returns
 */
export const refreshToken = (refreshToken: string) =>
  http.post<Pick<ILoginResult, "accessToken">>({
    data: { refreshToken },
    url: "/auth/refresh"
  });

/**
 * 获取验证码
 */
export const getVerifyCode = (mobile: string) =>
  http.post<boolean>({
    data: { mobile },
    url: "/auth/getSmsCode"
  });
