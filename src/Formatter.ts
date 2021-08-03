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

import { BYTE_STRING, UNITS } from "./SizeUnit";

export const BYTE_UNITS = [
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
export const BI_BYTE_UNITS = [
  " Bytes",
  " KiB",
  " MiB",
  " GiB",
  " TiB",
  " PiB",
  " EiB",
  " ZiB",
  " YiB"
];
export const BPS_UNITS = ["bps", "Kbps", "Mbps", "Gbps", "Tbps", "Pbps"];
export const FREQ_UNITS = [
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

/**
 * @deprecated {@class SizeTerm}로 대체됨
 * 기본 1000 단위로 변환
 *
 * @param size - 값
 * @param fixed - 소수점 자리 고정
 * @param units - 고정 할 단위(제곱)
 */
export const sizeTerm = (
  size: number,
  fixed = 0,
  units?: number
) => {
  const sizeValue = size ?? 0;

  if (sizeValue === 0) {
    return {
      value: 0,
      unit: "",
      index: 0,
    };
  }

  let i: number;
  if (units === undefined) {
    i = Math.floor(Math.log(sizeValue) / Math.log(1000));
    if (i === 0) {
      return {
        value: sizeValue,
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

  const res = Number((sizeValue / 1000 ** i).toFixed(fixed));

  return {
    value: res,
    unit: UNITS[i],
    index: i,
  };
};

/**
 * @deprecated 데이터 용량 단위로 변환
 * @description 십진수/이진수 값과 단위로 각각 변환 할 수 있으며 디폴트는 이진수 값(1024)와 단위(XiB)를 사용
 *
 * sizeTerm 으로
 *
 * @param size - 바이트 단위 사이즈
 * @param fixed - 반환 할 소수점 자리
 * @param units - 고정할 단위
 * @param binary - 이진수 값으로 계산 여부 (@default: true)
 * @param binaryUnits - 이진수 단위로 반환 여부 (@default: true)
 */
export const sizeTermByte = (
  size: number,
  fixed = 0,
  units?: number,
  binary = true,
  binaryUnits = true
) => {
  const sizeValue = size ?? 0;
  if (sizeValue === 0) {
    return {
      value: 0,
      unit: BYTE_STRING,
      index: 0,
    };
  }

  let i: number;
  if (units === undefined) {
    i = Math.floor(Math.log(sizeValue) / Math.log(binary ? 1024 : 1000));
    if (i === 0) {
      return {
        value: sizeValue,
        unit: sizeValue === 1 ? BYTE_STRING : BYTE_UNITS[i],
        index: 0,
      };
    }
  } else {
    i = units;
  }
  if (!i) {
    i = 0;
  }

  const res = Number((sizeValue / 1024 ** i).toFixed(fixed));

  return {
    value: res,
    unit: BYTE_UNITS[i],
    index: i,
  };
};

/**
 * @deprecated sizeTermByte 의 문자열 변환
 *
 * @param size
 * @param fixed
 * @param units
 */
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

/**
 * @deprecated 초당 전송량 단위로 변환
 *
 * @param size
 * @param fixed
 * @param units
 */
export const sizeTermBps = (size: number | string, fixed = 0, units?: number) => {
  let sizeValue = size;
  if (typeof (sizeValue) === 'string') {
    sizeValue = Number(sizeValue);
    if (isNaN(sizeValue)) {
      return;
    }
  }
  if (sizeValue >= 0 && sizeValue < 1) {
    return {
      value: sizeValue,
      unit: BPS_UNITS[0],
      index: 0,
    };
  }
  const minus = sizeValue < 0;
  if (minus) {
    sizeValue = -(sizeValue);
  }
  let i: number;
  if (units === undefined) {
    i = Math.floor(Math.log(sizeValue) / Math.log(1000));
    if (i === 0) {
      return {
        value: minus ? -(sizeValue) : sizeValue,
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
  const value = Number((sizeValue / 1000 ** i).toFixed(fixed));
  return {
    value: minus ? -(value) : value,
    unit: BPS_UNITS[i],
    index: i,
  };
};

/**
 * @deprecated
 *
 * @param size
 * @param fixed
 * @param units
 */
export const sizeTermFreq = (
  size: number,
  fixed = 0,
  units?: number
) => {
  const sizeValue = size ?? 0;
  if (sizeValue === 0) {
    return {
      value: 0,
      unit: FREQ_UNITS[0],
      index: 0,
    };
  }

  let i: number;
  if (units === undefined) {
    i = Math.floor(Math.log(sizeValue) / Math.log(1000));
    if (i === 0) {
      return {
        value: sizeValue,
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

  const res = Number((sizeValue / 1000 ** i).toFixed(fixed));

  return {
    value: res,
    unit: FREQ_UNITS[i],
    index: i,
  };
};

/**
 * @deprecated
 *
 * @param size
 * @param fixed
 * @param units
 */
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

/**
 * Left Padding
 * @description 문자열 왼쪽에 글자수 만큼 입력한 글자로 채움
 * String.padStart 없을 경우 Polyfill
 *
 * @param input - 변경할 문자열
 * @param fillChar - 채울 글자
 * @param fixedLength - 글자수
 */
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

/**
 * 초당 전송량 값을 10 또는 5의 배수로 계산한 최댓값
 *
 * @param size
 * @param isHalf
 */
export const bpsStepper = (size: number, isHalf = true) => {
  const sizeValue = size ?? 0;
  const MIN = 10000000;
  const MAX = 10 ** 15;
  let maxStep = MIN;
  let scale = 10;
  let half = 5;

  if (sizeValue < maxStep) {
    return maxStep;
  }
  while (sizeValue > maxStep && maxStep < MAX) {
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

export default {
  sizeTerm,
  sizeTermByte,
  sizeTermByteToString,
  sizeTermBps,
  sizeTermFreq,
  sizeTermFreqToString,
  lpad,
  bpsStepper,
};
