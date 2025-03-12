import React, { useEffect, useState } from "react";
import { Drawer, Form, Upload, Button, message, Table } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadAPI, uploadTokenAPI, uploadLogAPI } from "../service/shipmentAPI";
import OSS from "ali-oss";
import dayjs from "dayjs";
import axios from "axios";

interface UploadBookingFormatProps {
  open: boolean;
  onClose: () => void;
  upload_type: Number;
  order_id: string;
  updateData: () => void;
}

const UploadBookingFormat: React.FC<UploadBookingFormatProps> = ({
  open,
  onClose,
  upload_type,
  order_id,
  updateData
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [historyList, setHistoryList] = useState<any[]>([]);

  useEffect(() => {
    if (open === true) {
      getHistory();
      setFileList([]);
      form.resetFields();
    }
  }, [open]);
  const getHistory = async () => {
    try {
      const res = await uploadLogAPI({
        upload_type,
        order_id
      });
      setHistoryList(res.list);
    } catch (error) {}
  };
  const columns = [
    {
      tilte: "File Name",
      dataIndex: "file_name",
      key: "file_name"
    },
    {
      title: "Date",
      dataIndex: "upload_time",
      key: "upload_time",
      render: (text: string | number | Date | dayjs.Dayjs | null | undefined) => {
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    {
      title: "操作",
      key: "action",
      render: (record) => {
        return <a onClick={() => downloadHandle(record.path, record.file_name)}>下载</a>;
      }
    }
  ];

  const downloadHandle = (path: string, name: string) => {
    axios({
      url: path,
      method: "GET",
      responseType: "blob"
    })
      .then((response) => {
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = name; // 设置下载的文件名
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        message.error("Download failed: " + error);
      });
  };
  // 表单提交
  const handleSubmit = async (e) => {
    try {
      if (fileList.length === 0) return message.error("请上传文件");
      const res = await uploadAPI({
        upload_type,
        order_id,
        file: fileList
      });
      message.success(res.msg);
      onClose();
      updateData();
    } catch (error) {
      message.error("error");
    }
  };

  // 规范化文件列表
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // 自定义上传方法
  const customRequest = async ({ file, onSuccess, onError }: any) => {
    console.log(file);

    try {
      // 获取阿里云 OSS 的上传凭证
      const ossToken = await uploadTokenAPI();
      // 配置 OSS 客户端
      const client = new OSS({
        stsToken: ossToken.token.body.credentials.securityToken,
        accessKeyId: ossToken.token.body.credentials.accessKeyId,
        accessKeySecret: ossToken.token.body.credentials.accessKeySecret,
        region: "us-east-1",
        bucket: "hans-us",
        endpoint: "oss-us-east-1.aliyuncs.com"
      });
      // 上传文件
      const result = await client.put("uploads/" + file.name, file, {
        mime: "application/pdf", // 设置 MIME 类型为 PDF
        headers: { "Content-Type": "application/pdf" } // 设置 Content-Type 为 PDF
      });
      console.log(result);

      // 上传成功
      onSuccess("ok");
      setFileList([
        ...fileList,
        {
          file_name: result.name,
          path: result.url,
          file_type: result.name.split(".").pop().toLowerCase(),
          file_size: file.size
        }
      ]);
    } catch (error) {
      // 上传失败
      onError(error);
      message.error("error");
    }
  };

  // 上传属性配置
  const uploadProps = {
    customRequest: customRequest,
    beforeUpload: (file: File) => {
      // 限制文件类型为 PDF
      const isPdf = file.type === "application/pdf";
      if (!isPdf) {
        message.error("Only PDF files are allowed");
        return false;
      }

      // 限制文件大小（例如 10MB）
      const isLt3MB = file.size / 1024 / 1024 < 3;
      if (!isLt3MB) {
        message.error("File must be smaller than 3MB");
        return false;
      }

      return true;
    }
  };

  return (
    <Drawer
      destroyOnClose={true}
      title="Upload Booking Format"
      open={open}
      onClose={onClose}
      width={600}
      footer={[
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Submit
        </Button>
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="file"
          label="Booking Format"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="Supported extensions: .pdf"
        >
          <Upload accept=".pdf" {...uploadProps}>
            <Button icon={<UploadOutlined />}>Upload PDF</Button>
          </Upload>
        </Form.Item>
      </Form>

      {historyList.length > 0 && (
        <div>
          <h3>History</h3>
          <Table rowKey={"id"} columns={columns} dataSource={historyList} pagination={false} />
        </div>
      )}
    </Drawer>
  );
};

export default UploadBookingFormat;
