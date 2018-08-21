/**
 * Network Layer
 * @module Flipr
 * @author Nicolas Nunge <me@nikkow.eu>
 * @version 1.0.0
 */

import { FliprConfigInterface } from '../interfaces/fliprconfig.interface';
import { HttpStatusCode } from '../enums/httpstatuscode.enum';
import * as request from 'request';
import { Promise } from 'es6-promise'

export class Network {
  private config: FliprConfigInterface;

  private apiBaseUrl: string = "https://apis.goflipr.com";

  private accessToken: string | null = null;
  private expires: Date | null = null;

  public constructor(config: FliprConfigInterface) {
    this.config = config;
  }

  public auth(): Promise<any> {
    return new Promise((resolve, reject) => {
      request.post(this.apiBaseUrl + "/OAuth2/token", {
        form: {
          grant_type: "password",
          username: this.config.username,
          password: this.config.password
        },
        json: true
      }, (error, httpResponse, body) => {
        if(httpResponse.statusCode !== HttpStatusCode.OK) {
          return reject(new Error("Login failed."));
        }

        this.accessToken = body["access_token"];

        const expirationDate = new Date();
        expirationDate.setSeconds( expirationDate.getSeconds + body["expires"] );
        this.expires = expirationDate;

        return resolve();
      });
    });
  }

  private ensureAuth(): Promise<any> {
    if(this.accessToken !== null && this.expires !== null && this.expires > (new Date())) {
      return Promise.resolve();
    }

    return this.auth();
  }

  public get(endpoint: string) {
    return new Promise((resolve, reject) => {
      this.ensureAuth().then(() => {
        request.get(this.apiBaseUrl + endpoint, {
          json: true,
          headers: {
            "Authorization": 'Bearer '+ this.accessToken
          }
        }, (error, httpResponse, body) => {
          if(httpResponse.statusCode === HttpStatusCode.OK) {
            resolve(body);
          }

          reject(error);
        })
      })
    });
  }
}
