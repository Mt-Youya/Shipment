import { useState, useEffect, useMemo } from "react";
import { getDropdown } from "../../service/common";
import { useTranslation } from "react-i18next";

interface ChildType {
  name: string;
  label: string;
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
  const { t, i18n } = useTranslation();

  const detailList = useMemo(() => {
    return [
      {
        type: "input",
        id: 1,
        label: t("booking.quotation number"),
        name: "inquiry_no",
        placeholder: t("common.please typing"),
        col: "6"
      },
      {
        type: "input",
        id: 2,
        label: t("booking.shipper"),
        name: "shipper",
        placeholder: t("common.please typing"),
        col: "6"
      },
      {
        type: "input",
        id: 3,
        label: t("booking.consignee"),
        name: "consignee",
        placeholder: t("common.please typing"),
        col: "6"
      },
      {
        type: "input",
        id: 4,
        label: t("booking.notify Party"),
        name: "notify_party",
        placeholder: t("common.please typing"),
        col: "6"
      },
      {
        type: "input",
        id: 5,
        label: t("booking.ALSO NOTIFY"),
        name: "sub_notify_party",
        placeholder: t("common.please typing"),
        col: "6"
      },
      {
        type: "input",
        id: 6,
        label: t("booking.place Of Receipt"),
        name: "receipt_place",
        placeholder: t("common.please typing"),
        col: "6"
      },
      {
        type: "input",
        id: 7,
        label: t("booking.port Of Loading"),
        name: "loading_port",
        placeholder: t("common.please typing"),
        col: "6"
      },
      {
        type: "input",
        id: 8,
        label: t("booking.port Of Discharge"),
        name: "destination_port",
        placeholder: t("common.please typing"),
        col: "6"
      },
      {
        type: "input",
        id: 9,
        label: t("booking.place Of Delivery"),
        name: "destination",
        placeholder: t("common.please typing"),
        col: "6"
      },
      {
        type: "select",
        id: 10,
        label: t("booking.shipment type"),
        name: "business_type",
        placeholder: t("common.please typing"),
        col: "6",
        optionList: Object.entries(drop.business_type || {}).map(([key, label]) => ({ key, label }))
      },
      {
        type: "input",
        id: 11,
        label: t("booking.quantity"),
        name: "box_spec",
        placeholder: t("common.please typing"),
        col: "6"
      },
      {
        type: "select",
        id: 12,
        label: t("booking.inco-Terms"),
        name: "trade_terms",
        placeholder: t("common.please typing"),
        col: "6",
        optionList: Object.entries(drop.trade_terms || {}).map(([key, label]) => ({ key, label }))
      },
      {
        type: "select",
        id: 13,
        label: t("booking.service Type"),
        name: "transport_type",
        placeholder: t("common.please typing"),
        col: "6",
        optionList: Object.entries(drop.delivery_type || {}).map(([key, label]) => ({
          key,
          label
        }))
      },
      {
        type: "input",
        id: 14,
        label: t("booking.delivery Address"),
        name: "delivery_address",
        placeholder: t("common.please typing"),
        col: "12"
      },
      {
        type: "select",
        id: 15,
        label: t("booking.types Of Goods"),
        name: "goods_type",
        placeholder: t("common.please typing"),
        col: "6",
        optionList: Object.entries(drop.goods_type || {}).map(([key, label]) => ({ key, label }))
      },
      {
        type: "date",
        id: 16,
        label: t("booking.crd"),
        name: "goods_date",
        placeholder: t("common.please typing"),
        col: "6"
      },
      {
        type: "radio",
        id: 17,
        label: t("booking.insurance Required ?"),
        name: "is_insurance",
        placeholder: t("common.please typing"),
        col: "6"
      },
      {
        type: "radio",
        id: 18,
        label: t("booking.oil Included ?"),
        name: "is_oil",
        placeholder: t("common.please typing"),
        col: "6"
      },
      {
        type: "radio",
        id: 19,
        label: t("booking.batteries Included ?"),
        name: "is_electronic",
        placeholder: t("common.please typing"),
        col: "6"
      }
    ];
  }, [drop, i18n.language]);

  return { detailList, drop };
};

export default useDetailList;
