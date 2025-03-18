import { Table } from "antd";
import DetailOrder from "./detail-order";
import { useTranslation } from "react-i18next";

function DetailOwn({ service, container, cargo }) {
  const { t } = useTranslation();
  const serviceColumns = [
    { title: t("shipment.trade Terms"), key: "trade_terms", dataIndex: "trade_terms" },
    { title: t("shipment.service Type"), key: "delivery_type", dataIndex: "delivery_type" },
    { title: t("shipment.I/E"), key: "import_type", dataIndex: "import_type" }
  ];

  const containerColumns = [
    { title: t("shipment.qty"), key: "qty", dataIndex: "quantity" },
    { title: t("shipment.type"), key: "type", dataIndex: "container_type_code" },
    { title: t("shipment.container No."), key: "containerNo", dataIndex: "container_no" },
    { title: t("shipment.seal No."), key: "sealNo", dataIndex: "seal_no" },
    { title: t("shipment.carrier"), key: "carrier", dataIndex: "carrier" },
    { title: t("shipment.hbl"), key: "hbl", dataIndex: "hbl_no" }
  ];

  const cargoColumns = [
    { title: t("shipment.commodity"), key: "commodity", dataIndex: "goods_desc" },
    { title: t("shipment.gross Weight"), key: "grossWeight", dataIndex: "weight" },
    { title: t("shipment.quality"), key: "quality", dataIndex: "package_count" },
    { title: t("shipment.package"), key: "package", dataIndex: "packing_unit" },
    { title: t("shipment.volume"), key: "volume", dataIndex: "volume" }
  ];

  return (
    <div>
      <p className="mt-2 mb-1 font-bold">{t("shipment.service")}</p>
      <Table
        bordered
        rowKey="id"
        pagination={false}
        dataSource={service}
        loading={!service}
        columns={serviceColumns}
      />

      <p className="mt-2 mb-1 font-bold">{t("shipment.container")}</p>
      <Table
        bordered
        rowKey="container_no"
        pagination={false}
        dataSource={container}
        loading={!container}
        columns={containerColumns}
      />

      <p className="mt-2 mb-1 font-bold">{t("shipment.cargo details")}</p>
      <Table
        bordered
        rowKey="id"
        pagination={false}
        dataSource={cargo}
        loading={!cargo}
        columns={cargoColumns}
      />
    </div>
  );
}

DetailOwn.Order = DetailOrder;

export default DetailOwn;
