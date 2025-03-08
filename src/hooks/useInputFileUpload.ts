import { useEffect, useRef } from "react";
import { message } from "antd";

export function useInputFileUpload(onChange: (files: FileList) => void, props?, options?) {
  const ref = useRef<HTMLInputElement>(null);

  function handleChange(e) {
    const files = e.target.files;
    if (options) {
      if (options.maxSize) {
        for (const file of files) {
          if (file.size > options.maxSize) {
            return message.warning(`最大上传文件为${options.maxSize / 1024 / 1024}M`);
          }
        }
      }
    }
    onChange(files);
  }

  const input = document.createElement("input");
  input.type = "file";
  input.multiple = true;
  input.className = "hidden";

  useEffect(() => {
    ref.current = input;
    input.addEventListener("change", handleChange);
    for (const propsKey in props) {
      if (props.hasOwnProperty(propsKey)) {
        input[propsKey] = props[propsKey];
      }
    }
    document.body.appendChild(input);
    return () => {
      input.removeEventListener("change", handleChange);
      document.body.removeChild(input);
    };
  }, []);

  return ref.current ?? input;
}
