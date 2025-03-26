import { useEffect, useState } from "react";
import { getOSSClient, OssStore } from "../store/oss";
import { upload } from "../service/common.ts";
import { getFileType } from "../utils/getFileInfo.ts";
import { Session } from "../utils/storage.ts";

export function useOssUploadFile(upload_type, id, onFinish, onError, path = "uploads/") {
  const { client, setClient, expiration } = OssStore();

  const [urls, setUrls] = useState([]);
  const [files, setFiles] = useState<File[] | FileList>([]);

  async function putOssFile(fileList: File[] | FileList) {
    let preClient = client;
    const now = +new Date();
    if (!expiration || now - expiration >= 0 || now - Session.get("ossTimer") >= 1000 * 60 * 60) {
      preClient = await getOSSClient();
      setClient(preClient);
    }
    const file_arr = Array.from(fileList);
    const process = file_arr.map((f) => preClient.put(path + f.name, f));
    const results = await Promise.all(process).catch(async (err) => {
      console.log("err", err);
      const ossClient = await getOSSClient();
      setClient(ossClient);
      return file_arr.map((f) => ossClient.put(path + f.name, f));
    });
    return results.map(({ res }) => res?.requestUrls);
  }

  useEffect(() => {
    if (!files.length) return;
    putOssFile(files).then((urls) => setUrls(urls));
  }, [files]);

  useEffect(() => {
    if (!urls.length) return;
    const fileList = Array.from(files).map((file, index) => ({
      file_name: file.name,
      path: urls[index][0],
      file_size: file.size,
      file_type: file.type || getFileType(file.name)
    }));
    upload(upload_type, fileList, id.toString()).then(onFinish).catch(onError);
  }, [urls]);

  return { setFiles };
}
