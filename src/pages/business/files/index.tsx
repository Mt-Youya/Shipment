import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, FormInstance, message, Space, Select } from "antd";
import { useRef } from "react";
import { fileAPI } from "../../../service/shipmentAPI";
import axios from "axios";
import useDetailList from "../../booking/detailList";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const Files = () => {
  const { drop } = useDetailList();

  const dataTable = useRef<ActionType>();
  const dataForm = useRef<FormInstance>();

  const { t } = useTranslation();

  const columns: ProColumns[] = [
    { title: t("business.job No"), dataIndex: "sea_order_no" },
    { title: t("business.file Name"), dataIndex: "file_name" },
    {
      title: t("business.date"),
      dataIndex: "upload_time",
      sorter: true,
      valueType: "date",
      render: (_, record) => {
        return dayjs(record.upload_time).format("MMMDD YYYY HH:mm:ss");
      }
    },
    {
      title: t("business.uploader"),
      dataIndex: "upload_user_name",
      valueType: "select",
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return (
          <Select
            {...rest}
            placeholder="Please select"
            options={drop?.upload_user?.map((e) => ({
              value: e.upload_user_id + "," + e.upload_platform,
              label: e.upload_user_name
            }))}
          />
        );
      }
    },
    {
      title: t("common.action"),
      hideInSearch: true,
      render: (_, record) => (
        <>
          <Space size="middle">
            {/* <img src="/images/view.png" alt="" /> */}
            <img
              src="/images/download.png"
              onClick={() => downloadHandle(record.path, record.file_name)}
              alt=""
            />
          </Space>
        </>
      )
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
      .catch((error) => {});
  };

  return (
    <div>
      <div className="header">
        <div className="title leading-7xl">{t("business.files")}</div>
      </div>

      <ProTable
        actionRef={dataTable}
        formRef={dataForm}
        columns={columns}
        request={async (params, sort, filter) => {
          const { pageSize, current, sea_order_no, upload_user_name, upload_time, ...restParams } =
            params;
          const res = await fileAPI({
            ...restParams,
            per_page: pageSize,
            page: current,
            order_no: sea_order_no,
            user_id: upload_user_name ? upload_user_name.split(",")[0] : "",
            upload_platform: upload_user_name ? upload_user_name.split(",")[1] : "",
            upload_date: upload_time
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
    </div>
  );
};
export default Files;
