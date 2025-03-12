import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, FormInstance, Select, DatePicker } from "antd";
import { useRef, useState } from "react";
import { noticeAPI } from "../../../service/shipmentAPI";
import dayjs from "dayjs";

const Billing = () => {
  const dataTable = useRef<ActionType>();
  const dataForm = useRef<FormInstance>();

  const columns: ProColumns[] = [
    { title: "Job No", dataIndex: "sea_order_no" },
    {
      title: "Node Name",
      dataIndex: "notice_type",
      renderText: (value) => {
        if (value === 1) return "即将开船";
        if (value === 2) return "即将到港";
        if (value === 3) return "异常提醒";
        if (value === 4) return "付款提醒";
      },
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        if (item.dataIndex === "notice_type") {
          return (
            <Select
              {...rest}
              placeholder="Please select"
              options={[
                { value: 1, label: "即将开船" },
                { value: 2, label: "即将到港" },
                { value: 3, label: "异常提醒" },
                { value: 4, label: "付款提醒" }
              ]}
            />
          );
        }
        return defaultRender(item);
      }
    },
    { title: "Reminder content", dataIndex: "content", hideInSearch: true },
    {
      title: "Reminder Date",
      dataIndex: "created_at",
      sorter: true,
      valueType: "date",
      width: 200,
      render: (_, record) => dayjs(record.created_at).format("MMMDD, YYYY hh:mm a")
    }
  ];

  return (
    <div>
      <div className="header">
        <div className="title leading-7xl">Reminders</div>
      </div>

      <ProTable
        actionRef={dataTable}
        formRef={dataForm}
        columns={columns}
        request={async (params, sort, filter) => {
          if (params.sea_order_no) {
            params.order_no = params.sea_order_no;
            delete params.sea_order_no;
          }
          if (params.created_at) {
            params.notice_time = dayjs(params.created_at).format("MMM DD, YYYY hh:mm a");
            delete params.created_at;
          }

          params.sort_type = sort?.created_at === "ascend" ? 1 : 2;
          params.sort = "notice_time";
          const res = await noticeAPI(params);
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
    </div>
  );
};
export default Billing;
