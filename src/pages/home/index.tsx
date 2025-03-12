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
            <div style={{ fontSize: "24px", fontWeight: "700" }}>Task</div>
            <Button
              style={{ marginRight: "10px" }}
              onClick={() => {
                navigator("/business/tasks");
              }}
            >
              View All
            </Button>
          </div>
          <div className={styles.RT_content}>{data?.task && <Task data={data?.task} />}</div>
        </div>
        {/* 提醒 */}
        <div className={styles.sidebarSection}>
          <div className={styles.title}>
            <div style={{ fontSize: "24px", fontWeight: "700" }}>Reminders</div>
            <Button
              style={{ marginRight: "10px" }}
              onClick={() => {
                navigator("/home/reminders");
              }}
            >
              View All
            </Button>
          </div>
          <div className={styles.RT_content}>
            {data?.notice &&
              data?.notice.list &&
              data.notice.list.map((e, index) => {
                if (index < 3) {
                  return (
                    <div className={styles.RT_item} key={e.id}>
                      <div className={styles.RT_itemone}>{e.title}</div>
                      {e.po_list &&
                        e.po_list.length > 0 &&
                        e.po_list.map((item) => {
                          return (
                            <span
                              className={styles.RT_itemtwo}
                              style={{ whiteSpace: "pre-wrap", margin: "2px" }}
                            >
                              {item}
                            </span>
                          );
                        })}

                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img src="images/Group18.png" alt="" />
                          {drop.notice_type[e.notice_type]}
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img src="images/time.png" alt="" />
                          ETD:{dayjs(e.created_at).format("MMMDD")}
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
  );
};

export default DashboardLayout;
