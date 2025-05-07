import { Injectable } from "@nestjs/common";
import { DatabaseAwsService } from "../connections/aws-db.service";
import { ResponseLogI } from "../interfaces/logs.interface";

interface UpdateLogData {
  resp?: { codResp: string; resp: string; saldoTraspasado?: number };
  changes?: ChangesUpdateLog;
}

interface ChangesUpdateLog {
  isGcToGc: boolean;
}

@Injectable()
export class LogsService {
  constructor(private readonly _dbAws: DatabaseAwsService) {}

  async insert(log: ResponseLogI) {
    try {
      await this._insertMainLog(log);
      return [true];
    } catch (error) {
      return [false, 6];
    }
  }

  private async _insertMainLog(log: ResponseLogI): Promise<true | null> {
    try {
      if (!log || log.completed) return null;
      log.completed = true;
      const { idUsuario, operation, resp, request, response, detail } = log;
      const sql = {
        query: `INSERT INTO public.logs_postventa
        (id_usuario, operacion, codresp, msgresp, request, response, detalle) 
        VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
        params: [
          idUsuario || null,
          operation,
          resp.codResp,
          resp.resp.substring(0, 50),
          request,
          response,
          detail || null,
        ],
      };
      await this._dbAws.call(sql);
      return true;
    } catch (error) {
      return null;
    }
  }

  update(logData: ResponseLogI, nd: UpdateLogData) {
    if (nd.resp) {
      logData.resp.codResp = nd.resp.codResp;
      logData.resp.resp = nd.resp.resp;
      logData.response = nd.resp;
    }
  }
}
