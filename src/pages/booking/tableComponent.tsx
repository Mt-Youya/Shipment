// TableComponent.tsx
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Form, Table, Button, Space, Popconfirm, Typography, Input, InputNumber } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface DataType {
  key: string;
  name: string;
  mark: string;
  amount: string;
  weight: string;
  volume: string;
  total_amount: string;
  hs_code: string;
  unit: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: DataType;
  index: number;
  setTableData: React.Dispatch<React.SetStateAction<DataType[]>>;
  tableData: DataType[];
  unit: string;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = (props) => {
  const { editing, dataIndex, title, inputType, record, index, children, ...restProps } = props;
  const inputNode = inputType === "number" ? <InputNumber min={0} /> : <Input />;
  console.log(inputType);

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Please Input ${title}!` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

interface AppProps {
  tableData: DataType[];
  setTableData: React.Dispatch<React.SetStateAction<DataType[]>>;
}

export interface TableComponentRef {
  validate: () => Promise<DataType[]>;
}

const TableComponent = forwardRef<TableComponentRef, AppProps>(
  ({ tableData, setTableData }, ref) => {
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState("");
    const [count, setCount] = useState(tableData.length);
    const isEditing = (record: DataType) => record.key === editingKey;
    useEffect(() => {
      setCount(tableData.length);
    }, [tableData]);

    const edit = (record: Partial<DataType> & { key: React.Key }) => {
      form.setFieldsValue({
        name: "",
        mark: "",
        weight: "",
        volume: "",
        total_amount: "",
        hs_code: "",
        ...record
      });
      setEditingKey(record.key);
    };

    const cancel = () => {
      setEditingKey("");
    };

    const handleDelete = (key: React.Key) => {
      const newData = tableData.filter((item) => item.key !== key);
      setTableData(newData);
    };

    const save = async (key: React.Key) => {
      try {
        const row = (await form.validateFields()) as DataType;
        const newData = [...tableData];
        const index = newData.findIndex((item) => key === item.key);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, { ...item, ...row });
          setTableData(newData);
          setEditingKey("");
        } else {
          newData.push(row);
          setTableData(newData);
          setEditingKey("");
        }
      } catch (errInfo) {
        console.log("Validate Failed:", errInfo);
      }
    };

    const columns = [
      {
        title: "*编号",
        dataIndex: "key",
        render: (e) => {
          return Number(e) + 1;
        }
      },
      {
        title: "*唛头",
        dataIndex: "mark",
        editable: true
      },
      {
        title: "*件数",
        dataIndex: "amount",
        editable: true
      },
      {
        title: "*包装单位",
        dataIndex: "unit",
        editable: true
      },
      {
        title: "*中英文名称",
        dataIndex: "name",
        editable: true
      },
      {
        title: "*HS CODE",
        dataIndex: "hs_code",
        editable: true
      },
      {
        title: "*重量",
        dataIndex: "weight",
        editable: true
      },
      {
        title: "*体积",
        dataIndex: "volume",
        editable: true
      },
      {
        title: "*货值=发票金额",
        dataIndex: "total_amount",
        editable: true
      },
      {
        title: "操作",
        dataIndex: "operation",
        width: 130,
        render: (_: any, record: DataType) => {
          const editable = isEditing(record);
          return editable ? (
            <Space>
              <Typography.Link onClick={() => save(record.key)} style={{ marginInlineEnd: 8 }}>
                保存
              </Typography.Link>
              <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                <a>取消</a>
              </Popconfirm>
            </Space>
          ) : (
            <Space>
              <Popconfirm title="Sure to cancel?" onConfirm={() => handleDelete(record.key)}>
                <a>删除</a>
              </Popconfirm>
              <Typography.Link disabled={editingKey !== ""} onClick={() => edit(record)}>
                编辑
              </Typography.Link>
            </Space>
          );
        }
      }
    ];

    const mergedColumns: TableProps<DataType>["columns"] = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: DataType) => ({
          record,
          inputType: col.dataIndex === "amount" ? "number" : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record)
        })
      };
    });

    const handleAdd = () => {
      const newData = {
        key: count.toString(),
        name: "",
        mark: "",
        amount: "",
        weight: "",
        volume: "",
        unit: "",
        total_amount: "",
        hs_code: ""
      };
      console.log(count);

      setTableData([...tableData, newData]);
      setCount(count + 1);
      // 设置新增行为编辑状态
      console.log(newData.key);

      setEditingKey(newData.key);
    };

    useImperativeHandle(ref, () => ({
      validate: async () => {
        try {
          // 校验表单
          await form.validateFields();
          // 返回表单数据
          return form.getFieldsValue();
        } catch (error) {
          throw error;
        }
      }
    }));

    return (
      <Form form={form} component={false}>
        <Table<DataType>
          components={{
            body: { cell: EditableCell }
          }}
          bordered
          dataSource={tableData}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
        />
        <Button
          style={{ width: "100%", textAlign: "center", margin: "10px auto", display: "block" }}
          type="dashed"
          onClick={handleAdd}
          icon={<PlusOutlined />}
        >
          新增
        </Button>
      </Form>
    );
  }
);

export default TableComponent;
