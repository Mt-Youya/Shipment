import http from "../../utils/axios";
import { IPageBaseRes } from "../common.type";
import { IStaff, IPageStaffReq } from "./staff.type";

/**
 * 分页查询人员列表
 * @param params
 * @returns
 */
export const getStaffPage = (data: IPageStaffReq) =>
  http.post<IPageBaseRes<IStaff>>({
    data,
    url: "/staff/page"
  });

/**
 * 获取人员详情
 * @param id
 * @returns
 */
export const getStaffDetail = (id: string) =>
  http.get<IStaff>({
    url: `/staff/detail/${id}`
  });

/**
 * 新增人员
 */
export const createStaff = (data: IStaff) => http.post({ data, url: "/staff/create" });

/**
 * 修改人员
 */
export const updateStaff = (data: IStaff) => http.post({ data, url: `/staff/update` });

/**
 * 删除人员
 * @param id
 * @returns
 */
export const deleteStaff = (id: string) => http.post({ url: `/staff/delete/${id}` });

/**
 * 获取所有的人员
 * @returns
 */
export const getAllStaff = (data?: Partial<IStaff>) =>
  http.post<IStaff[]>({ url: "/staff/all", data });

/**
 * 获取当前登录用户详情
 * @returns
 */
export const getCurrentStaff = () =>
  http.get<IStaff>({
    url: `/staff/current`
  });

/**
 * 重置用户密码
 * @returns
 */
export const resetPwd = (id: string) =>
  http.get<IStaff>({
    url: `/staff/reset/${id}`
  });

/**
 * 修改用户角色
 * @returns
 */
export const updateRoles = (id: string, roleIds: string[]) =>
  http.post<boolean>({
    data: { id, roleIds },
    url: `/staff/roles`
  });

/**
 * 修改密码
 * @returns
 */
export const changePwd = (newPwd: string, oldPwd: string) =>
  http.post<boolean>({
    data: { newPwd, oldPwd },
    url: `/staff/pwd`
  });
