/*
 * yeonyu-utils
 *
 * Copyright (c) 2024. yeonyew. All rights reserved.
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

export function steppedMaxValue(size: number, base = 1000, isHalf = true) {
  const MIN = base * 10;
  const MAX = Math.pow(base, 15);
  const sizeValue = size || 0;
  let maxStep = MIN;
  let scale = base;
  let half = 5;

  while (sizeValue > maxStep && maxStep < MAX) {
    maxStep = MIN * scale;
    if (isHalf) {
      scale *= half;
      half = half === 5 ? 2 : 5;
    } else {
      scale *= base;
    }
  }

  return maxStep;
}
