// logger.service.ts
import { Injectable } from "@angular/core";
import { NGXLogger } from "ngx-logger";

@Injectable({ providedIn: "root" })
export class LoggerService {
  constructor(private logger: NGXLogger) {}

  debug(...args: any[]) { this.logger.debug(...args); }
  info(...args: any[]) { this.logger.info(...args); }
  warn(...args: any[]) { this.logger.warn(...args); }
  error(...args: any[]) { this.logger.error(...args); }
}
