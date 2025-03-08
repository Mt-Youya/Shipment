import http from "../../utils/axios";
import { IRouteFileList, IShipmentDetail, IShipmentMap, IShipmentType } from "./shipment.type.ts";

export const getShipments = (data) =>
  http.post<{ list: IShipmentType[] }>({ data, url: `/web/order` });

export const getShipmentDetail = (order: string) =>
  http.get<IShipmentDetail>({ url: `/web/order/${order}` });

export const getShipmentDetailFile = (order: string, data) =>
  http.post<{ list: IRouteFileList[] }>({ url: `/web/order/${order}/file`, data });

export const getShipmentMap = (order: string) =>
  http.get<IShipmentMap>({ url: `/web/order/${order}/map` });
