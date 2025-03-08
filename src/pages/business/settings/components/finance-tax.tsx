import React from "react";
import { Table } from "antd";
import type { TableProps } from "antd";

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

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Account name",
    dataIndex: "account_name",
    ellipsis: true
  },
  {
    title: "Bank Name",
    dataIndex: "bank_name"
  },
  {
    title: "Currency",
    dataIndex: "currency"
  },
  {
    title: "Opening bank account",
    dataIndex: "bank_account"
  },
  {
    title: "Billing address",
    dataIndex: "billing_address",
    ellipsis: true
  },
  {
    title: "Billing Tel No",
    dataIndex: "billing_tel_no"
  },
  {
    title: "Swift Code",
    dataIndex: "swift_code"
  },
  {
    title: "Account opening bank address",
    dataIndex: "opening_bank_address",
    ellipsis: true
  },
  {
    title: "Bank Interbank Number",
    dataIndex: "bank_interbank_no",
    ellipsis: true
  }
];

const FinanceTax: React.FC<{ data: any }> = (props) => {
  console.log(props.data);
  const { data } = props;

  return (
    <Table<DataType> columns={columns} dataSource={data.client_bank} bordered pagination={false} />
  );
};
export default FinanceTax;
