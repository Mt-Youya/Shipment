import { Button, Drawer, DrawerProps, Form, message, Table, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadLog } from "../../service/common.ts";
import React, { useEffect, useState } from "react";
import { useOssUploadFile } from "../../hooks/useOssUploadFile.ts";
import { useInputFileUpload } from "../../hooks/useInputFileUpload.ts";
import { useDownload } from "../../hooks/useDownload.ts";

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
      title: "File Name",
      dataIndex: "file_name",
      key: "file_name"
    },
    {
      title: "Date",
      dataIndex: "upload_time",
      key: "upload_time"
    },
    {
      title: "Audit opinion",
      dataIndex: "review_comment",
      key: "review_comment"
    },
    {
      title: "Action",
      dataIndex: "path",
      key: "action",
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
  }

  function handleFinish(res) {
    onFinish?.(res);
    message.success("Upload success");
    setLoading(false);
    setOpen(false);
  }

  const { setFiles } = useOssUploadFile(type, id, handleFinish);

  const input = useInputFileUpload(handleChange, uploadProps, { max: maxSize });

  return (
    <Drawer
      classNames={{ header: "*:flex-row-reverse" }}
      width={500}
      footer={[
        <Button
          key="submit"
          onClick={() => {
            setLoading(true);
            setFiles(fileList);
          }}
          loading={loading}
          className="bg-primary text-white hover:text-[#566AE5] mr-1"
        >
          Submit
        </Button>,
        <Button key="cancel" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      ]}
      open={open}
      onClose={() => setOpen(false)}
      {...drawerProps}
    >
      <Form form={form}>
        <h2 className="mt-0">{uploadOptions.title}</h2>
        <Form.Item name="file" label={null}>
          <div>
            <Button icon={<UploadOutlined />} onClick={() => input?.click()}>
              Upload files
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
          <h2>History</h2>
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
