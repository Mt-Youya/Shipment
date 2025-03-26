export interface IShipmentType {
  /**
   * 到达时间
   */
  arrival_date: string;
  /**
   * 提货日期
   */
  arrival_pickup: string;
  /**
   * 到达港
   */
  arrival_port: string;
  /**
   * 收货人
   */
  consignee: string;
  /**
   * 货柜
   */
  container: number;
  /**
   * 货好日期
   */
  crd: string;
  /**
   * 送达时间
   */
  delivery_arrive: string;
  /**
   * 送货时间
   */
  delivery_date: string;
  /**
   * 起运港送达日期
   */
  departure_arrive: string;
  /**
   * 起运港出发日期
   */
  departure_date: string;
  /**
   * 发货人
   */
  departure_location: string;
  /**
   * 起运港
   */
  departure_port: string;
  id: number;
  order_no: string;
  /**
   * 状态文本
   */
  order_progress: string;
  /**
   * 提货日期
   */
  pick_up_date: string;
  /**
   * po订单
   */
  po_order: string[];
  /**
   * 船开到达日期
   */
  sail_arrive: string;
  /**
   * 船开出发日期
   */
  sail_departure: string;
  /**
   * 状态
   */
  status: number;
  /**
   * 任务
   */
  task_count: number;
  /**
   * 运单标题
   */
  title: string;
}

interface TaskList {
  complete: Complete;
  /**
   * 未完成
   */
  incomplete: Incomplete;
}
interface Complete {
  count: number;
  list: CompleteList;
}

interface CompleteList {
  /**
   * 创建时间
   */
  created_at: string;
  /**
   * 截止时间
   */
  deadline: string;
  id: string;
  /**
   * 状态 0未完成 1已完成
   */
  status: number;
  /**
   * 标题
   */
  title: string;
}

interface Incomplete {
  /**
   * 数量
   */
  count: number;
  list: ListElement[];
}

interface ListElement {
  /**
   * 创建时间
   */
  created_at: string;
  /**
   * 截止时间
   */
  deadline: string;
  id: string;
  /**
   * 状态 0未完成 1已完成
   */
  status: number;
  /**
   * 标题
   */
  title: string;
}

interface Detail {
  /**
   * 费用
   */
  cost: Cost;
  /**
   * 运输条款
   */
  delivery_type: string;
  /**
   * 货物详情
   */
  goods: Good[];
  /**
   * 进出口
   */
  import_type: string;
  invoice: Invoice[];
  /**
   * 箱型信息
   */
  loading_detail: LoadingDetail[];
  /**
   * 贸易条款
   */
  trade_terms: string;
}

interface Invoice {
  amount: number;
  balance: number;
  due: string;
  file_url: string;
  /**
   * 发票号
   */
  invoice_no: string;
  issue: string;
  last_payment: string;
  /**
   * 0未支付 1未结清 2已支付
   */
  status: number;
  [property: string]: any;
}

interface Cost {
  /**
   * 询价信息
   */
  quote_info: QuoteInfo;
  rate_information: string;
  route: Route;
  total: number;
  transit_information: TransitInformation[];
}

interface QuoteInfo {
  action: string;
  /**
   * 承运人
   */
  carrier: string;
  carrier_advertised: string;
  expires: string;
  /**
   * 询价单号
   */
  quote_no: string;
  /**
   * 总金额
   */
  total_amount: number;
}

interface Route {
  delivery_place_port_id: string;
  destination: string;
  destination_dwell: string;
  flex_port_est: string;
  origin: string;
  origin_dwell: string;
  pod_port_id: string;
  pol_port_id: string;
  receipt_place_port_id: string;
  transit_port_id: string;
}

interface TransitInformation {
  carrier_advertised: string;
  carrier_name: string;
  closing_days: string;
  departure_days: string;
  freight_service: string;
  mode: string;
  pre_carriage: string;
  rate_expiration: string;
}

interface Good {
  /**
   * 品名
   */
  goods_desc: string;
  /**
   * 数量
   */
  package_count: string;
  packing_unit: PackingUnit;
  /**
   * 体积
   */
  volume: number;
  /**
   * 重量
   */
  weight: number;
}

interface PackingUnit {
  /**
   * 单位
   */
  name_en: string;
}

interface LoadingDetail {
  /**
   * 取最外层carrier
   */
  carrier: string;
  /**
   * 箱号
   */
  container_no: string;
  /**
   * 箱型
   */
  container_type_code: string;
  /**
   * 箱量
   */
  quantity: number;
  /**
   * 封号
   */
  seal_no: string;
}

export interface IShipmentDetail {
  crd: string;
  /**
   * 承运人
   */
  carrier: string;
  /**
   * 货柜数
   */
  container: string;
  /**
   * 详情
   */
  detail: Detail;
  id: number;
  /**
   * 订单号
   */
  order_no: string;
  /**
   * 货物列表
   */
  po_list: string[];
  /**
   * 运输方式
   */
  shipment_type: string;
  /**
   * 任务列表
   */
  task_list: TaskList;
  /**
   * 标题
   */
  title: string;
}

