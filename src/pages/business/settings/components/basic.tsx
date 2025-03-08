import React from "react";
import { Descriptions } from "antd";
import type { DescriptionsProps } from "antd";

const Basic: React.FC<{ data: any }> = (props) => {
  const { data } = props;

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Address(English)",
      children: data?.address_en
    },
    {
      key: "2",
      label: "Address(Chinese)",
      children: data?.address_local
    },
    {
      key: "3",
      label: "Bill of Lading Address",
      children: data?.pickup_address
    },
    {
      key: "4",
      label: "Company Profile",
      children: data?.company_profile
    },
    {
      key: "5",
      label: "City",
      children: data?.city
    },
    {
      key: "6",
      label: "Province",
      children: data?.province
    },
    {
      key: "7",
      label: "Country or Region",
      children: data?.country
    },
    {
      key: "8",
      label: "Zip Code",
      children: data?.zipcode
    },
    {
      key: "9",
      label: "URL",
      children: data?.website,
      span: 2
    }
  ];

  return <Descriptions bordered items={items} column={2} />;
};

export default Basic;
