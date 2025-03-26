import React, { useEffect, useState } from "react";
import { Button, Drawer, DrawerProps, Form, message, Table, Tooltip, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadLog } from "../../service/common.ts";
import { useOssUploadFile } from "../../hooks/useOssUploadFile.ts";
import { useInputFileUpload } from "../../hooks/useInputFileUpload.ts";
import { useDownload } from "../../hooks/useDownload.ts";
import { useTranslation } from "react-i18next";
import formatDateTime from "../../utils/formatDateTime.ts";
import { overTextPopper } from "@/utils/getElementAttributes.ts";

interface IProps {
  drawerProps: DrawerProps;
  onFinish: (values: any) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  fileList?: File[];
  uploadOptions: { title: string; id: string; type: string };
  uploadProps?: UploadProps;
  children?: React.ReactNode;
  acceptText?: string | React.ReactNode;
  showHistory?: boolean;
  maxSize?: number;
}

function DrawerUpload({
  open,
  setOpen,
  drawerProps,
  onFinish,
  acceptText,
  uploadOptions,
  children,
  uploadProps,
  showHistory = false,
  maxSize = 1024 * 1024 * 3
}: IProps) {
  const { id, type } = uploadOptions;
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  if (showHistory) {
    useEffect(() => {
      open && getHistory();
    }, [open]);
  }

  async function getHistory() {
    setLoading(true);
    const { list = [] } = await uploadLog({ upload_type: type, order_id: id });
    setHistoryData(list);
    setLoading(false);
  }

  const historyColumns = [
    {
      title: t("common.file Name"),
      dataIndex: "file_name",
      key: "file_name"
    },
    {
      title: t("common.date"),
      dataIndex: "upload_time",
      key: "upload_time",
      render: (time) => formatDateTime(time)
    },
    {
      title: t("common.audit opinion"),
      dataIndex: "review_comment",
      key: "review_comment",
      ellipsis: true,
      width: 120,
      render: (text) => {
        const styles = overTextPopper(text, { width: "120px" });
        const height = +styles.height.split("px")[0];
        if (height > 40) {
          return (
            <Tooltip title={text}>
              <div className="w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                {text}
              </div>
            </Tooltip>
          );
        }
        return text;
      }
    },
    {
      title: t("common.action"),
      dataIndex: "path",
      key: "action",
      width: 80,
      ellipsis: true,
      render: (url, record) => (
        <img
          src="/images/icons/Download.svg"
          alt="download"
          onClick={() => useDownload(url, record.file_name)}
        />
      )
    }
  ];

  const [fileList, setFileList] = useState([]);

  function handleChange(files) {
    setFileList(files);
    form.setFieldValue("file", files);
  }

  function handleFinish(res) {
    message.success(t("status.upload success")).then(() => onFinish?.(res));
    handleClose();
  }

  function handleClose() {
    setLoading(false);
    setOpen(false);
    setFileList([]);
  }

  const { setFiles } = useOssUploadFile(type, id, handleFinish, () => setLoading(false));

  const input = useInputFileUpload(handleChange, uploadProps, { max: maxSize });

  return (
    <Drawer
      destroyOnClose
      classNames={{ header: "*:flex-row-reverse" }}
      width={500}
      footer={[
        <Button
          key="submit"
          onClick={() => {
            form
              .validateFields()
              .then(() => {
                setLoading(true);
                setFiles(fileList);
              })
              .catch((e) => {
                console.log(e);
              });
          }}
          loading={loading}
          className="bg-primary text-white hover:text-[#566AE5] mr-1"
        >
          {t("common.submit")}
        </Button>,
        <Button key="cancel" onClick={handleClose}>
          {t("common.cancel")}
        </Button>
      ]}
      open={open}
      onClose={handleClose}
      {...drawerProps}
    >
      <Form form={form}>
        <h2 className="mt-0">{uploadOptions.title}</h2>
        <Form.Item
          name="file"
          label={null}
          rules={[{ required: true, message: t("common.please") + t("common.upload file") }]}
        >
          <div>
            <Button icon={<UploadOutlined />} onClick={() => input?.click()}>
              {t("common.upload files")}
            </Button>
            {acceptText}
          </div>
        </Form.Item>
        {!!fileList.length && (
          <ul className="list-none m-1 p-1 border-2 border-black border-solid">
            {Array.from(fileList).map((item, i) => (
              <li key={i} className="divide-y-4 divide-y-reverse divide-gray-200">
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </Form>
      {showHistory && (
        <>
          <h2>{t("common.history")}</h2>
          <Table
            bordered
            rowKey="id"
            loading={loading}
            pagination={false}
            columns={historyColumns}
            dataSource={historyData}
          />
        </>
      )}
      {children}
    </Drawer>
  );
}

export default DrawerUpload;
