// TableComponent.tsx
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  Form,
  Table,
  Button,
  Space,
  Popconfirm,
  Typography,
  Input,
  InputNumber,
  message
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

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
    const [canAdd, setCanAdd] = useState(true); // 控制是否允许新增
    const isEditing = (record: DataType) => record.key === editingKey;
    useEffect(() => {
      setCount(tableData.length);
    }, [tableData]);

    const edit = (record: Partial<DataType> & { key: React.Key }) => {
      form.setFieldsValue({
        name: record.name || "",
        mark: record.mark || "",
        amount: record.amount || "",
        weight: record.weight || "",
        volume: record.volume || "",
        unit: record.unit || "",
        total_amount: record.total_amount || "",
        hs_code: record.hs_code || ""
      });
      setEditingKey(record.key);
      setCanAdd(false); // 进入编辑状态时，不允许新增
    };

    const cancel = () => {
      setEditingKey("");
      setCanAdd(true); // 取消编辑时，允许新增
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
          setCanAdd(true); // 保存成功后，允许新增
        } else {
          newData.push(row);
          setTableData(newData);
          setEditingKey("");
          setCanAdd(true); // 保存成功后，允许新增
        }
      } catch (errInfo) {
        console.log("Validate Failed:", errInfo);
      }
    };

    const { t } = useTranslation();

    const columns = [
      {
        title: t("booking.No."),
        dataIndex: "key",
        render: (e) => {
          return Number(e) + 1;
        }
      },
      {
        title: "*" + t("booking.marks &Numbers"),
        dataIndex: "mark",
        editable: true
      },
      {
        title: "*" + t("booking.quality"),
        dataIndex: "amount",
        editable: true
      },
      {
        title: "*" + t("booking.package"),
        dataIndex: "unit",
        editable: true
      },
      {
        title: "*" + t("booking.commodity"),
        dataIndex: "name",
        editable: true
      },
      {
        title: "*" + t("booking.HS CODE"),
        dataIndex: "hs_code",
        editable: true
      },
      {
        title: "*" + t("booking.grossWeight") + '(KG)',
        dataIndex: "weight",
        editable: true
      },
      {
        title: "*" + t("booking.volume") + '(CBM)',
        dataIndex: "volume",
        editable: true
      },
      {
        title: "*" + t("booking.value"),
        dataIndex: "total_amount",
        editable: true
      },
      {
        title: t("common.action"),
        dataIndex: "operation",
        width: 130,
        render: (_: any, record: DataType) => {
          const editable = isEditing(record);
          return editable ? (
            <Space>
              <Typography.Link onClick={() => save(record.key)} style={{ marginInlineEnd: 8 }}>
                {t("common.save")}
              </Typography.Link>
              <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                <a>{t("common.cancel")}</a>
              </Popconfirm>
            </Space>
          ) : (
            <Space>
              <Popconfirm title="Sure to cancel?" onConfirm={() => handleDelete(record.key)}>
                <a>{t("common.delete")}</a>
              </Popconfirm>
              <Typography.Link disabled={editingKey !== ""} onClick={() => edit(record)}>
                {t("common.edit")}
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
      if (!canAdd) {
        message.error("请先保存当前编辑的行！");
        return;
      }
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
      setTableData([...tableData, newData]);
      setCount(count + 1);
      // 设置新增行为编辑状态
      setEditingKey(newData.key);
      setCanAdd(false); // 新增后进入编辑状态，不允许新增
      // 重置表单字段
      form.setFieldsValue({
        name: "",
        mark: "",
        amount: "",
        weight: "",
        volume: "",
        unit: "",
        total_amount: "",
        hs_code: ""
      });
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
          {t("common.add")}
        </Button>
      </Form>
    );
  }
);

export default TableComponent;
