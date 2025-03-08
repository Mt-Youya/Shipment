// import { EllipsisOutlined, SearchOutlined } from "@ant-design/icons";
import type { ActionType, FormInstance, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Select } from "antd";
import { useRef } from "react";
import { companyContractAPI } from "../../../../service/shipmentAPI";
import useDetailList from "../../../booking/detailList";

const valueEnum = {
  0: "close",
  1: "running",
  2: "online",
  3: "error"
};

export type TableListItem = {
  key: number;
  name: string;
  containers: number;
  creator: string;
  status: string;
  createdAt: number;
  progress: number;
  money: number;
  memo: string;
};

export default () => {
  const { drop } = useDetailList();
  const dataTable = useRef<ActionType>();
  const dataForm = useRef<FormInstance>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: "Contract Number",
      dataIndex: "contract_no",
      ellipsis: true
    },
    {
      title: "Contract Name",
      dataIndex: "contract_name"
    },
    {
      title: "Contract Type",
      dataIndex: "contract_type",
      valueType: "select",
      renderFormItem: (item, { defaultRender, ...rest }) => {
        return (
          <Select
            {...rest}
            placeholder="Please select"
            options={Object.entries(drop.contract_type || {}).map(([key, label]) => ({
              value: key,
              label
            }))}
          />
        );
      }
    },
    {
      title: "Effective Date",
      dataIndex: "effective_from",
      valueType: "date"
    },
    {
      title: "Expiring Date",
      dataIndex: "expiration_date",
      valueType: "date"
    },
    {
      title: "Notes",
      dataIndex: "remark",
      ellipsis: true,
      hideInSearch: true
    }
  ];

  return (
    <ProTable<TableListItem>
      actionRef={dataTable}
      formRef={dataForm}
      columns={columns}
      request={async (params, sorter, filter) => {
        const { pageSize, current, ...restParams } = params;
        const res = await companyContractAPI({
          ...restParams,
          per_page: pageSize,
          page: current
        });
        return { data: res.list, total: res.meta.total, success: true };
      }}
      form={{ colon: false, className: "p-0" }}
      rowKey="key"
      pagination={false}
      options={false}
      search={{
        span: {
          xs: 24,
          sm: 12,
          md: 12,
          lg: 8,
          xl: 8,
          xxl: 8
        },
        labelWidth: 120,
        layout: "horizontal",
        collapsed: false,
        collapseRender: false,
        optionRender: () => [
          <Button key="search" type="primary" onClick={() => dataForm.current?.submit()}>
            Filter
          </Button>
        ]
      }}
      dateFormatter="string"
    />
  );
};
