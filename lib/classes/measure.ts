/**
 * Measure specific module.
 * @module Flipr
 * @author Nicolas Nunge <me@nikkow.eu>
 * @version 1.0.0
 */

import { TemperatureUnit } from '../enums/temperature-unit.enum';
import { DisinfectantType } from '../enums/disinfectanttype.enum';
import { Deviation } from '../enums/deviation.enum';

/** FliprMeasure is used to handle metrics returned by Flipr */
export class FliprMeasure {

  private measureDate: Date | null = null;

  private batteryLevel: number | null = null;

  private uvIndex: number | null = null;

  private cloudCoverage: number | null = null;

  private temperature: number | null = null;

  private disinfectantType: DisinfectantType | null = null;

  private disinfectantDeviation: number | null = null;

  private disinfectantDeviationSector: Deviation = Deviation.UNKNOWN;

  private phValue: number | null = null;

  private phDeviation: number | null = null;

  private phDeviationSector: Deviation = Deviation.UNKNOWN;

  // TODO: Replace with proper interface
  /**
   * Creates a new instance of FliprMeasure
   */
  constructor(rawMeasureObject: any) {
    if(rawMeasureObject.hasOwnProperty('DateTime')) {
      this.measureDate = new Date(rawMeasureObject.DateTime);
    }

    if(rawMeasureObject.hasOwnProperty('Battery') && rawMeasureObject.Battery.hasOwnProperty('Deviation')) {
      this.batteryLevel = rawMeasureObject.Battery.Deviation;
    }

    if(rawMeasureObject.hasOwnProperty('CloudCoverage')) {
      this.cloudCoverage = rawMeasureObject.CloudCoverage;
    }

    if(rawMeasureObject.hasOwnProperty('UvIndex')) {
      this.uvIndex = rawMeasureObject.UvIndex;
    }

    if(rawMeasureObject.hasOwnProperty('Temperature')) {
      this.temperature = rawMeasureObject.Temperature;
    }

    if(rawMeasureObject.hasOwnProperty('Desinfectant')) {
      if(rawMeasureObject.Desinfectant.hasOwnProperty('Label')) {
        switch(rawMeasureObject.Desinfectant.Label) {
          case "Chlore":
            this.disinfectantType = DisinfectantType.CHLORINE;
            break;

          case "Brome":
            this.disinfectantType = DisinfectantType.BROMINE;
            break;

          case "Sel":
            this.disinfectantType = DisinfectantType.SALT;
            break;
        }
      }

      if(rawMeasureObject.Desinfectant.hasOwnProperty('Deviation')) {
        this.disinfectantDeviation = rawMeasureObject.Desinfectant.Deviation;
      }

      if(rawMeasureObject.Desinfectant.hasOwnProperty('DeviationSector')) {
        this.disinfectantDeviationSector = this.stringToDeviation(rawMeasureObject.Desinfectant.DeviationSector);
      }
    }

    if(rawMeasureObject.hasOwnProperty('PH')) {
      if(rawMeasureObject.PH.hasOwnProperty('Value')) {
        this.phValue = rawMeasureObject.PH.Value;
      }

      if(rawMeasureObject.PH.hasOwnProperty('Deviation')) {
        this.phDeviation = rawMeasureObject.PH.Deviation;
      }

      if(rawMeasureObject.PH.hasOwnProperty('DeviationSector')) {
        this.phDeviationSector = this.stringToDeviation(rawMeasureObject.PH.DeviationSector);
      }
    }
  }

  /**
   * Returns the date when these metrics were captured by Flipr.
   * @return  {Date|null} a native Date object of the metric capture date.
   */
  public getDate(): Date | null {
    return this.measureDate;
  }

  /**
   * Returns the UV index at the moment the metrics were captured.
   * @return  {number|null}
   */
  public getUVIndex(): number | null {
    return this.uvIndex;
  }

  /**
   * Returns the cloud coverage at the moment the metrics were captured.
   * @param  {boolean} expectRawValue
   * @return {number|null} When the "expectRawValue" parameter is set to true, the method will return the cloud coverage as returned by Flipr: a float 0 <= x <= 1. Otherwhise, the result will be returned as a percentage 0 <= x <= 100.
   */
  public getCloudCoverage(expectRawValue: boolean): number | null {
    if(expectRawValue) {
      return this.cloudCoverage;
    }

    return this.cloudCoverage !== null ? (this.cloudCoverage * 100) : null;
  }

  /**
   * Returns the device's battery level at the moment the metrics were captured.
   * @param  {boolean} expectRawValue
   * @return {number|null} When the "expectRawValue" parameter is set to true, the method will return the battery level as returned by Flipr: a float 0 <= x <= 1. Otherwise, the result will be returned as a percentage 0 <= x <= 100.
   */
  public getBatteryLevel(expectRawValue: boolean): number | null {
    if(expectRawValue) {
      return this.batteryLevel;
    }

    return this.batteryLevel !== null ? (this.batteryLevel * 100) : null;
  }

  /**
   * Returns the water's temperature in various units.
   * @param  {TemperatureUnit} unit Specifies the unit the result should be returned. See TemperatureUnit enum for possible values.
   * @return {number|null}
   */
  public getTemperature(unit: TemperatureUnit = TemperatureUnit.CELCIUS): number | null {
    if(this.temperature === null) {
      return null;
    }

    switch(unit) {
      case TemperatureUnit.FAHRENHEIT:
        return this.temperature * (9/5) + 32;

      case TemperatureUnit.KELVIN:
        return this.temperature + 273.15;

      case TemperatureUnit.CELCIUS:
      default:
        return this.temperature
    }
  }

  /**
   * Returns the type of disinfectant currently in use.
   * @return  {DisinfectantType|null}
   */
  public getDisinfectantType(): DisinfectantType | null {
    return this.disinfectantType;
  }

  /**
   * Returns the current disinfectant deviation/variation.
   * @param  {boolean} expectRawValue When true, the result will be the raw deviation (as a number, -1 <= x <= 1). Otherwise, the deviation sector (see Deviation enum)
   * @return {number|null}
   */
  public getDisinfectantDeviation(expectRawValue: boolean): Deviation | number | null {
    return expectRawValue ? this.disinfectantDeviation : this.disinfectantDeviationSector;
  }

  /**
   * Returns the raw PH value.
   * @return  {number|null}
   */
  public getPHValue(): number | null {
    return this.phValue;
  }

  /**
   * Returns the current PH deviation/variation.
   * @param  {boolean} expectRawValue When true, the result will be the raw deviation (as a number, -1 <= x <= 1). Otherwise, the deviation sector (see Deviation enum)
   * @return {number|null}
   */
  public getPHDeviation(expectRawValue: boolean): Deviation | number | null {
    return expectRawValue ? this.phDeviation : this.phDeviationSector;
  }

  /**
   * Converts API values to Deviation
   * @private
   * @param  {string} input
   * @return {Deviation}
   */
  private stringToDeviation(input: string): Deviation {
    switch(input.toUpperCase()) {
      case "TOOHIGH":      return Deviation.TOO_HIGH;
      case "MEDIUMHIGH":   return Deviation.MEDIUM_HIGH;
      case "MEDIUM":       return Deviation.MEDIUM;
      case "MEDIUMLOW":    return Deviation.MEDIUM_LOW;
      case "TOOLOW":       return Deviation.TOO_LOW;
      default:             return Deviation.UNKNOWN;
    }
  }
}
