import { useMemo } from "react";
import { Divider, Table, Tabs } from "antd";
import VerticalSlider from "@/components/VerticalSlider/index.js";
import RateInformations from "@/components/RateInformations/index.js";
import randomUUID from "@/utils/randomUUID.js";

function PrimaryTable(props) {
  const subtotal = useMemo(
    () => props.dataSource.reduce((preValue, item) => item.price ?? 0 + preValue, 0),
    [props.dataSource]
  );

  return (
    <Table
      bordered
      rowKey="id"
      className="mt-1 mx-1"
      pagination={false}
      footer={() => (
        <ul className="list-none my-0 p-0 grid grid-cols-3 w-full text-center">
          <li>Subtotal</li>
          <li>USD</li>
          <li>{subtotal.toFixed(2)}</li>
        </ul>
      )}
      loading={!props.dataSource}
      {...props}
    />
  );
}

function DetailCost({ dataSource }) {
  const costColumns = [
    { key: "quote_no", dataIndex: "quote_no", title: "Quoto" },
    { key: "carrier", dataIndex: "carrier", title: "Carrier" },
    {
      key: "carrier_advertised",
      dataIndex: "carrier_advertised",
      title: "Carrier-advertised"
    },
    { key: "total_amount", dataIndex: "total_amount", title: "Total" },
    { key: "expires", dataIndex: "expires", title: "Expires" },
    { key: "action", dataIndex: "action", title: "Action" }
  ];

  const transitColumns = [
    { key: "mode", dataIndex: "mode", title: "MODE" },
    {
      key: "carrier_advertised",
      dataIndex: "carrier_advertised",
      title: "CARRIER-ADVERTISED"
    },
    { key: "carrier_name", dataIndex: "carrier_name", title: "CARRIER" },
    { key: "freight_service", dataIndex: "freight_service", title: "FREIGHT SERVICE" },
    { key: "closing_days", dataIndex: "closing_days", title: "CLOSING DAYS" },
    { key: "departure_days", dataIndex: "departure_days", title: "DEPARTURE DAYS" },
    { key: "pre_carriage", dataIndex: "pre_carriage", title: "PRE-CARRIAGE" }
  ];

  const rateColumns = [
    { key: "cost_item_en", dataIndex: "cost_item_en", title: "Cost Description" },
    { key: "currency", dataIndex: "currency", title: "Cost Unit Name" },
    { key: "quote_unit_price", dataIndex: "quote_unit_price", title: "Unit Price" },
    { key: "quality", dataIndex: "quality", title: "Quality" },
    { key: "unit_name", dataIndex: "unit_name", title: "Unit" },
    { key: "total_amount", dataIndex: "total_amount", title: "Price" }
  ];

  const quoteData = useMemo(() => [{ ...dataSource?.quote_info, id: randomUUID() }], [dataSource]);
  const rateData = useMemo(
    () => dataSource?.rate_information ?? [],
    [dataSource?.rate_information]
  );
  const route = useMemo(() => dataSource?.route, [dataSource?.route]);
  const transitData = useMemo(
    () => dataSource?.transit_information ?? [],
    [dataSource?.transit_information]
  );

  const rateTabs = [
    {
      key: "origin",
      label: "ORIGIN CHARGES",
      children: <PrimaryTable dataSource={rateData} columns={rateColumns} />
    },
    {
      key: "ocean",
      label: "OCEAN FREIGHT",
      children: <PrimaryTable dataSource={rateData} columns={rateColumns} />
    },
    {
      key: "destination",
      label: "DESTINATION CHARGES",
      children: <PrimaryTable dataSource={rateData} columns={rateColumns} />
    },
    {
      key: "service",
      label: "SERVICE FEE",
      children: <PrimaryTable dataSource={rateData} columns={rateColumns} />
    }
  ];

  return (
    <div className="py-1">
      <Table
        bordered
        rowKey="id"
        className="my-1"
        pagination={false}
        columns={costColumns}
        dataSource={quoteData}
      />
      <h2 className="my-0">Quote Details:</h2>
      <h3 className="font-bold mt-1 text-[#69686D] ">Transit Information</h3>
      <Table
        bordered
        rowKey="id"
        pagination={false}
        columns={transitColumns}
        dataSource={transitData}
      />
      <div className="flex">
        <div className="flex-6">
          <h3 className="font-bold mb-1 text-[#69686D]">Rate Information</h3>
          <RateInformations data={{ total: dataSource?.total || 0, rate_information: rateData }} />
        </div>
        <Divider type="vertical" className="h-[80vh]" />
        <div className="flex-3">
          <h3>Route</h3>
          <ul className="mb-0 p-0 list-none *:text-[#69686D]">
            <li>
              Origin: &nbsp;<b>{route?.origin}</b>
            </li>
            <li>
              Origin Dwell: &nbsp;<b>{route?.origin_dwell}</b>
            </li>
            <li>
              Port to Port(Flexport Est.): &nbsp;<b>{route?.flex_port_est}</b>
            </li>
            <li>
              Destination Dwell: &nbsp;<b>{route?.destination_dwell}</b>
            </li>
            <li>
              Destination: &nbsp;<b>{route?.destination}</b>
            </li>
          </ul>
          <Divider />
          <VerticalSlider
            items={[
              {
                isMain: false,
                description: "PLACE OF PICKUP",
                content: <p className="mb-4">{route?.receipt_place_port_id}</p>
              },
              {
                isMain: false,
                description: "DEPARTURE PORT",
                content: <p className="mb-4">{route?.pol_port_id}</p>
              },
              {
                isMain: false,
                description: "TRANSIT PORT",
                content: <p className="mb-4">{route?.transit_port_id}</p>
              },
              {
                isMain: false,
                description: "ARRIVAL PORT",
                content: <p className="mb-4">{route?.pod_port_id}</p>
              },
              {
                isMain: false,
                showBar: false,
                description: "This is the receiving company",
                content: (
                  <p className="mb-4">
                    {route?.delivery_place_port_name}
                    {route?.delivery_place_port_address}
                  </p>
                )
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default DetailCost;
