// import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Divider, Tabs, TabsProps, theme } from "antd";
import { useEffect, useState } from "react";
import Basic from "./components/basic";
import FinanceTax from "./components/finance-tax";
import RelatedCompanies from "./components/related-companies";
import BusinessInfo from "./components/business-info";
import ContractRecords from "./components/contract-records";
import { companyAPI } from "../../../service/shipmentAPI";
import { useTranslation } from "react-i18next";

const { useToken } = theme;

const Settings = () => {
  const { token } = useToken();
  const [current, setCurrent] = useState("1");
  const [data, setData] = useState<any>([]);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    const res = await companyAPI();
    console.log(res);
    setData(res);
  };

  const { t } = useTranslation();

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("business.basic information")
    },
    {
      key: "2",
      label: t("business.bank & Tax")
    },
    {
      key: "3",
      label: t("business.contract Records")
    },
    {
      key: "4",
      label: t("business.affiliate Company")
    },
    {
      key: "5",
      label: t("business.registration Info")
    }
  ];
  return (
    <div>
      <div className="header">
        <div className="title leading-7xl">{t("business.settings")}</div>
      </div>

      <div className="text-2xl leading-6xl font-semibold mt-3 mb-1.5 text-black">
        {t("business.here is the company name")}
      </div>

      <div className="text-sm leading-lg text-black">
        <span className="text-gray">{t("business.english Company Name")}:</span>
        <span>{data?.name_en}</span>
      </div>
      <div className="text-sm leading-lg text-black mt-1">
        <span className="text-gray">{t("business.settlement Type")}:</span>
        <span>{data?.settlement_type}</span>
      </div>

      <Divider />
      <Tabs
        type="card"
        size="small"
        items={items}
        tabBarGutter={0}
        tabBarStyle={{ borderRadius: 0 }}
        onChange={setCurrent}
      ></Tabs>

      <div
        style={{
          border: `1px solid ${token.colorBorderSecondary}`,
          borderTop: "none",
          padding: "30px"
        }}
      >
        {current === "1" && <Basic data={data.basic_info} />}
        {current === "2" && <FinanceTax data={data.balance} />}
        {current === "3" && <ContractRecords />}
        {current === "4" && <RelatedCompanies data={data.company_relate} />}
        {current === "5" && <BusinessInfo data={data.registration} />}
      </div>
    </div>
  );
};
export default Settings;
