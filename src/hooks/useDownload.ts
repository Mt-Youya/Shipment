import { getFileName } from "../utils/getFileInfo.ts";

export function useDownload(filePath: string, fileName) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", filePath, true);
  xhr.responseType = "blob";
  xhr.onload = () => {
    const url = URL.createObjectURL(xhr.response);
    const a = document.createElement("a") as HTMLAnchorElement;
    a.href = url;
    a.download = fileName ?? getFileName(filePath);
    a.click();
    URL.revokeObjectURL(url);
  };
  xhr.send();
}
