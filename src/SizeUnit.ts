/*
 * yeonyu-utils
 *
 * Copyright (c) 2021. yeonyu. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

export const UNITS = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
export const BYTE_STRING = 'Byte';
const BYTE_UNIT = 'B';
const BIN_BYTE_UNIT = 'iB';
const BPS_UNIT = 'bps';
const FREQ_UNIT = 'Hz';

export enum UnitType {
  DEFAULT,
  BYTE,
  BIN_BYTE,
  BPS,
  FREQ,
}

const typeToUnit = {
  [UnitType.DEFAULT]: '',
  [UnitType.BYTE]: BYTE_UNIT,
  [UnitType.BIN_BYTE]: BIN_BYTE_UNIT,
  [UnitType.BPS]: BPS_UNIT,
  [UnitType.FREQ]: FREQ_UNIT,
};

export declare interface SizeTermResult {
  value: number;
  unit: string;
  index: number;
}

export interface SizeUnitOptions {
  fixedUnit?: number;
  isCutoffFixed?: boolean;
  isBinary?: boolean;
  customBase?: number;
  customUnits?: string[];
  isToLocaleString?: boolean;
  noSpaceToString?: boolean;
  customValue?: SizeUnitCustomValue;
}

export function cutoffFixed(value: number, fractionDigits: number) {
  const valueString = value.toString();
  const pointIndex = valueString.indexOf('.');
  if (pointIndex > -1) {
    let underPoint = valueString.slice(pointIndex + 1, pointIndex + fractionDigits + 1);
    if (underPoint === '' || Number(underPoint) === 0) {
      return valueString.slice(0, pointIndex);
    }
    return valueString.slice(0, pointIndex) + '.' + underPoint;
  }
  return value;
}

export type SizeUnitCustomValue = (size: number, fixed: number | undefined, sign: 1 | -1) => number;

export class SizeUnit {
  private readonly _size: number;
  private readonly _fixed?: number;
  private readonly _fixedUnit?: number;
  private readonly _unitType: UnitType;
  private readonly _base: 1000 | 1024 | number;
  private readonly _isNegative: boolean;
  private readonly _result: SizeTermResult;
  private readonly _isCutoffFixed: boolean;
  private readonly _isToLocaleString: boolean;
  private readonly _noSpaceToString: boolean;
  private readonly _customValueFunction?: SizeUnitCustomValue;

  constructor(
    size: number | string,
    unitType: UnitType = UnitType.DEFAULT,
    fixed?: number,
    options?: SizeUnitOptions
  ) {
    const isBinary = options?.isBinary;
    const fixedUnit = options?.fixedUnit;
    const customBase = options?.customBase;
    const customUnits = options?.customUnits;

    if (customBase) {
      this._base = customBase;
    } else if (isBinary) {
      this._base = 1024;
    } else {
      this._base = 1000;
    }
    if (Number.isNaN(Number(size))) {
      throw Error('[yeonyu-utils] Error size is not a number');
    }
    const $size = Number(size);
    this._isNegative = $size < 0;
    this._size = this._isNegative ? -$size : $size;
    this._customValueFunction = options?.customValue;
    this._fixed = fixed;
    this._isCutoffFixed = options?.isCutoffFixed || false;
    this._isToLocaleString = !!options?.isToLocaleString;
    this._noSpaceToString = !!options?.noSpaceToString;
    this._unitType = unitType;
    this._fixedUnit = fixedUnit;
    this._result = this._convert(customUnits);

    return this;
  }

  public get value() {
    return this._result.value;
  }

  public get unit() {
    return this._result.unit;
  }

  public get index() {
    return this._result.index;
  }

  private static _decideUnitBase(type: UnitType) {
    switch (type) {
      case UnitType.BYTE:
        return BYTE_UNIT;
      case UnitType.BIN_BYTE:
        return BIN_BYTE_UNIT;
      case UnitType.BPS:
        return BPS_UNIT;
      case UnitType.FREQ:
        return FREQ_UNIT;
      default:
        return '';
    }
  }

  private static _cutoffFixed = cutoffFixed;

  public toString(custom?: (result: SizeTermResult) => string) {
    if (typeof custom === 'function') {
      return custom(this._result);
    }
    if (this._result) {
      const { _isToLocaleString, _result, _noSpaceToString } = this;
      const { value, unit } = _result;
      const emitValue = _isToLocaleString ? value.toLocaleString() : value;
      if (unit === '') return emitValue;
      const space = _noSpaceToString ? '' : ' ';
      return `${emitValue}${space}${unit}`;
    }
    return '';
  }

  private _computeValue(value: number): number {
    const { _isNegative, _fixed } = this;
    const sign = _isNegative ? -1 : 1;
    if (typeof this._customValueFunction === 'function') {
      return this._customValueFunction(value, _fixed, sign);
    }
    if (this._isCutoffFixed && _fixed !== undefined) {
      return sign * Number(SizeUnit._cutoffFixed(value, _fixed));
    } else if (_fixed !== undefined) {
      return sign * Number(value.toFixed(_fixed));
    }
    return value;
  }

  private _convert(customUnits?: string[]) {
    if (!(this._unitType in UnitType)) {
      throw Error('[yeonyu-utils] Error SizeUnit invalid unitType in constructor');
    }
    const isByteUnitType = this._unitType === UnitType.BYTE || this._unitType === UnitType.BIN_BYTE;
    const unitBase = SizeUnit._decideUnitBase(this._unitType);
    let unitPrefixIndex = 0;
    if (this._size < this._base) {
      const pluralSuffix = this._size === 0 || this._size === 1 ? '' : 's';
      let value = this._size;
      if (isByteUnitType) {
        value = (this._isNegative ? -1 : 1) * Number(cutoffFixed(this._size, 0));
      } else {
        value = this._computeValue(value);
      }
      return Object.freeze({
        value,
        unit: isByteUnitType ? `${BYTE_STRING}${pluralSuffix}` : unitBase,
        index: 0,
      });
    } else {
      unitPrefixIndex = Math.floor(Math.log(this._size) / Math.log(this._base));
      const units = customUnits ? customUnits : UNITS;
      const unit = units[unitPrefixIndex] + typeToUnit[this._unitType];
      let value = Number(this._size / this._base ** unitPrefixIndex);
      value = this._computeValue(value);
      return Object.freeze({
        value,
        unit,
        index: unitPrefixIndex,
      });
    }
  }
}
