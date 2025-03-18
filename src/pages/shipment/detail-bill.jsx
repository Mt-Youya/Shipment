import { Table } from "antd";
import { useDownload } from "@/hooks/useDownload.js";
import DetailOrder from "./detail-order";
import formatDateTime from "@/utils/formatDateTime.js";
import { useTranslation } from "react-i18next";

function DetailBill({ dataSource, ...props }) {
  const { t } = useTranslation();
  const columns = [
    { title: t("shipment.invoice#"), dataIndex: "invoice_no" },
    { title: t("shipment.issued"), dataIndex: "issue", render: (due) => formatDateTime(due) },
    { title: t("shipment.due"), dataIndex: "due" },
    { title: t("shipment.last Payment"), dataIndex: "last_payment" },
    { title: t("shipment.status"), dataIndex: "status" },
    { title: t("shipment.amount"), dataIndex: "amount" },
    { title: t("shipment.balance"), dataIndex: "balance" },
    {
      title: t("shipment.action"),
      dataIndex: "file_url",
      render: (url) => (
        <img
          alt="Download"
          src="/images/icons/Download.svg"
          className="w-2.5 aspect-square cursor-pointer"
          onClick={() => useDownload(url)}
        />
      )
    }
  ];

  return (
    <Table
      bordered
      rowKey="id"
      className="my-1 mx-1"
      pagination={false}
      dataSource={dataSource}
      columns={columns}
      {...props}
    />
  );
}

DetailBill.Order = DetailOrder;

export default DetailBill;
