import { Tabs } from "antd";
import { PrimaryTable } from "../PrimaryTable";
import randomUUID from "../../utils/randomUUID.ts";
import styles from "./styles.module.less";

import type { ColumnType } from "antd/es/table/interface";

function RateInformation({ data }) {
  const { total, rate_information: rateData } = data;
  const rateColumns: ColumnType[] = [
    { key: "Item", title: "Item Name", dataIndex: "cost_item_en" },
    { key: "Unit", title: "Unit price (including tax)", dataIndex: "quote_unit_price" },
    { key: "Currency", title: "Currency", dataIndex: "currency" },
    { key: "Qty", title: "Qty", dataIndex: "quantity" },
    { key: "Total", title: "Total amount (including tax)", dataIndex: "total_amount" }
  ];

  const rateTabs = rateData?.map(({ cost_type, list, sum }) => ({
    key: cost_type,
    label: cost_type.toUpperCase(),
    children: (
      <>
        <PrimaryTable
          dataSource={list.map((item) => ({ ...item, id: item.id ?? randomUUID() }))}
          columns={rateColumns}
          sum={sum}
        />
        <ul
          className="grid grid-cols-3 mx-2 my-0 -mt-1 px-[14px] py-[10px] bg-[#fafafb] list-none text-center"
          style={{ border: "1px solid #f0f0f0", borderTop: "unset" }}
        >
          <li>Total</li>
          <li>CNY</li>
          <li>{total?.toFixed(2)}</li>
        </ul>
      </>
    )
  }));

  return <Tabs items={rateTabs} type="card" className={styles.rateInfos} />
}

export default RateInformation;
