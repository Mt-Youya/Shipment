import JSZip from "jszip";
import { getFileName, useDownload } from "./useDownload.ts";

function downloadFile(filePath: string) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", filePath, true);
  xhr.responseType = "blob";
  xhr.send();
  return new Promise((resolve, reject) => {
    xhr.onload = () => {
      resolve(xhr.response);
    };
    xhr.onerror = () => {
      reject();
    };
  });
}

const zip = new JSZip();
export async function useDownloadZip(urls: string[]) {
  const fetchPromises = urls.map(async (url) => {
    const blob = await downloadFile(url);
    const filename = getFileName(url);
    return zip.file(filename, blob as Blob);
  });
  await Promise.all(fetchPromises);
  // 生成ZIP文件
  const content = await zip.generateAsync({ type: "blob" });
  const contentPath = URL.createObjectURL(content);
  useDownload(contentPath, "shunxinda.zip");
}
