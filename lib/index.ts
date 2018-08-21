/**
 * Main file of NodeFlipr project
 * @module Flipr
 * @author Nicolas Nunge <me@nikkow.eu>
 * @version 1.0.0
 */

import { FliprConfigInterface } from './interfaces/fliprconfig.interface';
import { Deviation } from './enums/deviation.enum';
import { DisinfectantType } from './enums/disinfectanttype.enum';
import { Network } from './classes/network';
import { FliprMeasure } from './classes/measure';
import { TemperatureUnit } from './enums/temperature-unit.enum';

export * from './enums/deviation.enum';
export * from './enums/disinfectanttype.enum';
export * from './enums/temperature-unit.enum';
export * from './interfaces/fliprconfig.interface';

/** Class representing the main instance of Flipr */
export class Flipr {

  private config: FliprConfigInterface;
  private network: Network;

  private defaultConfig: FliprConfigInterface = {
    username: null,
    password: null,
    deviceSerial: null
  };

  /**
   * Creates a new instance of Flipr class.
   * @param  {FliprConfigInterface} config User specific configuration. This will overwrite the default parameters.
   */
  public constructor(
    config: FliprConfigInterface
  ) {
    if(!config.username) {
      throw new Error("You must set the username property.")
    }

    if(!config.password) {
      throw new Error("You must set the password property.")
    }

    this.config = {
      ...this.defaultConfig,
      ...config
    };

    this.network = new Network(this.config);
    this.network.auth();
  }

  /**
   * methodTwo description
   * @return {Promise<FliprMeasure>} Promise that will return a new instance of FliprMeasure, filled with the latest measure captured by Flipr.
   */
  public getLastMeasure() {
    return this.network.get('/modules/'+ this.config.deviceSerial +'/survey/last')
      .then((e:any) => {
        return new FliprMeasure(e);
      })
  }
}
