import { Button, DatePicker, Form, Input, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { getShipmentDetailFile, getUploadUsers } from "@/service/shipments/index.js";
import { useOssUploadFile } from "@/hooks/useOssUploadFile.js";
import { useInputFileUpload } from "@/hooks/useInputFileUpload.js";
import { useDownload } from "@/hooks/useDownload.js";
import { ShipmentsStore } from "@/store/shipments.js";
import dayjs from "dayjs";
import DetailOrder from "./detail-order";
import formatDateTime from "@/utils/formatDateTime.js";

function DetailDocuments() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
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
    getDocuments({ ...form.getFieldsValue(), page: current, per_page: pageSize });
  }

  const { setFiles } = useOssUploadFile(2, id, () => getDocuments());

  function onChange(files) {
    setFiles(files);
  }

  const [options, setOptions] = useState([]);
  useEffect(() => {
    getUploadUsers({ order_id: id }).then((list) => {
      setOptions(
        list.map((item) => ({
          label: item.upload_user_name,
          value: item.upload_user_id
        }))
      );
    });
  }, []);

  const input = useInputFileUpload(
    onChange,
    { accept: "image/png,.pdf" },
    { max: 1024 * 1024 * 5 }
  );

  const { t } = useTranslation();

  const columns = [
    { key: "filename", dataIndex: "file_name", title: t("shipment.file Name") },
    {
      key: "upload_time",
      dataIndex: "upload_time",
      title: t("shipment.upload Date"),
      valueType: "date",
      render: (due) => formatDateTime(due)
    },
    {
      key: "upload_user_name",
      dataIndex: "upload_user_name",
      title: t("shipment.uploader"),
      valueType: "select",
      valueEnum: dropdownOptions?.upload_user[0]
    },
    {
      key: "action",
      dataIndex: "action",
      title: t("shipment.action"),
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
      <Form form={form} className="my-2" layout="inline" onValuesChange={handleValuesChange}>
        <Form.Item name="file_name" label={t("shipment.file Name")}>
          <Input placeholder="Please enter" />
        </Form.Item>
        <Form.Item name="upload_date" label={t("shipment.upload Date")}>
          <DatePicker placeholder="Please select date" />
        </Form.Item>
        <Form.Item name="user_id" label={t("shipment.uploader")}>
          <Select options={options} placeholder="Please select" />
        </Form.Item>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          className="cursor-pointer"
          onClick={() => input.click()}
        >
          {t("shipment.upload files")}
        </Button>
      </Form>

      <Table
        bordered
        rowKey="id"
        dataSource={data}
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: onPageChange,
          showTotal: (total) => `${t("common.total")} ${total} ${t("common.entries")}`
        }}
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
