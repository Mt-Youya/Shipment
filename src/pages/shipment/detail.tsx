import { useParams } from "react-router-dom";
import { getShipmentDetail, getShipmentMap } from "../../service/shipments";
import { useEffect, useMemo, useState } from "react";
import { Divider, Spin, Table, Tabs } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { isEmpty } from "lodash-es";
import { ShipmentsStore } from "../../store/shipments.ts";
import { useTranslation } from "react-i18next";
import { LangStore } from "../../store/lang.ts";
import formatDateTime from "../../utils/formatDateTime.ts";
import DetailOwn from "./detail-own.jsx";
import DetailDocuments from "./detail-documents.jsx";
import DetailCost from "./detail-cost.jsx";
import DetailBill from "./detail-bill.jsx";
import DrawerUpload from "../../components/DrawerUpload";
import randomUUID from "../../utils/randomUUID.ts";
import styles from "./index.module.less";
import "./style.css";

import type { AwaitedReturn } from "../../utils/common.type.ts";

function ShipmentDetails() {
  const { id } = useParams();

  const [state, setState] = useState<AwaitedReturn<typeof getShipmentDetail> | null>(null);

  const [loading, setLoading] = useState(false);
  async function getDetail() {
    setLoading(true);
    const detailData = await getShipmentDetail(id!);
    const { carrier } = detailData;
    detailData.detail.loading_detail = detailData.detail.loading_detail.map((goods) => ({
      ...goods,
      carrier
    }));
    setState(detailData);
    setLoading(false);
  }

  const { setMapData, mapData, dropdownOptions } = ShipmentsStore();

  useEffect(() => {
    getDetail();
    getShipmentMap(id).then((res) => setMapData(res));
  }, []);

  const { t } = useTranslation();

  const [orderId, setOrderId] = useState("");
  const completed = {
    title: t("shipment.status"),
    dataIndex: "updated_at",
    key: "updated_at",
    render: (_, item) => (
      <>
        <span>{formatDateTime(item.updated_at)}</span>
        <br />
        <span className="font-light text-[#69686D]">{t("shipment.task completed at")}</span>
      </>
    )
  };
  const incompleted = {
    title: t("shipment.status"),
    dataIndex: "created_at",
    key: "created_at",
    render: (_, item) => (
      <>
        <span>{formatDateTime(item.created_at)}</span>
        <br />
        <span className="font-light text-[#69686D]">{t("shipment.task created at")}</span>
      </>
    )
  };
  const commonColumns = [
    { title: "", key: "index", render: (_, __, index) => index + 1 },
    { title: t("shipment.task"), dataIndex: "title", key: "task" }
  ];
  const taskColumns = [
    {
      title: t("shipment.action"),
      key: "operate",
      render: (_, record) => (
        <a
          className="text-blue font-bold"
          onClick={() => {
            setOpen(true);
            setOrderId(record.id);
          }}
        >
          {t("shipment.upload")}
        </a>
      )
    }
  ];

  const taskItems = [
    {
      key: "Pending",
      label: `${t("shipment.pending Tasks")} ${state?.task_list?.incomplete?.count ?? ""}`,
      children: (
        <Table
          bordered
          rowKey="id"
          pagination={false}
          loading={!state?.task_list?.incomplete?.list}
          dataSource={state?.task_list?.incomplete?.list}
          columns={[...commonColumns, incompleted, ...taskColumns]}
        />
      )
    },
    {
      key: "Completed",
      label: `${t("shipment.completed Tasks")} ${state?.task_list?.complete?.count ?? ""}`,
      children: (
        <Table
          bordered
          rowKey="id"
          pagination={false}
          loading={!state?.task_list?.complete?.list}
          dataSource={state?.task_list?.complete?.list}
          columns={[...commonColumns, completed, ...taskColumns]}
        />
      )
    }
  ];

  const serviceData = useMemo(() => {
    const data = {
      trade_terms: state?.detail.trade_terms,
      delivery_type: state?.detail.delivery_type,
      import_type: state?.detail.import_type
    };
    return isEmpty(data) ? null : [{ id: randomUUID(), ...data }];
  }, [state]);

  const orderItems = [
    {
      key: "details",
      label: t("shipment.details"),
      children: (
        <DetailOwn
          service={serviceData}
          container={state?.detail.loading_detail}
          cargo={state?.detail.goods}
        />
      )
    },
    {
      key: "documents",
      label: t("shipment.documents"),
      children: <DetailDocuments />
    },
    {
      key: "estimatedCost",
      label: t("shipment.estimated cost"),
      children: <DetailCost dataSource={state?.cost} />
    },
    {
      key: "bill",
      label: t("shipment.bill"),
      children: <DetailBill dataSource={state?.invoice} />
    }
  ];

  const [tabKey, setTabKey] = useState("details");
  const TabPane = {
    details: DetailOwn,
    documents: DetailDocuments,
    bill: DetailBill
  }[tabKey];

  const [open, setOpen] = useState(false);

  const { lang } = LangStore();

  return (
    <section>
      <div>
        <div>
          <div className="flex justify-between py-1.5">
            <h1 className="w-60 my-0 text-2xl">
              <p className="h-fit">{state?.title}</p>
              {state?.crd && <p className="h-fit">CRD:{state?.crd}</p>}
            </h1>
            <ul className="list-none p-0 m-0 flex justify-end gap-1">
              {state?.po_list.map((po, pIdx) => (
                <li
                  className="border border-[#CED0D1] border-solid py-1.5 px-2 font-bold h-fit"
                  key={pIdx}
                >
                  PO: {po}
                </li>
              ))}
            </ul>
          </div>
          <p className="flex">
            <span>
              <FileTextOutlined />
              &nbsp;{state?.order_no} &emsp;&emsp;
            </span>
            <span className="flex">
              <img src="/images/icons/Address.svg" alt="address" />
              &nbsp;{state?.shipment_type}&nbsp;
            </span>
            |<span>&nbsp; {state?.container}&nbsp;</span>|<span>&nbsp; {state?.carrier}&nbsp;</span>
          </p>
        </div>
        <Divider orientation="right" className={styles.divider}>
          {tabKey !== "estimatedCost" ? (
            <span className="border border-[#CED0D1] border-solid py-0.5 px-1 font-bold rounded-md">
              {[3, 4, 5].includes(mapData?.status)
                ? t("status.shipStatus." + mapData?.status)
                : dropdownOptions?.["order_status" + (lang === "en" ? "_en" : "")]?.[
                    mapData?.status
                  ]}
            </span>
          ) : (
            <span className="py-0.5 h-2.5 w-0 block" />
          )}
        </Divider>
        <div className="flex justify-between">
          <div className={`min-w-60 w-full ${styles.detailTabs}`}>
            <div>
              <Spin spinning={loading}>
                <Tabs items={taskItems} type="card" onChange={() => getDetail()} />
              </Spin>
            </div>
            <br />
            <Tabs items={orderItems} onChange={(e) => setTabKey(e)} />
          </div>
          {tabKey !== "estimatedCost" && (
            <Divider type="vertical" className="h-[84vh] -mt-[27px]" />
          )}
          {TabPane?.Order && <TabPane.Order />}
        </div>
      </div>
      <DrawerUpload
        showHistory
        open={open}
        setOpen={setOpen}
        onFinish={() => location.reload()}
        uploadProps={{ accept: ".pdf,.png" }}
        drawerProps={{ title: t("common.upload files") }}
        uploadOptions={{ title: t("common.upload files"), type: 4, id: orderId }}
        acceptText={
          <p className="text-[#00000066]">{t("common.Supported extensions")}: .pdf .png</p>
        }
      />
    </section>
  );
}

export default ShipmentDetails;
