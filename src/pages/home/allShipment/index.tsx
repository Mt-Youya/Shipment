import { useEffect, useState } from "react";
import { indexOrderAPI } from "../../../service/shipmentAPI/index";
import styles from ".././DashboardLayout.module.css"; // 导入CSS Modules文件
import ProgressComp from "./progressComp";
import { Button, Select } from "antd";
import { useNavigate } from "react-router-dom";
import fullLoading from "../../../components/loading";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

function index() {
  const { t } = useTranslation();
  const navigator = useNavigate();
  const [data, setData] = useState([]);
  const [params, setParams] = useState({ sort_type: "1", sort: "CRD" });
  const [count, setCount] = useState(0);
  const [valueSort, setValueSort] = useState(t("home.ascending"));
  const [value, setValue] = useState(t("home.crd"));
  useEffect(() => {
    getData();
  }, [params]);
  const getData = async () => {
    try {
      fullLoading.show();
      const res = await indexOrderAPI(params);
      fullLoading.hide();
      setData(res.list);
      setCount(res.count);
    } catch (error) {
      fullLoading.hide();
    }
  };
  const currentStatus = (e) => {
    if (e.includes("ATD") || e.includes("ETD") || e.includes("ATA")) {
      return "In transit";
    } else {
      return e;
    }
  };

  return (
    <div style={{ height: "100%" }}>
      <div className={styles.title}>
        <div style={{ fontSize: "24px", fontWeight: "700", display: "flex", alignItems: "center" }}>
          <div>{t("home.allShipment")}</div>
          {count > 0 && <div className={styles.badge}>{count}</div>}
        </div>
        <div style={{ marginRight: "10px" }}>
          <Select
            onChange={(value) => {
              setParams({ ...params, sort: value });
              setValue(value);
            }}
            style={{
              width: 140,
              marginRight: "10px"
            }}
            value={value}
            options={[
              {
                value: "CRD",
                label: t("home.crd")
              },
              {
                value: "delivery_date",
                label: t("home.deliveryDate")
              },
              {
                value: "updated_at",
                label: t("home.DOU")
              },
              {
                value: "created_at",
                label: t("home.TOC")
              },
              {
                value: "destination",
                label: t("home.DAD")
              }
            ]}
          />
          <Select
            onChange={(value) => {
              setParams({ ...params, sort_type: value });
              setValueSort(value);
            }}
            style={{
              width: 150,
              marginRight: "10px"
            }}
            value={valueSort}
            options={[
              {
                value: "2",
                label: t("home.descending")
              },
              {
                value: "1",
                label: t("home.ascending")
              }
            ]}
          />

          <Button
            onClick={() => {
              navigator("/shipment");
            }}
          >
            {t("home.viewAll")}
          </Button>
        </div>
      </div>
      <div className={styles.RT_content}>
        {data.length > 0 &&
          data.map((e: any, index) => {
            if (index < 9) {
              return (
                <div
                  key={e.order_id}
                  className={styles.RT_item}
                  onClick={() => navigator("/shipment/detail/" + e?.order_id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.RT_itemone}>{e.title}</div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between", color: "#A3A3A3" }}
                  >
                    <div className="flex flex-wrap" style={{ maxWidth: "350px", columnCount: 2, columnGap: 0 }}>
                      {e.po_order.length > 0 &&
                        e.po_order.map((item) => (
                          <span
                            className={styles.RT_itemtwo}
                            style={{ whiteSpace: "pre-wrap", margin: "2px" }}
                          >
                            {item.split("\n").map((e, index) => (
                              <div key={index}>PO: {e}</div>
                            ))}
                          </span>
                        ))}
                    </div>
                    <ProgressComp currentStatus={currentStatus(e.order_progress)} />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#A3A3A3",
                      marginTop: "5px"
                    }}
                  >
                    <img
                      src="/images/time.png"
                      alt=""
                      style={{ marginRight: "5px", width: "16px" }}
                    />
                    CRD:{e.date ? dayjs(e.date).format("MMMDD") : ""}
                  </div>
                </div>
              );
            }
          })}
      </div>
    </div>
  );
}

export default index;
