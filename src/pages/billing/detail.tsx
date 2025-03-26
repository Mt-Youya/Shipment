import { useEffect, useMemo, useState } from "react";
import { Button, Divider, Table, Tag } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { getBillingDetail, getBillings } from "../../service/billings";
import { BillingStore } from "../../store/billings.ts";
import { useDownload } from "../../hooks/useDownload.ts";
import { useDownloadZip } from "../../hooks/useDownloadZip.ts";
import CheckCard from "../../components/CheckCard";
import DrawerUpload from "@/components/DrawerUpload";
import randomUUID from "../../utils/randomUUID.ts";
import RateInformation from "../../components/RateInformations";
import formatDateTime from "../../utils/formatDateTime.ts";
import styles from "./detail.module.less";

import type { AwaitedReturn } from "../../utils/common.type.ts";
import type { ColumnType } from "antd/es/table/interface";

function BookingDetail() {
  const [open, setOpen] = useState(false);
  const { billingData, setBillingData } = BillingStore();
  const { t } = useTranslation();

  const { id } = useParams();

  const [orderList, setOrderList] = useState([]);
  const [containers, setContainers] = useState([]);
  const [state, setState] = useState<AwaitedReturn<typeof getBillingDetail> | null>(null);

  async function getChargeDetail() {
    const result = await getBillingDetail(id);
    setState(result);
    setOrderList([
      {
        issue_date: result.issue_date,
        due_date: result.due_date,
        invoice_total: result.invoice_total,
        paid_amount: result.paid_amount,
        balance_due: result.balance_due,
        id: randomUUID()
      }
    ]);
    setContainers(result.file);
  }

  useEffect(() => {
    getChargeDetail();
  }, [billingData]);

  const ordersColumns: ColumnType[] = [
    {
      key: "Issue",
      title: t("billing.issue Date"),
      dataIndex: "issue_date",
      render: (item) => formatDateTime(item)
    },
    { key: "Due", title: t("billing.due Date"), dataIndex: "due_date" },
    { key: "Invoice", title: t("billing.invoice Total"), dataIndex: "invoice_total" },
    { key: "Paid", title: t("billing.paid Amount"), dataIndex: "paid_amount" },
    { key: "Balance", title: t("billing.balance Due"), dataIndex: "balance_due" }
  ];

  const containerColumns: ColumnType[] = [
    {
      key: "Documents",
      title: t("billing.documents"),
      dataIndex: "file_name",
      render: (item) => <a className="underline text-primary cursor-default">{item}</a>
    },
    {
      key: "Action",
      title: t("billing.action"),
      render: (record) => (
        <img
          className="cursor-pointer"
          src="/images/icons/Download.svg"
          alt="download"
          onClick={() => useDownload(record.path, record.file_name)}
        />
      )
    }
  ];

  function handleDownloadAll() {
    if (containers.length === 0) {
      return;
    }
    const urls = containers.map(({ path }) => path);
    useDownloadZip(urls);
  }

  const navigate = useNavigate();

  const rateData = useMemo(() => state?.charge_detail ?? [], [state?.charge_detail]);

  const rateColumns: ColumnType[] = [
    { title: t("billing.cost Description"), dataIndex: "cost_item_en" },
    { title: t("billing.cost Unit Name"), dataIndex: "currency" },
    { title: t("billing.unit Price"), dataIndex: "quotation_unit_price_tax" },
    { title: t("billing.quality"), dataIndex: "quantity" },
    {
      title: t("billing.unit"),
      dataIndex: "charge_unit",
      render: (item) => item?.value
    },
    { title: t("billing.price"), dataIndex: "total_amount_tax" }
  ];

  async function handleUploadFinish() {
    const { list = [] } = await getBillings();
    list.forEach((item) => {
      item.invoice_type = item.invoice_type.value;
    });
    setBillingData(list);
  }

  return (
    <section className="py-2 h-full w-full">
      <div className="grid grid-cols-[2fr_62px_1fr] w-full h-full ">
        <div className="mb-3">
          <h1 className="flex justify-start items-center gap-2 m-0 text-3xl">
            <span>{state?.job_no} </span>
            <Tag color="geekblue">
              {[t("status.unpaid"), t("status.unsettled"), t("status.paid")][state?.status]}
            </Tag>
          </h1>
          <div>
            <div className="flex justify-between">
              <div className="flex flex-col my-1">
                <h2 className="font-semibold my-0"> {state?.invoice_type?.value} </h2>
                <a
                  className="underline text-blue"
                  onClick={() => navigate("/shipment/detail/" + id)}
                >
                  {state?.title}
                </a>
              </div>
              <button
                className="rounded-lg bg-primary text-white p-2 cursor-pointer border-none"
                onClick={() => setOpen(true)}
              >
                {t("billing.MAKE PAYMENT")}
              </button>
            </div>
            <br />
            <Table
              bordered
              rowKey="id"
              columns={ordersColumns}
              dataSource={orderList}
              pagination={false}
            />
          </div>
          <div className="my-2">
            <h2 className="my-1 font-semibold">{t("billing.recipient")} </h2>
            <p>{state?.consignee_address ?? t("billing.No Recipient")}</p>
          </div>
          <div className={styles.rateInfoWrapper}>
            <h2 className="my-1 font-semibold">{t("billing.invoice Details")}</h2>
            <RateInformation data={rateData} column={rateColumns} />
          </div>
        </div>
        <Divider type="vertical" className="h-[95vh] w-[2px] mx-3" />
        <div className="w-40 max-content">
          <CheckCard dataSource={billingData} />
          <div>
            <h1>{t("billing.containers")}</h1>
            <div className="flex justify-between items-end">
              <div>
                {state?.container.map((contain, index) => (
                  <p key={index} className="h-fit text-[#566AE5]">
                    {contain.container_no}({contain.container_size})
                  </p>
                ))}
              </div>
              <Button onClick={handleDownloadAll}>{t("billing.download All")}</Button>
            </div>
            <Divider />
            <Table
              dataSource={containers}
              columns={containerColumns}
              pagination={false}
              rowKey="id"
            />
          </div>
        </div>
      </div>

      <DrawerUpload
        drawerProps={{ title: t("billing.upload Bank Receipt") }}
        uploadOptions={{ title: t("billing.upload Bank Receipt"), id, type: 3 }}
        open={open}
        setOpen={setOpen}
        onFinish={handleUploadFinish}
      />
    </section>
  );
}

export default BookingDetail;
