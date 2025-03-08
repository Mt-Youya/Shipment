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
    title: "Company Number",
    dataIndex: "company_no"
  },
  {
    title: "Short Name",
    dataIndex: "short_name"
  },
  {
    title: "Corporate name",
    dataIndex: "company_name"
  },
  {
    title: "Company Category",
    dataIndex: "company_category"
  },
  {
    title: "Address",
    dataIndex: "address"
  }
];

// const data: DataType[] = [
//   {
//     id: "1",
//     name: "John Brown",
//     deposit: "BOC New York",
//     currency: "Dollar",
//     bankAccount: "12312341341231231",
//     billingAddress: "Here is the address",
//     invoicePhone: "18909873457",
//     swiftCode: "123123121",
//     bankAddress: "Here is the address",
//     bankInterNumber: "123124523"
//   },
//   {
//     id: "2",
//     name: "John Brown",
//     deposit: "BOC New York",
//     currency: "Dollar",
//     bankAccount: "12312341341231231",
//     billingAddress: "Here is the address",
//     invoicePhone: "18909873457",
//     swiftCode: "123123121",
//     bankAddress: "Here is the address",
//     bankInterNumber: "123124523"
//   },
//   {
//     id: "3",
//     name: "John Brown",
//     deposit: "BOC New York",
//     currency: "Dollar",
//     bankAccount: "12312341341231231",
//     billingAddress: "Here is the address",
//     invoicePhone: "18909873457",
//     swiftCode: "123123121",
//     bankAddress: "Here is the address",
//     bankInterNumber: "123124523"
//   },
//   {
//     id: "4",
//     name: "John Brown",
//     deposit: "BOC New York",
//     currency: "Dollar",
//     bankAccount: "12312341341231231",
//     billingAddress: "Here is the address",
//     invoicePhone: "18909873457",
//     swiftCode: "123123121",
//     bankAddress: "Here is the address",
//     bankInterNumber: "123124523"
//   },
//   {
//     id: "5",
//     name: "John Brown",
//     deposit: "BOC New York",
//     currency: "Dollar",
//     bankAccount: "12312341341231231",
//     billingAddress: "Here is the address",
//     invoicePhone: "18909873457",
//     swiftCode: "123123121",
//     bankAddress: "Here is the address",
//     bankInterNumber: "123124523"
//   }
// ];

const RelatedCompanies: React.FC<{ data: any }> = (props) => {
  const { data } = props;
  return <Table<DataType> columns={columns} dataSource={data} bordered pagination={false} />;
};

export default RelatedCompanies;
