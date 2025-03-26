import { Fragment } from "react";
import { Tabs } from "antd";
import { useTranslation } from "react-i18next";
import { PrimaryTable } from "../PrimaryTable";
import randomUUID from "../../utils/randomUUID.ts";
import styles from "./styles.module.less";

function RateInformation({ data, column }) {
  const { total, rate_information: rateData } = data;
  const { t } = useTranslation();

  const rateTabs = rateData?.map(({ cost_type, list, sum }, idx) => ({
    key: cost_type,
    label: t("shipment." + cost_type.toUpperCase()),
    children: (
      <Fragment key={idx}>
        <PrimaryTable
          dataSource={list.map((item) => ({ id: randomUUID(), ...item }))}
          columns={column}
          sum={sum}
        />
        <div className="-mt-1">
          {total.map((item, index) => (
            <ul
              className="grid grid-cols-3 mx-2 my-0 px-[14px] py-[10px] bg-[#fafafb] list-none text-center"
              style={{ border: "1px solid #f0f0f0", borderTop: "unset" }}
              key={index}
            >
              <li>{t("shipment.total")}</li>
              <li>{item?.currency}</li>
              <li>{(+item?.amount || 0)?.toFixed(2)}</li>
            </ul>
          ))}
        </div>
      </Fragment>
    )
  }));

  return <Tabs items={rateTabs} type="card" className={styles.rateInfos} />;
}

export default RateInformation;
