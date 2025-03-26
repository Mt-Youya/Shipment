import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, FormInstance, Select, Space } from "antd";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { useTranslation } from "react-i18next";
import { shipmentAPI } from "../../service/shipmentAPI";
import dayjs from "dayjs";
import UploadComponent from "../../components/UploadComponent";
import useDetailList from "./detailList";

const shipment = () => {
  const { drop } = useDetailList();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const dataTable = useRef<ActionType>();
  const dataForm = useRef<FormInstance>();

  const { t } = useTranslation();

  const columns: ProColumns[] = [
    { title: t("booking.name"), dataIndex: "title", ellipsis: true },
    {
      title: t("booking.cargo Ready Date"),
      dataIndex: "goods_date",
      hideInSearch: true,
      render: (e, b) => {
        return dayjs(b.goods_date).format("MMMDD, YYYY");
      }
    },
    {
      title: t("booking.consignee"),
      dataIndex: "consignee",
      valueType: "select",
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return (
          <Select
            {...rest}
            placeholder="Please select"
            options={drop?.consignee?.map((e) => ({
              value: e.id,
              label: e.name_en
            }))}
          />
        );
      }
    },
    {
      title: t("booking.grossWeight") + '(KG)',
      dataIndex: "weight",
      valueType: "digit",
      hideInSearch: true,
      render: (_, record) => record.booking_detail.weight
    },
    {
      title: t("booking.volume") + '(CBM)',
      dataIndex: "volume",
      valueType: "digit",
      hideInSearch: true,
      render: (_, record) => record.booking_detail.volume
    },
    {
      title: t("booking.creation Date"),
      dataIndex: "created_at",
      valueType: "date",
      render: (e, b) => {
        return dayjs(b.created_at).format("MMMDD, YYYY");
      }
    },
    {
      title: t("booking.status"),
      dataIndex: "status",
      width: 100,
      render: (text) => {
        if (text === 0) return t("status.draft");
        if (text === 1) return t("status.completed");
      },
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        if (item.dataIndex === "status") {
          return (
            <Select
              {...rest}
              placeholder="Please enter "
              style={{ width: "150px" }}
              options={[
                { value: 0, label: t("status.draft") },
                { value: 1, label: t("status.completed") }
              ]}
            />
          );
        }
        return defaultRender(item);
      }
    },
    {
      title: t("booking.action"),
      hideInSearch: true,
      render: (e, record) => (
        <>
          <Space>
            <a
              onClick={() => {
                navigate("/booking/detail", { state: { obj: record } });
              }}
            >
              <img src="/images/edit.png" alt="" />
            </a>
            <a onClick={() => download(record.id)}>
              <img src="/images/download.png" alt="下载" />
            </a>
            <a
              onClick={() => {
                setOpen(true);
                setId(record.id);
              }}
            >
              <img src="/images/Upload.png" alt="上传" />
            </a>
          </Space>
        </>
      )
    }
  ];
  const download = async (id) => {
    // const res = await uploadLogAPI({ order_id: id, upload_type: 1 });
    // window.open(res.data[0].url);
  };

  const onClose = () => {
    setOpen(false);
  };
  const updateData = () => {
    dataForm.current?.submit();
  };

  return (
    <div>
      <div className="header">
        <div className="title leading-7xl">{t("booking.booking")}</div>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            navigate("/booking/detail");
          }}
        >
          {t("booking.new booking")}
        </Button>
      </div>
      <ProTable
        bordered
        actionRef={dataTable}
        formRef={dataForm}
        columns={columns}
        request={async (params, sort, filter) => {
          params.per_page = params.pageSize;
          params.page = params.current;
          const res = await shipmentAPI(params);
          return { data: res.list, total: res.meta.total, success: true };
        }}
        options={false}
        search={{
          span: {
            xs: 24,
            sm: 12,
            md: 12,
            lg: 8,
            xl: 8,
            xxl: 6
          },
          className: "search-wrapper",
          labelWidth: "auto",
          collapsed: false,
          collapseRender: false,

          optionRender: () => [
            <Button key="search" type="primary" onClick={() => dataForm.current?.submit()}>
              {t("common.search")}
            </Button>,
            <Button
              key="reset"
              color="default"
              variant="filled"
              onClick={() => {
                dataForm.current?.resetFields();
                dataForm.current?.submit();
              }}
            >
              {t("common.clear")}
            </Button>
          ]
        }}
        dateFormatter="string"
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
          showTotal: (total) => `${t("common.total")} ${total} ${t("common.entries")}`
        }}
        rowKey="id"
        toolBarRender={false}
      />

      <UploadComponent
        upload_type={1}
        updateData={updateData}
        order_id={id.toString()}
        open={open}
        onClose={onClose}
      />
    </div>
  );
};
export default shipment;
