import { Table } from "antd";

export function PrimaryTable({ sum, dataSource, ...props }) {
  return (
    <Table
      bordered
      rowKey="id"
      className="mt-1 mx-1 pb-0"
      pagination={false}
      footer={() => (
        <ul className="list-none my-0 p-0 grid grid-cols-3 w-full text-center">
          <li>Subtotal</li>
          <li>CNY</li>
          <li>{(+sum).toFixed(2)}</li>
        </ul>
      )}
      loading={!dataSource}
      columns={props.columns}
      dataSource={dataSource}
      {...props}
    />
  );
}
