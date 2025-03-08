import { Button, DatePicker, Form, Input, message, Select, Table, Upload } from "antd";
import { useEffect, useMemo, useState } from "react";
import { getShipmentDetailFile } from "@/service/shipments/index.js";
import { useParams } from "react-router-dom";
import { getDropdown } from "@/service/common.js";
import { useOssUploadFile } from "@/hooks/useOssUploadFile.js";
import { useInputFileUpload } from "@/hooks/useInputFileUpload.js";
import { useDownload } from "@/hooks/useDownload.js";
import dayjs from "dayjs";
import DetailOrder from "./detail-order";
import { ShipmentsStore } from "@/store/shipments.js";
import { ProTable } from "@ant-design/pro-components";

function DetailDocuments() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  async function getDocuments(params = form.getFieldsValue()) {
    setLoading(true);
    const { list, meta } = await getShipmentDetailFile(id, params);
    setData(list);
    setPagination({ current: meta.current_page, pageSize: meta.per_page, total: meta.total });
    setLoading(false);
  }

  const { dropdownOptions } = ShipmentsStore();

  useEffect(() => {
    getDocuments();
  }, []);

  function handleValuesChange(e) {
    const upload_date = e.upload_date;
    const params = {
      ...e,
      upload_date: upload_date ? dayjs(upload_date).format("YYYY/MM/DD") : null
    };
    getDocuments(params);
  }

  function onPageChange(current, pageSize) {
    getDocuments({ ...form.getFieldsValue(), page: current });
  }

  const { setFiles } = useOssUploadFile(2, id, () => getDocuments());

  function onChange(files) {
    setFiles(files);
  }

  const options = useMemo(() => {
    const list = [];
    for (const uploadUserKey in dropdownOptions?.upload_user) {
      list.push({
        label: dropdownOptions?.upload_user[uploadUserKey]?.upload_user_name,
        value: uploadUserKey
      });
    }
    return list;
  }, [dropdownOptions]);

  const input = useInputFileUpload(
    onChange,
    { accept: "image/png,.pdf" },
    { max: 1024 * 1024 * 5 }
  );

  const columns = [
    { key: "filename", dataIndex: "file_name", title: "File Name" },
    {
      key: "upload_time",
      dataIndex: "upload_time",
      title: "Upload Date",
      valueType: "date"
    },
    {
      key: "upload_user_name",
      dataIndex: "upload_user_name",
      title: "Uploader",
      valueType: "select",
      valueEnum: dropdownOptions?.upload_user[0]
    },
    {
      key: "upload",
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
      render: () => (
        <Button type="primary" className="cursor-pointer" onClick={() => input.click()}>
          Upload file
        </Button>
      )
    },

    {
      key: "action",
      dataIndex: "action",
      title: "Action",
      hideInSearch: true,
      hideInForm: false,
      render: (_, record) => (
        <div className="flex justify-start items-center gap-1 ">
          {/*<EyeOutlined className="cursor-pointer" style={{ color: "#566AE5", fontSize: "24px" }} />*/}
          <img
            className="cursor-pointer"
            src="/images/icons/Download.svg"
            alt="download"
            onClick={() => useDownload(record.path, record.file_name)}
          />
        </div>
      )
    }
  ];

  return (
    <>
      {/*<Form form={form} className="my-2" layout="inline" onValuesChange={handleValuesChange}>*/}
      {/*  <Form.Item name="file_name" label="File Name">*/}
      {/*    <Input placeholder="Please enter" />*/}
      {/*  </Form.Item>*/}
      {/*  <Form.Item name="upload_date" label="Upload Date">*/}
      {/*    <DatePicker placeholder="Please select date" />*/}
      {/*  </Form.Item>*/}
      {/*  <Form.Item name="user_id" label="Uploader">*/}
      {/*    <Select options={options} placeholder="Please select" />*/}
      {/*  </Form.Item>*/}
      {/*  <Button type="primary" className="cursor-pointer" onClick={() => input.click()}>*/}
      {/*    Upload file*/}
      {/*  </Button>*/}
      {/*</Form>*/}

      <ProTable
        bordered
        rowKey="id"
        formRef={form}
        toolBarRender={false}
        request={async (params) => {
          const { list, meta } = await getShipmentDetailFile(id, {
            ...params,
            page: params.current
          });
          return { data: list, success: true, total: meta.total };
        }}
        pagination={{ pageSize: 10 }}
        // pagination={{ ...pagination, onChange: onPageChange }}
        columns={columns}
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT]
        }}
      />
    </>
  );
}

DetailDocuments.Order = DetailOrder;

export default DetailDocuments;
