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

import {BYTE_UNITS} from "./Formatter";

export const UNITS = ["", "K", "M", "G", "T", "P", "E", "Z", "Y"];
export const BYTE_STRING = "Byte";
const BYTE_UNIT = "B";
const BIN_BYTE_UNIT = "iB";
const BPS_UNIT = "bps";
const FREQ_UNIT = "Hz";

export enum UnitType {
  DEFAULT,
  BYTE,
  BIN_BYTE,
  BPS,
  FREQ,
}

const typeToUnit = {
  [UnitType.DEFAULT]: "",
  [UnitType.BYTE]: BYTE_UNIT,
  [UnitType.BIN_BYTE]: BIN_BYTE_UNIT,
  [UnitType.BPS]: BPS_UNIT,
  [UnitType.FREQ]: FREQ_UNIT,
}

export declare interface SizeTermResult {
  value: number;
  unit: string;
  index: number;
}

export interface SizeUnitOptions {
  fixedUnit?: number
  isCutoffFixed?: boolean;
  isBinary?: boolean;
}

export class SizeUnit {
  private readonly _size: number;
  private readonly _fixed?: number;
  private readonly _fixedUnit?: number;
  private readonly _unitType: UnitType;
  private readonly _base: 1000 | 1024;
  private readonly _isNegative: boolean;
  private readonly _result: SizeTermResult;
  private readonly _isCutoffFixed: boolean;

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
        return "";
    }
  }

  private static _cutoffFixed(value: number, fractionDigits: number) {
    const valueString = value.toString();
    const pointIndex = valueString.indexOf('.');
    if (pointIndex > -1) {
      let underPoint = valueString.slice(pointIndex + 1, pointIndex + fractionDigits + 1);
      if (underPoint === '' || Number(underPoint) === 0) {
        return valueString.slice(0, pointIndex);
      }
      return valueString.slice(0, pointIndex) + '.' + underPoint;
    }
  }

  private _convert() {
    if (!(this._unitType in UnitType)) {
      throw Error("[yeonyu-utils] Error SizeUnit invalid unitType in constructor");
    }
    const isByteUnitType = this._unitType === UnitType.BYTE || this._unitType === UnitType.BIN_BYTE;
    const unitBase = SizeUnit._decideUnitBase(this._unitType);
    let unitPrefixIndex = 0;
    if (this._size < this._base) {
      const pluralSuffix = (this._size === 0 || this._size === 1 ) ? '' : 's';
      let val = (this._isNegative ? -1 : 1) * this._size;
      if (isByteUnitType) {
        val = Number(this._size.toFixed(0));
      }
      if (this._isCutoffFixed && this._fixed !== undefined) {
        val = Number(SizeUnit._cutoffFixed(val, this._fixed));
      }
      return {
        value: val,
        unit: isByteUnitType
          ? (`${BYTE_STRING}${pluralSuffix}`) : unitBase,
        index: 0,
      };
    } else {
      unitPrefixIndex = Math.floor(
        Math.log(this._size) / Math.log(this._base)
      );
      let value = Number((this._size / this._base ** unitPrefixIndex));
      if (this._isCutoffFixed && this._fixed !== undefined) {
        value = Number(SizeUnit._cutoffFixed(value, this._fixed));
      } else if (this._fixed !== undefined) {
        value = Number(value.toFixed(this._fixed));
      }
      const unit = UNITS[unitPrefixIndex] + typeToUnit[this._unitType];
      return {
        value: (this._isNegative ? -1 : 1) * value,
        unit,
        index: unitPrefixIndex
      }
    }
  }

  constructor(
    size: number | string,
    unitType: UnitType = UnitType.DEFAULT,
    fixed?: number,
    options?: SizeUnitOptions,
  ) {
    const isBinary = options?.isBinary;
    const fixedUnit = options?.fixedUnit;
    if (isBinary) {
      this._base = 1024;
    } else {
      this._base = 1000;
    }
    if (Number.isNaN(Number(size))) {
      throw Error("[yeonyu-utils] Error size is not a number");
    }
    const $size = Number(size);
    this._isNegative = $size < 0;
    this._size = this._isNegative ? -($size) : $size;
    this._fixed = fixed;
    this._isCutoffFixed = options?.isCutoffFixed || false;
    this._unitType = unitType;
    this._fixedUnit = fixedUnit;
    this._result = this._convert();

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

  public toString() {
    if (this._result) {
      return `${this._result.value} ${this._result.unit}`
    }
    return "";
  }
}
