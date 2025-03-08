import { useNavigate } from "react-router-dom";
import { Skeleton, Tabs } from "antd";
import { Fragment, useEffect, useState } from "react";
import { getShipments } from "../../service/shipments";
import { clsx } from "clsx";
import styles from "./index.module.less";
import StepCard from "../../components/StepCard";

function ShipmentTab({ type }) {
  const navigate = useNavigate();

  const [wayBills, setWayBills] = useState<Awaited<ReturnType<typeof getShipments>>["list"]>([]);
  async function getData() {
    setLoading(true);
    const { list = [] } = await getShipments({ type });
    setWayBills(list);
    setLoading(false);
  }

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getData();
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
  const tabItems = [
    {
      key: "All",
      label: "All shipment in processs",
      children: <ShipmentTab />
    },
    {
      key: "next week",
      label: "Delivered within next week",
      children: <ShipmentTab type={2} />
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
