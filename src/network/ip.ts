/*
 * yeonyu-utils
 *
 * Copyright (c) 2025. yeonyu. All rights reserved.
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

import {
  MAX_32BITS,
} from '../constant';
import { DEC_REGEX, HEX_REGEX, OCT_REGEX } from '../Validator';

/**
 * Checks if the provided number is a valid IP number. An IP number is valid if it is a non-NaN integer
 * within the range of 0 to the maximum allowed 32-bit value.
 *
 * @param ipNum The number to validate as an IP number.
 * @return Returns true if the number is a valid IP number, otherwise false.
 */
export function isValidIpNumber(ipNum: number): boolean {
  return !isNaN(ipNum) && ipNum >= 0 && ipNum <= MAX_32BITS && ipNum % 1 === 0;
}

/**
 * IPv4 address to number
 * @param ipString
 */
export function aton(ipString: string): number | undefined {
  const parts = ipString.split('.').map(Number);
  if (parts.length !== 4) return undefined;

  for (const part of parts) {
    if (isNaN(part) || part < 0 || part > 255) {
      return undefined;
    }
  }

  return ((parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3]) >>> 0;
}

/**
 * For hex legacy compatibility
 * @param ipStr
 */
export function atonLegacy(ipStr: string): number | undefined {
  const parts = ipStr.split('.');
  if (parts.length !== 4) return undefined;

  const numbers: number[] = [];
  for (const part of parts) {
    let radix = 10;
    if (HEX_REGEX.test(part)) radix = 16;
    else if (OCT_REGEX.test(part) && part.length > 1) radix = 8;
    else if (!DEC_REGEX.test(part)) return undefined;

    const num = parseInt(part, radix);
    if (isNaN(num) || num < 0 || num > 255) return undefined;

    numbers.push(num);
  }

  return ((numbers[0] << 24) + (numbers[1] << 16) + (numbers[2] << 8) + numbers[3]) >>> 0;
}

/**
 * Number to IPv4 address
 * @param ipNum
 */
export function ntoa(ipNum: number): string | undefined {
  if (!isValidIpNumber(ipNum)) {
    return undefined;
  }
  return [
    (ipNum >>> 24) & 0xff,
    (ipNum >>> 16) & 0xff,
    (ipNum >>> 8) & 0xff,
    ipNum & 0xff,
  ].join('.');
}

/**
 * Calculate the maximum number of CIDR blocks starting with IP
 * (Determine trailing zeros counts of IP)
 */
export function getMaxCidrBlock(ipNum: number): number {
  let maxSize = 0;
  while (maxSize < 32 && (ipNum & (1 << maxSize)) === 0) {
    maxSize++;
  }
  return maxSize;
}

/**
 * IPv4 range to CIDR Blocks
 *
 * @param startIp
 * @param endIp
 */
export function ipRangeToCidr(startIp: string, endIp: string): string[] {
  let start = aton(startIp);
  const end = aton(endIp);
  if (!start || !end) return [];
  const result: string[] = [];

  while (start <= end) {
    const maxSize = getMaxCidrBlock(start);
    const remaining = end - start + 1;

    let blockSize = 0;
    while (blockSize < maxSize && 1 << (blockSize + 1) <= remaining) {
      blockSize++;
    }

    const cidr = 32 - blockSize;
    result.push(`${ntoa(start)}/${cidr}`);

    start += 1 << blockSize;
  }

  return result;
}

/**
 * Get CIDR Block(IPv4/prefix) to range info
 *
 * @param cidr
 */
export function getCidrInfo(cidr: string): {
  prefix: number;
  firstIp: string;
  lastIp: string;
  totalIps: number;
} {
  const [ip, prefixStr] = cidr.split('/');
  const prefix = parseInt(prefixStr);
  const ipInt = aton(ip) ?? 0;
  const hostBits = 32 - prefix;
  const totalIps = 1 << hostBits;
  const lastIpInt = ipInt + totalIps - 1;

  return {
    prefix,
    firstIp: ntoa(ipInt)!,
    lastIp: ntoa(lastIpInt)!,
    totalIps,
  };
}
