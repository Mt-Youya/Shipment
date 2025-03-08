import { EStaffType, EStatus } from "../../enums/common";
import { IModelBase, IPageBaseReq } from "../common.type";

export interface IStaff extends IModelBase {
  merId: string;
  type: EStaffType;
  status: EStatus;
  loginAccount: string;
  loginPwd: string;
  nickname: string;
  avatar: string;
  roleIds: string[];
  lastLoginTime: string;
  lastLoginIP: string;
  isSuper: boolean;
}

export type IPageStaffReq = IPageBaseReq & Partial<Pick<IStaff, "nickname" | "status">>;

export interface ILoginRes {
  token: string;
}
