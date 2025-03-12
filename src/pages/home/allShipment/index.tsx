import { useEffect, useState } from "react";
import { indexOrderAPI } from "../../../service/shipmentAPI/index";
import styles from ".././DashboardLayout.module.css"; // 导入CSS Modules文件
import ProgressComp from "./progressComp";
import { Button, Select } from "antd";
import { useNavigate } from "react-router-dom";
import fullLoading from "../../../components/loading";
import dayjs from "dayjs";

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
    <div style={{ height: "100%" }}>
      <div className={styles.title}>
        <div style={{ fontSize: "24px", fontWeight: "700" }}>All Shipment</div>
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
                <div style={{ maxWidth: "300px" }}>
                  {e.po_order.length > 0 &&
                    e.po_order.map((item) => (
                      <span
                        className={styles.RT_itemtwo}
                        style={{ whiteSpace: "pre-wrap", margin: "2px" }}
                      >
                        {item}
                      </span>
                    ))}
                </div>
                <ProgressComp currentStatus={e.order_progress} />
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <img src="/images/time.png" alt="" style={{ marginRight: "5px" }} />
                CRD:{e.date ? dayjs(e.date).format("MMMDD") : ""}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default index;
