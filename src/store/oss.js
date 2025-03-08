import { create } from "zustand";
import { uploadTokenAPI } from "../service/shipmentAPI";
import OSS from "ali-oss";

export async function getOSSClient() {
  const ossToken = await uploadTokenAPI();
  return new OSS({
    stsToken: ossToken.token.body.credentials.securityToken,
    accessKeyId: ossToken.token.body.credentials.accessKeyId,
    accessKeySecret: ossToken.token.body.credentials.accessKeySecret,
    region: "us-east-1",
    bucket: "hans-us",
    endpoint: "oss-us-east-1.aliyuncs.com"
  });
}

export const OssStore = create((set) => ({
  ossToken: null,
  setOssToken: (token) => set({ ossToken: token }),
  client: null,
  setClient: (client) => set({ client })
}));
