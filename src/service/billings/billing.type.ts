export interface IBilling {
  list: List[];
  meta: Meta;
  [property: string]: any;
}

export interface List {
  /**
   * 总金额
   */
  amount: string;
  /**
   * 已销账金额
   */
  balance: string;
  /**
   * 币种
   */
  currency: number;
  due: string;
  /**
   * hbl no
   */
  hbl_no?: string;
  id: number;
  /**
   * 发票号
   */
  invoice_no?: string;
  /**
   * 发票类型
   */
  invoice_type?: string;
  issued: string;
  last_payment: string;
  /**
   * 文件地址
   */
  path: string;
  /**
   * 关联 sea_orders 表
   */
  sea_order_id: number;
  /**
   * 状态 0未支付 1已支付
   */
  status: number;
  [property: string]: any;
}

export interface IBillingDetail {
  list: DataList[];
  meta: Meta;
  [property: string]: any;
}

export interface DataList {
  amount: number;
  balance: number;
  /**
   * 费用明细
   */
  charge_detail: ChargeDetail[];
  /**
   * 收货人地址
   */
  consignee_address: string;
  /**
   * 收货人名
   */
  consignee_name: string;
  container: Container[];
  /**
   * 币种
   */
  currency: string;
  due: string;
  file: File[];
  id: string;
  /**
   * 发票总额
   */
  invoice_total: number;
  /**
   * 发票类型
   */
  invoice_type: Enum;
  issued: string;
  /**
   * 运单号
   */
  order_no: string;
  /**
   * 运单id
   */
  sea_order_id: number;
  /**
   * 状态
   */
  status: number;
  /**
   * 运单标题
   */
  tittle: string;
  [property: string]: any;
}

export interface ChargeDetail {
  /**
   * 费用明细
   */
  rate_information: RateInformation[];
  /**
   * 总计
   */
  total: number;
  [property: string]: any;
}

export interface RateInformation {
  /**
   * 标签页下标
   */
  cost_type: string;
  /**
   * 费用项
   */
  list: RateInformationList[];
  /**
   * 小计
   */
  sum: string;
  [property: string]: any;
}

export interface RateInformationList {
  /**
   * 单位
   */
  charge_unit: string;
  /**
   * 费用项名
   */
  cost_item_en: string;
  /**
   * 币种
   */
  currency: string;
  /**
   * 数量
   */
  quantity: string;
  /**
   * 单价
   */
  quotation_unit_price_tax: string;
  /**
   * 价格
   */
  total_amount: string;
  [property: string]: any;
}

export interface Container {
  /**
   * 箱号
   */
  container_no: string;
  /**
   * 尺寸
   */
  container_size: string;
  [property: string]: any;
}

export interface File {
  /**
   * 文件名
   */
  file_name: string;
  /**
   * 文件地址
   */
  path: string;
  [property: string]: any;
}

/**
 * 发票类型
 *
 * 枚举
 */
export interface Enum {
  /**
   * 枚举下标
   */
  index: number;
  /**
   * 枚举标签
   */
  tag: string;
  /**
   * 枚举值
   */
  value: string;
  [property: string]: any;
}

export interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  [property: string]: any;
}