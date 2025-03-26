import { Button, Card, Row, Col, Select, Flex, Dropdown, Segmented, Popover } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, addWeeks, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { enUS } from "date-fns/locale";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import styles from ".././DashboardLayout.module.css"; // 导入CSS Modules文件
import { useTranslation } from "react-i18next";

const WeeklyCalendar: React.FC<{
  data: any;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}> = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, currentDate, setCurrentDate } = props;
  const [isPickupSelected, setIsPickupSelected] = useState(true);
  const [activeColumnIndex, setActiveColumnIndex] = useState<number>(-1); // 新增状态变量

  const getWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // 周一开始
    return eachDayOfInterval({
      start,
      end: new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000)
    });
  };

  // 处理周切换
  const handleWeekChange = (weeks: number) => {
    setCurrentDate((prev: Date) => addWeeks(prev, weeks));
  };
  const handlePickupClick = (e: boolean | ((prevState: boolean) => boolean)) => {
    setIsPickupSelected(e);
  };
  const content = (list) => {
    return (
      <div style={{ width: "234px" }}>
        <div
          style={{
            borderBottom: "1px solid #CED0D1",
            marginBottom: "5px",
            fontSize: "14px",
            fontWeight: "700"
          }}
        >
          {list.length} {list.length > 0 ? " containers" : "container"}
        </div>
        {list.map((e, index) => {
          return (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "#566AE5",
                  marginTop: "5px"
                }}
              >
                <div style={{ fontWeight: "500" }}>{e.order_no}</div>
                {e.status && (
                  <div
                    style={{
                      padding: "2px",
                      border: "1px solid",
                      background: "#566AE51A",
                      borderRadius: "4px",
                      width: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontWeight: "400"
                    }}
                  >
                    {e.status}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ height: "100%" }}>
      <div className={styles.title}>
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex" }}>
            <div
              style={{
                marginRight: "10px",
                fontSize: "18px",
                fontWeight: "700",
                display: "flex",
                lineHeight: "19px"
              }}
            >
              <div>
                <div>
                  {format(startOfWeek(currentDate, { weekStartsOn: 1 }), "MMMd", {
                    locale: enUS
                  })}
                </div>
                <div style={{ fontSize: "14px", fontWeight: "400" }}>
                  {format(startOfWeek(currentDate, { weekStartsOn: 1 }), "yyyy", {
                    locale: enUS
                  })}
                </div>
              </div>
              &nbsp;-&nbsp;
              <div>
                <div>
                  {format(endOfWeek(currentDate, { weekStartsOn: 1 }), " MMMd", { locale: enUS })}
                </div>
                <div style={{ fontSize: "14px", fontWeight: "400" }}>
                  {format(endOfWeek(currentDate, { weekStartsOn: 1 }), " yyyy", { locale: enUS })}
                </div>
              </div>
            </div>
          </div>

          <div>
            <Segmented
              style={{
                marginRight: "20px",
                border: "1px solid #ddd",
                background: "white"
              }}
              options={[
                { value: "pickup", label: t("home.pickup") },
                { value: "deliveries", label: t("home.deliveries") }
              ]}
              onChange={(value) => {
                handlePickupClick(value === "pickup");
              }}
            />
            <Button icon={<LeftOutlined />} onClick={() => handleWeekChange(-1)} />
            <Button
              icon={<RightOutlined />}
              onClick={() => handleWeekChange(1)}
              style={{ marginLeft: "10px" }}
            />
          </div>
        </div>
      </div>
      <div className={styles.RT_content}>
        <div style={{ display: "flex", height: "100%" }}>
          {getWeekDays(currentDate).map((date, index) => {
            //判断date是否是今天
            const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
            return (
              <div
                key={index}
                style={{
                  textAlign: "center",
                  background: activeColumnIndex === index ? "rgba(86, 106, 229, 0.05)" : "",
                  paddingTop: "10px",
                  borderRight: index === 6 ? "" : "1px solid #ddd",
                  borderLeft: index === 0 ? "1px solid #ddd" : "",
                  height: "100%",
                  width: activeColumnIndex === index ? "20%" : "14%", // 动态设置宽度
                  transition: "width 0.3s ease",
                  position: "relative",
                  flex: "0 0 auto"
                }}
              >
                <div
                  onClick={() => {
                    // if (isPickupSelected === false) {
                    if (activeColumnIndex === index) {
                      setActiveColumnIndex(-1);
                    } else {
                      setActiveColumnIndex(index);
                    }
                    // }
                  }}
                >
                  <div style={{ fontSize: "11px", color: isToday ? "#566AE5" : "#69686D" }}>
                    {format(date, "EEE", { locale: enUS })}
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 500,
                      color: isToday ? "#566AE5" : "#171629"
                    }}
                  >
                    {format(date, "d", { locale: enUS })}
                  </div>
                </div>
                {isPickupSelected ? (
                  // 提货
                  data?.goods_pickup?.[index] ? (
                    <div>
                      <div>
                        {Object.entries(data.goods_pickup[index]).length > 0 ? (
                          Object.entries(data.goods_pickup[index]).map(([key, value]) => {
                            return (
                              <div>
                                <div
                                  key={key}
                                  style={{
                                    textAlign: "center",
                                    borderRadius: "4px",
                                    background: key === "shipment" ? "#E684231A" : "#D84CE51A",
                                    color: key === "shipment" ? "#E68423" : "#D84CE5",
                                    marginTop: "5px"
                                  }}
                                >
                                  <span>{value}&nbsp;</span>
                                  <span>{key}</span>
                                </div>
                                <Button
                                  style={{
                                    width: "80px",
                                    height: "24px",
                                    marginBottom: "10px",
                                    position: "absolute",
                                    bottom: 0,
                                    left: "50%",
                                    transform: "translateX(-50%)"
                                  }}
                                  type="primary"
                                  onClick={() => navigate("/shipment")}
                                >
                                  {t("home.viewAll")}
                                </Button>
                              </div>
                            );
                          })
                        ) : (
                          <span style={{ color: "#A3A3A3" }}>None</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span style={{ color: "#A3A3A3" }}>None</span>
                  )
                ) : data?.delivery?.[index].length > 0 ? (
                  // 派送
                  <div>
                    {data.delivery[index].map((e) => (
                      <Popover content={content(e.sub_order)} key={e} placement="bottom">
                        <div
                          style={{
                            textAlign: "left",
                            overflowWrap: "break-word",
                            color: "#69686D",
                            fontWeight: 500,
                            marginTop: "5px",
                            fontSize: "12px",
                            width: "100%",
                            background: "#F6F8FA",
                            padding: "10px 2px",
                            wordBreak: "break-all",
                            border: "1px solid #ddd",
                            borderRadius: "4px"
                          }}
                        >
                          <p style={{ color: "#566AE5", marginBottom: "5px" }}>{e?.client_name}</p>
                          <span
                            onClick={() => {
                              navigate("/shipment/detail/" + e?.order_id);
                            }}
                            style={{ textDecoration: "underline", cursor: "pointer" }}
                          >
                            {e?.order_no}
                            {e?.order_no ? "," : ""}
                          </span>
                          <span>
                            {e?.port_name.length > (activeColumnIndex === index ? 25 : 13)
                              ? e?.port_name.slice(0, activeColumnIndex === index ? 25 : 13) + "..."
                              : e?.port_name}
                          </span>
                          <p style={{ color: "#A3A3A3", marginTop: "5px" }}>{e?.container}</p>
                        </div>
                      </Popover>
                    ))}
                    <Button
                      style={{
                        width: "80px",
                        height: "24px",
                        marginBottom: "10px",
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)"
                      }}
                      type="primary"
                      onClick={() => navigate("/shipment")}
                    >
                      {t("home.viewAll")}
                    </Button>
                  </div>
                ) : (
                  <span style={{ color: "#A3A3A3" }}>None</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;
