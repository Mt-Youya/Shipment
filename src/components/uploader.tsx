import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { message, Modal, Upload, UploadFile } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { generateRandomString, getFileBase64 } from "../utils/util";
import { upload } from "../service/common";

type TProps = {
  value?: string[];
  onChange?: (urls: string[]) => void;
  limit?: number;
  category: string;
  disabled?: boolean;
};

const Uploader = forwardRef(
  ({ onChange, value = [], limit, category = "", disabled = false }: TProps, ref) => {
    const [open, setOpen] = useState(false);
    const [filelist, setFilelist] = useState<UploadFile[]>([]);
    const [prevImg, setPrevImg] = useState<string>("");

    useImperativeHandle(ref, () => ({
      clear: () => {
        setFilelist([]);
      },
      start: async () => {
        try {
          // 不需要上传的图片地址
          const allUrls = filelist.filter((a) => a.url?.startsWith("http")).map((a) => a.url);
          const files = filelist.filter((a) => a.originFileObj).map((a) => a.originFileObj as File);
          if (files.length === 0) {
            return allUrls;
          }
          const urls = await upload(files, category);
          allUrls.push(...urls);
          return allUrls;
        } catch (error) {
          message.error("上传图片出错，请重试或刷新页面再次尝试");
        }
      }
    }));

    const getFileName = (url: string) => {
      if (!url) return "";
      if (!url.startsWith("http")) {
        return generateRandomString(12);
      }
      const index = url.lastIndexOf("/");
      return url.slice(index + 1);
    };

    const uploadButton = (
      <button style={{ border: 0, background: "none" }} type="button">
        <PlusOutlined className="text-2xl" />
      </button>
    );

    const handleRemove = (e: any) => {
      const i = filelist.findIndex((a) => a.uid === e.uid);
      filelist.splice(i, 1);
      setFilelist((filelist) => filelist.filter((a) => a.uid !== e.uid));
      onChange?.(filelist.map((a) => a.url as string));
    };

    const handlePreview = (e: any) => {
      setPrevImg(e.url);
      setOpen(true);
    };

    useEffect(() => {
      const uploadFiles: UploadFile[] = (value || []).map((a) => ({
        name: getFileName(a),
        uid: generateRandomString(12),
        url: a
      }));
      setFilelist(uploadFiles);
    }, []);

    return (
      <>
        <Upload
          accept="image/*"
          maxCount={limit}
          multiple
          listType="picture-card"
          fileList={filelist}
          onPreview={handlePreview}
          onRemove={handleRemove}
          disabled={disabled}
          beforeUpload={async (_, list) => {
            const fl = list.map(async (a) => {
              const base64 = await getFileBase64(a);
              const f = {
                name: getFileName(base64),
                uid: generateRandomString(12),
                url: base64,
                originFileObj: a
              };
              return f;
            });
            Promise.all(fl).then((r) => {
              const list = [...filelist, ...r];
              setFilelist(list);
              onChange?.(list.map((a) => a.uid as string));
            });
            return false;
          }}
        >
          {(limit && filelist.length >= limit) || disabled ? null : uploadButton}
        </Upload>

        <Modal open={open} footer={null} closeIcon={false} onCancel={() => setOpen(false)}>
          <img style={{ width: "100%" }} src={prevImg} />
        </Modal>
      </>
    );
  }
);

export default Uploader;
