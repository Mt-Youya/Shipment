import React, { useEffect } from "react";
import styles from "./DashboardLayout.module.css"; // 导入CSS Modules文件
import HandleWeekChange from "./handleWeekChange";
import { Button } from "antd";
import AllShipment from "./allShipment";
import { indexAPI } from "../../service/shipmentAPI";
import Task from "./task";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import useDetailList from "../booking/detailList";
import { useTranslation } from "react-i18next";

const DashboardLayout: React.FC = () => {
  const { t } = useTranslation();
  const { drop } = useDetailList();
  const navigator = useNavigate();
  const [data, setData] = React.useState({});
  const [currentDate, setCurrentDate] = React.useState(new Date());

  useEffect(() => {
    getData(currentDate);
  }, [currentDate]);
  const getData = async (e) => {
    const res = await indexAPI({ date: dayjs(e).format("YYYY-MM-DD") });
    setData(res);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar} style={{ flexBasis: "60%" }}>
        <div className={styles.sidebarSection}>
          <HandleWeekChange data={data} currentDate={currentDate} setCurrentDate={setCurrentDate} />
        </div>
        <div className={styles.sidebarSection}>
          <AllShipment />
        </div>
      </div>
      <div className={styles.sidebar} style={{ flexBasis: "40%" }}>
        <div className={styles.sidebarSection}>
          <div className={styles.title}>
            <div
              style={{ fontSize: "24px", fontWeight: "700", display: "flex", alignItems: "center" }}
            >
              <div>{t("home.task")}</div>
              {data?.task?.count && <div className={styles.badge}>{data?.task.count}</div>}
            </div>
            <Button
              style={{ marginRight: "10px" }}
              onClick={() => {
                navigator("/business/tasks");
              }}
            >
              {t("home.viewAll")}
            </Button>
          </div>
          <div className={styles.RT_content}>{data?.task && <Task data={data?.task} />}</div>
        </div>
        {/* 提醒 */}
        <div className={styles.sidebarSection}>
          <div className={styles.title}>
            <div
              style={{ fontSize: "24px", fontWeight: "700", display: "flex", alignItems: "center" }}
            >
              <div>{t("home.Reminders")}</div>
              {data?.notice?.count && <div className={styles.badge}>{data.notice.count}</div>}
            </div>
            <Button
              style={{ marginRight: "10px" }}
              onClick={() => {
                navigator("/home/reminders");
              }}
            >
              {t("home.viewAll")}
            </Button>
          </div>
          <div className={styles.RT_content}>
            <div>
              {data?.notice &&
                data?.notice.list &&
                data.notice.list.map((e, index) => {
                  if (index < 9) {
                    return (
                      <div
                        className={styles.RT_item}
                        key={e.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => navigator("/shipment/detail/" + e?.sea_order_id)}
                      >
                        <div className={styles.RT_itemone}>{e.title}</div>
                        {e.po_list &&
                          e.po_list.length > 0 &&
                          e.po_list.map((item) => {
                            return (
                              <span
                                className={styles.RT_itemtwo}
                                style={{ whiteSpace: "pre-wrap", margin: "2px" }}
                              >
                                {item.split("\n").map((e, index) => (
                                  <div key={index}>PO: {e}</div>
                                ))}
                              </span>
                            );
                          })}

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            color: "#A3A3A3"
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              fontSize: "12px",
                              marginTop: "5px"
                            }}
                          >
                            <img src="images/Group18.png" alt="" style={{ width: "16px" }} />
                            &nbsp;{drop?.notice_type[e.notice_type]}
                          </div>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <img src="images/time.png" alt="" style={{ width: "16px" }} />
                            &nbsp; ETD:{dayjs(e.created_at).format("MMMDD")}
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
