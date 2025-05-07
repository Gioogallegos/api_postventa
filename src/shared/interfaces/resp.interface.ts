export interface RespI {
  codResp: string;
  resp: string;
  errors?: ErrorI | any;
}

export interface ErrorI {
  cod: number;
  location: string;
  error: any;
}
