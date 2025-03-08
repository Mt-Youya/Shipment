import React from "react";
import { Progress } from "antd";

const status = [
  "Awaiting Arrival at Departure Port",
  "Arrived at Departure Port",
  "Estimated Time of Departure (ETD)",
  "Actual Time of Departure (ATD)",
  "Estimated Time of Arrival (ETA)",
  "Actual Time of Arrival (ATA)",
  "Final Delivery",
  "Delivered"
];

interface ShipmentStatusProps {
  currentStatus: string; // 后端传来的状态
}

const ShipmentStatus: React.FC<ShipmentStatusProps> = ({ currentStatus }) => {
  // 根据当前状态计算进度条的百分比
  const getProgressPercentage = (statusList: string[], current: string) => {
    const index = statusList.indexOf(current);
    return index !== -1 ? (index / (statusList.length - 1)) * 100 : 0;
  };

  const progress = getProgressPercentage(status, currentStatus);
  const circleWidth = 8; // 圆球宽度
  const circleSpacing = circleWidth / 2; // 圆球之间的间距
  const totalWidth = 300; // 进度条宽度

  return (
    <div style={{ position: "relative", width: "300px", marginRight: "20px" }}>
      <Progress percent={progress} strokeColor="#1890ff" trailColor="#ebedf0" showInfo={false} />
      {status.map((_, index) => {
        const percent = (index / (status.length - 1)) * 100;
        const offset =
          (percent / 100) * (totalWidth - circleWidth - circleSpacing * (status.length - 1));
        const left = `${offset + index * (circleWidth + circleSpacing)}px`;

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: left,
              top: "9px", // 调整圆点到进度条上方的距离
              width: `${circleWidth}px`,
              height: `${circleWidth}px`,
              backgroundColor: "#ffffff",
              // border: `2px solid #1890ff`, // 蓝色边框
              borderRadius: "50%",
              transition: "background-color 0.3s" // 可选：添加过渡效果
            }}
          ></div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: `${progress}%`,
          top: "0",
          transform: "translateX(-50%)"
        }}
      >
        <img src="/images/Group 16.png" alt="" />
      </div>

      {/* 当前状态文本 */}
      <div style={{ marginTop: "10px", position: "absolute" }}>{currentStatus}</div>
    </div>
  );
};

export default ShipmentStatus;
