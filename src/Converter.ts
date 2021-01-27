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

// decimal ip type to CIDR prefix length
export const subnetMask2CIDR = function (smStr: string) {
  if (typeof (smStr) !== 'string') {
    return -1;
  }

  const _splited = smStr.split('.');
  if (_splited.length === 4) {
    let result = 0;
    for (const digit of _splited) {
      const _num = parseInt(digit, 10);
      if (_num <= 255 && _num >= 0) {
        const _bit = _num.toString(2);
        result += (_bit.match(/1/g) || []).length;
      } else {
        return -1;
      }
    }
    return result;
  }

  return -1;
};

// CIDR prefix length to decimal
export const CIDR2SubnetMask = function (cidr: number) {
  const result = [];
  if (cidr >= 0 && cidr <= 32) {
    for (let i = 0; i < 4; i++) {
      if (cidr >= 8) {
        result.push('255');
        cidr -= 8;
      } else if (cidr > 0) {
        result.push(256 - Math.pow(2, cidr));
      } else {
        result.push('0');
      }
    }
  }
  if (result.length === 4) {
    return result.join('.');
  } else {
    return '';
  }
};

export const rgbHexToDecimal = function (rgbString: string) {
  const rgbHex = rgbString.replace("#", "").toUpperCase();
  if (/[0-9A-F]{6}/.test(rgbHex)) {
    const rgb = [];
    for (let i = 0; i < 3; i++) {
      rgb.push(rgbHex.substr(i * 2, 2));
    }
    return rgb.map((value) => {
      return parseInt(value, 16);
    });
  }
  return undefined;
}

export const decimalToBitString = function (decimal: number, bitLength: number) {
  return Number(decimal).toString(2).padStart(bitLength, "0");
}

export const decimalToBitFlags = function (target: number, bitLength: number) {
  const flags: number[] = [];
  const bitString = decimalToBitString(target, bitLength);
  if (bitString.length === bitLength) {
    for (let i = 0; i < bitLength; i ++) {
      if (bitString.charAt(i) === "1") {
        flags.push(Math.pow(2, bitLength - (i + 1)));
      }
    }
  }

  return flags;
}

export default {
  subnetMask2CIDR,
  CIDR2SubnetMask,
  rgbHexToDecimal,
  decimalToBitString,
  decimalToBitFlags,
}
