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

const UNITS = ["", " K", " M", " G", " T", " P", " E", " Z", " Y"];
const BYTE_STRING = "Byte";
const BYTE_UNITS = [
  " Bytes",
  " KB",
  " MB",
  " GB",
  " TB",
  " PB",
  " EB",
  " ZB",
  " YB",
];
const BPS_UNITS = ["bps", "Kbps", "Mbps", "Gbps", "Tbps", "Pbps"];
const FREQ_UNITS = [
  " Hz",
  " KHz",
  " MHz",
  " GHz",
  " THz",
  " PHz",
  " EHz",
  " ZHz",
  " YHz",
];

export declare interface SizeTermResult {
  value: number;
  unit: string;
  index: number;
}

export const sizeTerm = (size: number, fixed = 0, units?: number) => {
  if (size === undefined) {
    return;
  }
  if (size === 0) {
    return {
      value: 0,
      unit: "",
      index: 0,
    };
  }

  let i: number;
  if (units === undefined) {
    i = Math.floor(Math.log(size) / Math.log(1000));
    if (i === 0) {
      return {
        value: size,
        unit: "",
        index: 0,
      };
    }
  } else {
    i = units;
  }
  if (!i) {
    i = 0;
  }

  const res = Number((size / 1000 ** i).toFixed(fixed));

  return {
    value: res,
    unit: UNITS[i],
    index: i,
  };
};

export const sizeTermByte = (size: number, fixed = 0, units?: number) => {
  if (size === undefined) {
    return;
  }
  if (size === 0) {
    return {
      value: 0,
      unit: BYTE_STRING,
      index: 0,
    };
  }

  let i: number;
  if (units === undefined) {
    i = Math.floor(Math.log(size) / Math.log(1024));
    if (i === 0) {
      return {
        value: size,
        unit: size === 1 ? BYTE_STRING : BYTE_UNITS[i],
        index: 0,
      };
    }
  } else {
    i = units;
  }
  if (!i) {
    i = 0;
  }

  const res = Number((size / 1024 ** i).toFixed(fixed));

  return {
    value: res,
    unit: BYTE_UNITS[i],
    index: i,
  };
};

export const sizeTermByteToString = (
  size: number,
  fixed = 0,
  units?: number
) => {
  const formatSize = sizeTermByte(size, fixed, units);
  if (formatSize) {
    return formatSize.value + " " + formatSize.unit;
  }
};

export const sizeTermBps = (size: number | string, fixed = 0, units?: number) => {
  if (size === undefined) {
    return;
  }
  if (typeof(size) === 'string') {
    size = Number(size);
    if (isNaN(size)) {
      return;
    }
  }
  if (size >= 0 && size < 1) {
    return {
      value: size,
      unit: BPS_UNITS[0],
      index: 0,
    };
  }
  const minus = size < 0;
  if (minus) {
    size = -(size);
  }
  let i: number;
  if (units === undefined) {
    i = Math.floor(Math.log(size) / Math.log(1000));
    if (i === 0) {
      return {
        value: minus ? -(size) : size,
        unit: BPS_UNITS[i],
        index: 0,
      };
    }
  } else {
    i = units;
  }
  if (!i) {
    i = 0;
  }

  if (BPS_UNITS.length <= i) {
    i = BPS_UNITS.length - 1;
  }
  const value = Number((size / 1000 ** i).toFixed(fixed));
  return {
    value: minus ? -(value) : value,
    unit: BPS_UNITS[i],
    index: i,
  };
};

export const bpsStepper = (size: number, isHalf = true) => {
  const MIN = 10000000;
  const MAX = 10 ** 15;
  let maxStep = MIN;
  let scale = 10;
  let half = 5;

  if (size < maxStep) {
    return maxStep;
  }
  while(size > maxStep && maxStep < MAX) {
    maxStep = MIN * scale;
    if (isHalf) {
      scale = scale * half;
      half = half === 5 ? 2 : 5;
    } else {
      scale = scale * 10;
    }
  }

  return maxStep;
}

export const sizeTermFreq = (size: number, fixed = 0, units?: number) => {
  if (size === undefined) {
    return;
  }
  if (size === 0) {
    return {
      value: 0,
      unit: FREQ_UNITS[0],
      index: 0,
    };
  }

  let i: number;
  if (units === undefined) {
    i = Math.floor(Math.log(size) / Math.log(1000));
    if (i === 0) {
      return {
        value: size,
        unit: FREQ_UNITS[i],
        index: 0,
      };
    }
  } else {
    i = units;
  }
  if (!i) {
    i = 0;
  }

  const res = Number((size / 1000 ** i).toFixed(fixed));

  return {
    value: res,
    unit: FREQ_UNITS[i],
    index: i,
  };
};

export const sizeTermFreqToString = (
  size: number,
  fixed = 0,
  units?: number
) => {
  const formatSize = sizeTermFreq(size, fixed, units);
  if (formatSize) {
    return formatSize.value + " " + formatSize.unit;
  }
};

export function lpad(input: string, fillChar: string, fixedLength: number) {
  if (!input || !fillChar || input.length >= fixedLength) {
    return input;
  }

  const max = (fixedLength - input.length) / fillChar.length;
  for (let i = 0; i < max; i++) {
    input = fillChar + input;
  }

  return input;
}

export default {
  sizeTerm,
  sizeTermByte,
  sizeTermByteToString,
  sizeTermBps,
  sizeTermFreq,
  lpad,
  sizeTermFreqToString,
};
