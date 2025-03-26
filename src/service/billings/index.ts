import http from "../../utils/axios";

import type { IBillingDetail } from "./billing.type.ts";

export const getBillings = (data?: any) => http.post({ data, url: `/web/charge` });

export const getBillingDetail = (chargeId: string) =>
  http.get<IBillingDetail>({ url: `/web/charge/${chargeId}` });
