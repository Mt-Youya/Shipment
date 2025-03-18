import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton, Tabs } from "antd";
import { clsx } from "clsx";
import { getShipments } from "../../service/shipments";
import { getDropdown } from "../../service/common.ts";
import { ShipmentsStore } from "../../store/shipments.ts";
import styles from "./index.module.less";
import StepCard from "../../components/StepCard";
import { useTranslation } from "react-i18next";

function ShipmentTab({ type }: { type?: number }) {
  const navigate = useNavigate();

  const [wayBills, setWayBills] = useState<Awaited<ReturnType<typeof getShipments>>["list"]>([]);

  async function getData() {
    setLoading(true);
    const { list = [] } = await getShipments({ type });
    setWayBills(list);
    setLoading(false);
  }

  const { setDropdownOptions } = ShipmentsStore();

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getData();
    getDropdown().then((options) => setDropdownOptions(options));
  }, []);

  return loading ? (
    <Skeleton paragraph={{ rows: 4 }} />
  ) : (
    wayBills.map((wayBill, index) => (
      <Fragment key={wayBill?.id || index}>
        <StepCard data={wayBill} onClick={() => navigate("/shipment/detail/" + wayBill?.id)} />
      </Fragment>
    ))
  );
}

function Shipment() {
  const { t } = useTranslation();
  const tabItems = [
    {
      key: "All",
      label: t("shipment.all shipment in processs"),
      children: <ShipmentTab />
    },
    {
      key: "next week",
      label: t("shipment.delivered within next week"),
      children: <ShipmentTab type={1} />
    }
  ];

  const classnames = clsx("my-2", styles.tabs);

  return (
    <section>
      <Tabs items={tabItems} className={classnames} />
    </section>
  );
}

export default Shipment;
