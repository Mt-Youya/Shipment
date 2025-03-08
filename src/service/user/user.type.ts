import { EUserStatus } from "../../enums/core.enum";
import { IModelBase, IPageBaseReq } from "../common.type";
import { ILead } from "../lead/lead.type";
import { IReceive } from "../receive/receive.type";

export interface IUser extends IModelBase {
  name: string;
  mobile: string;
  sourceType: string;
  sourceChannel: string;
  status: EUserStatus;
  receives: IReceive[];
  lead: ILead;
}

export type IPageUserReq = IPageBaseReq & Partial<Pick<IUser, "name" | "mobile" | "remark">>;
