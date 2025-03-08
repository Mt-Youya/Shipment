import { Button, Card, Row, Col, Select, Flex, Dropdown } from "antd";
import React, { useState } from "react";
import { format, addWeeks, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { enUS } from "date-fns/locale";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const WeeklyCalendar: React.FC<{
  data: any;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}> = (props) => {
  const { data, currentDate, setCurrentDate } = props;
  const [isPickupSelected, setIsPickupSelected] = useState(true);

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
    const arr = list.map(
      (
        e: {
          order_no:
            | string
            | number
            | boolean
            | React.ReactElement<any, string | React.JSXElementConstructor<any>>
            | Iterable<React.ReactNode>
            | React.ReactPortal
            | Iterable<React.ReactNode>
            | null
            | undefined;
          status:
            | string
            | number
            | boolean
            | React.ReactElement<any, string | React.JSXElementConstructor<any>>
            | Iterable<React.ReactNode>
            | React.ReactPortal
            | Iterable<React.ReactNode>
            | null
            | undefined;
        },
        index: any
      ) => {
        return {
          label: (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                width: "200px",
                color: "#566AE5"
              }}
            >
              <div>{e.order_no}</div>
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
            </div>
          ),
          key: index
        };
      }
    );

    return arr;
  };

  return (
    <Card
      style={{ height: "100%" }}
      title={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: "10px" }}>
              {format(startOfWeek(currentDate, { weekStartsOn: 1 }), "MMM d", { locale: enUS })} -
              {format(endOfWeek(currentDate, { weekStartsOn: 1 }), " MMM d", { locale: enUS })}
            </div>
            <img src="/images/Group 90.png" alt="" />
          </div>
          <div>
            <Button
              onClick={() => {
                handlePickupClick(true);
              }}
              type={isPickupSelected ? "primary" : "default"}
            >
              提货
            </Button>
            <Button
              type={isPickupSelected ? "default" : "primary"}
              onClick={() => {
                handlePickupClick(false);
              }}
              style={{ marginRight: "20px" }}
            >
              派送
            </Button>
            <Button icon={<LeftOutlined />} onClick={() => handleWeekChange(-1)} />
            <Button
              icon={<RightOutlined />}
              onClick={() => handleWeekChange(1)}
              style={{ marginLeft: 8 }}
            />
          </div>
        </div>
      }
    >
      <div style={{ display: "flex", flexWrap: "wrap", height: "250px" }}>
        {getWeekDays(currentDate).map((date, index) => (
          <div
            key={index}
            style={{
              textAlign: "center",
              padding: "10px",
              borderRight: "1px solid #ddd",
              borderLeft: index === 0 ? "1px solid #ddd" : "",
              height: "100%",
              width: "14%"
            }}
          >
            <div>{format(date, "EEE", { locale: enUS })}</div>
            <div style={{ fontSize: "24px", fontWeight: 500 }}>
              {format(date, "d", { locale: enUS })}
            </div>
            {isPickupSelected ? (
              data?.goods_pickup?.[index] ? (
                <div>
                  {Object.entries(data.goods_pickup[index]).length > 0
                    ? Object.entries(data.goods_pickup[index]).map(([key, value]) => (
                        <div key={key} style={{ textAlign: "left" }}>
                          <span>{value}&nbsp;</span>
                          <span>{key}</span>
                        </div>
                      ))
                    : "None"}
                </div>
              ) : (
                "None"
              )
            ) : data?.delivery?.[index].length > 0 ? (
              data.delivery[index].map((e: React.Key | null | undefined) => (
                <Dropdown menu={{ items: items(e.sub_order) }} key={e}>
                  <a>{`${e?.client_name}${e?.order_no}${e?.port_name}${e?.container}`}</a>
                </Dropdown>
              ))
            ) : (
              "None"
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WeeklyCalendar;
