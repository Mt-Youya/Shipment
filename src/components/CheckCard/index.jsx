import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { Select } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import styles from "./index.module.less";
import { useNavigate, useParams } from "react-router-dom";
import formatDateTime from "@/utils/formatDateTime.js";
import { useTranslation } from "react-i18next";

function CardItem({ className, data }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isChecked, setIsChecked] = useState(+id === +data?.id);

  const classnames = clsx(
    "bg-[#566AE50D] cursor-pointer flex flex-col my-2 gap-1 px-4 py-3 border-black border border-solid hover:border-indigo-600 rounded-md transition-colors",
    isChecked ? styles.checked : "",
    styles.checkcard,
    className
  );

  function handleClick() {
    setIsChecked(!isChecked);
    navigate(`/billing/detail/${data.id}`);
  }

  return (
    <li className={classnames} onClick={handleClick}>
      <div className="flex justify-between">
        <div className="flex gap-1 justify-start">{data?.hbl_no}</div>
        <span className="text-primary">{["未支付", "已支付"][data?.status]} </span>
      </div>
      <div className="flex justify-between gap-1">
        <div className="flex justify-start items-center gap-1">
          <img src="/images/icons/Calender.svg" alt="Calender" />
          <span>{formatDateTime(data?.due)}</span>
        </div>
        <div className="flex justify-start items-center gap-0.5">
          <img src="/images/icons/Cash.svg" alt="Cash" />
          <span>${data?.remain_amount}</span>
        </div>
      </div>
    </li>
  );
}

function CheckCard({ dataSource = [] }) {
  const { t } = useTranslation();
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
    { label: t("common.unpaid"), value: 0 },
    { label: t("common.paid"), value: 1 }
  ];

  return (
    <>
      <div className={`flex gap-1 ${styles.divider}`}>
        <h1 className="m-0">{t("billing.status")}</h1>
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
