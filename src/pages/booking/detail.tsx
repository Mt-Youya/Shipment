import React, { useEffect, useRef } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  message,
  Button,
  Select,
  Radio,
  DatePicker,
  InputNumber
} from "antd";
import { ReactNode } from "react";
import useDetailList from "./detailList";
import TableComponent from "./tableComponent";
import UploadComponent from "../../components/UploadComponent";
import Notice from "./Notice";
import { bookingAddAPI, bookingListAPI, bookingUpdateAPI } from "../../service/shipmentAPI";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
interface DetailListItem {
  type: string;
  col: number;
  name: string;
  label: ReactNode;
  placeholder?: string;
}

const MyForm: React.FC = () => {
  const tableComponentRef = useRef<TableComponentRef>(null);
  const navigate = useNavigate();
  const { detailList, drop } = useDetailList();
  const [open, setOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<any>({});
  const [form] = Form.useForm();
  const location = useLocation();
  const [bondType, setBondType] = React.useState<boolean>(false);
  const [isTrailer, setisTrailer] = React.useState<boolean>(false);
  const [isFumigated, setisFumigated] = React.useState<boolean>(false);
  const [isAddress, setisAddress] = React.useState<boolean>(false);
  const [tableData, setTableData] = React.useState<DataType[]>([]);
  const [disable, setDisable] = React.useState<boolean>(false);

  const obj = location.state?.obj;

  useEffect(() => {
    if (obj && Object.keys(drop).length > 0) {
      getDetail(obj.id);
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [drop, obj]);

  const getDetail = async (id: string) => {
    try {
      const res = await bookingListAPI(id);
      res.goods_date = res?.goods_date ? dayjs(res?.goods_date) : "";
      res.loading_date = res?.loading_date ? dayjs(res?.loading_date) : "";
      setDetail(res);
      if (res.box_list && res.box_list.length > 0) {
        const tempOriginData = res.box_list.map((item, index) => ({
          ...item,
          key: index.toString()
        }));
        setTableData(tempOriginData);
      }
      if (res.is_trailer === 0) setisAddress(true);
      if (res.is_vgm === 0) setisTrailer(true);
      if (res.is_wooden === 0) setisFumigated(true);
      if (res.is_bond === 0) setBondType(true);
      form.setFieldsValue(res);
    } catch (error) {
      message.error("获取详情失败");
    }
  };
  const onClose = () => {
    setOpen(false);
  };
  function removeEmptyProperties(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] == null || obj[key] === "") {
          delete obj[key];
        }
      }
    }
    return obj;
  }
  function hasEmptyValuesInObjectArray(arr) {
    for (const obj of arr) {
      for (const key in obj) {
        // 检查是否是空字符串、null、undefined 或空数组
        if (
          obj[key] == null ||
          obj[key] === "" ||
          (Array.isArray(obj[key]) && obj[key].length === 0)
        ) {
          return true;
        }
      }
    }
    return false;
  }
  const onFinish = async (values: any) => {
    try {
      await tableComponentRef.current?.validate();
      console.log(hasEmptyValuesInObjectArray(tableData));
      if (hasEmptyValuesInObjectArray(tableData)) {
        return message.error("表格数据不能为空");
      }

      const params = removeEmptyProperties({
        ...values,
        freight_cost: values?.freight_cost.toString(),
        goods_date: values.goods_date ? dayjs(values.goods_date).format("YYYY-MM-DD") : "",
        loading_date: values.loading_date ? dayjs(values.loading_date).format("YYYY-MM-DD") : "",
        box_list: tableData
      });
      if (obj) {
        await bookingUpdateAPI(params, obj.id);
        message.success("修改成功");
        navigate("/booking");
      } else {
        await bookingAddAPI(params);
        message.success("新增成功");
        navigate("/booking");
      }
    } catch (e) { }
  };
  const onChangeisBond = (e: any) => {
    if (e.target.value === 0) {
      form.setFieldsValue({
        bond_type: ""
      });
      setBondType(true);
    } else {
      setBondType(false);
    }
  };

  const onChangeiswooden = (e: any) => {
    if (e.target.value === 0) {
      form.setFieldsValue({
        is_fumigated: ""
      });
      setisFumigated(true);
    } else {
      setisFumigated(false);
    }
  };
  const onChangeIsVgm = (e: any) => {
    if (e.target.value === 0) {
      form.setFieldsValue({
        is_trailer: "",
        loading_date: "",
        loading_address: "",
        link_person: "",
        special_requirement: ""
      });
      setisTrailer(true);
      setisAddress(true);
    } else {
      setisTrailer(false);
      setisAddress(false);
    }
  };
  const onChangeisTrailer = (e: any) => {
    if (e.target.value === 0) {
      form.setFieldsValue({
        loading_date: "",
        loading_address: "",
        link_person: "",
        special_requirement: ""
      });
      setisAddress(true);
    } else {
      setisAddress(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
    message.error(errorInfo.errorFields[0].errors[0]);
    // errorInfo.errorFields.map((e) => {
    //   message.error(e.errors[0]);
    // });
  };

  const { t } = useTranslation();
  return (
    <>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 24 }} // 设置标签占满整行
        wrapperCol={{ span: 24 }} // 设置输入框占满整行
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Row gutter={[16, 16]}>
          {detailList &&
            detailList.map((item) => (
              <Col span={item.col} key={item.id}>
                <Form.Item
                  key={item.name}
                  name={item.name}
                  label={item.label}
                  rules={
                    item.name === "delivery_address"
                      ? [
                        { required: true, message: `请输入${item.label}` },
                        {
                          max: 255,
                          message:
                            "The delivery address field must not be greater than 255 characters!"
                        }
                      ]
                      : [{ required: true, message: `请输入${item.label}` }]
                  }
                >
                  {item.type === "input" && <Input placeholder={item.placeholder} />}
                  {item.type === "select" && (
                    <Select placeholder={item.placeholder}>
                      {item.optionList &&
                        item.optionList.map((e: any) => {
                          return (
                            <Select.Option key={e.key} value={Number(e.key)}>
                              {e?.label}
                            </Select.Option>
                          );
                        })}
                    </Select>
                  )}
                  {item.type === "radio" && (
                    <Radio.Group>
                      <Radio value={1}> {t("common.yes")} </Radio>
                      <Radio value={0}> {t("common.no")} </Radio>
                    </Radio.Group>
                  )}
                  {item.type === "date" && <DatePicker />}
                </Form.Item>
              </Col>
            ))}
        </Row>

        <Row gutter={[16, 16]}>
          <Form.Item
            name="is_wooden"
            label={t("booking.wooden Packing?")}
            rules={[{ required: !isFumigated, message: "请选择是否含木质包装" }]}
          >
            <Radio.Group onChange={onChangeiswooden}>
              <Radio value={1}> {t("common.yes")} </Radio>
              <Radio value={0}> {t("common.no")} </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="is_fumigated"
            label={t("booking.whether to fumigate")}
            rules={[
              { required: !isFumigated, message: t("booking.please select whether to fumigate") }
            ]}
          >
            <Radio.Group disabled={isFumigated}>
              <Radio value={1}> {t("common.yes")} </Radio>
              <Radio value={0}> {t("common.no")} </Radio>
            </Radio.Group>
          </Form.Item>
        </Row>
        <Row gutter={[16, 16]}>
          <Form.Item
            name="is_vgm"
            label={t("booking.VGM Required ?")}
            rules={[{ required: true, message: t("common.please select") }]}
          >
            <Radio.Group onChange={onChangeIsVgm}>
              <Radio value={1}> {t("common.yes")} </Radio>
              <Radio value={0}> {t("common.no")} </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="is_trailer" label={t("booking.trucking required?")}>
            <Radio.Group disabled={isTrailer} onChange={onChangeisTrailer}>
              <Radio value={1}> {t("common.yes")} </Radio>
              <Radio value={0}> {t("common.no")} </Radio>
            </Radio.Group>
          </Form.Item>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item name="loading_date" label={t("booking.PICK UP DATE")}>
              <DatePicker disabled={isAddress} />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              name="loading_address"
              label={t("booking.pick Up Address")}
              rules={[
                {
                  max: 255,
                  message: "The loading address field must not be greater than 255 characters!"
                }
              ]}
            >
              <Input disabled={isAddress} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item name="link_person" label={t("booking.contact")}>
              <Input disabled={isAddress} />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              name="special_requirement"
              label={t("booking.special Requests")}
              rules={[
                {
                  max: 2000,
                  message: "The special requirement field must not be greater than 2000 characters!"
                }
              ]}
            >
              <Input disabled={isAddress} />
            </Form.Item>
          </Col>
        </Row>
        <TableComponent ref={tableComponentRef} tableData={tableData} setTableData={setTableData} />
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Form.Item
              name="is_declaration"
              label={t("booking.export Customs Declaration Required ?")}
            >
              <Radio.Group>
                <Radio value={1}> {t("common.yes")} </Radio>
                <Radio value={0}> {t("common.no")} </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="is_bond"
              label={t("booking.BOND")}
              rules={[{ required: true, message: `请选择` }]}
            >
              <Radio.Group onChange={onChangeisBond}>
                <Radio value={1}> {t("booking.importer's Self-Purchase")} </Radio>
                <Radio value={2}> {t("booking.SXD Proxy Purchase")} </Radio>
                <Radio value={0}> {t("booking.no")} </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Form.Item
              name="bond_type"
              label={t("booking.bond Type")}
              rules={[{ required: !bondType, message: "请选择BOND类型" }]}
            >
              <Radio.Group disabled={bondType}>
                <Radio value={1}> {t("booking.annual Bond")} </Radio>
                <Radio value={2}> {t("booking.single Entry Bond")} </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="payment_type"
              label={t("booking.freight & Charges")}
              rules={[{ required: true, message: "请选择付款方式" }]}
            >
              <Select placeholder="请选择付款方式">
                {drop.payment_type &&
                  Object.entries(drop.payment_type || {})
                    .map(([key, label]) => ({ key, label }))
                    .map((e: any) => {
                      return (
                        <Select.Option key={e.key} value={Number(e.key)}>
                          {e.label}
                        </Select.Option>
                      );
                    })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="freight_cost"
              label={t("booking.freight Amount")}
              rules={[{ required: true, message: "请输入运费金额" }]}
            >
              <InputNumber min={0} />
            </Form.Item>
          </Col>
        </Row>
        <Notice />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Form.Item style={{ marginRight: "10px" }}>
            <Button htmlType="submit">{t("booking.save as Draft")}</Button>
          </Form.Item>
          <Form.Item style={{ marginRight: "10px" }}>
            <Button disabled={disable} onClick={() => setOpen(true)}>
              {t("booking.upload booking letter")}
            </Button>
          </Form.Item>
          <Form.Item style={{ marginRight: "10px" }}>
            <Button type="primary" htmlType="submit">
              {t("booking.confirm and download the booking letter")}
            </Button>
          </Form.Item>
        </div>
      </Form>
      <UploadComponent
        upload_type={1}
        order_id={obj?.id.toString()}
        open={open}
        onClose={onClose}
      />
    </>
  );
};

export default MyForm;
