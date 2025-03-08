export interface IBillingItem {
  /**
   * 发票类型
   */
  invoice_type?: number;
  /**
   * 关键词   POL、POD、job No、carrier、HBL、MBL、柜号
   */
  key_word?: string;
  page: number;
  per_page: number;
  /**
   * invoice_no/order_no/invoice_type/issued_date/due_date/payment_time/status/amount/balance
   */
  sort: string;
  /**
   * 1正序 2倒序
   */
  sort_type: number;
  /**
   * 状态 0未支付 1已支付
   */
  status?: number;

  [property: string]: any;
}

export interface IBillingDetail {
  list: any[];
  meta: {
    total: 0;
    current_page: 0;
    per_page: 0;
    last_page: 0;
  };
}
