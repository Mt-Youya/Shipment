import { useMemo } from "react";
import { Divider, Table } from "antd";
import { useTranslation } from "react-i18next";
import VerticalSlider from "@/components/VerticalSlider";
import RateInformation from "@/components/RateInformations";
import randomUUID from "@/utils/randomUUID.js";

function DetailCost({ dataSource }) {
  const { t } = useTranslation();
  const costColumns = [
    { key: "quote_no", dataIndex: "quote_no", title: t("shipment.quote") },
    { key: "carrier", dataIndex: "carrier", title: t("shipment.carrier") },
    {
      key: "carrier_advertised",
      dataIndex: "carrier_advertised",
      title: t("shipment.carrier-advertised")
    },
    { key: "total_amount", dataIndex: "total_amount", title: t("shipment.total") },
    { key: "expires", dataIndex: "expires", title: t("shipment.expires") },
    { key: "action", dataIndex: "action", title: t("shipment.action") }
  ];

  const transitColumns = [
    { key: "mode", dataIndex: "mode_name", title: t("shipment.mode") },
    {
      key: "carrier_advertised",
      dataIndex: "carrier_advertised",
      title: t("shipment.CARRIER-ADVERTISED")
    },
    { key: "carrier_name", dataIndex: "carrier_name", title: t("shipment.CARRIER") },
    { key: "freight_service", dataIndex: "freight_service", title: t("shipment.FREIGHT SERVICE") },
    { key: "closing_days", dataIndex: "closing_days", title: t("shipment.CLOSING DAYS") },
    { key: "departure_days", dataIndex: "departure_days", title: t("shipment.DEPARTURE DAYS") },
    { key: "pre_carriage", dataIndex: "pre_carriage", title: t("shipment.PRE-CARRIAGE") }
  ];

  const quoteData = useMemo(() => [{ id: randomUUID(), ...dataSource?.quote_info }], [dataSource]);
  const rateData = useMemo(
    () => dataSource?.rate_information ?? [],
    [dataSource?.rate_information]
  );
  const route = useMemo(() => dataSource?.route, [dataSource?.route]);
  const transitData = useMemo(
    () => dataSource?.transit_information?.map((item) => ({ id: randomUUID(), ...item })) ?? [],
    [dataSource?.transit_information]
  );

  const rateColumns = [
    { title: t("billing.cost Description"), dataIndex: "cost_item_en" },
    { title: t("billing.cost Unit Name"), dataIndex: "currency" },
    { title: t("billing.unit Price"), dataIndex: "quote_unit_price" },
    { title: t("billing.quality"), dataIndex: "quantity" },
    { title: t("billing.unit"), dataIndex: "unit_name" },
    { title: t("billing.price"), dataIndex: "total_amount" }
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
      <h2 className="my-0">{t("shipment.quote")}:</h2>
      <h3 className="font-bold mt-1 text-[#69686D]">{t("shipment.transit Information")}</h3>
      <Table
        bordered
        rowKey="id"
        pagination={false}
        columns={transitColumns}
        dataSource={transitData}
      />
      <div className="flex">
        <div className="flex-6">
          <h3 className="font-bold my-1 text-[#69686D]">{t("shipment.rate Information")}</h3>
          <RateInformation
            data={{ total: dataSource?.total || 0, rate_information: rateData }}
            column={rateColumns}
          />
        </div>
        <Divider type="vertical" className="h-[80vh]" />
        <div className="flex-3 mt-1">
          <h3>{t("shipment.route")}</h3>
          <ul className="mb-0 p-0 list-none *:text-[#69686D]">
            <li>
              {t("shipment.origin")}: &nbsp;<b>{route?.origin}</b>
            </li>
            <li>
              {t("shipment.origin Dwell")}: &nbsp;<b>{route?.origin_dwell}</b>
            </li>
            <li>
              {t("shipment.port to Port(Flexport Est.)")}: &nbsp;<b>{route?.flex_port_est}</b>
            </li>
            <li>
              {t("shipment.destination Dwell")}: &nbsp;<b>{route?.destination_dwell}</b>
            </li>
            <li>
              {t("shipment.destination")}: &nbsp;<b>{route?.destination}</b>
            </li>
          </ul>
          <Divider />
          <VerticalSlider
            items={[
              {
                isMain: false,
                description: <span className="text-base font-medium"> PLACE OF PICKUP</span>,
                content: <p className="mb-4 text-[#A3A3A3]">{route?.receipt_place_port_id}</p>
              },
              {
                isMain: false,
                description: <span className="text-base font-medium"> DEPARTURE PORT</span>,
                content: <p className="mb-4 text-[#A3A3A3]">{route?.pol_port_id}</p>
              },
              {
                isMain: false,
                description: <span className="text-base font-medium"> TRANSIT PORT</span>,
                content: <p className="mb-4 text-[#A3A3A3]">{route?.transit_port_id}</p>
              },
              {
                isMain: false,
                description: <span className="text-base font-medium"> ARRIVAL PORT</span>,
                content: <p className="mb-4 text-[#A3A3A3]">{route?.pod_port_id}</p>
              },
              {
                isMain: false,
                showBar: false,
                description: (
                  <span className="text-base font-medium">{route?.delivery_place_port_name}</span>
                ),
                content: <p className="mb-4 text-[#A3A3A3]">{route?.delivery_place_port_address}</p>
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default DetailCost;
