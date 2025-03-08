import React from "react";
import { Descriptions, Image } from "antd";
import type { DescriptionsProps } from "antd";

const BusinessInfo: React.FC<{ data: any }> = (props) => {
  const { data } = props;
  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "LOGO",
      children: <Image src="/images/login-logo.png" height={130} />,
      span: 2
    },
    {
      key: "2",
      label: "Operating Status",
      children: data.operating_status
    },
    {
      key: "3",
      label: "Company type",
      children: data.tax_company_type
    },
    {
      key: "4",
      label: "Paid in capital",
      children: data.paid_in_capital
    },
    {
      key: "5",
      label: "Business Registration",
      children: data.business_registration_no
    },
    {
      key: "6",
      label: "Sector",
      children: data?.sector
    },
    {
      key: "7",
      label: "Legal representative",
      children: data?.legal_representative
    },
    {
      key: "8",
      label: "Registered capital",
      children: data?.registered_capital
    },
    {
      key: "9",
      label: "Registration date",
      children: data?.registration_date
    },
    {
      key: "10",
      label: "Registration authority",
      children: data?.registration_authority
    },
    {
      key: "11",
      label: "Organization code",
      children: data?.organization_code
    },
    {
      key: "12",
      label: "Business scope",
      children: data?.business_scope,
      span: 2
    }
  ];

  return <Descriptions bordered items={items} column={2} />;
};

export default BusinessInfo;
