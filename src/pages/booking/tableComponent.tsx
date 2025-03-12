import React, { useEffect, useState } from "react";
import type { TableProps } from "antd";
import { Button, Form, Input, InputNumber, Popconfirm, Space, Table, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface DataType {
  key: string;
  name: string;
  mark: string;
  amount: string;
  address: string;
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
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

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

const originData = Array.from({ length: 2 }).map<DataType>((_, i) => ({
  key: i.toString(),
  name: "",
  mark: "",
  amount: "",
  address: `London Park no. ${i}`,
  weight: "",
  volume: "",
  total_amount: "",
  hs_code: "",
  unit: ""
}));

interface AppProps {
  tableData: DataType[];
  setTableData: React.Dispatch<React.SetStateAction<DataType[]>>;
}

const App: React.FC<AppProps> = ({ tableData, setTableData }) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [count, setCount] = useState(tableData.length);

  const isEditing = (record: DataType) => record.key === editingKey;

  useEffect(() => {
    // 移除原有的逻辑，不再默认填充两行数据
  }, [tableData]);

  const edit = (record: Partial<DataType> & { key: React.Key }) => {
    form.setFieldsValue({
      name: "",
      mark: "",
      address: "",
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
      title: "编号",
      dataIndex: "key",
      render: (e) => {
        return Number(e) + 1;
      }
    },
    {
      title: "唛头",
      dataIndex: "mark",
      editable: true
    },
    {
      title: "件数",
      dataIndex: "unit",
      editable: true
    },
    {
      title: "包装单位",
      dataIndex: "amount",
      editable: true
    },
    {
      title: "中英文名称",
      dataIndex: "name",
      editable: true
    },
    {
      title: "HS CODE",
      dataIndex: "hs_code",
      editable: true
    },
    {
      title: "重量",
      dataIndex: "weight",
      editable: true
    },
    {
      title: "体积",
      dataIndex: "volume",
      editable: true
    },
    {
      title: "货值=发票金额",
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
        inputType: col.dataIndex === "age" ? "number" : "text",
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
      address: "",
      weight: "",
      volume: "",
      total_amount: "",
      hs_code: ""
    };
    setTableData([...tableData, newData]);
    setCount(count + 1);
  };

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
};

export default App;
