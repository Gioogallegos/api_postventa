export interface SqlDb2I {
  sql: string;
  params: ParamDB2I[];
  ArraySize?: number;
}

export interface SqlDb2SpI {
  sql: string;
  params: ParamSpDB2I[];
  ArraySize?: number;
}

export interface ParamDB2I {
  ParamType?: string;
  DataType: any;
  Data: any;
  Length?: number;
  SQLType?: any;
}

export interface ParamSpDB2I {
  ParamType?: string;
  DataType?: any;
  Data?: any;
  Length?: number;
  SQLType?: any;
}

export interface SqlPGI {
  query: string;
  params: (string | number | Date | null)[];
}


export interface TokensHttp {
  cookie?: any;
  gcpdf?: string;
  so?: boolean;
}
