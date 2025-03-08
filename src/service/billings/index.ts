import http from "../../utils/axios";
import { IBilling, IBillingDetail } from "./billing.type.ts";

export const getBillings = (data: IBilling) => http.post({ data, url: `/web/charge` });

export const getBillingDetail = (chargeId: string) =>
  http.get<IBillingDetail>({ url: `/web/charge/${chargeId}` });
