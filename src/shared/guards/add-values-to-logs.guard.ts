import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class AddValuesToLogs implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { body, params, query, raw } = context.switchToHttp().getRequest();
    //if (body) raw.logApi.request["body"] = body;
    //if (params) raw.logApi.request["params"] = params;
    //if (query) raw.logApi.request["query"] = query;
    return true;
  }
}
