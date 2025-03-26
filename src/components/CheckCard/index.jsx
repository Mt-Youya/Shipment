import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { clsx } from "clsx";
import { Select, Empty } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { LangStore } from "@/store/lang.js";
import { getBillings } from "@/service/billings/index.js";
import styles from "./index.module.less";
import formatDateTime from "@/utils/formatDateTime.js";

function CardItem({ className, data }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const [isChecked, setIsChecked] = useState(+data.id === +id);
  useEffect(() => {
    setIsChecked(+data.id === +id);
  }, [data.id]);

  const classnames = clsx(
    "bg-[#566AE50D] cursor-pointer flex flex-col my-2 gap-1 px-4 py-3 border-black border border-solid hover:border-indigo-600 rounded-md transition-colors",
    isChecked ? styles.checked : "",
    styles.checkcard,
    className
  );

  function handleClick() {
    !isChecked && setIsChecked(!isChecked);
    navigate(`/billing/detail/${data.id}`);
  }

  return (
    <li className={classnames} onClick={handleClick}>
      <div className="flex justify-between">
        <div className="flex gap-1 justify-start">{data?.hbl_no}</div>
        <span className="text-primary">
          {[t("status.unpaid"), t("status.unsettled"), t("status.paid")][data?.status]}
        </span>
      </div>
      <div className="flex justify-between gap-1">
        <div className="flex justify-start items-center gap-1">
          <img src="/images/icons/Calender.svg" alt="Calender" />
          <span>{formatDateTime(data?.due)}</span>
        </div>
        <div className="flex justify-start items-center gap-0.5">
          <img src="/images/icons/Cash.svg" alt="Cash" />
          <span>${data?.total_amount}</span>
        </div>
      </div>
    </li>
  );
}

const pageSize = 4;
function CheckCard() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [value, setValue] = useState();

  const [data, setData] = useState([]);

  async function fetchData() {
    const { list = [], meta } = await getBillings();
    list.forEach((item) => {
      item.invoice_type = item.invoice_type.value;
    });
    setData(list);
    const idx = list.findIndex((item) => +item.id === +id);
    setCurrent(Math.ceil((idx + 1) / pageSize) - 1);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const maxPage = useMemo(() => Math.ceil(data.length / pageSize), [data]);

  function handlePageChange(step = "next") {
    if (step === "prev") {
      setCurrent(current > 0 ? current - 1 : 0);
    } else {
      if (list.length < pageSize || current >= maxPage) {
        return;
      }
      setCurrent(current < maxPage ? current + 1 : maxPage);
    }
  }

  const list = useMemo(() => {
    const arr = value === void 0 ? data : data.filter((item) => item.status === value);
    const arr2 = arr.slice(current * pageSize, current * pageSize + pageSize);
    if (arr2.length === 0) {
      setCurrent((prevState) => (prevState > 0 ? prevState - 1 : 0));
    }
    return arr2;
  }, [current, data, value]);

  const selectOptions = [
    { label: t("status.unpaid"), value: 0 },
    { label: t("status.unsettled"), value: 1 },
    { label: t("status.paid"), value: 2 }
  ];

  const { lang } = LangStore();

  return (
    <>
      <div className={`flex gap-1 ${styles.divider}`}>
        <h1 className="m-0">{t("billing.status")}</h1>
        <Select
          allowClear
          placeholder="Please select"
          options={selectOptions}
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
        {!list.length && (
          <div className="my-1 text-center mb-2">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={lang === "en" ? "No Data" : "无数据"}
            />
          </div>
        )}
      </ul>
    </>
  );
}

export default CheckCard;
