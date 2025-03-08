import { Table } from "antd";
import { useDownload } from "@/hooks/useDownload.js";
import DetailOrder from "./detail-order";

function DetailBill({ dataSource, ...props }) {
  const columns = [
    { title: "Invoice#", dataIndex: "invoice_no" },
    { title: "Issued", dataIndex: "issue" },
    { title: "Due", dataIndex: "due" },
    { title: "Last Payment", dataIndex: "last_payment" },
    { title: "Status", dataIndex: "status" },
    { title: "Amount", dataIndex: "amount" },
    { title: "Balance", dataIndex: "balance" },
    {
      title: "Action",
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
