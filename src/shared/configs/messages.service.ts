import { Injectable } from "@nestjs/common";
import { RespI } from "../interfaces/resp.interface";

export enum GenericErrors {
  "E007" = "Mensaje generico",
}

@Injectable()
export class MessagesResponse {
  private readonly _messages: RespI[] = [
    { codResp: "I000", resp: "Éxito" },
    { codResp: "E001", resp: "Token inválido" },
    { codResp: "E002", resp: "Correo electrónico y/o contraseña incorrecta" },
    { codResp: "E003", resp: "Usuario bloqueado" },
    {
      codResp: "E004",
      resp: "El Usuario no tiene permisos para realizar esta acción",
    },
    { codResp: "E005", resp: "Request con formato inválido" },
    { codResp: "E006", resp: "Runtime Error" },
    { codResp: "E007", resp: GenericErrors.E007 },
  ];

  constructor() {}

  get(idx: number): RespI {
    return { ...(this._messages[idx] || this._messages[6]) };
  }
}
