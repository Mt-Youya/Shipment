import http from "../../utils/axios";


/**
 * 订舱列表
 * @param id
 * @returns
 */

export const shipmentAPI = (data: any) => http.post({ data, url: "/web/booking/_search" });
export const bookingAddAPI = (data: any) => http.post({ data, url: "/web/booking" });
export const taskAPI = (data: any) => http.post({ data, url: "/web/task" });
export const fileAPI = (data: any) => http.post({ data, url: "/web/file" });
export const companyAPI = () => http.get({ url: "/web/company" });
export const indexOrderAPI = (data: { sort_type: string; sort: string; }) => http.post({ data, url: "/web/indexOrder" });
export const noticeAPI = (data: any) => http.post({ data, url: "/web/notice" });
export const indexAPI = (data:any) => http.post({data, url: "/web/index" });
export const uploadAPI = (data: any) => http.post({ data, url: "/web/upload" });
export const uploadLogAPI = (data: any) => http.post({ data, url: "/web/uploadLog" });
export const uploadTokenAPI = () => http.get({ url: "/web/uploadToken" });
export const bookingListAPI = (id: string) => http.get({ url: `/web/booking/${id}`});
export const bookingUpdateAPI = (data: any,id:Number) => http.put({ url: `/web/booking/${id}`,data});
export const companyContractAPI = (data: any) => http.post({ data, url: "/web/companyContract" });
export const dropdownAPI = () => http.get({ url: "/web/dropdown" });






