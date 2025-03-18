import { ProTable, type ActionType, type ProColumns } from "@ant-design/pro-components";
import { Button, Divider, Table, type FormInstance } from "antd";
import { useRef, useState } from "react";
import { getBillings } from "../../service/billings";
import { useNavigate } from "react-router-dom";
import { BillingStore } from "../../store/billings.ts";
import { useTranslation } from "react-i18next";
import styles from "./index.module.less";
import DrawerUpload from "../../components/DrawerUpload";
import formatDateTime from "../../utils/formatDateTime.ts";

function Billing() {
  const { t } = useTranslation();
  const actionRef = useRef<ActionType>(null);
  const formRef = useRef<FormInstance>();

  const navigate = useNavigate();

  const columns: ProColumns[] = [
    { title: t("billing.keywords"), dataIndex: "name", hideInTable: true },
    { title: t("billing.invoice#"), dataIndex: "invoice", hideInSearch: true },
    {
      title: t("billing.hbl"),
      dataIndex: "hbl_no",
      hideInSearch: true,
      render: (item, record) => (
        <a className="text-blue underline" onClick={() => navigate(`/billing/detail/${record.id}`)}>
          {item}
        </a>
      )
    },
    { title: t("billing.issued"), dataIndex: "issued", hideInSearch: true },
    {
      title: t("billing.due"),
      dataIndex: "due",
      hideInSearch: true,
      render: (item) => formatDateTime(item)
    },
    { title: t("billing.last Payment"), dataIndex: "last_payment", hideInSearch: true },
    {
      title: t("billing.status"),
      dataIndex: "status",
      valueType: "select",
      valueEnum: {
        0: { text: t("common.unpaid"), status: "Warning" },
        1: { text: t("common.paid"), status: "Success" }
      }
    },
    {
      title: t("billing.invoice Type"),
      dataIndex: "invoice_type",
      valueType: "select",
      valueEnum: {
        null: t("selections.null"),
        1: t("selections.bill"),
        2: t("selections.debit note")
      }
    },
    { title: t("billing.amount"), dataIndex: "amount", hideInSearch: true },
    { title: t("billing.balance"), dataIndex: "balance", hideInSearch: true },
    {
      title: t("billing.action"),
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
  const [uploadOptions, setUploadOptions] = useState({
    title: t("common.upload files"),
    type: "3",
    id: ""
  });

  return (
    <>
      <section className="py-2">
        <h1 className="title leading-7xl m-0">{t("billing.billing")}</h1>
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
            searchText: t("common.search"),
            resetText: t("common.clear"),
            className: styles.searchBar
          }}
          dateFormatter="string"
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
            showTotal: (total) => `${t("common.total")} ${total} ${t("common.entries")}`
          }}
          rowKey="id"
          toolBarRender={() => [
            <Button key="Payment" onClick={handleBatchPayment}>
              {t("billing.batch Payment")}
            </Button>
          ]}
        />
      </section>

      <DrawerUpload
        drawerProps={{ title: t("common.upload files") }}
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