export interface IRouteFileList {
  /**
   * 文件名
   */
  file_name: string;
  id: number;
  /**
   * 文件存储路径
   */
  path: string;
  /**
   * 所属订单id
   */
  sea_order_no: string;
  /**
   * 上传时间
   */
  upload_time: string;
  /**
   * 上传用户id
   */
  upload_user_id: number;
  /**
   * 上传用户
   */
  upload_user_name: string;
  [property: string]: any;
}

export interface IShipmentMap {
  /**
   * 地点信息
   */
  places: Places;
  /**
   * 运单状态 下拉框order_status数据
   */
  status: number;
  /**
   * 左上角时间
   */
  time: ActionTime;
  /**
   * iframe链接
   */
  url: string;
}

/**
 * 地点信息
 */
export interface Places {
  /**
   * 目的地
   */
  delivery: Delivery;
  /**
   * 发货地
   */
  depart: PlacesDepart;
  /**
   * 目的港
   */
  pod_port: PodPort;
  /**
   * 起运港
   */
  pol_port: PolPort;
  /**
   * 中转港 无此信息时无该字段
   */
  transit_port: TransitPort;
  [property: string]: any;
}

/**
 * 目的地
 */
export interface Delivery {
  /**
   * 地址
   */
  address: string;
  /**
   * 收货人名称
   */
  name: string;
  [property: string]: any;
}

/**
 * 发货地
 */
export interface PlacesDepart {
  /**
   * 发货人地址
   */
  address: string;
  /**
   * 箱数据
   */
  container_info: ContainerInfo[];
  /**
   * 预计时间
   */
  expect_time: string;
  /**
   * 发货人名称
   */
  name: string;
  /**
   * 运输方式
   */
  transfer_type: string;
  [property: string]: any;
}

export interface ContainerInfo {
  /**
   * 到达时间 只到年月日
   */
  arrive?: ContainerInfoArrive[];
  /**
   * 箱号
   */
  container_no?: string;
  crd?: Crd;
  /**
   * 出发时间 只到年月日
   */
  depart?: ActionTime[];
  /**
   * 运输信息
   */
  transfer_info?: string;
  [property: string]: any;
}

export interface ContainerInfoArrive {
  /**
   * 更新时间
   */
  created_at?: string;
  /**
   * 是否最新
   */
  is_newest?: number;
  /**
   * 时间类型
   */
  time_type?: string;
  /**
   * 时间值
   */
  time_value?: string;
  [property: string]: any;
}

export interface Crd {
  created_at: string;
  is_newest: number;
  time_type: string;
  time_value: string;
  [property: string]: any;
}

/**
 * 目的港
 */
export interface PodPort {
  /**
   * 到达时间
   */
  arrive: ActionTime[];
  /**
   * 船司
   */
  carrier: string;
  /**
   * 箱号
   */
  container_no: string;
  /**
   * 出发时间
   */
  depart: ActionTime[];
  /**
   * 预计时间
   */
  expect_time: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 运输方式
   */
  transfer_type: string;
  [property: string]: any;
}

/**
 * 起运港
 */
export interface PolPort {
  /**
   * 到达时间
   */
  arrive: ActionTime[];
  /**
   * 船司
   */
  carrier: string;
  /**
   * 箱号
   */
  container_no: string;
  /**
   * 截场时间
   */
  cutoff: string;
  /**
   * 出发时间
   */
  depart: ActionTime[];
  /**
   * 预计时间
   */
  expect_time: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 船号
   */
  tracking: string;
  /**
   * 运输信息
   */
  transfer_info: string;
  /**
   * 运输方式
   */
  transfer_type: string;
  /**
   * 航线
   */
  vessel: string;
  [property: string]: any;
}

export interface ActionTime {
  /**
   * 更新时间
   */
  created_at?: string;
  /**
   * 是否最新
   */
  is_newest?: number;
  /**
   * 时间类型
   */
  time_type?: string;
  /**
   * 时间值
   */
  time_value?: string;
  [property: string]: any;
}

/**
 * 中转港 无此信息时无该字段
 */
export interface TransitPort {
  /**
   * 到达时间
   */
  arrive: ActionTime[];
  /**
   * 船司
   */
  carrier: string;
  /**
   * 箱号
   */
  container_no: string;
  /**
   * 出发时间
   */
  depart: ActionTime[];
  /**
   * 预计时间
   */
  expect_time: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 船号
   */
  tracking: string;
  /**
   * 运输信息
   */
  transfer_info: string;
  /**
   * 运输方式
   */
  transfer_type: string;
  /**
   * 航线
   */
  vessel: string;
  [property: string]: any;
}

export interface IUploadSelectOptions {
  upload_user_name: string;
  upload_user_id: number;
  admin_user_has_permission: boolean;
  upload_platform: number;
  [property: string]: any;
}
