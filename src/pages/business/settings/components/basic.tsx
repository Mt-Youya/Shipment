import React from "react";
import { Descriptions } from "antd";
import type { DescriptionsProps } from "antd";
import {useTranslation} from "react-i18next";

const Basic: React.FC<{ data: any }> = (props) => {
  const { data } = props;

  const { t } = useTranslation()

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: t("business.address(English)"),
      children: data?.address_en
    },
    {
      key: "2",
      label: t("business.address(Chinese)"),
      children: data?.address_local
    },
    {
      key: "3",
      label: t("business.bill of Lading Address"),
      children: data?.pickup_address
    },
    {
      key: "4",
      label: t("business.company Profile"),
      children: data?.company_profile
    },
    {
      key: "5",
      label: t("business.city"),
      children: data?.city
    },
    {
      key: "6",
      label: t("business.province"),
      children: data?.province
    },
    {
      key: "7",
      label: t("business.country or Region"),
      children: data?.country
    },
    {
      key: "8",
      label: t("business.zip Code"),
      children: data?.zipcode
    },
    {
      key: "9",
      label: t("business.url"),
      children: data?.website,
      span: 2
    }
  ];

  return <Descriptions bordered items={items} column={2} />;
};

export default Basic;
