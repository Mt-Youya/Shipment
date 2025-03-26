import { create } from "zustand";
import { uploadTokenAPI } from "../service/shipmentAPI";
import OSS from "ali-oss";
import { Session } from "@/utils/storage.js";
import formatDateTime from "@/utils/formatDateTime.js";

export async function getOSSClient() {
  const ossToken = await uploadTokenAPI();
  const oss = new OSS({
    stsToken: ossToken.token.body.credentials.securityToken,
    accessKeyId: ossToken.token.body.credentials.accessKeyId,
    accessKeySecret: ossToken.token.body.credentials.accessKeySecret,
    region: "us-east-1",
    bucket: "hans-us",
    endpoint: "oss-us-east-1.aliyuncs.com"
  });

  Session.set("ossTimer", +new Date());
  OssStore.setState(() => ({
    ossToken: ossToken,
    expiration: +new Date(formatDateTime(ossToken.token.body.credentials.expiration)),
    client: oss
  }));
  return oss;
}

export const OssStore = create((set) => ({
  ossToken: null,
  setOssToken: (token) => set({ ossToken: token }),
  expiration: 0,
  setExpiration: (expiration) => set({ expiration }),
  client: null,
  setClient: (client) => set({ client })
}));
