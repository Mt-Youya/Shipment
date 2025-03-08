import { SortOrder } from "antd/es/table/interface";
import { IStaff } from "./staff/staff.type";

export interface IPageBaseReq {
  search?: string;
  page?: number;
  size?: number;
  sorter?: Record<string, SortOrder>;
  filter?: Record<string, (string | number)[] | null>;
}

export interface IPageBaseRes<T> {
  page: number;
  count: number;
  total: number;
  list: T[];
}

export interface IModelBase {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  remark: string;
  createdBy: IStaff;
  updatedBy: IStaff;
}

export interface IDropdownData {
  /**
   * 订舱状态
   */
  booking_status: BookingStatus;
  /**
   * 业务类型
   */
  business_type: BusinessType;
  /**
   * 账单状态
   */
  charge_status: ChargeStatus;
  /**
   * 收货人
   */
  consignee: Consignee[];
  /**
   * 运输条款
   */
  delivery_type: DeliveryType;
  /**
   * 货物种类
   */
  goods_type: GoodsType;
  /**
   * 发票类型
   */
  invoice_type: InvoiceType;
  /**
   * 提醒节点
   */
  notice_type: NoticeType;
  /**
   * 运单mode
   */
  order_mode: OrderMode;
  /**
   * 运单状态
   */
  order_type: OrderType;
  /**
   * 付款方式
   */
  payment_type: PaymentType;
  /**
   * 任务状态
   */
  task_status: TaskStatus;
  /**
   * 贸易条款
   */
  trade_terms: TradeTerms;
  /**
   * 上传人
   */
  upload_user: UploadUser[];
}

/**
 * 订舱状态
 */
export interface BookingStatus {
  "0": string;
  "1": string;
  [property: string]: any;
}

/**
 * 业务类型
 */
export interface BusinessType {
  "1": string;
  "2": string;
  "3": string;
  "4": string;
  "5": string;
  "6": string;
  "7": string;
  [property: string]: any;
}

/**
 * 账单状态
 */
export interface ChargeStatus {
  "0": string;
  "1": string;
  "2": string;
  [property: string]: any;
}

export interface Consignee {
  id?: number;
  name_en?: string;
  [property: string]: any;
}

/**
 * 运输条款
 */
export interface DeliveryType {
  "1": string;
  "10": string;
  "11": string;
  "12": string;
  "13": string;
  "14": string;
  "2": string;
  "3": string;
  "4": string;
  "5": string;
  "6": string;
  "7": string;
  "8": string;
  "9": string;
  [property: string]: any;
}

/**
 * 货物种类
 */
export interface GoodsType {
  "1": string;
  "2": string;
  "3": string;
  "4": string;
  [property: string]: any;
}

/**
 * 发票类型
 */
export interface InvoiceType {
  "1": string;
  "2": string;
  [property: string]: any;
}

/**
 * 提醒节点
 */
export interface NoticeType {
  "1": string;
  "2": string;
  "3": string;
  "4": string;
  [property: string]: any;
}

/**
 * 运单mode
 */
export interface OrderMode {
  "1": string;
  "2": string;
  "3": string;
  "4": string;
  [property: string]: any;
}

/**
 * 运单状态
 */
export interface OrderType {
  "0": string;
  "1": string;
  [property: string]: any;
}

/**
 * 付款方式
 */
export interface PaymentType {
  "1": string;
  "2": string;
  "3": string;
  [property: string]: any;
}

/**
 * 任务状态
 */
export interface TaskStatus {
  "0": string;
  "1": string;
  [property: string]: any;
}

/**
 * 贸易条款
 */
export interface TradeTerms {
  "1": string;
  "10": string;
  "2": string;
  "3": string;
  "4": string;
  "5": string;
  "6": string;
  "7": string;
  "8": string;
  "9": string;
  [property: string]: any;
}

export interface UploadUser {
  upload_platform?: number;
  upload_user_id?: number;
  upload_user_name?: string;
  [property: string]: any;
}