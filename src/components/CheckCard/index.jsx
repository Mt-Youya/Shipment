import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { Select } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import styles from "./index.module.less";

function CardItem({ checked = false, className, data }) {
  const [isChecked, setIsChecked] = useState(checked);

  const classnames = clsx(
    "bg-[#566AE50D] cursor-pointer flex flex-col my-2 gap-1 px-4 py-3 border-black border border-solid hover:border-indigo-600 rounded-md transition-colors",
    isChecked ? styles.checked : "",
    styles.checkcard,
    className
  );

  return (
    <li className={classnames} onClick={() => setIsChecked(!isChecked)}>
      <div className="flex justify-between">
        <div className="flex gap-1 justify-start" onClick={() => setIsChecked(!isChecked)}>
          {data?.hbl_no}
        </div>
        <span className="text-primary">{["未支付", "已支付"][data?.status]} </span>
      </div>
      <div className="grid grid-cols-3 gap-1" style={{ gridTemplateColumns: "1fr 70px" }}>
        <div className="flex justify-start items-center gap-1">
          <img src="/images/icons/Calender.svg" alt="Calender" />
          <span>{data?.due}</span>
        </div>
        <div className="flex justify-start items-center gap-1">
          <img src="/images/icons/Cash.svg" alt="Cash" />
          <span>${data?.remain_amount}</span>
        </div>
      </div>
    </li>
  );
}

function CheckCard({ dataSource = [] }) {
  const [current, setCurrent] = useState(0);
  const [value, setValue] = useState(null);

  const maxPage = useMemo(() => Math.ceil(dataSource.length % 4), [dataSource]);

  function handlePageChange(step = "next") {
    if (step === "prev") {
      setCurrent(current > 0 ? current - 1 : 0);
    } else {
      setCurrent(current < maxPage ? current + 1 : maxPage);
    }
  }

  const pageSize = 4;
  const list = useMemo(() => {
    const arr = value === null ? dataSource : dataSource.filter((item) => item.status === value);
    return arr.slice(current * pageSize, current * pageSize + pageSize);
  }, [current, dataSource, value]);

  const selectOptions = [
    { label: "未支付", value: 0 },
    { label: "已支付", value: 1 }
  ];

  return (
    <>
      <div className={`flex gap-1 ${styles.divider}`}>
        <h1 className="m-0">Status</h1>
        <Select
          options={selectOptions}
          placeholder="Please select"
          onChange={setValue}
          value={value}
        />
        <button
          className="cursor-pointer border border-solid border-[#CED0D1] p-[8px] rounded-md"
          onClick={() => handlePageChange("prev")}
        >
          <LeftOutlined />
        </button>
        <button
          className="cursor-pointer border border-solid border-[#CED0D1] p-[8px] rounded-md"
          onClick={() => handlePageChange("next")}
        >
          <RightOutlined />
        </button>
      </div>
      <ul className="m-0 p-0">
        {list.map((item, index) => (
          <CardItem key={index} data={item} />
        ))}
        {!list.length && "No Data"}
      </ul>
    </>
  );
}

export default CheckCard;
