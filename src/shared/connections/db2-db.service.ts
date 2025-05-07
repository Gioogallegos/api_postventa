process.env.DB2CODEPAGE = "1208";
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import * as ibmdb from "ibm_db";

import { Subject, Subscription, repeat, takeUntil, timer } from "rxjs";
// configs
import { ConfigVarsService } from "../configs/config-vars.service";
// interfaces
import { SqlDb2I, SqlDb2SpI } from "../interfaces/db.interface";

@Injectable()
export class DatabaseDb2Service implements OnModuleInit, OnModuleDestroy {
  private _db: ibmdb.Pool;
  private _timerIdleCloseSubcr: Subscription;
  private _durationTimerIdleClose: number = 15 * 60 * 1000;
  private _triggerTimerIdleClose$: Subject<void> = new Subject();

  constructor(private readonly _config: ConfigVarsService) {}

  async onModuleInit(): Promise<void> {
    this._db = new ibmdb.Pool({
      autoCleanIdle: true,
      idleTimeout: 10 * 60,
      connectTimeout: 60,
      maxPoolSize: this._config.DB_DB2_POOL_MAX,
    });
    this._db.init(1, this._config.DB_DB2_CNSTR);
    this._timerIdleCloseSubcr = timer(this._durationTimerIdleClose)
      .pipe(takeUntil(this._triggerTimerIdleClose$), repeat())
      .subscribe(() => this._idleClose());
    await this.call({
      sql: "SELECT current date from sysibm.sysdummy1",
      params: [],
    });
  }

  onModuleDestroy(): void {
    this._db?.close();
    this._timerIdleCloseSubcr.unsubscribe();
  }

  async call(sql: SqlDb2I, intentos: number = 0) {
    try {
      return new Promise((resolve, reject) => {
        this.ejecuteTriggerIdleClose();
        this._db.open(this._config.DB_DB2_CNSTR, (err, conn) => {
          if (err) {
            reject(err);
          }
          conn.query(sql, (errCn, rows) => {
            conn.close((errCl) => {
              if (errCl) console.error(errCl);
            });
            if (errCn) reject(errCn);
            resolve(rows);
          });
        });
      });
    } catch (error) {
      const codErr = (error as Error).message.slice(18, 27);
      if (intentos === 0 && codErr === "SQL30081N") {
        return await this.call(sql, 1);
      } else {
        throw new Error((error as Error).message);
      }
    }
  }

  async exec(
    sql: SqlDb2SpI,
    intentos: number = 0
  ): Promise<{ result: any[]; outparams: any }> {
    try {
      return await new Promise((resolve, reject) => {
        this.ejecuteTriggerIdleClose();
        this._db.open(this._config.DB_DB2_CNSTR, (err, conn) => {
          if (err) reject(err);
          conn.prepare(sql.sql, (errCn, stmt) => {
            if (errCn) {
              conn.close((errCl) => {
                if (errCl) console.error(errCl);
              });
              reject(errCn);
            }
            stmt.execute(sql.params, (errExc, result, outparams) => {
              conn.close((errCl) => {
                if (errCl) console.error(errCl);
              });
              if (errExc) reject(errExc);
              resolve({ result, outparams });
            });
          });
        });
      });
    } catch (error) {
      const codErr = (error as Error).message.slice(18, 27);
      if (intentos === 0 && codErr === "SQL30081N") {
        return await this.exec(sql, 1);
      } else {
        throw new Error((error as Error).message);
      }
    }
  }

  async execNonQuery(sql: SqlDb2SpI, intentos: number = 0) {
    try {
      return await new Promise((resolve, reject) => {
        this.ejecuteTriggerIdleClose();
        this._db.open(this._config.DB_DB2_CNSTR, (err, conn) => {
          if (err) reject(err);
          conn.prepare(sql.sql, (errCn, stmt) => {
            if (errCn) {
              conn.close((errCl) => {
                if (errCl) console.error(errCl);
              });
              reject(errCn);
            }
            stmt.executeNonQuery(sql.params, (errExc, deleted) => {
              conn.close((errCl) => {
                if (errCl) console.error(errCl);
              });
              if (errExc) reject(errExc);
              resolve(deleted);
            });
          });
        });
      });
    } catch (error) {
      const codErr = (error as Error).message.slice(18, 27);
      if (intentos === 0 && codErr === "SQL30081N") {
        return await this.exec(sql, 1);
      } else {
        throw new Error((error as Error).message);
      }
    }
  }

  private ejecuteTriggerIdleClose() {
    this._triggerTimerIdleClose$.next();
  }

  private _idleClose() {
    if (this._db.poolSize === 0) return;
    const db = this._db;
    const now = Date.now();
    db.availablePool[this._config.DB_DB2_CNSTR] = db.availablePool[
      this._config.DB_DB2_CNSTR
    ].filter(function (conn) {
      if (
        conn.lastUsed &&
        now - conn.lastUsed > db.options.idleTimeout &&
        conn.realClose
      ) {
        conn.realClose(function () {
          if (db.poolSize) db.poolSize--;
        });
        return false;
      } else {
        return true;
      }
    });
  }
}
