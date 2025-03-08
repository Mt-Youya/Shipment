import { useEffect, useMemo, useState } from "react";
import { Button, Divider, Form, Select, Table, Tag } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { getBillingDetail } from "../../service/billings";
import { ColumnType } from "antd/es/table/interface";
import "./detail.css";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { BillingStore } from "../../store/billings.ts";
import { useDownload } from "../../hooks/useDownload.ts";
import CheckCard from "../../components/CheckCard";
import DrawerUpload from "@/components/DrawerUpload";
import randomUUID from "../../utils/randomUUID.ts";
import RateInformation from "../../components/RateInformations";
import { useDownloadZip } from "../../hooks/useDownloadZip.ts";

function BookingDetail() {
  const [open, setOpen] = useState(false);
  const { billingData } = BillingStore();

  const { id } = useParams();

  const [orderList, setOrderList] = useState([]);
  const [containers, setContainers] = useState([]);
  const [state, setState] = useState(null);

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
  }, []);

  const ordersColumns: ColumnType[] = [
    { key: "Issue", title: "Issue Date", dataIndex: "issue_date" },
    { key: "Due", title: "Due Date", dataIndex: "due_date" },
    { key: "Invoice", title: "Invoice Total", dataIndex: "invoice_total" },
    { key: "Credit", title: "Credit Applied", dataIndex: "credit_applied" },
    { key: "Paid", title: "Paid Amount", dataIndex: "paid_amount" },
    { key: "Balance", title: "Balance Due", dataIndex: "balance_due" }
  ];

  const containerColumns: ColumnType[] = [
    {
      key: "Documents",
      title: "Documents",
      dataIndex: "file_name",
      render: (item) => (
        <a className="underline text-primary" onClick={handleDownload}>
          {item}
        </a>
      )
    },
    {
      key: "Action",
      title: "Action",
      render: (item, record) => (
        <img
          className="cursor-pointer"
          src="/images/icons/Download.svg"
          alt="download"
          onClick={() => handleDownload(record)}
        />
      )
    }
  ];

  function handleDownload(info) {
    const [first, second] = info.file_name?.split("/");
    const filename = second ?? first;
    useDownload(info.url, filename);
  }

  function handleDownloadAll() {
    if (containers.length === 0) {
      return;
    }
    const urls = containers.map(({ path }) => path);
    useDownloadZip(urls);
  }

  const navigate = useNavigate();

  const rateData = useMemo(() => state?.charge_detail ?? [], [state?.charge_detail]);

  return (
    <section className="py-2 h-full w-full">
      <div className="grid grid-cols-[2fr_62px_1fr] w-full h-full ">
        <div className="mb-3">
          <h1 className="flex justify-start items-center gap-2 m-0 text-3xl">
            <span>{state?.job_no} </span>
            <Tag color="geekblue">{["未支付", "已支付"][state?.status]} </Tag>
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
                MAKE PAYMENT
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
            <h2 className="my-1 font-semibold">Recipient </h2>
            <p>{state?.consignee_address}</p>
          </div>
          <div className="my-2">
            <h2 className="my-1 font-semibold">Invoice Details</h2>
            <RateInformation data={rateData} />
          </div>
        </div>
        <Divider type="vertical" className="h-[95vh] w-[2px] mx-3" />
        <div className="w-40 max-content">
          <CheckCard dataSource={billingData} />
          <div>
            <h1>Containers</h1>
            <div className="flex justify-between">
              <p> 123453456(40’HQ) </p>
              <Button onClick={handleDownloadAll}>Download All</Button>
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
        drawerProps={{ title: "Upload Bank Receipt" }}
        uploadOptions={{ title: "Upload Bank Receipt", id, type: 3 }}
        open={open}
        setOpen={setOpen}
      />
    </section>
  );
}

export default BookingDetail;
