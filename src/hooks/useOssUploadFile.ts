import { useEffect, useState } from "react";
import { OssStore } from "../store/oss";
import { upload } from "../service/common.ts";

export function useOssUploadFile(upload_type, id, onFinish, path = "uploads/") {
  const { client } = OssStore();
  const [urls, setUrls] = useState([]);
  const [files, setFiles] = useState<File[] | FileList>([]);

  async function putOssFile(fileList: File[] | FileList) {
    const file_arr = Array.from(fileList);
    const process = file_arr.map((f) => client.put(path + f.name, f));
    const results = await Promise.all(process);
    return results.map(({ res }) => res.requestUrls);
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
      file_type: file.type
    }));
    upload(upload_type, fileList, id.toString()).then(onFinish);
  }, [urls]);

  return { setFiles };
}
