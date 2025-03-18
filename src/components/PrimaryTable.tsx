import { Table } from "antd";
import { useTranslation } from "react-i18next";

export function PrimaryTable({ sum, dataSource, ...props }) {
  const { t } = useTranslation();
  return (
    <Table
      bordered
      rowKey="id"
      className="mt-1 mx-1 pb-0"
      pagination={false}
      footer={() =>
        sum.map((item, index) => (
          <ul
            className="list-none my-0 py-1 last:pb-0 px-0 first:pt-0 grid grid-cols-3 w-full text-center last:mb-0 border-x-2 border-b-black last:border-none"
            style={{
              borderBottom: index < sum.length - 1 ? "1px solid rgb(240, 240, 240)" : "none"
            }}
            key={index}
          >
            <li>{t("shipment.subtotal")} </li>
            <li>{item?.currency} </li>
            <li>{(+item?.amount || 0)?.toFixed(2)}</li>
          </ul>
        ))
      }
      loading={!dataSource}
      columns={props.columns}
      dataSource={dataSource}
      {...props}
    />
  );
}
