import http from "../../utils/axios";
import type {
  IRouteFileList,
  IShipmentDetail,
  IShipmentMap,
  IShipmentType,
  IUploadSelectOptions
} from "./shipment.type.ts";

export const getShipments = (data) =>
  http.post<{ list: IShipmentType[] }>({ data, url: `/web/order` });

export const getShipmentDetail = (order: string) =>
  http.get<IShipmentDetail>({ url: `/web/order/${order}` });

export const getShipmentDetailFile = (order: string, data) =>
  http.post<{ list: IRouteFileList[] }>({ url: `/web/order/${order}/file`, data });

export const getShipmentMap = (order?: string) =>
  http.get<IShipmentMap>({ url: `/web/order/${order}/map` });

export function getUploadUsers(data) {
  return http.post<IUploadSelectOptions[]>({ url: "/web/uploadUsers", data });
}
