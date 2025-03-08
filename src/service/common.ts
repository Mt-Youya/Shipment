import http from "../utils/axios";
import type { IDropdownData } from "./common.type.ts";

export function upload(upload_type: number, files: any[], order_id: string) {
  const params = {
    upload_type,
    file: files,
    order_id
  };
  return http.post<string[]>({
    url: `/web/upload`,
    data: params
  });
}

export function uploadLog(data) {
  return http.post<string[]>({
    url: `/web/uploadLog`,
    data
  });
}

export function getDropdown() {
  return http.get<IDropdownData>({ url: `/web/dropdown` });
}
