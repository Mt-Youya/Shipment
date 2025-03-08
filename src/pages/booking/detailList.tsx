import { useState, useEffect, useMemo } from "react";
import { getDropdown } from "../../service/common";

interface ChildType {
  name: string;
  label: string;
}

interface DetailItemType {
  type: string;
  id: number;
  label: string;
  name: string;
  placeholder?: string;
  col: string;
  children?: ChildType[];
  optionList?: ChildType[]; // 用于下拉选项
}

const useDetailList = () => {
  const [drop, setDrop] = useState<ChildType[]>({});

  useEffect(() => {
    fetchData();
  }, []); // 空依赖数组表示这个 effect 只在组件挂载时运行一次
  const fetchData = async () => {
    try {
      const res = await getDropdown(); // 假设 getDropdown 返回一个 Promise
      setDrop(res);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const detailList = useMemo(() => {
    return [
      {
        type: "input",
        id: 1,
        label: "查询单号",
        name: "inquiry_no",
        placeholder: "请输入",
        col: "6"
      },
      { type: "input", id: 2, label: "发货人", name: "shipper", placeholder: "请输入", col: "6" },
      { type: "input", id: 3, label: "收货人", name: "consignee", placeholder: "请输入", col: "6" },
      {
        type: "input",
        id: 4,
        label: "通知人",
        name: "notify_party",
        placeholder: "请输入",
        col: "6"
      },
      {
        type: "input",
        id: 5,
        label: "第二通知人",
        name: "sub_notify_party",
        placeholder: "请输入",
        col: "6"
      },
      {
        type: "input",
        id: 6,
        label: "收货地",
        name: "receipt_place",
        placeholder: "请输入",
        col: "6"
      },
      {
        type: "input",
        id: 7,
        label: "起运港",
        name: "loading_port",
        placeholder: "请输入",
        col: "6"
      },
      {
        type: "input",
        id: 8,
        label: "目的港",
        name: "destination_port",
        placeholder: "请输入",
        col: "6"
      },
      {
        type: "input",
        id: 9,
        label: "目的地",
        name: "destination",
        placeholder: "请输入",
        col: "6"
      },
      {
        type: "select",
        id: 10,
        label: "业务类型",
        name: "business_type",
        placeholder: "请输入",
        col: "6",
        optionList: Object.entries(drop.business_type || {}).map(([key, label]) => ({ key, label }))
      },
      {
        type: "input",
        id: 11,
        label: "箱装数量",
        name: "box_spec",
        placeholder: "请输入",
        col: "6"
      },
      {
        type: "select",
        id: 12,
        label: "贸易条款",
        name: "trade_terms",
        placeholder: "请输入",
        col: "6",
        optionList: Object.entries(drop.trade_terms || {}).map(([key, label]) => ({ key, label }))
      },
      {
        type: "select",
        id: 13,
        label: "运输条款",
        name: "transport_type",
        col: "6",
        optionList: Object.entries(drop.delivery_type || {}).map(([key, label]) => ({
          key,
          label
        }))
      },
      {
        type: "input",
        id: 14,
        label: "派送地址",
        name: "delivery_address",
        placeholder: "请输入",
        col: "12"
      },
      {
        type: "select",
        id: 15,
        label: "货物种类",
        name: "goods_type",
        placeholder: "请输入",
        col: "6",
        optionList: Object.entries(drop.goods_type || {}).map(([key, label]) => ({ key, label }))
      },
      {
        type: "date",
        id: 16,
        label: "货好日期",
        name: "goods_date",
        placeholder: "请输入",
        col: "6"
      },
      {
        type: "radio",
        id: 17,
        label: "是否需要保险",
        name: "is_insurance",
        placeholder: "请输入",
        col: "6"
      },
      { type: "radio", id: 18, label: "含油", name: "is_oil", placeholder: "请输入", col: "6" },
      {
        type: "radio",
        id: 19,
        label: "含电",
        name: "is_electronic",
        placeholder: "请输入",
        col: "6"
      }
    ];
  }, [drop]);

  return { detailList, drop };
};

export default useDetailList;
