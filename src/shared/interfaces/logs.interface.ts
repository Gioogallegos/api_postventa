import { RespI } from "./resp.interface";

export interface ResponseLogI {
  completed: boolean;
  idUsuario: string;
  operation: string;
  resp: RespI;
  response: any;
  request: any;
  tipoDocumento: string;
  detail?: object;
  codautCompra?: number;
  codautOperacion?: number;
  codautNew?: number;
  giftcard?: string;
  codMotivo?: number;
  comentario?: object;
}

export interface Motivos {
  cod: number;
  description: string;
}

export interface ThrowErrI {
  cod: number;
  location?: string;
  error: any;
}
