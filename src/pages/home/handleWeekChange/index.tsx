import { Button, Card, Row, Col, Select, Flex, Dropdown, Segmented } from "antd";
import React, { useState } from "react";
import { format, addWeeks, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { enUS } from "date-fns/locale";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import styles from ".././DashboardLayout.module.css"; // 导入CSS Modules文件
import { ProFormSegmented } from "@ant-design/pro-components";

const WeeklyCalendar: React.FC<{
  data: any;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}> = (props) => {
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
    setCurrentDate((prev: any) => addWeeks(prev, weeks));
  };
  const handlePickupClick = (e: boolean | ((prevState: boolean) => boolean)) => {
    setIsPickupSelected(e);
  };

  const items = (list: any[]) => {
    const arr = list.map((e: {}, index: any) => {
      return {
        label: (
          <div style={{ padding: "10px" }}>
            <div
              style={{
                borderBottom: "1px solid #CED0D1",
                marginBottom: "5px",
                fontSize: "14px",
                fontWeight: "700"
              }}
            >
              {list.length + 1} {list.length > 1 ? "container" : "containers"}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                width: "200px",
                color: "#566AE5",
                marginTop: "5px"
              }}
            >
              <div>{e.order_no}</div>
              {e.status && (
                <div
                  style={{
                    padding: "2px",
                    border: "1px solid",
                    background: "#566AE51A",
                    borderRadius: "4px"
                  }}
                >
                  {e.status}
                </div>
              )}
            </div>
          </div>
        ),
        key: index
      };
    });
    return arr;
  };

  return (
    <>
      <div>
        <div className={styles.title}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  marginRight: "10px",
                  fontSize: "18px",
                  fontWeight: "700",
                  display: "flex"
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
                    {" "}
                    {format(endOfWeek(currentDate, { weekStartsOn: 1 }), " yyyy", { locale: enUS })}
                  </div>
                </div>
              </div>
              <img src="/images/Group 90.png" alt="" height={32} />
            </div>

            <div>
              <Segmented
                style={{
                  marginRight: "20px",
                  border: "1px solid #ddd",
                  background: "white"
                }}
                options={["Pickups", "Deliveries"]}
                onChange={(value) => {
                  handlePickupClick(value === "Pickups");
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
          <div style={{ display: "flex", flexWrap: "wrap", height: "250px" }}>
            {getWeekDays(currentDate).map((date, index) => (
              <div
                key={index}
                style={{
                  textAlign: "center",
                  padding: "10px",
                  borderRight: index === 6 ? "" : "1px solid #ddd",
                  borderLeft: index === 0 ? "1px solid #ddd" : "",
                  height: "100%",
                  width: activeColumnIndex === index ? "20%" : "14%", // 动态设置宽度
                  transition: "width 0.3s ease", // 添加动画效果
                  marginTop: "10px"
                }}
              >
                <div>{format(date, "EEE", { locale: enUS })}</div>
                <div style={{ fontSize: "24px", fontWeight: 500 }}>
                  {format(date, "d", { locale: enUS })}
                </div>
                {isPickupSelected ? (
                  data?.goods_pickup?.[index] ? (
                    <div>
                      {Object.entries(data.goods_pickup[index]).length > 0 ? (
                        Object.entries(data.goods_pickup[index]).map(([key, value]) => {
                          console.log(key);

                          return (
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
                          );
                        })
                      ) : (
                        <span style={{ color: "#A3A3A3" }}>None</span>
                      )}
                    </div>
                  ) : (
                    "None"
                  )
                ) : data?.delivery?.[index].length > 0 ? (
                  data.delivery[index].map((e) => (
                    <Dropdown menu={{ items: items(e.sub_order) }} key={e}>
                      <div
                        style={{
                          textAlign: "left",
                          overflowWrap: "break-word",
                          color: "#69686D",
                          fontWeight: 500
                        }}
                      >
                        <p>{e?.client_name}</p>
                        <a
                          onClick={() => {
                            if (activeColumnIndex === index) {
                              setActiveColumnIndex(-1); // 如果当前列已经是活跃状态，则恢复
                            } else {
                              setActiveColumnIndex(index); // 否则设置为活跃状态
                            }
                          }}
                        >
                          <p>{e?.order_no}</p>
                        </a>
                        <p>{e?.port_name}</p>
                        <p>{e?.container}</p>
                      </div>
                    </Dropdown>
                  ))
                ) : (
                  <span style={{ color: "#A3A3A3" }}>None</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default WeeklyCalendar;
