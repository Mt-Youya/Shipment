import { Table } from "antd";
import DetailOrder from "./detail-order";

function DetailOwn({ service, container, cargo }) {
  const serviceColumns = [
    { title: "Trade Terms", key: "trade_terms", dataIndex: "trade_terms" },
    { title: "Service Type", key: "delivery_type", dataIndex: "delivery_type" },
    { title: "I/E", key: "import_type", dataIndex: "import_type" }
  ];

  const containerColumns = [
    { title: "Qty", key: "qty", dataIndex: "quantity" },
    { title: "Type", key: "type", dataIndex: "container_type_code" },
    { title: "Container No.", key: "containerNo", dataIndex: "container_no" },
    { title: "Seal No.", key: "sealNo", dataIndex: "seal_no" },
    { title: "Carrier", key: "carrier", dataIndex: "carrier" }
    // { title: "HBL", key: "hbl", dataIndex: "hbl" }
  ];

  const cargoColumns = [
    { title: "Commodity", key: "commodity", dataIndex: "goods_desc" },
    { title: "Gross Weight", key: "grossWeight", dataIndex: "weight" },
    { title: "Quality", key: "quality", dataIndex: "package_count" },
    { title: "Package", key: "package", dataIndex: "packing_unit" },
    { title: "Volume", key: "volume", dataIndex: "volume" }
  ];

  return (
    <div>
      <p className="mt-2 mb-1 font-bold">Service</p>
      <Table
        bordered
        rowKey="id"
        pagination={false}
        dataSource={service}
        loading={!service}
        columns={serviceColumns}
      />

      <p className="mt-2 mb-1 font-bold">Container</p>
      <Table
        bordered
        rowKey="container_no"
        pagination={false}
        dataSource={container}
        loading={!container}
        columns={containerColumns}
      />

      <p className="mt-2 mb-1 font-bold">Cargo details</p>
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
