export function getFileName(url) {
  return url.substring(url.lastIndexOf("/") + 1);
}

export function getFileType(url) {
  return url.substring(url.lastIndexOf(".") + 1);
}
