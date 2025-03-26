import React from "react";
import { Descriptions, Image } from "antd";
import type { DescriptionsProps } from "antd";
import { useTranslation } from "react-i18next";

const BusinessInfo: React.FC<{ data: any }> = (props) => {
  const { data } = props;
  const { t } = useTranslation();
  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: t("business.lOGO"),
      children: <Image src="/images/login-logo.png" height={50} />,
      span: 2
    },
    {
      key: "2",
      label: t("business.operating Status"),
      children: data.operating_status
    },
    {
      key: "3",
      label: t("business.company type"),
      children: data.tax_company_type
    },
    {
      key: "4",
      label: t("business.paid in capital"),
      children: data.paid_in_capital
    },
    {
      key: "5",
      label: t("business.business Registration"),
      children: data.business_registration_no
    },
    {
      key: "6",
      label: t("business.sector"),
      children: data?.sector
    },
    {
      key: "7",
      label: t("business.legal Representative"),
      children: data?.legal_representative
    },
    {
      key: "8",
      label: t("business.registered capital"),
      children: data?.registered_capital
    },
    {
      key: "9",
      label: t("business.registration Date"),
      children: data?.registration_date
    },
    {
      key: "10",
      label: t("business.registration Authority"),
      children: data?.registration_authority
    },
    {
      key: "11",
      label: t("business.organization Code"),
      children: data?.organization_code
    },
    {
      key: "12",
      label: t("business.business scope"),
      children: data?.business_scope,
      span: 2
    }
  ];

  return <Descriptions bordered items={items} column={2} />;
};

export default BusinessInfo;
