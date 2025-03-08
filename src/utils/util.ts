import { DefaultOptionType } from "antd/es/select";

export const optsToEnum = (opts: DefaultOptionType[] = []) => {
  const obj: Record<string, string> = {};
  opts.forEach((o) => {
    if (o.value) {
      obj[o.value.toString()] = o.label as string;
    }
  });
  return obj;
};

export const generateRandomString = (length: number) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

export const getFileBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
