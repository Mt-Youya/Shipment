import http from "../../utils/axios";
import { IPageBaseRes } from "../common.type";
import { IUser, IPageUserReq } from "./user.type";

/**
 * 分页查询会员用户列表
 * @param params
 * @returns
 */
export const getUserPage = (data: IPageUserReq) =>
  http.post<IPageBaseRes<IUser>>({
    data,
    url: "/user/page"
  });

/**
 * 获取会员用户详情
 * @param id
 * @returns
 */
export const getUserDetail = (id: string) =>
  http.get<IUser>({
    url: `/user/detail/${id}`
  });

/**
 * 新增会员用户
 */
export const createUser = (data: IUser) => http.post({ data, url: "/user/create" });

/**
 * 修改会员用户
 */
export const updateUser = (data: IUser) => http.post({ data, url: `/user/update` });

/**
 * 删除会员用户
 * @param id
 * @returns
 */
export const deleteUser = (id: string) => http.post({ url: `/user/delete/${id}` });

/**
 * 获取所有的会员用户
 * @returns
 */
export const getAllUser = (data?: Partial<IUser>) => http.post<IUser[]>({ url: "/user/all", data });
