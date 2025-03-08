export interface ILoginReq {
  mobile: string;
  code: string;
}

export interface ILoginResult {
  [x: string]: IStaff | undefined;
  token: string | undefined;
  data: any;
  accessToken: string;
  refreshToken: string;
}
