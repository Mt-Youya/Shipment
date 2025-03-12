import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, FormInstance, DatePicker, Select } from "antd";
import { useRef, useState } from "react";
import { taskAPI } from "../../../service/shipmentAPI";
import dayjs from "dayjs";
import UploadComponent from "../../../components/UploadComponent";

const Billing = () => {
  const dataTable = useRef<ActionType>();
  const dataForm = useRef<FormInstance>();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);
  const columns: ProColumns[] = [
    { title: "Job No", dataIndex: "sea_order_no", order: 3 },
    {
      title: "Task",
      dataIndex: "task_type",
      hideInSearch: true,
      renderText: (e) => {
        if (e === 1) return "Upload Commercial Invoice & Packing List";
        if (e === 2) return "Cargo Release Request Handling";
        if (e === 3) return "Make Payment";
      }
    },
    {
      title: "status",
      dataIndex: "status",
      renderText: (value) => {
        if (value === 0) return "待处理";
        if (value === 1) return "已完成";
      },
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        if (item.dataIndex === "status") {
          return (
            <Select
              placeholder="Please enter "
              {...rest}
              options={[
                { value: 0, label: "待处理" },
                { value: 1, label: "已完成" }
              ]}
            />
          );
        }
        return defaultRender(item);
      }
    },

    {
      title: "Due",
      dataIndex: "deadline",
      valueType: "date",
      renderText: (value) => {
        if (!value) return "";
        return dayjs(new Date(value)).format("YYYY-MM-DD HH:mm");
      }
    },
    {
      title: "Action",
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
        <div className="title leading-7xl">Tasks</div>
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
              Search
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
              Clear Filters
            </Button>
          ]
        }}
        dateFormatter="string"
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} data`
        }}
        rowKey="id"
        toolBarRender={false}
      />
      <UploadComponent
        upload_type={4}
        updateData={updateData}
        order_id={id.toString()}
        open={open}
        onClose={onClose}
      />
    </div>
  );
};
export default Billing;
