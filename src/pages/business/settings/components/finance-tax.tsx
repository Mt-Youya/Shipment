import React from "react";
import { Table } from "antd";
import type { TableProps } from "antd";
import { useTranslation } from "react-i18next";

interface DataType {
  id: string;
  name: string;
  deposit: string;
  currency: string;
  bankAccount: string;
  billingAddress: string;
  invoicePhone: string;
  swiftCode: string;
  bankAddress: string;
  bankInterNumber: string;
}

const FinanceTax: React.FC<{ data: any }> = (props) => {
  console.log(props.data);
  const { data } = props;
  const { t } = useTranslation();

  const columns: TableProps<DataType>["columns"] = [
    {
      title: t("business.account Name"),
      dataIndex: "account_name",
      ellipsis: true
    },
    {
      title: t("business.bank Name"),
      dataIndex: "bank_name"
    },
    {
      title: t("business.currency"),
      dataIndex: "currency",
      width:100
    },
    {
      title: t("business.opening Bank Account"),
      dataIndex: "bank_account"
    },
    {
      title: t("business.billing Address"),
      dataIndex: "billing_address",
      ellipsis: true
    },
    {
      title: t("business.billing Tel No"),
      dataIndex: "billing_tel_no"
    },
    {
      title: t("business.swift Code"),
      dataIndex: "swift_code",
      width:100
    },
    {
      title: t("business.account") + t("business.opening Bank Address"),
      dataIndex: "opening_bank_address",
      ellipsis: true,
      width:240
    },
    {
      title: t("business.bank Interbank Number"),
      dataIndex: "bank_interbank_no",
      ellipsis: true
    }
  ];

  return (
    <Table<DataType> columns={columns} dataSource={data.client_bank} bordered pagination={false} />
  );
};
export default FinanceTax;
