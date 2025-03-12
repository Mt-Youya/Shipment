import { ProTable, type ActionType, type ProColumns } from "@ant-design/pro-components";
import { Button, Divider, Table, type FormInstance } from "antd";
import { useRef, useState } from "react";
import { getBillings } from "../../service/billings";
import { useNavigate } from "react-router-dom";
import { BillingStore } from "../../store/billings.ts";
import styles from "./index.module.less";
import DrawerUpload from "../../components/DrawerUpload";

function Billing() {
  const actionRef = useRef<ActionType>(null);
  const formRef = useRef<FormInstance>();

  const navigate = useNavigate();

  const columns: ProColumns[] = [
    { title: "Keywords", dataIndex: "name", hideInTable: true },
    { title: "Invoice#", dataIndex: "invoice", hideInSearch: true },
    {
      title: "HBL",
      dataIndex: "hbl_no",
      hideInSearch: true,
      render: (item, record) => (
        <a className="text-blue underline" onClick={() => navigate(`/billing/detail/${record.id}`)}>
          {item}
        </a>
      )
    },
    { title: "Issued", dataIndex: "issued", hideInSearch: true },
    { title: "Due", dataIndex: "due", hideInSearch: true },
    { title: "Last Payment", dataIndex: "last_payment", hideInSearch: true },
    {
      title: "Status",
      dataIndex: "status",
      valueType: "select",
      valueEnum: {
        0: { text: "未支付", status: "Warning" },
        1: { text: "已支付", status: "Success" }
      }
    },
    {
      title: "Invoice Type",
      dataIndex: "invoice_type",
      valueType: "select",
      valueEnum: {
        null: "空",
        0: "发票",
        1: "DEBIT NOTE"
      }
    },
    { title: "Amount", dataIndex: "amount", hideInSearch: true },
    { title: "Balance", dataIndex: "balance", hideInSearch: true },
    {
      title: "Action",
      dataIndex: "shipper",
      hideInSearch: true,
      render: (_, record) => (
        <>
          <img
            className="w-2.5 aspect-square cursor-pointer"
            src="/images/icons/Payment.svg"
            alt="Payment"
            onClick={() => handlePayment(record)}
          />
          &nbsp;
          <img
            className="w-2.5 aspect-square cursor-pointer"
            src="/images/icons/Download.svg"
            alt="Download"
            // onClick={() => useDownload(record.path)}
          />
        </>
      )
    }
  ];

  function handlePayment({ id }) {
    setUploadOptions((prevState) => ({ ...prevState, id }));
    setOpen(true);
  }

  function handleBatchPayment() {
    setUploadOptions((prevState) => ({ ...prevState, id: selects.current?.join(",") }));
    setOpen(true);
  }

  const selects = useRef<number[]>([]);
  const { setBillingData } = BillingStore();

  const [open, setOpen] = useState(false);
  const [uploadOptions, setUploadOptions] = useState({ title: "文件上传", type: "3", id: "" });

  return (
    <>
      <section className="py-2">
        <div className="flex justify-between">
          <h1 className="title leading-7xl m-0">Billing</h1>
          <button
            className="bg-primary text-white text-base font-bold px-2 py-1.5 border-none rounded-md cursor-pointer"
            onClick={() => navigate("/booking/detail")}
          >
            NEW BOOKING
          </button>
        </div>
        <Divider className="my-1" />
        <ProTable
          bordered
          className={styles.ProtableWrapper}
          actionRef={actionRef}
          formRef={formRef}
          columns={columns}
          rowSelection={{
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
            onChange: (selectedRowKeys) => (selects.current = selectedRowKeys)
          }}
          request={async (params, sort, filter) => {
            const { pageSize, current, ...param } = params;
            const rest = {
              page: current,
              per_page: pageSize,
              sort_type: 1,
              sort: "invoice_no",
              ...param
            };
            let success = true;
            const { list = [], meta } = await getBillings(rest).catch(() => (success = false));
            list.forEach((item) => {
              item.invoice_type = item.invoice_type.value;
            });
            setBillingData(list);
            return { data: list, total: meta?.total, success };
          }}
          options={false}
          search={{
            labelWidth: "auto",
            collapsed: false,
            collapseRender: false,
            searchText: "Search",
            resetText: "Clear Filters",
            className: styles.searchBar
          }}
          dateFormatter="string"
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} data`
          }}
          rowKey="id"
          toolBarRender={() => [
            <Button key="Payment" onClick={handleBatchPayment}>
              Batch Payment
            </Button>
          ]}
        />
      </section>

      <DrawerUpload
        drawerProps={{ title: "文件上传" }}
        open={open}
        setOpen={setOpen}
        onFinish={actionRef.current?.reload}
        uploadOptions={uploadOptions}
        uploadProps={{ accept: "image/png,.pdf" }}
      />
    </>
  );
}

export default Billing;
