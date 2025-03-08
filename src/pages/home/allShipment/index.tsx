import { useEffect, useState } from "react";
import { indexOrderAPI } from "../../../service/shipmentAPI/index";
import styles from ".././DashboardLayout.module.css"; // 导入CSS Modules文件
import ProgressComp from "./progressComp";
import { Button, Select } from "antd";
import { useNavigate } from "react-router-dom";
import fullLoading from "../../../components/loading";

function index() {
  const navigator = useNavigate();
  const [data, setData] = useState([]);
  const [params, setParams] = useState({ sort_type: "1", sort: "CRD" });
  useEffect(() => {
    getData();
  }, [params]);
  const getData = async () => {
    try {
      fullLoading.show();
      const res = await indexOrderAPI(params);
      fullLoading.hide();
      setData(res.list);
    } catch (error) {
      fullLoading.hide();
      message.error("error");
    }
  };

  return (
    <div>
      <div className={styles.title}>
        <h3 style={{ marginLeft: "10px" }}>All Shipment</h3>
        <div style={{ marginRight: "10px" }}>
          <Select
            onChange={(value) => {
              setParams({ ...params, sort: value });
            }}
            style={{
              width: 140,
              marginRight: "10px"
            }}
            defaultValue="货好日期"
            options={[
              {
                value: "CRD",
                label: "货好日期"
              },
              {
                value: "delivery_date",
                label: "交货日期"
              },
              {
                value: "updated_at",
                label: "最新船期变化"
              },
              {
                value: "created_at",
                label: "创建时间"
              },
              {
                value: "destination",
                label: "目的地到达日期"
              }
            ]}
          />
          <Select
            onChange={(value) => {
              setParams({ ...params, sort_type: value });
            }}
            style={{
              width: 150,
              marginRight: "10px"
            }}
            defaultValue="Sort ascending"
            options={[
              {
                value: "2",
                label: "Sort descending"
              },
              {
                value: "1",
                label: "Sort ascending"
              }
            ]}
          />

          <Button
            onClick={() => {
              navigator("/shipment");
            }}
          >
            View All
          </Button>
        </div>
      </div>
      <div className={styles.RT_content}>
        {data.length > 0 &&
          data.map((e: any) => (
            <div key={e.order_id} className={styles.RT_item}>
              <div className={styles.RT_itemone}>{e.title}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <span className={styles.RT_itemtwo}>
                    PO:
                    {e.po_order.join(",").length > 60
                      ? e.po_order.join(",").substring(0, 60) + "..."
                      : e.po_order.join(",")}
                  </span>
                </div>
                <ProgressComp currentStatus={e.order_progress} />
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <img src="/images/time.png" alt="" style={{ marginRight: "5px" }} />
                {e.date}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default index;
