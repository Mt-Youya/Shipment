import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, FormInstance, DatePicker, Select } from "antd";
import { useRef, useState } from "react";
import { taskAPI } from "../../../service/shipmentAPI";
import dayjs from "dayjs";
import UploadComponent from "../../../components/UploadComponent";
import DrawerUpload from "@/components/DrawerUpload";
import { useTranslation } from "react-i18next";

const Tasks = () => {
  const dataTable = useRef<ActionType>();
  const dataForm = useRef<FormInstance>();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);

  const { t } = useTranslation();
  const columns: ProColumns[] = [
    { title: t("business.job No"), dataIndex: "sea_order_no", order: 3 },
    {
      title: t("business.task"),
      dataIndex: "task_type",
      hideInSearch: true,
      renderText: (e) => {
        if (e === 1) return "Upload Commercial Invoice & Packing List";
        if (e === 2) return "Cargo Release Request Handling";
        if (e === 3) return "Make Payment";
      }
    },
    {
      title: t("business.status"),
      dataIndex: "status",
      renderText: (value) => {
        if (value === 0) return t("status.pending");
        if (value === 1) return t("status.completed");
      },
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        if (item.dataIndex === "status") {
          return (
            <Select
              placeholder="Please enter "
              {...rest}
              options={[
                { value: 0, label: t("status.pending") },
                { value: 1, label: t("status.completed") }
              ]}
            />
          );
        }
        return defaultRender(item);
      }
    },

    // {
    //   title:t ("business.Due",)
    //   dataIndex: "deadline",
    //   valueType: "date",
    //   renderText: (value) => {
    //     if (!value) return "";
    //     return dayjs(new Date(value)).format("YYYY-MM-DD HH:mm");
    //   }
    // },
    {
      title: t("common.action"),
      hideInSearch: true,
      render: (_, record) => (
        <a
          onClick={() => {
            setOpen(true);
            setId(record.id);
          }}
        >
          <img src="/images/Upload.png" alt="上传" />
        </a>
      )
    }
  ];

  const onClose = () => {
    setOpen(false);
  };
  const updateData = () => {
    dataForm.current?.submit();
  };

  return (
    <div>
      <div className="header">
        <div className="title leading-7xl">{t("business.tasks")}</div>
      </div>

      <ProTable
        actionRef={dataTable}
        formRef={dataForm}
        columns={columns}
        request={async (params) => {
          const { pageSize, current, sea_order_no, deadline, upload_time, ...restParams } = params;
          console.log(params.deadline);

          const res = await taskAPI({
            ...restParams,
            per_page: pageSize,
            page: current,
            order_no: sea_order_no,
            due_time: params.deadline ? dayjs(params.deadline) : ""
          });
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
      {/* <UploadComponent
        upload_type={4}
        updateData={updateData}
        order_id={id.toString()}
        open={open}
        onClose={onClose}
      /> */}
      <DrawerUpload
        showHistory
        open={open}
        setOpen={setOpen}
        onFinish={() => location.reload()}
        uploadProps={{ accept: ".pdf,.png" }}
        drawerProps={{ title: t("common.upload files") }}
        uploadOptions={{ title: t("common.upload files"), type: 4, id: id.toString() }}
        acceptText={
          <p className="text-[#00000066]">{t("common.Supported extensions")}: .pdf .png</p>
        }
      />
    </div>
  );
};
export default Tasks;
